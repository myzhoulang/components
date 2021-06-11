import React, { useMemo, useRef } from 'react';
// @ts-ignore
import { ContentUtils } from 'braft-utils';
import BraftEditor, { EditorState, MediaType } from 'braft-editor';
import 'braft-editor/dist/index.css';
import sanitizeHtml from 'sanitize-html';
import { upload } from '../utils';
import type { Params } from '../utils/upload/typing';
import type { EditorProps } from './typing';
import { validFile } from '../utils/upload';
import { ValidFileProps } from '../utils/upload/validFile';

import './index.less';

const { getUploadData } = upload;

const Editor: React.FC<EditorProps> = (props) => {
  const {
    value,
    onChange,
    upload = {},
    braftEditorProps = {},
    oss = {},
    sanitize,
  } = props;
  const { onBeforeStart, onStart, onFinsh } = upload;
  const editor = useRef<BraftEditor>(null);
  const editorState = useMemo(() => {
    if (typeof value === 'string') {
      const editorState = BraftEditor.createEditorState(value);
      onChange?.(editorState);
      return BraftEditor.createEditorState(editorState);
    } else {
      return value;
    }
  }, [value]);

  // 对粘贴的内容做处理 主要是对 html的输入
  // 对一些脚本做过滤和危险属性做过滤处理
  const handlePasted = (html: string | undefined) => {
    console.log('origin =>', html);
    if (!html) return html;
    console.log(111);
    // 对复制的文本进行过滤
    const stripedHTMLString = sanitizeHtml(
      html,
      Object.assign(
        {
          allowedTags: [
            'address',
            'article',
            'aside',
            'footer',
            'header',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'hgroup',
            'main',
            'nav',
            'section',
            'blockquote',
            'dd',
            'div',
            'dl',
            'dt',
            'figcaption',
            'figure',
            'hr',
            'li',
            'main',
            'ol',
            'p',
            'pre',
            'ul',
            'a',
            'abbr',
            'b',
            'bdi',
            'bdo',
            'br',
            'cite',
            'code',
            'data',
            'dfn',
            'em',
            'i',
            'kbd',
            'mark',
            'q',
            'rb',
            'rp',
            'rt',
            'rtc',
            'ruby',
            's',
            'samp',
            'small',
            'span',
            'strong',
            'sub',
            'sup',
            'time',
            'u',
            'var',
            'wbr',
            'caption',
            'col',
            'colgroup',
            'table',
            'tbody',
            'td',
            'tfoot',
            'th',
            'thead',
            'tr',
            'img',
          ],
          allowedAttributes: {
            '*': ['style', 'title', 'id'],
            a: ['href', 'name', 'target'],
            img: ['src', 'alt'],
          },
        },
        sanitize,
      ),
    );

    console.log('striped =>', stripedHTMLString);

    onChange?.(
      ContentUtils.insertHTML(editorState, stripedHTMLString, 'paste'),
    );
    return 'handled';
  };

  braftEditorProps.draftProps = {
    // @ts-ignore
    handlePastedText(text: string, html: string | undefined) {
      return handlePasted(html);
    },
  };

  function change(editorState: EditorState) {
    if (onChange) {
      console.log('change');
      onChange(editorState);
    }
  }

  const uploadFn: MediaType['uploadFn'] = async (param: Params) => {
    try {
      const { exts, signSize } = upload;
      const config: ValidFileProps = {};
      if (exts) {
        config.exts = exts;
      }
      if (signSize) {
        config.signSize = signSize;
      }

      const result = validFile(param.file, config);
      // 校验不通过
      if (!(result === true)) {
        onAbort();
        return;
      }
      // 开始上传
      onBeforeStart?.(param.file, editor.current);
      const ossData = await getUploadData(param.file, oss);
      const form = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      if (ossData) {
        Object.entries(ossData).forEach(([key, value]) => {
          form.append(key, value);
        });
      }
      // 开始上传
      onStart?.(form);

      function onProgress(event: ProgressEvent) {
        const { loaded, total } = event;
        upload?.onProgress?.(loaded, total);
        param.progress((loaded / total) * 100);
      }

      function onSuccess(event: ProgressEvent) {
        let url: string = '';
        if (ossData) {
          url = ossData.host + '/' + ossData.path;
        }

        // 上传结束
        onFinsh?.({ status: 200, message: 'ok' }, editor.current);
        upload?.onSuccess?.(xhr.response);

        param.success({
          url: url,
          meta: {
            id: '',
            title: '',
            alt: '',
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
            poster: '', // 指定视频播放器的封面
          },
        });
      }

      function onError(event: ProgressEvent) {
        console.log('err');
        onFinsh?.({ status: 400, message: '上传错误' }, editor.current);
        param.error({
          msg: '上传失败',
        });
      }

      function onAbort() {
        onFinsh?.({ status: 400, message: '上传被取消' }, editor.current);
        param.error({
          msg: '上传失败',
        });
      }

      // 有自定义上传方法，直接使用并返回
      if (typeof upload.customUpload === 'function') {
        return upload.customUpload(form);
      }

      // 没有自定义上传方法并且没有action ，直接抛错并返回
      if (!upload.action) {
        param.error({
          msg: '使用默认上传方法需要 action 地址',
        });
        return;
      }

      // 没有自定义上传方法并且没有ossData ，直接抛错并返回
      if (!ossData) {
        param.error({
          msg: '获取 oss 数据失败',
        });
        return;
      }

      form.append('file', param.file);
      xhr.open('POST', upload.action, true);
      xhr.send(form);

      xhr.upload.addEventListener('progress', onProgress, false);
      xhr.addEventListener('load', onSuccess, false);
      xhr.addEventListener('error', onError, false);
      xhr.addEventListener('abort', onAbort, false);
    } catch (error) {
      onFinsh?.({ status: 400, message: error }, editor.current);
      console.error('上传失败 ===》 ', error);
    }
  };

  return (
    <div className={'braft-editor'}>
      <BraftEditor
        {...braftEditorProps}
        ref={editor}
        value={editorState}
        onChange={change}
        media={{ uploadFn: uploadFn }}
      />
    </div>
  );
};

export default Editor;

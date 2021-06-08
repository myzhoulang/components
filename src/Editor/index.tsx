import React, { useMemo, useRef } from 'react';
import type { UploadProps } from 'antd';
// @ts-ignore
import { ContentUtils } from 'braft-utils';
import BraftEditor, {
  BraftEditorProps,
  EditorState,
  MediaType,
} from 'braft-editor';
import 'braft-editor/dist/index.css';
import { filterXSS } from 'xss';
import { upload } from '../utils';
import type { OSS, KeyValue, Params } from '../utils/upload/typing';
import './styles/index.less';

const { getUploadData } = upload;

type FinshResult = {
  status: 100 | 200 | 400;
  message: string;
};

export type UploaderProps = UploadProps & {
  customUpload?: (data: KeyValue) => Promise<any>;
  action?: string;
  // 上传之前，比如 上传之前需要获取 oss 信息
  onBeforeStart?: (file: File, editor: BraftEditor | null) => void;
  // 真正执行上传请求
  onStart?: (data: FormData) => void;
  // 上传过程中执行的回调
  onProgress?: (current: number, total: number) => void;
  // 上传成功
  onSuccess?: (data: any) => void;
  // 上传完成 不管是成功或失败还是取消 都会执行
  onFinsh?: (result: FinshResult, editor: BraftEditor | null) => void;
};

type EditorProps = {
  value?: EditorState;
  onChange?: (editorState: EditorState) => void;
  braftEditorProps?: BraftEditorProps;
  upload?: UploaderProps;
  oss?: OSS;
};

const Editor: React.FC<EditorProps> = (props) => {
  const {
    value,
    onChange,
    upload = {},
    braftEditorProps = {},
    oss = {},
  } = props;
  const { onBeforeStart, onStart, onFinsh } = upload;
  const editor = useRef<BraftEditor>(null);
  const isUpadding = useRef(false);
  const editorState = useMemo(() => {
    // if (isUpadding.current) {
    //   return;
    // }
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
    // 首先去除所有on开头的属性
    const stripedHTMLString = filterXSS(
      html
        .replaceAll(/on(\w+)\s*=\s*(".*?")/gi, function () {
          return '\n';
        })
        .replaceAll('&quot;', "'")
        .replaceAll('&amp;', '&'),
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
        // hooks={{
        //   'open-braft-finder': () => {
        //     console.log(1);
        //     isUpadding.current = true;
        //   },
        //   'insert-medias': () => {
        //     console.log(2);
        //     isUpadding.current = false;
        //   },
        // }}
        value={editorState}
        onChange={change}
        media={{ uploadFn: uploadFn }}
      />
    </div>
  );
};

export default Editor;

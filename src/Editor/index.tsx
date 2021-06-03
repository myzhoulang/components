import React, { useMemo } from 'react';
import type { UploadProps } from 'antd';
import BraftEditor, {
  BraftEditorProps,
  EditorState,
  MediaType,
} from 'braft-editor';
import 'braft-editor/dist/index.css';
import { getExtraData, Params, OSS, KeyValue, UploadExtraData } from '../utils';
import './styles/index.less';

type EditorProps = {
  value?: EditorState;
  onChange?: (editorState: EditorState) => void;
  braftEditorProps?: BraftEditorProps;
  upload?: UploadProps & {
    customUpload?: (data: KeyValue) => Promise<any>;
    action?: string;
  };
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

  const editorState = useMemo(() => {
    if (typeof value === 'string') {
      return BraftEditor.createEditorState(value);
    } else {
      return value;
    }
  }, [value]);

  function change(editorState: EditorState) {
    if (onChange) {
      onChange(editorState);
    }
  }

  const uploadFn: MediaType['uploadFn'] = async (param: Params) => {
    try {
      const ossData = await getExtraData(param.file, oss);
      const form = new FormData();
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      function onProgress(event: ProgressEvent) {
        param.progress((event.loaded / event.total) * 100);
      }

      function onSuccess(data: any) {
        let url: string = '';
        if (ossData) {
          url = ossData.host + '/' + ossData.path;
        }

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

      function onError() {
        param.error({
          msg: '上传失败',
        });
      }

      function onAbort() {}

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

      Object.entries(ossData).forEach(([key, value]) => {});

      form.append('file', param.file);
      xhr.open('POST', upload.action, true);
      xhr.send(form);

      xhr.upload.addEventListener('progress', onProgress, false);
      xhr.addEventListener('load', onSuccess, false);
      xhr.addEventListener('error', onError, false);
      xhr.addEventListener('abort', onAbort, false);
    } catch (error) {
      console.error('上传失败 ===》 ', error);
    }
  };

  return (
    <div className={'braft-editor'}>
      <BraftEditor
        {...braftEditorProps}
        value={editorState}
        onChange={change}
        media={{ uploadFn: uploadFn }}
      />
    </div>
  );
};

export default Editor;

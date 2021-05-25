import React, { useMemo } from 'react';
import type { UploadProps } from 'antd';
import BraftEditor, {
  BraftEditorProps,
  EditorState,
  MediaType,
} from 'braft-editor';
import 'braft-editor/dist/index.css';
import { getExtraData, Params, OSS, KeyValue, UploadExtraData } from '../utils';
import styles from './index.less';

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
        param.success({
          url: (ossData as UploadExtraData)?.url,
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

      // 判断是否 OSS 上传还是自定义上传
      if (typeof upload.customUpload === 'function') {
        return upload.customUpload(form);
      }

      if (!upload.action) {
        console.error('使用默认上传方法需要 action 地址');
        return;
      }

      if (!ossData) {
        return;
      }

      Object.entries(ossData).forEach(([key, value]) => {
        form.append(key, value);
      });

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
    <div className={styles.braftEditor}>
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

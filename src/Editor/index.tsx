import React, { useMemo } from 'react';
import BraftEditor, {
  BraftEditorProps,
  EditorState,
  MediaType,
} from 'braft-editor';
import 'braft-editor/dist/index.css';
import { defaultUpload, UploadProps, Params } from '../utils';
import styles from './index.less';

type EditorProps = {
  value?: EditorState;
  onChange?: (editorState: EditorState) => void;
  braftEditorProps?: BraftEditorProps;
  upload?: UploadProps;
};

const Editor: React.FC<EditorProps> = (props) => {
  const { value, onChange, upload = {}, braftEditorProps = {} } = props;
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
      const xhr = await defaultUpload(param.file, {
        upload: upload,
        onProgress(event: ProgressEvent) {
          param.progress((event.loaded / event.total) * 100);
        },
        onSuccess() {
          // 假设服务端直接返回文件上传后的地址
          // 上传成功后调用param.success并传入上传后的文件地址
          try {
            const res = JSON.parse(xhr.response);
            const url = `${xhr.responseURL}${res.filename}`;
            param.success({
              url: url,
              meta: {
                id: 'xxx',
                title: 'xxx',
                alt: 'xxx',
                loop: true, // 指定音视频是否循环播放
                autoPlay: true, // 指定音视频是否自动播放
                controls: true, // 指定音视频是否显示控制栏
                poster: 'http://xxx/xx.png', // 指定视频播放器的封面
              },
            });
          } catch (e) {
            console.log(e);
          }
        },
        onError() {
          param.error({
            msg: '上传失败',
          });
        },
      });
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

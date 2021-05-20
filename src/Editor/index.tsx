import React, { useMemo } from 'react';
import BraftEditor, {
  BraftEditorProps,
  EditorState,
  MediaType,
} from 'braft-editor';
import SparkMD5 from 'spark-md5';
import 'braft-editor/dist/index.css';
import styles from './index.less';

export type Params = {
  file: File;
  progress: (progress: number) => void;
  libraryId: string;
  success: (res: {
    url: string;
    meta: {
      id: string;
      title: string;
      alt: string;
      loop: boolean;
      autoPlay: boolean;
      controls: boolean;
      poster: string;
    };
  }) => void;
  error: (err: { msg: string }) => void;
};

// OSS 信息
export type IOSSData = {
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
  callback: string;
};

// 上传文件的 props
export type UploadProps = {
  // 获取 OSS 信息的方法
  getOSSData?: () => Promise<IOSSData>;
  // OSS 信息
  OSSData?: IOSSData;
  // 自定义上传文件方法
  customUpload?: (fd: FormData, params?: Params) => Promise<any>;
  // 默认上传文件的地址
  serverUrl?: string;
};

export const UploadProps = <T,>(props: UploadProps) => <></>;

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
    // TODO: 做节流处理
    // clearTimeout(timer)
    if (onChange) {
      // timer = window.setTimeout(() => {
      console.log('memo');
      onChange(editorState);
      // }, 60)
    }
  }

  const getMD5 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const spark = new SparkMD5.ArrayBuffer();
      reader.readAsArrayBuffer(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          spark.append(e.target.result as ArrayBuffer);
        }
        resolve(spark.end());
      };
      reader.onerror = (e) => {
        reject(e);
      };
    });
  };

  // 获取 OSS 数据
  const getSignature = () => {
    const getOSSDataFn = upload.getOSSData;
    const OSSData = upload.OSSData;
    if (typeof getOSSDataFn !== 'function' && !OSSData) {
      return Promise.reject({ message: '缺少OSS数据或获取OSS数据的方法' });
    }

    if (typeof getOSSDataFn === 'function') {
      return getOSSDataFn()
        .then((data: IOSSData) => {
          return data;
        })
        .catch((e) => {
          console.error(e);
          return Promise.reject(e);
        });
    }

    return OSSData ? Promise.resolve(OSSData) : Promise.reject('缺少OSS数据');
  };

  const getExtraData = async (file: File & { url?: string; path?: string }) => {
    const ext = file.name.substr(file.name.lastIndexOf('.'));

    return Promise.all([getMD5(file), getSignature()])
      .then(([md5, oss]) => {
        const { dir, host, accessId, policy, signature, callback } = oss;
        const path = `${dir}${md5}${ext}`;
        file.path = path;
        file.url = `${host}/${dir}${md5}${ext}`;
        return {
          file: file,
          key: path,
          OSSAccessKeyId: accessId,
          policy: policy,
          Signature: signature,
          callback: callback,
        };
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const uploadFn: MediaType['uploadFn'] = async (param: Params) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const serverURL = upload.serverUrl;
    await getExtraData(param.file)
      .then((res) => {
        if (res) {
          fd.append('key', res.key);
          fd.append('OSSAccessKeyId', res.OSSAccessKeyId);
          fd.append('policy', res.policy);
          fd.append('Signature', res.Signature);
          fd.append('file', param.file);
          fd.append('callback', res.callback);
        }
      })
      .catch((e) => {
        console.error(e);
      });

    // 判断是否 OSS 上传还是自定义上传
    if (typeof upload.customUpload === 'function') {
      return upload.customUpload(fd, param);
    }

    if (!serverURL) {
      console.error('使用默认上传方法需要 server 地址');
      return;
    }

    const successFn = () => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      try {
        console.log(xhr.response);
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
    };

    const progressFn = (event: ProgressEvent) => {
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败',
      });
    };
    xhr.open('POST', serverURL, true);
    console.log(fd);
    xhr.send(fd);
    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);
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

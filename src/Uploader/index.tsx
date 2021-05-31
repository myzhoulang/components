import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { Upload, Button, Modal } from 'antd';
import type { UploadProps } from 'antd';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import SignCardUpload from './SignCardUpload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { noop, getExtraData, OSS, uploadValid } from '@/utils';
import style from './index.less';

export type UploaderProps = {
  // 展示文案
  label?: string;
  // 获取OSS 配置数据
  oss?: OSS;
  /**
   * value
   * @description       文件的路径
   * @default
   */
  value?: string | Array<string>;
  /**
   * exts
   * @description       可以上传的文件扩展名
   * @default           ['jpg', 'jpeg', 'png']
   */
  exts?: Array<string>;
  /**
   * signSize
   * @description       单个文件的最大尺寸 单位： KB
   * @default           200
   */
  signSize?: number;
  /**
   * crop
   * @description       是否需要对文件进行裁剪
   * @default           false
   */
  crop?: boolean;
  /**
   * crop
   * @description       antd 的 [uploadProps]()
   * @default           { listType: 'text', maxCount: 1 }
   */
  uploadProps?: UploadProps;

  onChange?: (urls: string | Array<string>) => void;
};

const defaultProps = {
  getOSSConfig: noop,
  signSize: 200,
  crop: false,
  exts: ['jpg', 'jpeg', 'png'],
  accept: 'image/jpg, image/png, image/jpeg',
};

const Uploader = (originProps: UploaderProps) => {
  const props = Object.assign({ ...defaultProps }, originProps);
  const { value, onChange, exts = [], signSize = 200, crop, label } = props;

  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [data, setData] = useState<any>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const isTriggerChange = useRef(false);
  const lastValue = useRef(value);

  // 文件上传成功后执行的操作
  // 设置 loading状态、触发 onChange、延迟将 isTriggerChange.current 值改成false
  const uploadSuccess = (url: string | Array<string>) => {
    lastValue.current = url;
    onChange?.(url);
    setLoading(false);
    setTimeout(() => {
      isTriggerChange.current = false;
    });
  };

  const change = ({ fileList }: UploadChangeParam) => {
    console.log('value change');
    // 将 isTriggerChange.current 值改成true, 防止 setFileList 操作导致 useEffect 重复执行
    // 当文件上传成功后 在 uploadSuccess 方法中， 将 isTriggerChange.current 值重新赋值为 false
    // 这样当外面 重新改变 upload 的值得时候 就又会走 useEffect
    isTriggerChange.current = true;
    const signFile = fileList[0];
    if (isSign && signFile?.status === 'done') {
      const url = data.host + '/' + data.path;
      signFile.url = url;
      uploadSuccess(url);
    } else {
      // TODO: 替换 any
      if (fileList.every((item: any) => item.status === 'done')) {
        const urls = fileList.map((item: any) => {
          return item.url || item?.response?.filename;
        });
        uploadSuccess(urls);
      }
    }
    setFileList(fileList);
  };

  // 删除文件
  const deleteFile = (file: string) => {
    fileList.forEach((item, index, array) => {
      if (item.url === file) {
        array.splice(index, 1);
      }
    });
    setFileList(fileList);
    const url = isSign
      ? ''
      : fileList.map((item) => item.url || item?.response?.filename);
    uploadSuccess(url);
  };

  // 预览文件
  const preview = (file: UploadFile | string) => {
    const fileUrl = typeof file === 'string' ? file : file.url || file.thumbUrl;
    if (fileUrl) {
      setPreviewImage(fileUrl);
      setPreviewVisible(true);
    }
  };

  const beforeUpload = async (file: File) => {
    const { oss, uploadProps } = props;
    const result = uploadValid(file, {
      exts,
      signSize,
      multiple: uploadProps?.multiple ?? false,
    });
    if (result === true) {
      // 没有自定义方法
      if (oss && !uploadProps?.customRequest) {
        const data = await getExtraData(file, oss);
        setData(data);
        setLoading(true);
      }
    }

    return result;
  };

  const defaultUploadProps = {
    listType: 'text',
    maxCount: 1,
    onPreview: preview,
  };

  const uploadProps = Object.assign(
    { ...defaultUploadProps },
    props.uploadProps,
  );

  const maxCount = uploadProps.maxCount;
  const isSign = maxCount === 1;

  const hasValue = (value: string | Array<string> | undefined) => {
    return (
      (typeof value === 'string' && value) ||
      (Array.isArray(value) && value.length > 0)
    );
  };

  useEffect(() => {
    console.log('useEffect');
    if (!isTriggerChange.current) {
      if (!hasValue(value)) {
        setFileList([]);
      } else {
        let fileList: Array<UploadFile> = [];
        if (Array.isArray(value)) {
          fileList = value.map((item) => {
            if (typeof item === 'string') {
              return {
                name: `${Math.random()}`,
                uid: `${Math.random()}`,
                status: 'done',
                url: item,
              };
            }
            return item;
          });
        } else {
          fileList = [
            {
              name: `${Math.random()}`,
              uid: `${Math.random()}`,
              status: 'done',
              url: value,
            },
          ];
        }
        setFileList(fileList);
      }
    }
  }, [value]);

  const originUpload = () => {
    const props = {
      onChange: change,
      beforeUpload: beforeUpload,
      data: data,
      ...uploadProps,
    };

    let signUrl: string | undefined;
    if (isSign && uploadProps.listType === 'picture-card') {
      const signFile = fileList[0];
      signUrl = signFile?.url;
      props.showUploadList = false;
      props.className = classnames(props.className, [style.signCard]);
      console.log('class', props);
    } else {
      props.fileList = fileList;
    }

    const UploadBtn = () => {
      const listType = uploadProps.listType;
      const cardButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{label ?? 'Unpload'}</div>
        </div>
      );

      const uploadButton = () => {
        if (isSign) {
          return signUrl ? (
            <SignCardUpload
              fileUrl={signUrl}
              onDeleteFile={deleteFile}
              onPreview={preview}
            />
          ) : (
            cardButton
          );
        } else {
          if (fileList.length >= maxCount) {
            return null;
          }
          return cardButton;
        }
      };

      if (listType === 'picture-card') {
        return uploadButton();
      } else {
        return <Button icon={<PlusOutlined />}>{label ?? 'Unpload'}</Button>;
      }
    };

    return (
      <>
        <Upload {...props}>{UploadBtn()}</Upload>
        <Modal
          visible={previewVisible}
          title={'图片预览'}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt={'图片'} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  };

  return (
    <>{crop ? <ImgCrop rotate>{originUpload()}</ImgCrop> : originUpload()}</>
  );
};

export default Uploader;

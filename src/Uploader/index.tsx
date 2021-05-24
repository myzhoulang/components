import React, { useEffect, useState, useRef } from 'react';
import { Upload, message, Button } from 'antd';
import type { UploadProps } from 'antd';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { noop, IOSSData, getExtraData, OSS } from '@/utils';

export type UploaderProps = {
  oss?: boolean;
  // OSS 配置数据
  OSSData: IOSSData;
  /**
   * getOSSData 获取 OSS 配置数据
   */
  getOSSData?: () => Promise<IOSSData>;
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
};

const defaultUploadProps = {
  listType: 'text',
  maxCount: 1,
};

const Uploader = (originProps: UploaderProps) => {
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<any>({});

  const props = Object.assign({ ...defaultProps }, originProps);
  const { value = [], onChange, exts = [], signSize = 200, crop } = props;
  const uploadProps = Object.assign(
    { ...defaultUploadProps },
    props.uploadProps,
  );

  const maxCount = uploadProps.maxCount;
  const ref = useRef(true);
  const isSign = maxCount === 1;

  useEffect(() => {
    if (
      (typeof value === 'string' && value) ||
      (Array.isArray(value) && value.length > 0 && ref.current)
    ) {
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

      ref.current = false;
      setFileList(fileList);
    }
  }, [value]);

  const change = ({ fileList }: UploadChangeParam) => {
    setFileList(fileList);
    const signFile = fileList[0];
    if (isSign && signFile.status === 'done') {
      const url = signFile.url || signFile.response.url;
      onChange?.(url);
    } else {
      if (fileList.every((item) => item.status === 'done')) {
        onChange?.(fileList.map((item) => item.url || item.response.url));
      }
    }
  };

  const getFileExtendingName = (filename: string = '') => {
    const ext = filename.slice(filename.lastIndexOf('.') + 1);
    if (ext) {
      return ext.toLocaleLowerCase();
    }
    return '';
  };

  const beforeUpload = async (file: File) => {
    const { getOSSData, OSSData, oss } = props;
    const ext = getFileExtendingName(file.name);
    const isType = exts.includes(ext);
    const isSize = file.size / 1024 < signSize;
    // 获取 OSS 数据
    if (oss && isType && isSize) {
      const data = await getExtraData(file, oss);
      setData(data);
    }

    if (!isType) {
      message.error(`${file.name} 文件格式不正确`);
      return isType ? true : Upload.LIST_IGNORE;
    }

    if (!isSize) {
      message.error(`${file.name} size 不能大于 ${signSize} KB`);
      return isSize ? true : Upload.LIST_IGNORE;
    }
  };

  const originUpload = () => {
    const props = {
      onChange: change,
      beforeUpload: beforeUpload,
      data: data,
      ...uploadProps,
    };

    let signUrl: string;
    if (isSign && uploadProps.listType === 'picture-card') {
      signUrl = fileList[0]?.url || fileList[0]?.response?.url;
    } else {
      props.fileList = fileList;
    }

    const UploadBtn = () => {
      const listType = uploadProps.listType;
      const cardButton = (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      );

      const uploadButton = () => {
        if (isSign) {
          return signUrl ? (
            <img src={signUrl} alt="avatar" style={{ width: '100%' }} />
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
        return <Button icon={<PlusOutlined />}>Upload</Button>;
      }
    };

    return <Upload {...props}>{UploadBtn()}</Upload>;
  };
  console.log('render');
  return (
    <>{crop ? <ImgCrop rotate>{originUpload()}</ImgCrop> : originUpload()}</>
  );
};

export default Uploader;

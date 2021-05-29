import React, { useEffect, useState, useRef } from 'react';
import { Upload, message, Button } from 'antd';
import type { UploadProps } from 'antd';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { noop, IOSSData, getExtraData, OSS, uploadValid } from '@/utils';

export type UploaderProps = {
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
};

const defaultUploadProps = {
  listType: 'text',
  maxCount: 1,
};

const Uploader = (originProps: UploaderProps) => {
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const isTriggerChange = useRef(false);

  const props = Object.assign({ ...defaultProps }, originProps);
  const { value = [], onChange, exts = [], signSize = 200, crop } = props;
  const uploadProps = Object.assign(
    { ...defaultUploadProps },
    props.uploadProps,
  );

  const maxCount = uploadProps.maxCount;
  const isSign = maxCount === 1;

  useEffect(() => {
    if (
      (typeof value === 'string' && value) ||
      (Array.isArray(value) && value.length > 0 && !isTriggerChange.current)
    ) {
      console.log('useEffect');
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
  }, [value]);

  const change = ({ fileList }: UploadChangeParam) => {
    console.log('value change');
    isTriggerChange.current = true;
    const signFile = fileList[0];
    if (isSign && signFile.status === 'done') {
      const url = data.host + '/' + data.path;
      signFile.url = url;
      setLoading(false);
      onChange?.(data.path);
    } else {
      if (fileList.every((item) => item.status === 'done')) {
        console.log(fileList);
        setLoading(false);
        const urls = fileList.map((item) => {
          return item.url || item?.response?.filename;
        });
        console.log(fileList);
        onChange?.(urls);
      }
    }
    setFileList(fileList);
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
    } else {
      props.fileList = fileList;
    }

    const UploadBtn = () => {
      const listType = uploadProps.listType;
      const cardButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
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

  return (
    <>{crop ? <ImgCrop rotate>{originUpload()}</ImgCrop> : originUpload()}</>
  );
};

export default Uploader;

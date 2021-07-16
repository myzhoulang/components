import type { OSS } from '../utils/upload/typing';
import type { UploadProps } from 'antd';
import React from 'react';

export type FileValue = {
  name: string;
  url: string;
};

export type FilesValue = string | Array<string> | FileValue | Array<FileValue>;

export type UploaderProps = {
  /**
   * previewType
   * @description 文件预览形式 false 为不预览
   * @default 'modal'
   */
  previewType?: 'modal' | 'page' | false;
  /**
   * valueType
   * @description value是字符串还是文件对象
   * @default 'string'
   */
  valueType?: 'string' | 'file';

  /**
   * label
   * @description 展示文案
   * @default 'Upload'
   */
  label?: string;

  // 获取OSS 配置数据
  oss?: OSS;
  /**
   * value
   * @description       文件的路径
   * @default
   */
  value?: FilesValue;
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

  icon?: React.ReactNode;

  onChange?: (urls: FilesValue) => void;
};

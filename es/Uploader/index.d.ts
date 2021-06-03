/// <reference types="react" />
import type { UploadProps } from 'antd';
import { OSS } from '@/utils';
import './styles/index.less';
export declare type FileValue = {
  name: string;
  url: string;
};
export declare type FilesValue =
  | string
  | Array<string>
  | FileValue
  | Array<FileValue>;
export declare type UploaderProps = {
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
  onChange?: (urls: FilesValue) => void;
};
declare const Uploader: (originProps: UploaderProps) => JSX.Element;
export default Uploader;

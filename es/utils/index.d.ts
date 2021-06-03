import type { UploadProps } from 'antd';
import type { FilesValue } from '../Uploader';
export declare type OSS = {
  OSSHeader?: Headers & {
    token?: string;
  };
  OSSData?: IOSSData;
  OSSAction?: string;
  getOSSData?: () => Promise<IOSSData>;
};
export declare type Options = {
  onProgress?: (event: ProgressEvent) => void;
  onSuccess?: () => void;
  onError?: () => void;
  onAbort?: () => void;
  data?: Map<string, any>;
  header?: Map<string, any>;
  upload?: UploadProps;
  oss?: OSS;
};
export declare const noop: () => void;
export declare type IOSSData = {
  path: string;
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
  callback: string;
};
export declare type Params = {
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
export declare type KeyValue = {
  [key: string]: any;
};
/**
 * 获取文件的MD5 和 OSS 配置
 * @param file 上传的文件
 * @param upload 上传的配置
 * @returns Promise<IOSSData> OSS 配置
 */
export declare type UploadExtraData = {
  host: string;
  path: string;
  key: string;
  OSSAccessKeyId: string;
  policy: string;
  Signature: string;
  callback: string;
};
export declare const getExtraData: (
  file: File & {
    url?: string;
    path?: string;
    server_url?: string;
  },
  oss: OSS,
) => Promise<UploadExtraData | void>;
declare type UploadValid = {
  exts?: Array<string>;
  signSize?: number;
  multiple?: boolean;
};
export declare const uploadValid: (
  file: File,
  config?: UploadValid | undefined,
) => string | true;
export declare const getFilePath: (files: FilesValue) =>
  | string
  | (
      | string
      | {
          url: string;
          name: string;
        }
    )[]
  | {
      url: string;
      name: string;
    }
  | undefined;
declare const _default: {
  getExtraData: (
    file: File & {
      url?: string | undefined;
      path?: string | undefined;
      server_url?: string | undefined;
    },
    oss: OSS,
  ) => Promise<void | UploadExtraData>;
  getFilePath: (files: FilesValue) =>
    | string
    | (
        | string
        | {
            url: string;
            name: string;
          }
      )[]
    | {
        url: string;
        name: string;
      }
    | undefined;
};
export default _default;

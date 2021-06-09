import type { UploadProps } from 'antd';

export type OSS = {
  OSSHeader?: Headers & { token?: string };
  OSSData?: IOSSData;
  OSSAction?: string;
  getOSSData?: () => Promise<IOSSData>;
};

export type Options = {
  onProgress?: (event: ProgressEvent) => void;
  onSuccess?: () => void;
  onError?: () => void;
  onAbort?: () => void;
  data?: Map<string, any>;
  header?: Map<string, any>;
  upload?: UploadProps;
  oss?: OSS;
};

// OSS 信息
export type IOSSData = {
  path: string;
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
  callback: string;
};

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

export type UploadExtraData = {
  host: string;
  path: string;
  key: string;
  OSSAccessKeyId: string;
  policy: string;
  Signature: string;
  callback: string;
};

export type GetFileMd5 = (file: File) => Promise<string | null | DOMException>;

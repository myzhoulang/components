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

export const noop = () => {};

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

// 默认获取 oss 配置方法
// 当需要获取oss配置数据的时候，只提供了一个获取 oss 配置的 api 时使用
const getOSSDataForAction = (url: string, header?: Headers) => {
  return fetch(url, {
    headers: header,
  })
    .then((res) => res.json())
    .then((data) => data.data);
};

/**
 * 获取文件上传到OSS的配置
 * @returns Promise<IOSSData> OSS 配置
 * getOSSData > OSSAction > OSSData
 */
const getSignature = (oss: OSS) => {
  const { getOSSData, OSSData, OSSAction, OSSHeader } = oss;

  // 没有提供 OSS 配置数据  并且 没有获取 OSS 配置数据的方法 并且也没有获取 OSSAction 的服务器地址
  // 就认为 获取不到 OSS 配置数据就认为获取 OSS 配置失败
  if (typeof getOSSData !== 'function' && !OSSData && !OSSAction) {
    return Promise.reject({
      message: '缺少OSS数据或获取OSS数据的方法或缺少获取OSS配置的服务器地址',
    });
  }

  if (typeof getOSSData === 'function') {
    return getOSSData()
      .then((data: IOSSData) => {
        return data;
      })
      .catch((e) => {
        console.error(e);
        return Promise.reject(e);
      });
  } else if (typeof OSSAction === 'string') {
    return getOSSDataForAction(OSSAction, OSSHeader);
  }

  return OSSData ? Promise.resolve(OSSData) : Promise.reject('缺少OSS数据');
};

export default getSignature;

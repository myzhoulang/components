import { message, Upload } from 'antd';
import type { UploadProps } from 'antd';
import SparkMD5 from 'spark-md5';

import type { FileValue, FilesValue } from '../Uploader';

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

export type KeyValue = {
  [key: string]: any;
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
 * 获取文件的md5值，用作文件名称
 * @param file 要上传的文件
 * @returns 文件的 MD5
 */
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

/**
 * 获取文件的MD5 和 OSS 配置
 * @param file 上传的文件
 * @param upload 上传的配置
 * @returns Promise<IOSSData> OSS 配置
 */
export type UploadExtraData = {
  host: string;
  path: string;
  key: string;
  OSSAccessKeyId: string;
  policy: string;
  Signature: string;
  callback: string;
};
export const getExtraData: (
  file: File & { url?: string; path?: string; server_url?: string },
  oss: OSS,
) => Promise<UploadExtraData | void> = async (file, oss) => {
  const ext = file.name.substr(file.name.lastIndexOf('.'));

  return Promise.all([getMD5(file), getSignature(oss)])
    .then(([md5, oss]) => {
      const { dir, host, accessId, policy, signature, callback } = oss;
      const path = `${dir}${md5}${ext}`;
      file.server_url = `${host}/${dir}${md5}${ext}`;
      return {
        host: host,
        path: path,
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

const getFileExtendingName = (filename: string = '') => {
  const ext = filename.slice(filename.lastIndexOf('.') + 1);
  if (ext) {
    return ext.toLocaleLowerCase();
  }
  return '';
};

// 上传之前的拦截
type UploadValid = {
  exts?: Array<string>;
  signSize?: number;
  multiple?: boolean;
};
export const uploadValid = (file: File, config?: UploadValid) => {
  const conf = Object.assign(
    { exts: [], signSize: 200, multiple: false },
    config,
  );
  const ext = getFileExtendingName(file.name);
  const isType = conf?.exts?.includes(ext);
  const isSize = file.size / 1024 < conf?.signSize;

  if (!isType) {
    message.error(`${file.name} 文件格式不正确`);
    return Upload.LIST_IGNORE;
  }

  if (!isSize) {
    message.error(`${file.name} size 不能大于 ${conf?.signSize} KB`);
    return Upload.LIST_IGNORE;
  }

  return true;
};
// 将 url 转换成 path + search + hash
const urlToPath = (url: string) => {
  try {
    const u = new URL(url);
    return `${u.pathname.substr(1)}${u.search}${u.hash}`;
  } catch (e) {
    return url;
  }
};

export const getFilePath = (files: FilesValue) => {
  if (Array.isArray(files)) {
    return files.map((item: string | FileValue) => {
      if (typeof item === 'string') {
        return urlToPath(item);
      } else {
        return {
          ...item,
          url: urlToPath(item.url),
        };
      }
    });
  }

  if (typeof files === 'string') {
    return urlToPath(files);
  }

  if (Object.prototype.toString.call(files) === '[object Object]') {
    return {
      ...files,
      url: urlToPath(files.name),
    };
  }

  console.error('获取文件路径失败，请检查 files value的类型');
};

export default {
  getExtraData,
  getFilePath,
};

import SparkMD5 from 'spark-md5';

export type OSS = {
  OSSData?: IOSSData;
  OSSAction?: string;
  getOSSData?: (OSSAction: string) => Promise<IOSSData>;
};

export type Options = {
  onProgress?: (event: ProgressEvent) => void;
  onSuccess?: () => void;
  onError?: () => void;
  onAbort?: () => void;
  data?: Map<string, any>;
  header?: Map<string, any>;
  upload?: UploadProps;
};

export const noop = () => {};

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
 */
const getSignature = (oss: OSS) => {
  const { getOSSData, OSSData, OSSAction = '/compliance/oss/policy' } = oss;

  if (typeof getOSSData !== 'function' && !OSSData) {
    return Promise.reject({ message: '缺少OSS数据或获取OSS数据的方法' });
  }

  if (typeof getOSSData === 'function') {
    return getOSSData(OSSAction)
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

/**
 * 获取文件的MD5 和 OSS 配置
 * @param file 上传的文件
 * @param upload 上传的配置
 * @returns Promise<IOSSData> OSS 配置
 */
export const getExtraData = async (
  file: File & { url?: string; path?: string },
  oss: OSS,
) => {
  const ext = file.name.substr(file.name.lastIndexOf('.'));

  return Promise.all([getMD5(file), getSignature(oss)])
    .then(([md5, oss]) => {
      const { dir, host, accessId, policy, signature, callback } = oss;
      const path = `${dir}${md5}${ext}`;
      file.path = path;
      file.url = `${host}/${dir}${md5}${ext}`;
      return {
        // file: file,
        url: `${host}/${dir}${md5}${ext}`,
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

/**
 *  默认文件上传方法
 * @param data 上传文件
 * @param options 上传配置
 */
export async function defaultUpload(file: File, options: Options = {}) {
  const {
    onProgress = noop,
    onSuccess = noop,
    onError = noop,
    onAbort = noop,
    upload = {},
    data = new Map(),
    header = new Map(),
  } = options;

  // 获取信息
  try {
    const fd = new FormData();
    const res = await getExtraData(file, upload || {});
    const xhr = new XMLHttpRequest();

    if (res) {
      fd.append('key', res.key);
      fd.append('OSSAccessKeyId', res.OSSAccessKeyId);
      fd.append('policy', res.policy);
      fd.append('Signature', res.Signature);
      fd.append('file', file);
      fd.append('callback', res.callback);
    }
    // 添加额外的数据
    for (let [key, value] of data) {
      fd.append(key, value);
    }

    // 判断是否 OSS 上传还是自定义上传
    if (typeof upload.customUpload === 'function') {
      return upload.customUpload(fd);
    }
    if (!upload.serverUrl) {
      console.error('使用默认上传方法需要 server 地址');
      return;
    }
    xhr.open('POST', upload.serverUrl, true);
    // xhr.setRequestHeader()
    xhr.send(fd);

    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.addEventListener('load', onSuccess, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('abort', onAbort, false);
  } catch (error) {
    console.log(error);
  }
}

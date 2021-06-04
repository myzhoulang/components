import getFileMD5 from './getFileMd5';
import getOSSConfig from './getOSSConfig';
import type { OSS, UploadExtraData } from './typing';
/**
 * 获取文件的MD5 和 OSS 配置
 * @param file 上传的文件
 * @param upload 上传的配置
 * @returns Promise<IOSSData> OSS 配置
 */

const getUploadData: (
  file: File & { url?: string; path?: string; server_url?: string },
  oss: OSS,
) => Promise<UploadExtraData | void> = async (file, oss) => {
  const ext = file.name.substr(file.name.lastIndexOf('.'));

  return Promise.all([getFileMD5(file), getOSSConfig(oss)])
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

export default getUploadData;

import SparkMD5 from 'spark-md5';

/**
 * 获取文件的md5值，用作文件名称
 * @param file 要上传的文件
 * @returns 文件的 MD5
 */
const getFileMD5 = (file: File) => {
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

export default getFileMD5;

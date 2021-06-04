import { message, Upload } from 'antd';
// 上传之前的拦截
type ValidFileProps = {
  exts?: Array<string>;
  signSize?: number;
  multiple?: boolean;
};
const getFileExtendingName = (filename: string = '') => {
  const ext = filename.slice(filename.lastIndexOf('.') + 1);
  if (ext) {
    return ext.toLocaleLowerCase();
  }
  return '';
};

const validFile = (file: File, config?: ValidFileProps) => {
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
export default validFile;

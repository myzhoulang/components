/// <reference types="react" />
import './styles/index.less';
declare type SignCardUploadProps = {
  fileUrl: string;
  previewType: 'modal' | 'page' | false;
  onPreview?: (file: string) => void;
  onDeleteFile?: (file: string) => void;
};
declare const SignCardUpload: (props: SignCardUploadProps) => JSX.Element;
export default SignCardUpload;

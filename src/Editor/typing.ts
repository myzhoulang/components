import type { UploadProps } from 'antd';
import BraftEditor, { BraftEditorProps, EditorState } from 'braft-editor';
import sanitize from 'sanitize-html';
import type { OSS } from '../utils/upload/typing';

export type FinshResult = {
  status: 100 | 200 | 400;
  message: string;
};

export type MediaMetaProps = {
  id: string;
  title: string;
  alt: string;
  loop: boolean; // 指定音视频是否循环播放
  autoPlay: boolean; // 指定音视频是否自动播放
  controls: boolean; // 指定音视频是否显示控制栏
  poster: string; // 指定视频播放器的封面
};

export type UploaderProps = UploadProps & {
  customUpload?: (data: any) => Promise<any>;
  // 可上传的文件后缀名
  exts?: Array<string>;
  // 单个文件大小限制
  signSize?: number;
  // 文件上传地址
  action?: string;
  // 上传之前，比如 上传之前需要获取 oss 信息
  onBeforeStart?: (file: File, editor: BraftEditor | null) => void;
  // 真正执行上传请求
  onStart?: (data: FormData) => void;
  // 上传过程中执行的回调
  onProgress?: (current: number, total: number) => void;
  // 上传成功
  onSuccess?: (data: any) => void;
  // 上传完成 不管是成功或失败还是取消 都会执行
  onFinsh?: (result: FinshResult, editor: BraftEditor | null) => void;
  // 媒体标签渲染是的属性
  mediaMetaProps?: Partial<MediaMetaProps>;
};

export type EditorProps = {
  value?: EditorState;
  onChange?: (editorState: EditorState) => void;
  braftEditorProps?: BraftEditorProps;
  upload?: UploaderProps;
  oss?: OSS;
  sanitize?: sanitize.IOptions;
};

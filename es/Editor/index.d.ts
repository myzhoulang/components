import React from 'react';
import type { UploadProps } from 'antd';
import { BraftEditorProps, EditorState } from 'braft-editor';
import 'braft-editor/dist/index.css';
import { OSS, KeyValue } from '../utils';
import './styles/index.less';
declare type EditorProps = {
  value?: EditorState;
  onChange?: (editorState: EditorState) => void;
  braftEditorProps?: BraftEditorProps;
  upload?: UploadProps & {
    customUpload?: (data: KeyValue) => Promise<any>;
    action?: string;
  };
  oss?: OSS;
};
declare const Editor: React.FC<EditorProps>;
export default Editor;

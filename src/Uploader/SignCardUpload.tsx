import React from 'react';
import classnames from 'classnames';
import './index.less';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

// type PreviewType = Extract<>
type SignCardUploadProps = {
  fileUrl: string;
  previewType: 'modal' | 'page' | false;
  onPreview?: (file: string) => void;
  onDeleteFile?: (file: string) => void;
};

const SignCardUpload = (props: SignCardUploadProps) => {
  const { fileUrl, onPreview, onDeleteFile, previewType } = props;
  const preview = (e: React.MouseEvent, file: string) => {
    if (previewType === false) {
      return;
    }
    if (previewType === 'modal') {
      e.preventDefault();
      e.stopPropagation();
      onPreview?.(file);
    }
  };

  const deleteFile = (e: React.MouseEvent, file: string) => {
    e.stopPropagation();
    e.preventDefault();

    onDeleteFile?.(file);
  };

  return (
    <div className="ant-upload-list ant-upload-list-picture-card">
      <div
        className={'ant-upload-list-picture-card-container'}
        style={{ margin: 0 }}
      >
        <div
          className={classnames([
            'ant-upload-list-item',
            'ant-upload-list-item-done',
            'ant-upload-list-item-list-type-picture-card',
          ])}
        >
          <div
            className={classnames(
              'ant-upload-list-item-info',
              'upload-list-item-into',
            )}
          >
            <span className="ant-upload-span">
              <a
                className="ant-upload-list-item-thumbnail"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={fileUrl}
                  alt="image.png"
                  className="ant-upload-list-item-image"
                />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="ant-upload-list-item-name"
                title="image.png"
                href={fileUrl}
              >
                image.png
              </a>
            </span>
          </div>

          <span className="ant-upload-list-item-actions">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="????????????"
              onClick={(e) => preview(e, fileUrl)}
            >
              <span role="img" aria-label="eye" className="anticon anticon-eye">
                <EyeOutlined />
              </span>
            </a>

            <button
              title="????????????"
              type="button"
              onClick={(e) => deleteFile(e, fileUrl)}
              className={classnames([
                'ant-btn',
                'ant-btn-text',
                'ant-btn-icon-only',
                'ant-upload-list-item-card-actions-btn',
              ])}
            >
              <span
                role="img"
                aria-label="delete"
                className="anticon anticon-delete"
              >
                <DeleteOutlined />
              </span>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignCardUpload;

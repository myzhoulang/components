import React from 'react';
import classnames from 'classnames';
import style from './index.less';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

var SignCardUpload = function SignCardUpload(props) {
  var fileUrl = props.fileUrl,
    onPreview = props.onPreview,
    onDeleteFile = props.onDeleteFile,
    previewType = props.previewType;

  var preview = function preview(e, file) {
    if (previewType === false) {
      return;
    }

    if (previewType === 'modal') {
      e.preventDefault();
      e.stopPropagation();
      onPreview === null || onPreview === void 0 ? void 0 : onPreview(file);
    }
  };

  var deleteFile = function deleteFile(e, file) {
    e.stopPropagation();
    e.preventDefault();
    onDeleteFile === null || onDeleteFile === void 0
      ? void 0
      : onDeleteFile(file);
  };

  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: 'ant-upload-list ant-upload-list-picture-card',
    },
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'ant-upload-list-picture-card-container',
        style: {
          margin: 0,
        },
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          className: classnames([
            'ant-upload-list-item',
            'ant-upload-list-item-done',
            'ant-upload-list-item-list-type-picture-card',
          ]),
        },
        /*#__PURE__*/ React.createElement(
          'div',
          {
            className: classnames(
              'ant-upload-list-item-info',
              style.uploadListItemInto,
            ),
          },
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'ant-upload-span',
            },
            /*#__PURE__*/ React.createElement(
              'a',
              {
                className: 'ant-upload-list-item-thumbnail',
                href: fileUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              /*#__PURE__*/ React.createElement('img', {
                src: fileUrl,
                alt: 'image.png',
                className: 'ant-upload-list-item-image',
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'a',
              {
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'ant-upload-list-item-name',
                title: 'image.png',
                href: fileUrl,
              },
              'image.png',
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          'span',
          {
            className: 'ant-upload-list-item-actions',
          },
          /*#__PURE__*/ React.createElement(
            'a',
            {
              href: fileUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
              title: '\u9884\u89C8\u6587\u4EF6',
              onClick: function onClick(e) {
                return preview(e, fileUrl);
              },
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                role: 'img',
                'aria-label': 'eye',
                className: 'anticon anticon-eye',
              },
              /*#__PURE__*/ React.createElement(EyeOutlined, null),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'button',
            {
              title: '\u5220\u9664\u6587\u4EF6',
              type: 'button',
              onClick: function onClick(e) {
                return deleteFile(e, fileUrl);
              },
              className: classnames([
                'ant-btn',
                'ant-btn-text',
                'ant-btn-icon-only',
                'ant-upload-list-item-card-actions-btn',
              ]),
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                role: 'img',
                'aria-label': 'delete',
                className: 'anticon anticon-delete',
              },
              /*#__PURE__*/ React.createElement(DeleteOutlined, null),
            ),
          ),
        ),
      ),
    ),
  );
};

export default SignCardUpload;

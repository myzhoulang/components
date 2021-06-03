'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireDefault(require('react'));

var _classnames = _interopRequireDefault(require('classnames'));

require('./styles/index.less');

var _icons = require('@ant-design/icons');

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

  return /*#__PURE__*/ _react.default.createElement(
    'div',
    {
      className: 'ant-upload-list ant-upload-list-picture-card',
    },
    /*#__PURE__*/ _react.default.createElement(
      'div',
      {
        className: 'ant-upload-list-picture-card-container',
        style: {
          margin: 0,
        },
      },
      /*#__PURE__*/ _react.default.createElement(
        'div',
        {
          className: (0, _classnames.default)([
            'ant-upload-list-item',
            'ant-upload-list-item-done',
            'ant-upload-list-item-list-type-picture-card',
          ]),
        },
        /*#__PURE__*/ _react.default.createElement(
          'div',
          {
            className: (0, _classnames.default)(
              'ant-upload-list-item-info',
              'upload-list-item-into',
            ),
          },
          /*#__PURE__*/ _react.default.createElement(
            'span',
            {
              className: 'ant-upload-span',
            },
            /*#__PURE__*/ _react.default.createElement(
              'a',
              {
                className: 'ant-upload-list-item-thumbnail',
                href: fileUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              /*#__PURE__*/ _react.default.createElement('img', {
                src: fileUrl,
                alt: 'image.png',
                className: 'ant-upload-list-item-image',
              }),
            ),
            /*#__PURE__*/ _react.default.createElement(
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
        /*#__PURE__*/ _react.default.createElement(
          'span',
          {
            className: 'ant-upload-list-item-actions',
          },
          /*#__PURE__*/ _react.default.createElement(
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
            /*#__PURE__*/ _react.default.createElement(
              'span',
              {
                role: 'img',
                'aria-label': 'eye',
                className: 'anticon anticon-eye',
              },
              /*#__PURE__*/ _react.default.createElement(
                _icons.EyeOutlined,
                null,
              ),
            ),
          ),
          /*#__PURE__*/ _react.default.createElement(
            'button',
            {
              title: '\u5220\u9664\u6587\u4EF6',
              type: 'button',
              onClick: function onClick(e) {
                return deleteFile(e, fileUrl);
              },
              className: (0, _classnames.default)([
                'ant-btn',
                'ant-btn-text',
                'ant-btn-icon-only',
                'ant-upload-list-item-card-actions-btn',
              ]),
            },
            /*#__PURE__*/ _react.default.createElement(
              'span',
              {
                role: 'img',
                'aria-label': 'delete',
                className: 'anticon anticon-delete',
              },
              /*#__PURE__*/ _react.default.createElement(
                _icons.DeleteOutlined,
                null,
              ),
            ),
          ),
        ),
      ),
    ),
  );
};

var _default = SignCardUpload;
exports.default = _default;

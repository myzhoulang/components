'use strict';

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

require('antd/es/modal/style');

var _modal = _interopRequireDefault(require('antd/es/modal'));

require('antd/es/upload/style');

var _upload = _interopRequireDefault(require('antd/es/upload'));

require('antd/es/button/style');

var _button = _interopRequireDefault(require('antd/es/button'));

var _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator'),
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
);

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread2'),
);

var _react = _interopRequireWildcard(require('react'));

var _classnames = _interopRequireDefault(require('classnames'));

var _SignCardUpload = _interopRequireDefault(require('./SignCardUpload'));

var _icons = require('@ant-design/icons');

var _antdImgCrop = _interopRequireDefault(require('antd-img-crop'));

var _utils = require('@/utils');

require('./styles/index.less');

var defaultProps = {
  previewType: 'modal',
  valueType: 'string',
  getOSSConfig: _utils.noop,
  signSize: 200,
  crop: false,
  exts: ['jpg', 'jpeg', 'png'],
  accept: 'image/jpg, image/png, image/jpeg',
};

var Uploader = function Uploader(originProps) {
  var props = Object.assign(
    (0, _objectSpread2.default)({}, defaultProps),
    originProps,
  );
  var value = props.value,
    onChange = props.onChange,
    _props$exts = props.exts,
    exts = _props$exts === void 0 ? [] : _props$exts,
    _props$signSize = props.signSize,
    signSize = _props$signSize === void 0 ? 200 : _props$signSize,
    crop = props.crop,
    label = props.label,
    valueType = props.valueType,
    previewType = props.previewType;

  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    fileList = _useState2[0],
    setFileList = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];

  var _useState5 = (0, _react.useState)(''),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    previewImage = _useState6[0],
    setPreviewImage = _useState6[1];

  var _useState7 = (0, _react.useState)({}),
    _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
    data = _useState8[0],
    setData = _useState8[1];

  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2.default)(_useState9, 2),
    previewVisible = _useState10[0],
    setPreviewVisible = _useState10[1];

  var isTriggerChange = (0, _react.useRef)(false);
  var lastValue = (0, _react.useRef)(value); // 文件上传成功后执行的操作
  // 设置 loading状态、触发 onChange、延迟将 isTriggerChange.current 值改成false

  var uploadSuccess = function uploadSuccess(files) {
    lastValue.current = files;
    onChange === null || onChange === void 0 ? void 0 : onChange(files);
    setLoading(false);
    setTimeout(function () {
      isTriggerChange.current = false;
    });
  };

  var change = function change(_ref) {
    var fileList = _ref.fileList;
    console.log('value change'); // 将 isTriggerChange.current 值改成true, 防止 setFileList 操作导致 useEffect 重复执行
    // 当文件上传成功后 在 uploadSuccess 方法中， 将 isTriggerChange.current 值重新赋值为 false
    // 这样当外面 重新改变 upload 的值得时候 就又会走 useEffect

    isTriggerChange.current = true;
    var signFile = fileList[0];

    if (
      isSign &&
      (signFile === null || signFile === void 0 ? void 0 : signFile.status) ===
        'done'
    ) {
      var url = data.host + '/' + data.path;
      signFile.url = url;

      if (valueType === 'file' && signFile) {
        uploadSuccess({
          url: data.path,
          name: signFile.name,
        });
      } else {
        uploadSuccess(data.path);
      }
    } else {
      if (
        fileList.every(function (item) {
          return item.status === 'done';
        })
      ) {
        if (valueType === 'file') {
          var files = fileList.map(function (item) {
            var _item$response;

            return {
              name: item.name,
              url:
                item.url ||
                (item === null || item === void 0
                  ? void 0
                  : (_item$response = item.response) === null ||
                    _item$response === void 0
                  ? void 0
                  : _item$response.filename),
            };
          });
          uploadSuccess(files);
        } else {
          var urls = fileList.map(function (item) {
            var _item$response2;

            return (
              item.url ||
              (item === null || item === void 0
                ? void 0
                : (_item$response2 = item.response) === null ||
                  _item$response2 === void 0
                ? void 0
                : _item$response2.filename)
            );
          });
          uploadSuccess(urls);
        }
      }
    }

    setFileList(fileList);
  }; // 删除文件

  var deleteFile = function deleteFile(file) {
    fileList.forEach(function (item, index, array) {
      if (item.url === file) {
        array.splice(index, 1);
      }
    });
    setFileList(fileList);
    var url = isSign
      ? ''
      : fileList.map(function (item) {
          var _item$response3;

          return (
            item.url ||
            (item === null || item === void 0
              ? void 0
              : (_item$response3 = item.response) === null ||
                _item$response3 === void 0
              ? void 0
              : _item$response3.filename)
          );
        });
    uploadSuccess(url);
  }; // 预览文件

  var preview = function preview(file) {
    if (!previewType) return;
    var fileUrl = typeof file === 'string' ? file : file.url || file.thumbUrl;

    if (fileUrl) {
      setPreviewImage(fileUrl);
      setPreviewVisible(true);
    }
  };

  var beforeUpload = /*#__PURE__*/ (function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(file) {
        var _uploadProps$multiple;

        var oss, uploadProps, result, _data;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                (oss = props.oss), (uploadProps = props.uploadProps);
                result = (0, _utils.uploadValid)(file, {
                  exts: exts,
                  signSize: signSize,
                  multiple:
                    (_uploadProps$multiple =
                      uploadProps === null || uploadProps === void 0
                        ? void 0
                        : uploadProps.multiple) !== null &&
                    _uploadProps$multiple !== void 0
                      ? _uploadProps$multiple
                      : false,
                });

                if (!(result === true)) {
                  _context.next = 9;
                  break;
                }

                if (
                  !(
                    oss &&
                    !(uploadProps === null || uploadProps === void 0
                      ? void 0
                      : uploadProps.customRequest)
                  )
                ) {
                  _context.next = 9;
                  break;
                }

                _context.next = 6;
                return (0, _utils.getExtraData)(file, oss);

              case 6:
                _data = _context.sent;
                setData(_data);
                setLoading(true);

              case 9:
                return _context.abrupt('return', result);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee);
      }),
    );

    return function beforeUpload(_x) {
      return _ref2.apply(this, arguments);
    };
  })();

  var defaultUploadProps = {
    listType: 'text',
    maxCount: 1,
  }; // 预览类型为 modal 形式

  if (previewType === 'modal') {
    defaultUploadProps.onPreview = preview;
  }

  var uploadProps = Object.assign(
    (0, _objectSpread2.default)({}, defaultUploadProps),
    props.uploadProps,
  );
  var maxCount = uploadProps.maxCount || 1;
  var isSign = maxCount === 1; // 判断字符串是否为空或者数组长度是否为0或者不是一个空对象

  var hasValue = function hasValue(value) {
    return (
      (typeof value === 'string' && value) ||
      (Array.isArray(value) && value.length > 0) ||
      (Object.prototype.toString.call(value) === '[object Object]' &&
        Object.keys(value).length > 0)
    );
  };

  (0, _react.useEffect)(
    function () {
      console.log('useEffect');

      if (!isTriggerChange.current) {
        if (typeof value === 'undefined' || !hasValue(value)) {
          setFileList([]);
        } else {
          var _fileList = [];

          if (Array.isArray(value)) {
            _fileList = value.map(function (item) {
              var info = {
                uid: ''.concat(Math.random()),
                status: 'done',
              };

              if (typeof item === 'string') {
                return (0, _objectSpread2.default)(
                  {
                    name: ''.concat(Math.random()),
                    url: item,
                  },
                  info,
                );
              }

              return (0,
              _objectSpread2.default)((0, _objectSpread2.default)({}, info), item);
            });
          } else {
            if (typeof value === 'string') {
              _fileList = [
                {
                  name: ''.concat(Math.random()),
                  uid: ''.concat(Math.random()),
                  status: 'done',
                  url: value,
                },
              ];
            } else {
              _fileList = [
                {
                  uid: ''.concat(Math.random()),
                  status: 'done',
                  name:
                    (value === null || value === void 0
                      ? void 0
                      : value.name) || '',
                  url: value === null || value === void 0 ? void 0 : value.url,
                },
              ];
            }
          }

          setFileList(_fileList);
        }
      }
    },
    [value],
  );

  var originUpload = function originUpload() {
    var props = (0, _objectSpread2.default)(
      {
        onChange: change,
        beforeUpload: beforeUpload,
        data: data,
      },
      uploadProps,
    );
    var signUrl;

    if (isSign && uploadProps.listType === 'picture-card') {
      var signFile = fileList[0];
      signUrl =
        signFile === null || signFile === void 0 ? void 0 : signFile.url;
      props.showUploadList = false;
      props.className = (0, _classnames.default)(
        props.className,
        'upload-list-item-into',
      );
      console.log('class', props);
    } else {
      props.fileList = fileList;
    }

    var UploadBtn = function UploadBtn() {
      var listType = uploadProps.listType;

      var cardButton = /*#__PURE__*/ _react.default.createElement(
        'div',
        null,
        loading
          ? /*#__PURE__*/ _react.default.createElement(
              _icons.LoadingOutlined,
              null,
            )
          : /*#__PURE__*/ _react.default.createElement(
              _icons.PlusOutlined,
              null,
            ),
        /*#__PURE__*/ _react.default.createElement(
          'div',
          {
            style: {
              marginTop: 8,
            },
          },
          label !== null && label !== void 0 ? label : 'Unpload',
        ),
      );

      var uploadButton = function uploadButton() {
        if (isSign) {
          console.log('previewType', previewType);
          return signUrl
            ? /*#__PURE__*/ _react.default.createElement(
                _SignCardUpload.default,
                {
                  previewType: previewType,
                  fileUrl: signUrl,
                  onDeleteFile: deleteFile,
                  onPreview: preview,
                },
              )
            : cardButton;
        } else {
          if (fileList.length >= maxCount) {
            return null;
          }

          return cardButton;
        }
      };

      if (listType === 'picture-card') {
        return uploadButton();
      } else {
        return /*#__PURE__*/ _react.default.createElement(
          _button.default,
          {
            icon: /*#__PURE__*/ _react.default.createElement(
              _icons.PlusOutlined,
              null,
            ),
          },
          label !== null && label !== void 0 ? label : 'Unpload',
        );
      }
    };

    return /*#__PURE__*/ _react.default.createElement(
      _react.default.Fragment,
      null,
      /*#__PURE__*/ _react.default.createElement(
        _upload.default,
        (0, _objectSpread2.default)({}, props),
        UploadBtn(),
      ),
      previewType === 'modal'
        ? /*#__PURE__*/ _react.default.createElement(
            _modal.default,
            {
              visible: previewVisible,
              title: '图片预览',
              footer: null,
              onCancel: function onCancel() {
                return setPreviewVisible(false);
              },
            },
            /*#__PURE__*/ _react.default.createElement('img', {
              alt: '图片',
              style: {
                width: '100%',
              },
              src: previewImage,
            }),
          )
        : null,
    );
  };

  return /*#__PURE__*/ _react.default.createElement(
    _react.default.Fragment,
    null,
    crop
      ? /*#__PURE__*/ _react.default.createElement(
          _antdImgCrop.default,
          {
            rotate: true,
          },
          originUpload(),
        )
      : originUpload(),
  );
};

var _default = Uploader;
exports.default = _default;

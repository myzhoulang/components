function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr &&
    ((typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
      arr['@@iterator']);
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { Upload, Button, Modal } from 'antd';
import SignCardUpload from './SignCardUpload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { noop, getExtraData, uploadValid } from '@/utils';
import style from './index.less';
var defaultProps = {
  previewType: 'modal',
  valueType: 'string',
  getOSSConfig: noop,
  signSize: 200,
  crop: false,
  exts: ['jpg', 'jpeg', 'png'],
  accept: 'image/jpg, image/png, image/jpeg',
};

var Uploader = function Uploader(originProps) {
  var props = Object.assign(_objectSpread({}, defaultProps), originProps);
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

  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    fileList = _useState2[0],
    setFileList = _useState2[1];

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];

  var _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    previewImage = _useState6[0],
    setPreviewImage = _useState6[1];

  var _useState7 = useState({}),
    _useState8 = _slicedToArray(_useState7, 2),
    data = _useState8[0],
    setData = _useState8[1];

  var _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    previewVisible = _useState10[0],
    setPreviewVisible = _useState10[1];

  var isTriggerChange = useRef(false);
  var lastValue = useRef(value); // 文件上传成功后执行的操作
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
    var _ref2 = _asyncToGenerator(
      /*#__PURE__*/ regeneratorRuntime.mark(function _callee(file) {
        var _uploadProps$multiple;

        var oss, uploadProps, result, _data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                (oss = props.oss), (uploadProps = props.uploadProps);
                result = uploadValid(file, {
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
                return getExtraData(file, oss);

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
    _objectSpread({}, defaultUploadProps),
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

  useEffect(
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
                return _objectSpread(
                  {
                    name: ''.concat(Math.random()),
                    url: item,
                  },
                  info,
                );
              }

              return _objectSpread(_objectSpread({}, info), item);
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
    var props = _objectSpread(
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
      props.className = classnames(props.className, [style.signCard]);
      console.log('class', props);
    } else {
      props.fileList = fileList;
    }

    var UploadBtn = function UploadBtn() {
      var listType = uploadProps.listType;
      var cardButton = /*#__PURE__*/ React.createElement(
        'div',
        null,
        loading
          ? /*#__PURE__*/ React.createElement(LoadingOutlined, null)
          : /*#__PURE__*/ React.createElement(PlusOutlined, null),
        /*#__PURE__*/ React.createElement(
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
            ? /*#__PURE__*/ React.createElement(SignCardUpload, {
                previewType: previewType,
                fileUrl: signUrl,
                onDeleteFile: deleteFile,
                onPreview: preview,
              })
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
        return /*#__PURE__*/ React.createElement(
          Button,
          {
            icon: /*#__PURE__*/ React.createElement(PlusOutlined, null),
          },
          label !== null && label !== void 0 ? label : 'Unpload',
        );
      }
    };

    return /*#__PURE__*/ React.createElement(
      React.Fragment,
      null,
      /*#__PURE__*/ React.createElement(
        Upload,
        _objectSpread({}, props),
        UploadBtn(),
      ),
      previewType === 'modal'
        ? /*#__PURE__*/ React.createElement(
            Modal,
            {
              visible: previewVisible,
              title: '图片预览',
              footer: null,
              onCancel: function onCancel() {
                return setPreviewVisible(false);
              },
            },
            /*#__PURE__*/ React.createElement('img', {
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

  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    crop
      ? /*#__PURE__*/ React.createElement(
          ImgCrop,
          {
            rotate: true,
          },
          originUpload(),
        )
      : originUpload(),
  );
};

export default Uploader;

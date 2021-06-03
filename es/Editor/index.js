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

import React, { useMemo } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { getExtraData } from '../utils';
import styles from './index.less';

var Editor = function Editor(props) {
  var value = props.value,
    onChange = props.onChange,
    _props$upload = props.upload,
    upload = _props$upload === void 0 ? {} : _props$upload,
    _props$braftEditorPro = props.braftEditorProps,
    braftEditorProps =
      _props$braftEditorPro === void 0 ? {} : _props$braftEditorPro,
    _props$oss = props.oss,
    oss = _props$oss === void 0 ? {} : _props$oss;
  var editorState = useMemo(
    function () {
      if (typeof value === 'string') {
        return BraftEditor.createEditorState(value);
      } else {
        return value;
      }
    },
    [value],
  );

  function change(editorState) {
    if (onChange) {
      onChange(editorState);
    }
  }

  var uploadFn = /*#__PURE__*/ (function () {
    var _ref = _asyncToGenerator(
      /*#__PURE__*/ regeneratorRuntime.mark(function _callee(param) {
        var onProgress, onSuccess, onError, onAbort, ossData, form, xhr;
        return regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.prev = 0;

                  onProgress = function onProgress(event) {
                    param.progress((event.loaded / event.total) * 100);
                  };

                  onSuccess = function onSuccess(data) {
                    var url = '';

                    if (ossData) {
                      url = ossData.host + '/' + ossData.path;
                    }

                    param.success({
                      url: url,
                      meta: {
                        id: '',
                        title: '',
                        alt: '',
                        loop: true,
                        autoPlay: true,
                        controls: true,
                        poster: '', // 指定视频播放器的封面
                      },
                    });
                  };

                  onError = function onError() {
                    param.error({
                      msg: '上传失败',
                    });
                  };

                  onAbort = function onAbort() {}; // 有自定义上传方法，直接使用并返回

                  _context.next = 7;
                  return getExtraData(param.file, oss);

                case 7:
                  ossData = _context.sent;
                  form = new FormData();
                  xhr = new XMLHttpRequest();
                  xhr.responseType = 'json';

                  if (!(typeof upload.customUpload === 'function')) {
                    _context.next = 13;
                    break;
                  }

                  return _context.abrupt('return', upload.customUpload(form));

                case 13:
                  if (upload.action) {
                    _context.next = 16;
                    break;
                  }

                  param.error({
                    msg: '使用默认上传方法需要 action 地址',
                  });
                  return _context.abrupt('return');

                case 16:
                  if (ossData) {
                    _context.next = 19;
                    break;
                  }

                  param.error({
                    msg: '获取 oss 数据失败',
                  });
                  return _context.abrupt('return');

                case 19:
                  Object.entries(ossData).forEach(function (_ref2) {
                    var _ref3 = _slicedToArray(_ref2, 2),
                      key = _ref3[0],
                      value = _ref3[1];
                  });
                  form.append('file', param.file);
                  xhr.open('POST', upload.action, true);
                  xhr.send(form);
                  xhr.upload.addEventListener('progress', onProgress, false);
                  xhr.addEventListener('load', onSuccess, false);
                  xhr.addEventListener('error', onError, false);
                  xhr.addEventListener('abort', onAbort, false);
                  _context.next = 32;
                  break;

                case 29:
                  _context.prev = 29;
                  _context.t0 = _context['catch'](0);
                  console.error('上传失败 ===》 ', _context.t0);

                case 32:
                case 'end':
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[0, 29]],
        );
      }),
    );

    return function uploadFn(_x) {
      return _ref.apply(this, arguments);
    };
  })();

  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: styles.braftEditor,
    },
    /*#__PURE__*/ React.createElement(
      BraftEditor,
      _objectSpread(
        _objectSpread({}, braftEditorProps),
        {},
        {
          value: editorState,
          onChange: change,
          media: {
            uploadFn: uploadFn,
          },
        },
      ),
    ),
  );
};

export default Editor;

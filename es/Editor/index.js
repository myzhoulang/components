import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import React, { useMemo } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { getExtraData } from '../utils';
import './styles/index.less';

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
      /*#__PURE__*/ _regeneratorRuntime.mark(function _callee(param) {
        var onProgress, onSuccess, onError, onAbort, ossData, form, xhr;
        return _regeneratorRuntime.wrap(
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
      className: 'braft-editor',
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

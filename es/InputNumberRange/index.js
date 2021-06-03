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

import React from 'react';
import 'antd/dist/antd.css';
import styles from './index.less';
import { InputNumber } from 'antd';

var InputNumberRange = function InputNumberRange(_ref) {
  var _ref$value = _ref.value,
    value = _ref$value === void 0 ? [] : _ref$value,
    _onChange = _ref.onChange,
    _ref$placeholder = _ref.placeholder,
    placeholder = _ref$placeholder === void 0 ? [] : _ref$placeholder,
    _ref$inputNumberProps = _ref.inputNumberProps,
    inputNumberProps =
      _ref$inputNumberProps === void 0 ? {} : _ref$inputNumberProps,
    width = _ref.width;

  var _value = _slicedToArray(value, 2),
    start = _value[0],
    end = _value[1];

  var inputWidth =
    width !== null && width !== void 0
      ? width
      : typeof width === 'number'
      ? ''.concat(width, 'px')
      : width;
  return /*#__PURE__*/ React.createElement(
    'span',
    null,
    /*#__PURE__*/ React.createElement(
      InputNumber,
      _objectSpread(
        {
          value: start,
          placeholder: placeholder[0],
          onChange: function onChange(val) {
            return _onChange === null || _onChange === void 0
              ? void 0
              : _onChange([val, end]);
          },
          style: {
            width: inputWidth,
          },
        },
        inputNumberProps,
      ),
    ),
    /*#__PURE__*/ React.createElement(
      'span',
      {
        className: styles.rangeLine,
      },
      '-',
    ),
    /*#__PURE__*/ React.createElement(
      InputNumber,
      _objectSpread(
        {
          value: end,
          placeholder: placeholder[1],
          onChange: function onChange(val) {
            return _onChange === null || _onChange === void 0
              ? void 0
              : _onChange([start, val]);
          },
          style: {
            width: inputWidth,
          },
        },
        inputNumberProps,
      ),
    ),
  );
};

export default InputNumberRange;

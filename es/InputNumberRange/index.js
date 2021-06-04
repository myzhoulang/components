import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import 'antd/es/input-number/style';
import _InputNumber from 'antd/es/input-number';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import React from 'react'; // import './styles/index.less';

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
      _InputNumber,
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
        className: 'range-line',
      },
      '-',
    ),
    /*#__PURE__*/ React.createElement(
      _InputNumber,
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

'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectSpread2'),
);

require('antd/es/input-number/style');

var _inputNumber = _interopRequireDefault(require('antd/es/input-number'));

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
);

var _react = _interopRequireDefault(require('react'));

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

  var _value = (0, _slicedToArray2.default)(value, 2),
    start = _value[0],
    end = _value[1];

  var inputWidth =
    width !== null && width !== void 0
      ? width
      : typeof width === 'number'
      ? ''.concat(width, 'px')
      : width;
  return /*#__PURE__*/ _react.default.createElement(
    'span',
    null,
    /*#__PURE__*/ _react.default.createElement(
      _inputNumber.default,
      (0, _objectSpread2.default)(
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
    /*#__PURE__*/ _react.default.createElement(
      'span',
      {
        className: 'range-line',
      },
      '-',
    ),
    /*#__PURE__*/ _react.default.createElement(
      _inputNumber.default,
      (0, _objectSpread2.default)(
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

var _default = InputNumberRange;
exports.default = _default;

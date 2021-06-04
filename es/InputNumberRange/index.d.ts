import React from 'react';
import type { InputNumberProps } from 'antd';
export declare type InputNumberRangeProps = {
  /** inputNumberProps */
  inputNumberProps?: Exclude<InputNumberProps, 'value'>;
  /** value 输入框的值 */
  value?: [number?, number?];
  /** onChange 输入框中值改变后的回调 */
  onChange?: (value: [(number | string)?, (number | string)?]) => void;
  /** placeholder 输入框的placeholder */
  placeholder?: [string, string];
  /** width 输入框的宽度 */
  width?: string | number;
};
declare const InputNumberRange: React.FC<InputNumberRangeProps>;
export default InputNumberRange;

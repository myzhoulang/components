import React from 'react';
import 'antd/dist/antd.css';
import styles from './index.less';
import { InputNumber } from 'antd';
import type { InputNumberProps } from 'antd';

export type InputNumberRangeProps = {
  /** inputNumberProps */
  inputNumberProps?: Exclude<InputNumberProps, 'value'>;
  /** value 输入框的值 */
  value: [number?, number?];
  /** onChange 输入框中值改变后的回调 */
  onChange?: (value: [(number | string)?, (number | string)?]) => void;
  /** placeholder 输入框的placeholder */
  placeholder?: [string, string];
  /** width 输入框的宽度 */
  width?: string | number;
};

const InputNumberRange: React.FC<InputNumberRangeProps> = ({
  value = [],
  onChange,
  placeholder = [],
  inputNumberProps = {},
  width,
}) => {
  let [start, end] = value;
  const inputWidth =
    width ?? (typeof width === 'number' ? `${width}px` : width);
  return (
    <span>
      <InputNumber
        value={start}
        placeholder={placeholder[0]}
        onChange={(val) => onChange?.([val, end])}
        style={{
          width: inputWidth,
        }}
        {...inputNumberProps}
      />
      <span className={styles.rangeLine}>-</span>
      <InputNumber
        value={end}
        placeholder={placeholder[1]}
        onChange={(val) => onChange?.([start, val])}
        style={{
          width: inputWidth,
        }}
        {...inputNumberProps}
      />
    </span>
  );
};

export default InputNumberRange;

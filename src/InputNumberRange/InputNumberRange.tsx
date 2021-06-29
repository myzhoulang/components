import React from 'react';
import { InputNumber } from 'antd';
import type { InputNumberRangeProps } from './typing';

import './index.less';

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
  const styles = {
    display: 'flex',
    width: '100%',
  };
  return (
    <div style={styles}>
      <InputNumber
        value={start}
        placeholder={placeholder[0]}
        onChange={(val) => onChange?.([val, end])}
        style={{
          width: inputWidth,
          flex: 1,
        }}
        {...inputNumberProps}
      />
      <span className="range-line">-</span>
      <InputNumber
        value={end}
        placeholder={placeholder[1]}
        onChange={(val) => onChange?.([start, val])}
        style={{
          width: inputWidth,
          flex: 1,
        }}
        {...inputNumberProps}
      />
    </div>
  );
};

export default InputNumberRange;

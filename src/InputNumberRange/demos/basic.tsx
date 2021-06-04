import React, { useState } from 'react';
import { Card } from 'antd';
import { InputNumberRange } from '@zhou.lang/components';

export default () => {
  const [value, setValue] = useState<[number?, number?]>([3, 5]);
  const change = (val: [number?, number?]) => {
    setValue(val);
  };
  return (
    <Card bordered={false}>
      <InputNumberRange
        // @ts-ignore
        onChange={change}
        placeholder={['start', 'end']}
        value={value}
        inputNumberProps={{
          min: 1,
          max: 10,
        }}
      />
    </Card>
  );
};

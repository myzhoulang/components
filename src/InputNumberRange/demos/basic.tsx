import React from 'react';
import { Card } from 'antd';
import { InputNumberRange } from '@zhou.lang/components';

export default () => (
  <Card bordered={false}>
    <InputNumberRange placeholder={['start', 'end']} value={[3, 5]} />
  </Card>
);

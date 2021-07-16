import { Cascader } from 'antd';
import React from 'react';
import { useIntl } from '@ant-design/pro-provider';

import type { ProFieldFC } from '@ant-design/pro-field';

const FieldCascader: ProFieldFC<{
  text: string;
}> = ({ text, mode, render, renderFormItem, fieldProps }) => {
  const intl = useIntl();
  console.log(fieldProps);
  if (mode === 'read') {
    const dom = text ?? '-';

    if (render) {
      return render(text, { mode, ...fieldProps }, <>{dom}</>);
    }
    return <>{dom}</>;
  }
  if (mode === 'edit' || mode === 'update') {
    const placeholder = intl.getMessage('tableForm.inputPlaceholder', '请输入');
    const dom = <Cascader placeholder={placeholder} {...fieldProps} />;

    if (renderFormItem) {
      return renderFormItem(text, { mode, ...fieldProps }, dom);
    }
    return dom;
  }
  return null;
};

export default FieldCascader;

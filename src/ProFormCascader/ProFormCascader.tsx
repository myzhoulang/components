import React from 'react';
import type { CascaderProps, CascaderOptionType } from 'antd/es/cascader';
import createField from '@ant-design/pro-form/es/BaseForm/createField';
import type { ProFormItemProps } from '@ant-design/pro-form/es/interface';
import FieldCascader from './FieldCascader';

const valueType = 'cascader';
/**
 * 文本组件
 *
 * @param
 */
// type ProFormCascaderOptionType = {
//   label: string;
//   value: number | string;
//   children: Array<ProFormCascaderOptionType>;
// };
const ProFormCascader = createField<ProFormItemProps<CascaderProps>>(
  ({ fieldProps, proFieldProps }: ProFormItemProps<CascaderProps>) => {
    console.log('f', fieldProps, proFieldProps);
    const [text, setText] = React.useState<Array<string | React.ReactNode>>([]);
    React.useEffect(() => {
      const options = fieldProps?.options ?? [];
      const value = fieldProps?.value ?? [];
      let i = 0;
      function find(
        value: Array<number | string>,
        options: Array<CascaderOptionType>,
        text = [],
      ): Array<string> {
        var item = options.find((opt) => opt.value === value[i]);
        if (item) {
          i++;
          if (item.children) {
            // @ts-ignore
            text.push(item.label);
            return find(value, item.children, text);
          } else {
            // @ts-ignore
            text.push(item.label);
            return text;
          }
        }
        return text;
      }
      setText(find(value, options));
    }, [fieldProps]);
    return (
      <FieldCascader
        mode="edit"
        fieldProps={fieldProps}
        {...proFieldProps}
        text={text?.join(' / ')}
      />
    );
  },
);

export default ProFormCascader;

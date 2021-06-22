import React, { useRef, useState } from 'react';
import { Button, message, Space } from 'antd';
import type { FormInstance } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormCascader } from '@zhou.lang/components';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

export default () => {
  const formRef = useRef<FormInstance>();
  const [mode, setMode] = useState(false);
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="新建表单"
      formRef={formRef}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建表单
        </Button>
      }
      initialValues={{
        id: '111',
        cascader: ['zhejiang', 'hangzhou', 'xihu'],
        mangerName: '商务经理S',
        project: 'xxxx项目',
      }}
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
    >
      <Space>
        <Button
          onClick={() => {
            formRef.current?.setFieldsValue({
              cascader: ['jiangsu', 'nanjing', 'zhonghuamen'],
            });
          }}
        >
          change
        </Button>

        <Button
          onClick={() => {
            setMode((state) => !state);
          }}
        >
          切换读写模式
        </Button>
      </Space>

      <ProFormCascader
        label="级联"
        fieldProps={{ options: options, changeOnSelect: true }}
        name="cascader"
        readonly={mode}
      />

      <ProFormText width="sm" name="id" label="主合同编号" readonly={mode} />
      <ProFormText disabled label="项目名称" initialValue="" readonly={mode} />
      <ProFormText
        width="xs"
        name="mangerName"
        label="商务经理"
        readonly={mode}
      />
    </ModalForm>
  );
};

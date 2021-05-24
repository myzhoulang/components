import React from 'react';
import { Card, Form, Button } from 'antd';
import { InputNumberRange } from '@zhou.lang/components';

export default () => {
  const onFinish = (values) => {
    console.log('Received values from form: ', values);
  };
  const [form] = Form.useForm();
  const check = (_, value) => {
    if (Array.isArray(value)) {
      const [start, end] = value;
      return end > start
        ? Promise.resolve()
        : Promise.reject(new Error('结束值不能小于开始值'));
    }

    return Promise.reject(new Error('值必须是一个数组'));
  };

  return (
    <Card bordered={false}>
      <Form
        form={form}
        name="customized_form_controls"
        layout="inline"
        onFinish={onFinish}
        initialValues={{
          price: [0, 1],
        }}
      >
        <Form.Item name="price" label="Price" rules={[{ validator: check }]}>
          <InputNumberRange placeholder={['start', 'end']} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

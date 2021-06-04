import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'antd';
import 'antd/dist/antd.css';
import { Editor } from '@zhou.lang/components';
import type { UploaderProps } from '../index';
import { uploadConfig } from '../../Uploader/demos/demo.config';
const { token } = uploadConfig;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const Demo = () => {
  const [uploading, setUploading] = useState(false);
  const e = useRef();

  const oss = {
    OSSHeader: { token },
    OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
  };
  const uploadProps: UploaderProps = {
    onBeforeStart(file, editor) {
      setUploading(true);
    },
    onFinsh(result, editor) {
      setUploading(false);
    },
    onSuccess(data) {
      console.log('onSuccess', data);
    },
    action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com',
  };
  // 表单提交
  const onFinish = (values) => {
    // 这里 values 中的 content 是一个 editorState对象
    // 需要 使用 toHTML 方法拿到最终的 html 字符串
    const { content } = values;
    console.log('Received values from form: ', {
      content: content.toHTML(),
    });
  };

  const [form] = Form.useForm();

  // 模拟从后端请求数据
  // 拿到数据后使用表单的 setFieldsValue 设置值
  // 无需再手动处理

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue({
        content: '<h1>标题</h1>',
      });
    }, 1000);
  }, []);

  // 校验富文本是否必填需要一个自定义一个函数去校验
  // 因为这里的value 是一个 editorState 对象， 对象永远是 ture
  // 参考： https://braft.margox.cn/demos/antd-form
  function validateBraftEditor() {
    return {
      validator(_, value) {
        if (value.isEmpty()) {
          return Promise.reject(new Error('服务内容不能为空'));
        }
        return Promise.resolve();
      },
    };
  }

  return (
    <Form form={form} onFinish={onFinish} {...layout}>
      <Form.Item
        label="服务内容"
        name="content"
        rules={[
          {
            required: true,
          },
          validateBraftEditor(),
        ]}
      >
        <Editor
          oss={oss}
          upload={uploadProps}
          braftEditorProps={{ contentStyle: { height: '300px' } }}
        />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" disabled={uploading}>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Demo;

---
title: Uploader
order: 0
group:
  path: /
nav:
  title: 组件
  path: /components
---

# Upload

> `Uploader`是对 `antd`中的`Upload` 组件的再封装。针对业务在此基础上添加了一些配置，方便使用，减少重复逻辑

## 代码示例

### 结合 antd 表单校验使用

```tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, message, Space, Row, Col, Input, Spin } from 'antd';
import { Uploader } from '@zhou.lang/components';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};
const { TextArea } = Input;
const token = `b2afc52e13d4456eaae13923d960db9d`;
const Demo = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState({});
  const [projectId] = useState(1);

  const onFinish = (values) => {
    console.log('Received values from form: ', values);
  };

  const oss = {
    OSSHeader: { token },
    OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
  };

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue({
        avatar:
          'https://gw.alipayobjects.com/zos/bmw-prod/acb29a94-6200-4798-82eb-190177fa841c/kezwf18r_w2556_h1396.jpeg',
        projects: [
          'https://gw.alipayobjects.com/zos/bmw-prod/acb29a94-6200-4798-82eb-190177fa841c/kezwf18r_w2556_h1396.jpeg',
        ],
        projectsFile: '',
        media: [],
        name: '',
      });
    }, 2000);
  }, [projectId]);

  return (
    <Row gutter={20}>
      <Col span={12}>
        <Form
          form={form}
          name="customized_form_controls"
          onFinish={onFinish}
          {...layout}
        >
          <Form.Item
            name="name"
            label="您的姓名"
            rules={[{ required: true, message: '请填写您的姓名' }]}
          >
            <Input placeholder="尊姓大名" />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="个人头像"
            extra="只能上传 png 图片"
            rules={[{ required: true, message: '请上传个人头像' }]}
          >
            <Uploader
              label="个人头像"
              oss={oss}
              uploadProps={{
                listType: 'picture-card',
                maxCount: 1,
                accept: 'image/*',
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
              exts={['png', 'jpeg']}
              signSize={20000}
              crop={false}
            />
          </Form.Item>

          <Form.Item
            label="项目图标"
            name="projects"
            extra="只能上传 png 图片"
            rules={[
              { required: true, message: '请上传项目图标', type: 'array' },
            ]}
          >
            <Uploader
              label="项目图标"
              oss={oss}
              uploadProps={{
                listType: 'picture-card',
                maxCount: 5,
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
              exts={['png', 'jpeg']}
              signSize={200}
              crop={false}
            />
          </Form.Item>

          <Form.Item
            name="projectsFile"
            label="项目文件"
            extra="只能上传 pdf 或 doc 文件"
            rules={[{ required: true, message: '请上传项目文件' }]}
          >
            <Uploader
              label="项目文件"
              oss={oss}
              uploadProps={{
                maxCount: 1,
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
              maxCount={5}
              exts={['pdf', 'docx']}
              signSize={200}
              crop={false}
            />
          </Form.Item>
          <Form.Item
            name="media"
            label="媒体文件"
            extra="只能上传 mp4 或 mp3 文件"
            rules={[
              { required: true, message: '请上传媒体文件', type: 'array' },
            ]}
          >
            <Uploader
              label="媒体文件"
              oss={oss}
              uploadProps={{
                maxCount: 5,
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
              maxCount={5}
              exts={['mp4', 'mp3']}
              signSize={20000000}
              crop={false}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit1
              </Button>
              <Button htmlType="reset" onClick={() => form.resetFields()}>
                reset
              </Button>
              <Button onClick={() => form.setFieldsValue({ projects: [] })}>
                清空项目图标
              </Button>
              <Button
                onClick={() =>
                  form.setFieldsValue({
                    projects: [
                      'https://gw.alipayobjects.com/zos/bmw-prod/acb29a94-6200-4798-82eb-190177fa841c/kezwf18r_w2556_h1396.jpeg',
                    ],
                  })
                }
              >
                设置项目图标
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        <TextArea
          rows={12}
          value={JSON.stringify(value, null, '\t')}
        ></TextArea>
        <Button onClick={() => setValue(form.getFieldsValue(true))}>
          Get Form Value
        </Button>
      </Col>
    </Row>
  );
};

export default Demo;
```

### API

#### Uploder

| 属性        | 说明                                                                         | 类型                                 | 默认值                              |
| ----------- | ---------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| oss         | 文件上传到`oss`时候，获取`oss`信息的配置                                     | OSS                                  | --                                  |
| value       | 文件的路径                                                                   | `string \| string[]`                 | --                                  |
| exts        | 可以上传的文件扩展名                                                         | `string[]`                           | `['jpg', 'jpeg', 'png']`            |
| signSize    | 单个文件的最大尺寸 单位： `KB`                                               | `number`                             | `200`                               |
| crop        | 是否需要对文件进行裁剪                                                       | `boolean`                            | `false`                             |
| uploadProps | antd 的 [uploadProps](https://ant.design/components/upload-cn/#API)          | `UploadProps<any>`                   | `{ listType: 'text', maxCount: 1 }` |
| onChange    | 只有在上传的文件状态为 `done`时触发， 和 `antd`中`upload`的 `onChange`不一样 | `(urls: string \| string[]) => void` | --                                  |

### OSS

> 当文件上传到`oss`的时候采用服务端签名后直传到`oss`时,首先需要从应用服务器获取上传的`Policy`和签名，然后再将这些信息和文件直接上传到`oss`。这个配置就是用来获取`Policy`和签名的。在获取到这些签名后会将这些内容给上传组件。在这里有 3 种方式。
>
> 1. 可能在某一个时间内这些信息时固定的，比如之前已经请求过一次了，后面不需要在请求了直接复用这些信息，就可以直接配置`OSSData`属性
> 2. 组件内部有一个获取`Policy`和签名的默认方法，只需要传入`OSSAction`后，就会在内部发起获取`Policy`和签名的请求，如果获取信息的接口需要加请求头信息，可以配置`OSSHeader`属性
> 3. 当以上两种方式都不能满足的情况下，可以自定义一个获取信息的方法。

| 属性       | 说明                                | 类型                      | 默认值 |
| ---------- | ----------------------------------- | ------------------------- | ------ |
| OSSHeader  | 获取`OSS`信息时需要携带的请求头信息 | `Headers`                 | --     |
| OSSData    | `oss`信息                           | `IOSSData`                | --     |
| OSSAction  | 获取`oss`信息请求的地址             | `string`                  | --     |
| getOSSData | 自定义获取`oss`信息的方法           | `() => Promise<IOSSData>` | --     |

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

### 基本用法 限制一个文件

```tsx
import React from 'react';
import { Row, Col } from 'antd';
import { Uploader } from '@zhou.lang/components';
import 'antd/dist/antd.css';

const Demo = () => {
  const request = ({
    action,
    data,
    file,
    filename,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    // setUploading(true);
    console.log(file, filename, withCredentials);
    setTimeout(() => {
      onSuccess({
        url: 'https://gw.alipayobjects.com/zos/rmsportal/uHAzKpIQDMGdmjIxZLOV.png',
      });
      // setUploading(false);
    }, 2000);
  };
  return (
    <Row gutter={20}>
      <Col span={12}>
        <Uploader
          uploadProps={{ customRequest: request }}
          customRequest={request}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Col>
      <Col span={12}>
        <Uploader
          uploadProps={{
            listType: 'picture-card',
            showUploadList: false,
            customRequest: request,
          }}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Col>
    </Row>
  );
};

export default Demo;
```

### 基本用法 多个

```tsx
import React from 'react';
import { Row, Col } from 'antd';
import { Uploader, util } from '@zhou.lang/components';
import 'antd/dist/antd.css';

const Demo = () => {
  return (
    <Row gutter={20}>
      <Col span={12}>
        <Uploader
          oss={{
            // getOSSData: getOSSData,
            OSSHeader: { token: '1e0bb8ae06ed4a8ba1e9c18f0b740c09' },
            OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
          }}
          uploadProps={{
            maxCount: 3,
            multiple: true,
            action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
          }}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Col>

      <Col span={12}>
        <Uploader
          oss={{
            // getOSSData: getOSSData,
            OSSHeader: { token: '1e0bb8ae06ed4a8ba1e9c18f0b740c09' },
            OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
          }}
          uploadProps={{
            listType: 'picture-card',
            maxCount: 3,
            multiple: true,
            action: 'https://beicai-test.2oss-cn-hangzhou.aliyuncs.com/',
          }}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Col>
    </Row>
  );
};

export default Demo;
```

### 自定义请求方法

```tsx
import React from 'react';
import { Row, Col } from 'antd';
import { Uploader, util } from '@zhou.lang/components';
import 'antd/dist/antd.css';

const Demo = () => {
  // 自定义请求方法
  const request = async ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    console.log('customer');
    const form = new FormData();

    const ossData = await util.getExtraData(file, {
      OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
      OSSHeader: { token: 'c0365260778d4065bf57a717c9591043' },
    });

    const xhr = new XMLHttpRequest();

    Object.entries(ossData).forEach(([key, value]) => {
      form.append(key, value);
    });
    form.append('file', file);
    xhr.open('POST', 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/', true);
    xhr.send(form);
    xhr.upload.addEventListener('progress', onProgress, false);
    xhr.addEventListener('load', onSuccess, false);
    xhr.addEventListener('error', onError, false);
  };

  return (
    <Row gutter={20}>
      <Col span={12}>
        <Uploader
          uploadProps={{
            customRequest: request,
            maxCount: 3,
          }}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Col>

      <Col span={12}>
        <Uploader
          oss={{
            // getOSSData: getOSSData,
            OSSHeader: { token: 'c0365260778d4065bf57a717c9591043' },
            OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
          }}
          uploadProps={{
            listType: 'picture-card',
            maxCount: 3,
            action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
          }}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Col>
    </Row>
  );
};

export default Demo;
```

### 结合 antd 表单校验使用

```tsx
import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
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

const Demo = () => {
  const onFinish = (values) => {
    console.log('Received values from form: ', values);
  };
  const [form] = Form.useForm();

  const oss = {
    OSSHeader: { token: '1e0bb8ae06ed4a8ba1e9c18f0b740c09' },
    OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
  };

  setTimeout(() => {
    form.setFieldsValue({
      avatar: '',
      projects: [],
      projectsFile: [],
    });
  }, 2000);
  // uploadProps={{ disabled: true }}
  return (
    <Form
      form={form}
      name="customized_form_controls"
      onFinish={onFinish}
      initialValues={{
        avatar: '',
      }}
      {...layout}
    >
      <Form.Item
        name="avatar"
        label="个人头像"
        extra="只能上传 png 图片"
        rules={[{ required: true, message: 'required' }]}
      >
        <Uploader
          oss={oss}
          uploadProps={{
            listType: 'picture-card',
            maxCount: 1,
            action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
          }}
          exts={['png', 'jpeg']}
          signSize={200}
          crop={false}
        />
      </Form.Item>

      <Form.Item name="projects" label="项目图标" extra="只能上传 png 图片">
        <Uploader
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
      >
        <Uploader
          oss={oss}
          uploadProps={{
            maxCount: 5,
            action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
          }}
          maxCount={5}
          exts={['pdf', 'docx']}
          signSize={200}
          crop={false}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit1
        </Button>
        <Button></Button>
      </Form.Item>
    </Form>
  );
};

export default Demo;
```

### API

#### Uploder

| 参数        | 说明                                                                         | 类型                                 | 默认值                              |
| ----------- | ---------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| value       | 文件的路径                                                                   | `string \| string[]`                 | --                                  |
| exts        | 可以上传的文件扩展名                                                         | `string[]`                           | `['jpg', 'jpeg', 'png']`            |
| signSize    | 单个文件的最大尺寸 单位： `KB`                                               | `number`                             | `200`                               |
| crop        | 是否需要对文件进行裁剪                                                       | `boolean`                            | `false`                             |
| uploadProps | antd 的 [uploadProps](https://ant.design/components/upload-cn/#API)          | `UploadProps<any>`                   | `{ listType: 'text', maxCount: 1 }` |
| onChange    | 只有在上传的文件状态为 `done`时触发， 和 `antd`中`upload`的 `onChange`不一样 | `(urls: string \| string[]) => void` | --                                  |

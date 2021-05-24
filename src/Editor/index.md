---
title: Editor
order: 0
group:
  path: /
nav:
  title: 组件
  path: /components
---

# Editor

> `Editor`是对 `BraftEditor` 组件的再封装, `BraftEditor`上的属性都可以用在`Editor`的`braftEditorProps`属性上

## 代码示例

### 结合antd表单校验使用

```tsx
  import React, { useState } from "react";
  import { Form, Button } from "antd";
  import "antd/dist/antd.css";
  import { Editor } from "@zhou.lang/components";
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  };

  const Demo = () => {
    const uploadProps = {
      serverUrl:"https://beicai-test.oss-cn-hangzhou.aliyuncs.com/",
      getOSSData(){
        return fetch('http://daily.api.beicaizs.com/compliance/oss/policy',{
          method: 'GET', // or 'PUT'
          headers: new Headers({
            'Content-Type': 'application/json',
            'token': 'da17f488cf584758a60d3c5d1f578b34'
          })
        })
        .then(response => response.json())
        .then(res => res.data)
      }
    }
    // 表单提交
    const onFinish = (values) => {
      // 这里 values 中的 content 是一个 editorState对象
      // 需要 使用 toHTML 方法拿到最终的 html 字符串
      const { content } = values;
      console.log("Received values from form: ", {
        content: content.toHTML()
      });
    };

    const [form] = Form.useForm();

    // 模拟从后端请求数据
    // 拿到数据后使用表单的 setFieldsValue 设置值
    // 无需再手动处理
    setTimeout(() => {
      form.setFieldsValue({
        content:
          '<h1>标题</h1>'
      });
    }, 1000);

    // 校验富文本是否必填需要一个自定义一个函数去校验
    // 因为这里的value 是一个 editorState 对象， 对象永远是 ture
    // 参考： https://braft.margox.cn/demos/antd-form
    function validateBraftEditor() {
      return {
        validator(_, value) {
          if (value.isEmpty()) {
            return Promise.reject(new Error('服务内容不能为空'))
          }
          return Promise.resolve()
        },
      }
    }

    return ( <Form form={form}  onFinish={onFinish} {...layout}>
      <Form.Item
        label="服务内容"
        name="serviceContent"
        rules={[
          {
            required: true,
          },
          validateBraftEditor(),
        ]}
      >
        <Editor upload={uploadProps} braftEditorProps={{contentStyle: {height: '300px'}}}/>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">确定</Button>
      </Form.Item>
    </Form>)
  }
  export default Demo
```

### API

#### Editor

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 富文本的内容, [EditorState](https://github.com/margox/braft-editor/blob/master/index.d.ts#L10) | `EditorState` | - |  |
| braftEditorProps | `BraftEditor` 组件的配置, [BraftEditorProps](https://www.yuque.com/braft-editor/be/gz44tn) | `BraftEditorProps]` | - |  |
| upload | 上传文件的配置,[UploadProps](#uploadprops) | `UploadProps` | - |  |
| onChange | 富文本内容改变 | `function(editorState: EditorState)` | - |  |

#### IOSSData
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dir | 要上传的目录 | `string` | - |  |
| expire | 过期时间 | `string` | - |  |
| host | 上传文件的host | `string` | - |  |
| accessId | AccessKeyId | `string` | - |  |
| policy | 授权策略 | `string` | - |  |
| signature | OSS 签名 | `string` | - |  |
| callback | 上传成功后的回调函数 | `string` | - |  |

#### UploadProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| getOSSData | 获取 OSS 信息的方法, [IOSSData](#iossdata) | `() => Promise<IOSSData>` | - |  |
| OSSData | OSS 信息,[IOSSData](#iossdata)` | `IOSSData` | - |  |
| customUpload | 自定义上传文件方法 | `(fd: FormData, params?: Params) => Promise<any>` | - |  |
| serverUrl | 默认上传文件的地址 | `string` | - |  |




## 注意事项

- 配合`ant design`表单时校验必填时，需要自定义一个方法处理，因为这里的 value 是一个 editorState 对象， 对象永远是 ture
- 在提交数据给服务端时，需要 使用 toHTML 方法拿到最终的 html 字符串，这里 values 中的 content 是一个 editorState 对象
- `braft-edito`组件上所有能设置的属性，都可以在当前组件上设置

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
> 组件在内部集成了 文件上传功能， 默认上传到`oss`。使用默认上传需要`policy`和签名信息。如果使用自定义上传，需要在`upload`属性中
> 配置`customUpload`，自定义上传方法。

## 代码示例

### 结合 antd 表单校验使用

<code src="./demos/antdForm.tsx" title="结合 antd 表单校验使用" />

### API

#### Editor

| 参数             | 说明                                                                                           | 类型                                 | 默认值 | 版本 |
| ---------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------ | ------ | ---- |
| value            | 富文本的内容, [EditorState](https://github.com/margox/braft-editor/blob/master/index.d.ts#L10) | `EditorState`                        | -      |      |
| braftEditorProps | `BraftEditor` 组件的配置, [BraftEditorProps](https://www.yuque.com/braft-editor/be/gz44tn)     | `BraftEditorProps]`                  | -      |      |
| upload           | 上传文件的配置,[UploadProps](#uploadprops)                                                     | `UploadProps`                        | -      |      |
| onChange         | 富文本内容改变                                                                                 | `function(editorState: EditorState)` | -      |      |

#### IOSSData

| 参数      | 说明                 | 类型     | 默认值 | 版本 |
| --------- | -------------------- | -------- | ------ | ---- |
| dir       | 要上传的目录         | `string` | -      |      |
| expire    | 过期时间             | `string` | -      |      |
| host      | 上传文件的 host      | `string` | -      |      |
| accessId  | AccessKeyId          | `string` | -      |      |
| policy    | 授权策略             | `string` | -      |      |
| signature | OSS 签名             | `string` | -      |      |
| callback  | 上传成功后的回调函数 | `string` | -      |      |

#### UploadProps

| 参数         | 说明                                       | 类型                                              | 默认值 | 版本 |
| ------------ | ------------------------------------------ | ------------------------------------------------- | ------ | ---- |
| getOSSData   | 获取 OSS 信息的方法, [IOSSData](#iossdata) | `() => Promise<IOSSData>`                         | -      |      |
| OSSData      | OSS 信息,[IOSSData](#iossdata)`            | `IOSSData`                                        | -      |      |
| customUpload | 自定义上传文件方法                         | `(fd: FormData, params?: Params) => Promise<any>` | -      |      |
| serverUrl    | 默认上传文件的地址                         | `string`                                          | -      |      |

## 注意事项

- 配合`ant design`表单时校验必填时，需要自定义一个方法处理，因为这里的 value 是一个 editorState 对象， 对象永远是 ture
- 在提交数据给服务端时，需要 使用 toHTML 方法拿到最终的 html 字符串，这里 values 中的 content 是一个 editorState 对象
- `braft-edito`组件上所有能设置的属性，都可以在当前组件上设置

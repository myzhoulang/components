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

### 基本用法 单个文件

<!-- <code src="./demo/SignFile.tsx" title="单个文件" /> -->

### 自定义请求方法

<!-- <code src="./demo/CustomRequest.tsx" title="自定义请求方法" /> -->

### 值为对象或对象数组

<!-- <code src="./demo/ValueFiles.tsx" title="值为对象或对象数组" /> -->

### 结合 antd 表单校验使用

<code src="./demo/ComposeAntDForm.tsx" title="结合 antd 表单校验使用" />

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

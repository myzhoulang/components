import React, { useState, useEffect } from 'react';
import { Form, Button, Space, Row, Col, Input } from 'antd';
import { Uploader } from '@zhou.lang/components';
import type { OSS } from '@zhou.lang/components/es/utils/upload/typing';
import 'antd/dist/antd.css';

import { uploadConfig } from './demo.config';
const token: string = uploadConfig.token;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};
const { TextArea } = Input;

type FormData = {
  name: string;
  avatar: string;
  projects: string | Array<string>;
  projectsFile: string | Array<string>;
  media: string | Array<string>;
};
const ComposeAntDForm = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState({});
  const [projectId] = useState(1);

  const onFinish = (values: FormData) => {
    console.log('Received values from form: ', values);
  };

  const getValue = () => {
    const { avatar, projects, projectsFile, media, ...other } =
      form.getFieldsValue(true);
    const values = {
      // avatar: getFilePath?.(avatar),
      // projects: getFilePath?.(projects),
      // projectsFile: getFilePath?.(projectsFile),
      // media: getFilePath?.(media),
      ...other,
    };

    setValue(values);
  };

  const oss: OSS = {
    OSSHeader: new Headers({ token }),
    OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
  };

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue({
        avatar: '',
        projects: [
          'https://gw.alipayobjects.com/zos/bmw-prod/acb29a94-6200-4798-82eb-190177fa841c/kezwf18r_w2556_h1396.jpeg',
        ],
        projectsFile: [],
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
              oss={oss}
              uploadProps={{
                listType: 'picture-card',
                maxCount: 1,
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
              exts={['png', 'jpeg', 'mp4']}
              signSize={200}
              crop={false}
            />
          </Form.Item>

          <Form.Item
            name="projects"
            label="项目图标"
            extra="只能上传 png 图片"
            rules={[
              { required: true, message: '请上传项目图标', type: 'array' },
            ]}
          >
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
            extra="只能上传 pdf、doc、zip 文件"
            rules={[
              { required: true, message: '请上传项目文件', type: 'array' },
            ]}
          >
            <Uploader
              oss={oss}
              uploadProps={{
                maxCount: 5,
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
              exts={['pdf', 'docx', 'zip']}
              signSize={200000}
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
              oss={oss}
              uploadProps={{
                maxCount: 5,
                action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
              }}
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
              <Button onClick={() => form.setFieldsValue({ avatar: '' })}>
                清空头像
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
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea
            rows={12}
            value={JSON.stringify(value, null, '\t')}
          ></TextArea>
          <Button onClick={getValue}>获取表单的值</Button>
        </Space>
      </Col>
    </Row>
  );
};

export default ComposeAntDForm;

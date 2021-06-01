import React, { useState, useEffect } from 'react';
import { Form, Button, Space, Row, Col, Input } from 'antd';
import { Uploader } from '@zhou.lang/components';
import type { OSS } from '@zhou.lang/components';
import 'antd/dist/antd.css';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};
const { TextArea } = Input;
const token = `b671f50d46364240914f26cc435a694a`;

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

  const oss: OSS = {
    OSSHeader: { token },
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
              exts={['png', 'jpeg']}
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
            extra="只能上传 pdf 或 doc 文件"
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

export default ComposeAntDForm;
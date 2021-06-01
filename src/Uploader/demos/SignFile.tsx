import React from 'react';
import { Row, Col } from 'antd';
import { Uploader } from '@zhou.lang/components';
import 'antd/dist/antd.css';

import { uploadConfig } from '../../../demo.config';
const token = uploadConfig.token;

const SignFile = () => {
  return (
    <Row gutter={20}>
      <Col span={12}>
        <Uploader
          oss={{
            OSSHeader: { token },
            OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
          }}
          uploadProps={{
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
            OSSHeader: { token },
            OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
          }}
          uploadProps={{
            listType: 'picture-card',
            showUploadList: false,
            action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
          }}
          exts={['png', 'jpeg']}
          signSize={200000}
          crop={false}
        />
      </Col>
    </Row>
  );
};

export default SignFile;

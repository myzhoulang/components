import React from 'react';
import { Row, Col } from 'antd';
import { RedEnvelopeOutlined } from '@ant-design/icons';
import { Uploader } from '@zhou.lang/components';
import 'antd/dist/antd.css';

import { uploadConfig } from './demo.config';
const token = uploadConfig.token;

const CustomUploadControl = () => {
  return (
    <Uploader
      oss={{
        OSSHeader: new Headers({ token }),
        OSSAction: 'http://daily.api.beicaizs.com/compliance/oss/policy',
      }}
      uploadProps={{
        action: 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/',
        showUploadList: false,
      }}
      value={
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      }
      exts={['png', 'jpeg']}
      signSize={200}
      crop={false}
    >
      {<RedEnvelopeOutlined />}
    </Uploader>
  );
};

export default CustomUploadControl;

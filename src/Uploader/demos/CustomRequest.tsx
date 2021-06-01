import React from 'react';
import { Row, Col } from 'antd';
import { Uploader, util } from '@zhou.lang/components';
import type { UploadProps } from 'antd';
import 'antd/dist/antd.css';

import { uploadConfig } from '../../../demo.config';
const token = uploadConfig.token;

const CustomRequest = () => {
  // 自定义请求方法
  const request: UploadProps['customRequest'] = async ({
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
      OSSHeader: { token },
    });

    const xhr = new XMLHttpRequest();

    Object.entries(ossData).forEach(([key, value]) => {
      form.append(key, value as any);
    });
    form.append('file', file);
    xhr.responseType = 'json';
    xhr.open('POST', 'https://beicai-test.oss-cn-hangzhou.aliyuncs.com/', true);

    xhr.upload.addEventListener(
      'progress',
      (e) => {
        onProgress?.(Object.assign(e, { percent: (e.loaded / e.total) * 100 }));
      },
      false,
    );
    xhr.addEventListener(
      'load',
      (e) => {
        console.log('load =>', xhr.response);
        onSuccess?.(xhr.response, xhr);
      },
      false,
    );
    xhr.addEventListener(
      'error',
      (e) => {
        onError?.(e);
      },
      false,
    );

    xhr.send(form);
  };

  return (
    <Row gutter={20}>
      <Col span={12}>
        <Uploader
          uploadProps={{
            customRequest: request,
            maxCount: 3,
            progress: {
              strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
              },
              strokeWidth: 3,
              format: (percent: number) => `${parseFloat(percent.toFixed(2))}%`,
            },
          }}
          value={
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
          exts={['png', 'jpeg', 'mp4']}
          signSize={200000}
          crop={false}
        />
      </Col>

      <Col span={12}>
        <Uploader
          oss={{
            // getOSSData: getOSSData,
            OSSHeader: { token },
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

export default CustomRequest;

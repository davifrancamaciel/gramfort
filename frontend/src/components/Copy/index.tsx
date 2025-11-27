import React, { useEffect, useState } from 'react';
import { Button, Col, Input, notification, Row, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface PropTypes {
  text: string;
}
const Copy: React.FC<PropTypes> = ({ text }) => {
  const [copy, setCopy] = useState('');

  useEffect(() => {
    getCopy();
  }, []);

  const getCopy = () => {
    setCopy(text);
  };

  const copyTextToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
        notification.success({
          message: 'Link copiado'
        });
        return true;
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
        return false;
      }
    );
  };
  return (
    <Row style={{ marginBottom: '15px' }}>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Input.Group compact>
          <Input
            readOnly={true}
            style={{ width: 'calc(100% - 32px)' }}
            defaultValue={copy}
            value={copy}
          />
          <Tooltip title="Copiar">
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyTextToClipboard(copy)}
            />
          </Tooltip>
        </Input.Group>
      </Col>
    </Row>
  );
};

export default Copy;

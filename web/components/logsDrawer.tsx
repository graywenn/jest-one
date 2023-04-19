import React from 'react';
import { Drawer, Row } from 'antd';
import { ResultConsoleType } from '../../types';
import { Col } from 'antd';

export const LogsDrawer = (props: {
  consoles: ResultConsoleType[];
  open: boolean;
  onClose: () => void;
}) => {
  const { consoles, open, onClose } = props;
  return (
    <Drawer
      title='Logs'
      placement='top'
      closable={false}
      open={open}
      onClose={onClose}
    >
      {consoles.map((item) => {
        return (
          <Row>
            <Col span={24}>
              [{item.type.toUpperCase()}] {item.message}
            </Col>
            <Col span={24}>{item.origin}</Col>
          </Row>
        );
      })}
    </Drawer>
  );
};

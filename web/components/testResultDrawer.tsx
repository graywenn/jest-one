import React from 'react';
import { Drawer, Row } from 'antd';
import { ResultConsoleType } from '../../types';
import { Col } from 'antd';
import { TestResultTable } from './testResultTable';

export const TestResultDrawer = (props: {
  testId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { testId, open, onClose } = props;
  return (
    <Drawer
      height={'80%'}
      title='Test Result List'
      placement='top'
      closable={false}
      open={open}
      onClose={onClose}
    >
      <TestResultTable testId={testId} />
    </Drawer>
  );
};

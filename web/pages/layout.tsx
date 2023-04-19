import React from 'react';
import { Content } from 'antd/es/layout/layout';
import { FileListTable } from '../components/fileListTable';
import { TestListTable } from '../components/testListTable';
import { Col, Row } from 'antd';
import { TestResultTable } from '../components/testResultTable';

const Layout = () => {
  return (
    <Content style={{ padding: '16px 16px' }}>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <FileListTable />
        </Col>
        <Col span={24}>
          <TestListTable />
        </Col>
      </Row>
    </Content>
  );
};
export default Layout;

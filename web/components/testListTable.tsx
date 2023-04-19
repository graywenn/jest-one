import React, { useState } from 'react';
import { Button, Col, Row, Space, Table, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Card from 'antd/lib/card/Card';
import { ColumnsType } from 'antd/es/table';
import { Events, TestStatus } from '../../common/enums';
import { TestListType } from '../../types';
import { JestEventSubscription, QueryTestList } from '../gql/tests';
import { useQuery, useSubscription } from '@apollo/client';
import { CreateTestDrawer } from './createTestDrawer';
import { EnvironmentDrawer } from './environmentDrawer';
import { TagDrawer } from './tagDrawer';
import { TestResultDrawer } from './testResultDrawer';

export const TestListTable = () => {
  const [drawers, setDrawers] = useState({
    create: false,
    environment: false,
    result: false,
  });
  const [testId, setTestId] = useState('');
  const { data: { list: testList } = { testList: [] }, refetch } =
    useQuery(QueryTestList);

  useSubscription(JestEventSubscription, {
    onData: (_) => {
      if (_.data?.data?.jestEvents.event === Events.RUN_COMPLETE) {
        setTimeout(() => refetch(), 400);
      } else {
        refetch();
      }
    },
  });
  const tableColumns = [
    {
      title: 'Environment',
      dataIndex: 'environment',
      width: '10%',
    },
    {
      title: 'Tag Name',
      dataIndex: 'tag',
      width: '10%',
      render: (_, record) => {
        return (
          <Tag style={{ textAlign: 'center' }}>{record.tag.toUpperCase()}</Tag>
        );
      },
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      width: '10%',
      ellipsis: true,
      render: (createTime) => {
        return createTime;
      },
    },
    {
      title: 'Statistics',
      width: '15%',
      children: [
        {
          title: 'Passed',
          width: '5%',
          render: (_, record) => record.numPassingTests || 0,
        },
        {
          title: 'Failed',
          width: '5%',
          render: (_, record) => record.numFailingTests || 0,
        },
        {
          title: 'Skip',
          width: '5%',
          render: (_, record) => record.numPendingTests || 0,
        },
      ],
    },
    {
      title: 'Total Duration',
      dataIndex: 'totalDuration',
      width: '10%',
      render: (_, record) => {
        return new Date(record.totalDuration || 0)
          .toISOString()
          .substring(14, 23);
      },
    },
    {
      title: 'Status',
      width: '5%',
      render: (_, record) => {
        switch (record.status) {
          case TestStatus.Successful: {
            return (
              <Tag style={{ textAlign: 'center' }} color='#52c41a'>
                Done
              </Tag>
            );
          }
          case TestStatus.Running: {
            return (
              <Tag
                icon={<LoadingOutlined spin />}
                style={{ textAlign: 'center' }}
                color='#faad14'
              >
                {record.status.toUpperCase()}
              </Tag>
            );
          }
          default: {
            return <></>;
          }
        }
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: '5%',
      render: (_: any, record: TestListType) => {
        return (
          <Space wrap>
            <Button
              type='link'
              onClick={() => {
                setTestId(record.id);
                setDrawers({ ...drawers, result: true });
              }}
            >
              Details
            </Button>
          </Space>
        );
      },
    },
  ] as ColumnsType<TestListType>;

  return (
    <Card bordered={false}>
      <Row justify='space-between' style={{ padding: '16px 0 16px 0' }}>
        <Col span='24' style={{ textAlign: 'right' }}>
          <Space wrap>
            <Button
              type='primary'
              onClick={() => {
                setDrawers({ ...drawers, environment: true });
              }}
            >
              Environment
            </Button>
            <Button
              type='primary'
              onClick={() => {
                setDrawers({ ...drawers, tag: true });
              }}
            >
              Tag
            </Button>
            <Button
              type='primary'
              onClick={() => {
                setDrawers({ ...drawers, create: true });
              }}
            >
              Create
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        bordered
        rowKey={(_, index) => `row-key-${index}`}
        style={{ width: '100%' }}
        dataSource={testList}
        pagination={false}
        columns={tableColumns}
      />
      <CreateTestDrawer
        open={drawers.create}
        onClose={() => {
          setDrawers({ ...drawers, create: false });
        }}
      />
      <EnvironmentDrawer
        open={drawers.environment}
        onClose={() => {
          setDrawers({ ...drawers, environment: false });
        }}
      />
      <TagDrawer
        open={drawers.tag}
        onClose={() => {
          setDrawers({ ...drawers, tag: false });
        }}
      />
      <TestResultDrawer
        open={drawers.result}
        onClose={() => {
          setDrawers({ ...drawers, result: false });
        }}
        testId={testId}
      />
    </Card>
  );
};

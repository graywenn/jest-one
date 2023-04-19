import { Button, Col, Row, Space, Switch, Table, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { ResultItemType, TestItemType } from '../../types';
import { useQuery, useSubscription } from '@apollo/client';
import { QueryTestResultList } from '../gql/result';
import { ColumnsType } from 'antd/es/table';
import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { ResultStatus } from '../../common/types';
import { JestEventSubscription } from '../gql/tests';
import { Events } from '../../common/enums';
import { ErrorMessagesDrawer } from './errorMessagesDrawer';
import { Card } from 'antd';
import { LogsDrawer } from './logsDrawer';

interface ITestResult {
  testId: string;
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  numTodoTests: number;
  totalDuration: number;
}

const ALL = 'all';

export const TestResultTable = (props: { testId: string }) => {
  const statusTags = [
    {
      name: ALL,
      count: 0,
    },
    {
      name: 'passed',
      count: 0,
    },
    {
      name: 'pending',
      count: 0,
    },
    {
      name: 'failed',
      count: 0,
    },
  ];
  const { testId } = props;
  const [testStatistics, setTestStatistics] = useState<ITestResult>();
  const [testItems, setTestItems] = useState<TestItemType[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [rowKeys, setRowKeys] = useState([]);
  const [status, setStatus] = useState<{ name: string; count: number }[]>([
    ...statusTags,
  ]);
  const [query, setQuery] = useState<{ status: ResultStatus }>({
    status: 'passed',
  });
  const [drawers, setDrawer] = useState({ error: false, console: false });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const {
    refetch,
    data: { testResultList: testResultList } = { testResultList: [] },
  } = useQuery(QueryTestResultList, {
    variables: { testId },
    onCompleted(data) {
      const list = data.testResultList;
      if (list && list.length > 0) {
        const listFirst = list[0];
        setTestStatistics(listFirst);
        filterItems(query, listFirst.testItems);

        const paths = listFirst.testItems.map((x) => x.path);
        setRowKeys(paths);
        setExpandedRowKeys(paths);
        let _status = [...statusTags],
          all = 0;
        listFirst.testItems.forEach((item) => {
          item.resultItems.forEach((result) => {
            let found = _status.find((s) => s.name == result.status);
            if (found) found.count += 1;
            all += 1;
          });
        });
        _status.find((s) => s.name === ALL)!.count = all;
        setStatus(_status);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [testId]);

  useSubscription(JestEventSubscription, {
    onData: (_) => {
      if (_.data?.data?.jestEvents.event === Events.RUN_COMPLETE) {
        setTimeout(() => refetch(), 400);
      } else {
        refetch();
      }
    },
  });

  function filterItems(q: { status: ResultStatus }, data?: TestItemType[]) {
    setQuery(q);
    const _data = data || testResultList[0].testItems;
    if (!q.status) {
      setTestItems(_data);
    } else {
      const _testItems = [] as TestItemType[];
      _data?.forEach((result) => {
        const resultItems = result.resultItems.filter(
          (item) => item.status === q.status
        );
        resultItems.length > 0 &&
          _testItems.push({
            ...result,
            resultItems,
          });
      });

      setTestItems(_testItems);
    }
  }

  const tableColumns = [
    {
      title: 'File Path / Test Name',
      dataIndex: 'path',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: '',
      width: '10%',
    },
    {
      title: 'Duration',
      width: '10%',
    },
    {
      title: 'Operation',
      width: '20%',
    },
  ] as ColumnsType<TestItemType>;

  const childTableColumns = [
    { title: '', dataIndex: '', width: '5%' },
    {
      title: 'File',
      dataIndex: 'name',
      width: '30%',
      ellipsis: true,
      render: (_, record) => {
        return record.title;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      ellipsis: true,
      render: (_, record) => {
        const status = record.status?.toUpperCase();
        switch (record.status) {
          case 'passed':
            return <Tag color='#52c41a'>{status}</Tag>;
          case 'failed':
            return <Tag color='#ff4d4f'>{status}</Tag>;
          case 'pending':
            return <Tag color='#faad14'>SKIP</Tag>;
          default:
            return <></>;
        }
      },
    },
    {
      title: 'Duration',
      width: '10%',
      ellipsis: true,
      render: (_, record) => {
        return new Date(record.duration || 0).toISOString().substring(14, 23);
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: '20%',
      render: (_: any, record: ResultItemType) => {
        return (
          <Space wrap>
            {record.failureMessages?.length > 0 && (
              <Button
                type='link'
                onClick={() => {
                  setDrawer({ ...drawers, error: true });
                  setErrorMessages(record.failureMessages);
                }}
              >
                Errors
              </Button>
            )}
          </Space>
        );
      },
    },
  ] as ColumnsType<ResultItemType>;

  return (
    <>
      <Card bordered={false}>
        <Row justify='space-between' style={{ padding: '16px 0 16px 0' }}>
          <Col span='18'>
            {status.map((s) => (
              <Button
                key={s.name}
                style={{ margin: '0 8px' }}
                type={
                  query.status === s.name || (!query.status && s.name === ALL)
                    ? 'primary'
                    : 'default'
                }
                onClick={() => {
                  const q = { ...query, status: s.name === ALL ? '' : s.name };
                  filterItems(q);
                }}
              >
                {s.name.toUpperCase() === 'PENDING'
                  ? 'SKIP'
                  : s.name.toUpperCase()}
                &nbsp;({s.count})
              </Button>
            ))}
          </Col>
          <Col span='6' style={{ textAlign: 'right' }}>
            <Space warp>
              <Button
                type='link'
                onClick={() => setDrawer({ ...drawers, console: true })}
              >
                Consoles
              </Button>
              <Switch
                checked={
                  expandedRowKeys.length === rowKeys.length &&
                  rowKeys.length !== 0
                }
                onChange={(checked) => {
                  setExpandedRowKeys(checked ? rowKeys : []);
                }}
              />
              &nbsp;Expanded All
            </Space>
          </Col>
        </Row>
        <Table
          bordered
          rowKey={(row) => row.path}
          style={{ width: '100%' }}
          expandIcon={({ expanded, onExpand, record }) =>
            expanded ? (
              <FolderOpenOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <FolderOutlined onClick={(e) => onExpand(record, e)} />
            )
          }
          onExpand={(_, row: TestItemType) => {
            setExpandedRowKeys(
              expandedRowKeys.indexOf(row.path) === -1
                ? expandedRowKeys.concat(row.path)
                : expandedRowKeys.filter((x) => x !== row.path)
            );
          }}
          dataSource={testItems}
          expandedRowKeys={expandedRowKeys}
          expandable={{
            columnWidth: '5%',
            expandedRowRender: (record: TestItemType) => (
              <div style={{ width: '100%', margin: 0, padding: 0 }}>
                {record.resultItems.length > 0 && (
                  <Table
                    key='child-table'
                    rowKey={(data) => `row-key-${data.title}`}
                    bordered
                    style={{ width: '100%' }}
                    dataSource={record.resultItems}
                    pagination={false}
                    columns={childTableColumns}
                    showHeader={false}
                  />
                )}
              </div>
            ),
          }}
          pagination={false}
          columns={tableColumns}
        />
        <ErrorMessagesDrawer
          messages={errorMessages}
          open={drawers.error}
          onClose={() => setDrawer({ ...drawers, error: false })}
        />
        <LogsDrawer
          consoles={
            testResultList.length > 0
              ? testResultList[0].testItems?.map((x) => x.console).flat()
              : []
          }
          open={drawers.console}
          onClose={() => setDrawer({ ...drawers, console: false })}
        />
      </Card>
    </>
  );
};

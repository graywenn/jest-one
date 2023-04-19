import React, { useState, useEffect } from 'react';
import { Button, Col, Input, Row, Select, Switch, Table, message } from 'antd';
import Card from 'antd/lib/card/Card';
import { ColumnsType } from 'antd/es/table';
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { TestFileItemType, TestFileListType } from '../../types';
import { useQuery, useMutation } from '@apollo/client';
import { QueryTagNames, SetTestTags } from '../gql/tag';
import { QueryFileList } from '../gql/files';

export const FileListTable = () => {
  const NO_SET_TAG = 'No set Tag';
  const ALL = 'ALL';
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [rowKeys, setRowKeys] = useState([]);
  const [query, setQuery] = useState<{ name: string; tag: string }>({
    name: '',
    tag: '',
  });
  const [files, setFiles] = useState([]);
  const [counts, setCounts] = useState<[{ name: string; count: number }]>([]);

  const { data: { tagNames: tags = [] } = { tags: [] } } =
    useQuery(QueryTagNames);
  const {
    data: { fileList: fileList } = { fileList: [] },
    refetch: refetchFiles,
  } = useQuery(QueryFileList, {
    onCompleted: (data) => {
      calcTagCount(data.fileList);
      filterFiles(query, data.fileList);
    },
  });
  const [setTestTags] = useMutation(SetTestTags);

  useEffect(() => {
    const paths = files?.map((x) => x.path);
    setRowKeys(paths);
    // setExpandedRowKeys(paths.length > 0 ? [paths[0]] : []);
  }, [files]);

  function filterFiles(
    query: { name: string; tag?: string },
    data?: TestFileListType[]
  ) {
    setQuery(query);
    const _data = data || fileList;
    if (!query.name && !query.tag) {
      setFiles(_data);
    } else {
      const _fileList = [] as TestFileListType[];
      _data.forEach((file) => {
        let items = [] as TestFileItemType[];
        if (query.name) {
          items = file.items.filter((item) => item.name.includes(query.name));
        }
        if (query.tag === NO_SET_TAG) {
          items = file.items.filter((item) => !item.tag);
        }
        if (query.tag && query.tag !== NO_SET_TAG) {
          items = file.items.filter(
            (item) => item.tag?.indexOf(query.tag || '') >= 0
          );
        }

        if (items.length > 0) {
          _fileList.push({
            path: file.path,
            items,
          });
        }
      });
      setFiles(_fileList);
    }
  }

  function calcTagCount(data: TestFileListType[]) {
    let allTag = 0,
      noTag = 0;
    let _counts = [
      { name: ALL, count: 0 },
      { name: NO_SET_TAG, count: 0 },
    ];
    data.forEach((file) => {
      file.items.forEach((item) => {
        allTag += 1;
        if (!item.tag) {
          noTag += 1;
          return;
        }
        item.tag.split(',').forEach((t) => {
          const found = _counts.find((c) => c.name === t);
          if (found) found.count += 1;
          else {
            _counts.push({ name: t, count: 1 });
          }
        });
      });
    });
    _counts.find((c) => c.name === ALL)!.count = allTag;
    _counts.find((c) => c.name === NO_SET_TAG)!.count = noTag;
    setCounts(_counts);
  }

  const tableColumns = [
    {
      title: 'File Path / Test Name',
      dataIndex: 'path',
      width: '50%',
      ellipsis: true,
    },
    {
      title: 'Tags',
      width: '45%',
    },
  ] as ColumnsType<TestFileListType>;

  const childTableColumns = [
    { title: '', dataIndex: '', width: '5%' },
    {
      title: 'File',
      dataIndex: 'name',
      width: '50%',
      ellipsis: true,
      render: (_, record) => {
        return record.name;
      },
    },
    {
      title: 'Tags',
      dataIndex: '',
      width: '45%',
      ellipsis: true,
      render: (_, record) => {
        return (
          <Select
            mode='multiple'
            bordered={false}
            style={{ width: '100%' }}
            placeholder='Select Tags'
            value={record.tag?.split(',')}
            onChange={async (values) => {
              await setTestTags({
                variables: { name: record.name, tag: values.join(',') },
              });
              await refetchFiles();
              message.success('Operation successful!');
            }}
            options={tags?.map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
          />
        );
      },
    },
  ] as ColumnsType<TestFileItemType>;

  return (
    <>
      <Card bordered={false}>
        <Row align='middle' gutter={[48, 8]}>
          <Col span='4'>
            <Input
              allowClear
              placeholder='Test Name'
              onChange={(e) => {
                const q = { ...query, name: e.target.value || null };
                filterFiles(q);
              }}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Row justify='space-between' style={{ padding: '16px 0 16px 0' }}>
          <Col span='20'>
            {counts.map((c) => (
              <Button
                key={c.name}
                style={{ margin: '0 8px' }}
                type={
                  query.tag === c.name || (!query.tag && c.name === ALL)
                    ? 'primary'
                    : 'default'
                }
                onClick={() => {
                  const q = { ...query, tag: c.name === ALL ? '' : c.name };
                  filterFiles(q);
                }}
              >
                {c.name.toUpperCase()}&nbsp;({c.count})
              </Button>
            ))}
          </Col>
          <Col span='4' style={{ textAlign: 'right' }}>
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
          onExpand={(_, row: TestFileListType) => {
            setExpandedRowKeys(
              expandedRowKeys.indexOf(row.path) === -1
                ? expandedRowKeys.concat(row.path)
                : expandedRowKeys.filter((x) => x !== row.path)
            );
          }}
          dataSource={files}
          expandedRowKeys={expandedRowKeys}
          expandable={{
            columnWidth: '5%',
            expandedRowRender: (record: TestFileListType) => (
              <div style={{ width: '100%', margin: 0, padding: 0 }}>
                {record.items.length > 0 && (
                  <Table
                    key='child-table'
                    rowKey={(data) => `row-key-${data.name}`}
                    bordered
                    style={{ width: '100%' }}
                    dataSource={record.items.filter(
                      (x) => x.type !== 'describe'
                    )}
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
      </Card>
    </>
  );
};

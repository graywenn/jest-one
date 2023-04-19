import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { TagListType } from '../../types';
import { DelTag, QueryTagList, SetTag } from '../gql/tag';

interface ITag {
  key: string;
  name: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: TagListType[];
  index: number;
  children: React.ReactNode;
}

export const TagDrawer = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;
  const [tags, setTags] = useState<ITag[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: ITag) => record.key === editingKey;
  const { refetch } = useQuery(QueryTagList, {
    skip: true,
    onCompleted(data) {
      setTags(
        data.tagList.map((e, index) => ({
          key: index.toString(),
          name: e.name,
        }))
      );
    },
  });

  useEffect(() => {
    open && refetch();
  }, [open]);

  const [setTag, { loading: setLoading }] = useMutation(SetTag);
  const [delTag, { loading: delLoading }] = useMutation(DelTag, {
    onCompleted(data) {
      if (data['delTag']) {
        message.success('Deleted successful!');
      } else {
        message.error('Deleted failed!');
      }
    },
  });

  const [form] = Form.useForm();
  async function save() {
    const row = (await form.validateFields()) as TagListType;
    await setTag({
      variables: { name: row.name },
    });
    await refetch();
    form.resetFields();
    setEditingKey('');
    message.success('Saved successful!');
  }

  const cancel = (record: ITag) => {
    setEditingKey('');
    !record.name && setTags(tags.filter((env) => env.name));
  };

  const remove = (record: ITag) => {
    if (record.name) {
      delTag({ variables: { name: record.name } });
      refetch();
    } else {
      setTags(tags.filter((env) => env.name));
    }
  };

  const newTag = () => ({
    key: tags.length + 1,
    name: '',
    value: '',
  });

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: ITag) => {
        const editable = isEditing(record);
        return editable ? (
          <Space wrap>
            <Button type='link' onClick={() => save()} loading={setLoading}>
              Save
            </Button>
            <Button type='link' onClick={cancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space wrap>
            <Button
              type='link'
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title='Sure to delete?'
              onConfirm={() => remove(record)}
            >
              <Button type='link' loading={delLoading}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ITag) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = (record: Partial<ITag>) => {
    form.setFieldsValue({ name: '', value: '', ...record });
    setEditingKey(record.key);
  };

  return (
    <Drawer
      title='Tag'
      placement='top'
      height='45%'
      closable={false}
      open={open}
      onClose={onClose}
    >
      <Row justify='center' style={{ padding: '16px 0 16px 0' }}>
        <Col span='24' style={{ textAlign: 'right' }}>
          <Button
            type='primary'
            disabled={tags.find((x) => !x.name)}
            onClick={() => {
              const tag = newTag();
              setTags([...tags, tag]);
              edit(tag);
            }}
          >
            Create
          </Button>
        </Col>
      </Row>
      <Form form={form} component={false}>
        <Table
          rowKey={(record) => `row-key-${record.key}`}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={tags}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={false}
        />
      </Form>
    </Drawer>
  );
};

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
import {
  DelEnvironment,
  QueryEnvironmentList,
  SetEnvironment,
} from '../gql/environment';
import { EnvironmentListType } from '../../types';
import TextArea from 'antd/es/input/TextArea';

interface IEnvironment {
  key: string;
  name: string;
  value: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: EnvironmentListType[];
  index: number;
  children: React.ReactNode;
}

export const EnvironmentDrawer = (props: {
  open: boolean;
  onClose: () => void;
}) => {
  const { open, onClose } = props;
  const [environments, setEnvironments] = useState<IEnvironment[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: IEnvironment) => record.key === editingKey;
  const { refetch } = useQuery(QueryEnvironmentList, {
    skip: true,
    onCompleted(data) {
      setEnvironments(
        data.environmentList.map((e, index) => ({
          key: index.toString(),
          name: e.name,
          value: e.value,
        }))
      );
    },
  });

  useEffect(() => {
    open && refetch();
  }, [open]);

  const [setEnvironment, { loading: setLoading }] = useMutation(SetEnvironment);
  const [delEnvironment, { loading: delLoading }] = useMutation(
    DelEnvironment,
    {
      onCompleted(data) {
        if (data['delEnvironment']) {
          message.success('Deleted successful!');
        } else {
          message.error('Deleted failed!');
        }
      },
    }
  );

  const [form] = Form.useForm();
  async function save() {
    const row = (await form.validateFields()) as EnvironmentListType;
    await setEnvironment({
      variables: { name: row.name, value: !!row.value.trim() ? row.value : '' },
    });
    await refetch();
    form.resetFields();
    setEditingKey('');
    message.success('Saved successful!');
  }

  const cancel = (record: IEnvironment) => {
    setEditingKey('');
    !record.name && setEnvironments(environments.filter((env) => env.name));
  };

  const remove = (record: IEnvironment) => {
    if (record.name) {
      delEnvironment({ variables: { name: record.name } });
      refetch();
    } else {
      setEnvironments(environments.filter((env) => env.name));
    }
  };

  const newEnvironment = () => ({
    key: environments.length + 1,
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
    const inputNode =
      dataIndex === 'value' ? <TextArea /> : <Input disabled={record?.name} />;
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
            {inputNode}
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
      title: 'Values',
      dataIndex: 'value',
      width: '40%',
      editable: true,
      // render: (_, record: EnvironmentListType) => {
      //   return JSON.stringify(JSON.parse(record.value), null, 2);
      // },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: IEnvironment) => {
        const editable = isEditing(record);
        return editable ? (
          <Space wrap>
            <Button type='link' onClick={() => save()} loading={setLoading}>
              Save
            </Button>
            <Button type='link' onClick={() => cancel(record)}>
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
      onCell: (record: IEnvironment) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = (record: Partial<IEnvironment>) => {
    form.setFieldsValue({ name: '', value: '', ...record });
    setEditingKey(record.key);
  };

  return (
    <Drawer
      title='Environment'
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
            disabled={environments.find((x) => !x.name)}
            onClick={() => {
              const env = newEnvironment();
              setEnvironments([...environments, env]);
              edit(env);
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
          dataSource={environments}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={false}
        />
      </Form>
    </Drawer>
  );
};

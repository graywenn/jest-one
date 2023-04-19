import { useMutation, useQuery } from '@apollo/client';
import { Button, Col, Drawer, Form, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { QueryTagNames } from '../gql/tag';
import { QueryEnvironmentNames } from '../gql/environment';
import { MutationStartTest } from '../gql/tests';

export const CreateTestDrawer = (props: {
  open: boolean;
  onClose: () => void;
}) => {
  const { open, onClose } = props;
  const [tags, setTags] = useState<string[]>([]);
  const [environments, setEnvironments] = useState<string[]>([]);
  const { refetch: queryTag } = useQuery(QueryTagNames, {
    skip: true,
    onCompleted(data) {
      setTags(data.tagNames);
    },
  });
  const { refetch: queryEnvironment } = useQuery(QueryEnvironmentNames, {
    skip: true,
    onCompleted(data) {
      setEnvironments(data.environmentNames);
    },
  });

  const [startTest] = useMutation(MutationStartTest);

  const [form] = Form.useForm();
  async function create(values: { environment: string; tag: string }) {
    await startTest({
      variables: { environment: values.environment, tag: values.tag },
    });
    form.resetFields();
    onClose();
  }

  useEffect(() => {
    if (open) {
      queryTag();
      queryEnvironment();
    }
  }, [open]);

  return (
    <Drawer
      title='Create Test'
      placement='top'
      closable={false}
      open={open}
      onClose={onClose}
    >
      <Row justify='center'>
        <Col span='24'>
          <Form form={form} layout='vertical' onFinish={create}>
            <Form.Item
              name='environment'
              label='Environment'
              rules={[
                { required: true, message: 'Please select environment.' },
              ]}
            >
              <Select
                options={environments.map((item) => {
                  return {
                    label: item,
                    value: item,
                  };
                })}
              ></Select>
            </Form.Item>
            <Form.Item
              name='tag'
              label='Tags'
              rules={[{ required: true, message: 'Please select tags.' }]}
            >
              <Select
                options={tags.map((item) => {
                  return {
                    label: item,
                    value: item,
                  };
                })}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type='primary' htmlType='submit'>
                Confirm
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Drawer>
  );
};

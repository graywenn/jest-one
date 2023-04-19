import React from 'react';
import { Drawer, Row } from 'antd';
import { convert, escapeHtml } from '../utils/html';

export const ErrorMessagesDrawer = (props: {
  messages: string[];
  open: boolean;
  onClose: () => void;
}) => {
  const { messages, open, onClose } = props;
  return (
    <Drawer
      title='Error'
      placement='top'
      closable={false}
      open={open}
      onClose={onClose}
    >
      <Row style={{ padding: '0 0 16px 0' }}>
        <pre
          dangerouslySetInnerHTML={{
            __html: convert.toHtml(escapeHtml(messages.join() || '')),
          }}
        />
      </Row>
    </Drawer>
  );
};

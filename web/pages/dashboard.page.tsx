import { useQuery, useSubscription } from '@apollo/client';
import React from 'react';
import { JestEventSubscription, QueryTestList } from '../gql/tests';
import { TestListTable } from '../components/testListTable';

const DashboardPage = () => {
  const { data, refetch } = useQuery(QueryTestList);

  useSubscription(JestEventSubscription, {
    onData: (_) => {
      refetch();
    },
  });
  return (
    <>
      <TestListTable testList={data?.list || []} />
    </>
  );
};

export default DashboardPage;

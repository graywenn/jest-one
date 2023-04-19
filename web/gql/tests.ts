import { TypedDocumentNode, gql } from '@apollo/client';
import { TestListInput, TestListType, TestStartInput } from '../../types';

export const QueryTestList: TypedDocumentNode<
  { list: TestListType[] },
  TestListInput
> = gql`
  query List {
    list {
      id
      status
      environment
      tag
      totalDuration
      numFailingTests
      numPassingTests
      numPendingTests
      numTodoTests
      createTime
    }
  }
`;

export const MutationStartTest: TypedDocumentNode<
  { start: string },
  TestStartInput
> = gql`
  mutation Start($environment: String!, $tag: String!) {
    start(TestStartInput: { environment: $environment, tag: $tag })
  }
`;

export const JestEventSubscription = gql`
  subscription JestEvents {
    jestEvents {
      testId
      path
      event
    }
  }
`;

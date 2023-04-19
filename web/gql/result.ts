import { TypedDocumentNode, gql } from '@apollo/client';
import { TestResultListInput, TestResultListType } from '../../types';

export const QueryTestResultList: TypedDocumentNode<
  { testResultList: TestResultListType[] },
  TestResultListInput
> = gql`
  query TestResultList($testId: String!) {
    testResultList(
      TestResultListInput: { testId: $testId }
    ) {
      testId
      numFailingTests
      numPassingTests
      numPendingTests
      numTodoTests
      totalDuration
      testItems {
        path
        numFailingTests
        numPassingTests
        numPendingTests
        numTodoTests
        failureMessage
        console {
          message
          origin
          type
        }
        resultItems {
          title
          fullName
          status
          failureMessages
          ancestorTitles
          duration
        }
      }
    }
  }
`;

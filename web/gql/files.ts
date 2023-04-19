import { TypedDocumentNode, gql } from '@apollo/client';
import { TestFileListType } from '../../types';

export const QueryFileList: TypedDocumentNode<
  { fileList: TestFileListType[] },
  null
> = gql`
  query FileList {
    fileList {
      path
      items {
        name
        type
        parent
        tag
      }
    }
  }
`;

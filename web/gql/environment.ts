import { TypedDocumentNode, gql } from '@apollo/client';
import {
  EnvironmentListType,
  NameInput,
  SetEnvironmentInput,
} from '../../types';

export const QueryEnvironmentNames: TypedDocumentNode<
  { environmentNames: string[] },
  null
> = gql`
  query EnvironmentNames {
    environmentNames
  }
`;

export const QueryEnvironmentList: TypedDocumentNode<
  { environmentList: EnvironmentListType[] },
  null
> = gql`
  query EnvironmentList {
    environmentList {
      name
      value
    }
  }
`;

export const SetEnvironment: TypedDocumentNode<
  Boolean,
  SetEnvironmentInput
> = gql`
  mutation SetEnvironment($name: String!, $value: String!) {
    setEnvironment(SetEnvironmentInput: { name: $name, value: $value })
  }
`;

export const DelEnvironment: TypedDocumentNode<Boolean, NameInput> = gql`
  mutation DelEnvironment($name: String!) {
    delEnvironment(Name: $name)
  }
`;

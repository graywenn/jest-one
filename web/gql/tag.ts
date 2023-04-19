import { TypedDocumentNode, gql } from '@apollo/client';
import {
  NameInput,
  SetTagInput,
  SetTestTagInput,
  TagListType,
} from '../../types';

export const QueryTagNames: TypedDocumentNode<
  { tagNames: string[] },
  null
> = gql`
  query TagNames {
    tagNames
  }
`;

export const QueryTagList: TypedDocumentNode<
  { tagList: TagListType[] },
  null
> = gql`
  query TagList {
    tagList {
      name
    }
  }
`;

export const SetTestTags: TypedDocumentNode<Boolean, SetTestTagInput> = gql`
  mutation SetTestTags($name: String!, $tag: String) {
    setTestTags(SetTestTagInput: { name: $name, tag: $tag })
  }
`;

export const SetTag: TypedDocumentNode<Boolean, SetTagInput> = gql`
  mutation SetTag($name: String!) {
    setTag(SetTagInput: { name: $name })
  }
`;

export const DelTag: TypedDocumentNode<Boolean, NameInput> = gql`
  mutation DelTag($name: String!) {
    delTag(Name: $name)
  }
`;

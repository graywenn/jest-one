import { SyntaxType } from '../../ast/type';

export class TestFileEntity {
  path: string;
  items: TestFileItem[];
}

export class TestFileItem {
  name: string;
  type: SyntaxType;
  parent?: string;
}

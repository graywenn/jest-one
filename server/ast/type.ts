export const TL = 'TemplateLiteral';
export type SyntaxType = 'describe' | 'it' | 'todo' | 'skip';

export interface SyntaxTestItem {
  path: string;
  name: string;
  type: SyntaxType;
  parent?: string;
  only: boolean;
}

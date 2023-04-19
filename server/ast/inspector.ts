import traverse from '@babel/traverse';
import { parse } from './parser';
import { readFile } from 'fs';
import { SyntaxTestItem, TL } from './type';

export async function inspect(path: string): Promise<SyntaxTestItem[]> {
  return new Promise((resolve, reject) => {
    readFile(
      path,
      {
        encoding: 'utf8',
      },
      (err, code) => {
        if (err) {
          reject(err);
        }

        let ast;
        try {
          ast = parse(path, code);
        } catch (e) {
          reject(e);
        }

        const result: SyntaxTestItem[] = [];

        traverse(ast, {
          CallExpression(nodePath: any) {
            if (nodePath.scope.block.type === 'Program') {
              findItems(path, nodePath, result);
            }
          },
        });
        resolve(result);
      }
    );
  });
}

function getTemplateLiteralName(path: any) {
  let currentExpressionIndex = 0;
  const { expressions, quasis } = path.node.arguments[0];

  return `\`${quasis.reduce((finalText: String, q: any) => {
    if (
      expressions[currentExpressionIndex] &&
      q.end === expressions[currentExpressionIndex].start - 2
    ) {
      const formattedExpression = `${q.value.raw}\$\{${expressions[currentExpressionIndex].name}\}`;
      currentExpressionIndex += 1;

      return finalText.concat(formattedExpression);
    } else {
      return finalText.concat(q.value.raw);
    }
  }, '')}\``;
}

function findItems(
  path: string,
  nodePath: any,
  result: SyntaxTestItem[],
  parent?: any
) {
  let type: string;
  let only: boolean = false;

  if (nodePath.node.callee.name === 'fdescribe') {
    type = 'describe';
    only = true;
  } else if (nodePath.node.callee.name === 'fit') {
    type = 'it';
    only = true;
  } else if (
    nodePath.node.callee.property &&
    nodePath.node.callee.property.name === 'only'
  ) {
    type = nodePath.node.callee.object.name;
    only = true;
  } else if (nodePath.node.callee.name === 'test') {
    type = 'it';
  } else if (
    nodePath.node.callee.property &&
    nodePath.node.callee.property.name === 'todo'
  ) {
    type = 'todo';
  } else if (
    nodePath.node.callee.property &&
    nodePath.node.callee.property.name === 'skip'
  ) {
    type = 'skip';
  } else {
    type = nodePath.node.callee.name;
  }

  if (type === 'describe') {
    let describe: any;
    const { type, value } = nodePath.node.arguments[0];
    describe = {
      type: 'describe',
      name: type === TL ? getTemplateLiteralName(nodePath) : value,
      only,
      parent,
      path,
    };

    result.push(describe);
    nodePath.skip();
    nodePath.traverse({
      CallExpression(itPath: any) {
        findItems(path, itPath, result, describe.name);
      },
    });
  } else if (type === 'it') {
    const { type, value } = nodePath.node.arguments[0];
    result.push({
      type: 'it',
      name: type === TL ? getTemplateLiteralName(nodePath) : value,
      only,
      parent,
      path,
    });
  } else if (type === 'todo') {
    const { type, value } = nodePath.node.arguments[0];
    result.push({
      type: 'todo',
      name: type === TL ? getTemplateLiteralName(nodePath) : value,
      only,
      parent,
      path,
    });
  } else if (type === 'skip') {
    const { type, value } = nodePath.node.arguments[0];
    result.push({
      type: 'skip',
      name: type === TL ? getTemplateLiteralName(nodePath) : value,
      only,
      parent,
      path,
    });
  }
}

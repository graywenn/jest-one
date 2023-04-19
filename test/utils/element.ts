import { WebElement } from 'selenium-webdriver';

export async function getElementTexts(
  elements: WebElement[]
): Promise<string[]> {
  const list = [];
  for await (const element of elements) {
    const text = await element.getText();
    list.push(text);
  }
  return list;
}

export async function getElementHrefs(
  elements: WebElement[]
): Promise<string[]> {
  const list = [];
  for await (const element of elements) {
    const text = await element.getAttribute('href');
    list.push(text);
  }
  return list;
}

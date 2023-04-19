import { Browser } from ".";

export interface NewablePage<T extends Page> {
  new (browser: Browser): T;
}

export abstract class Page {
  private url: string = "";

  protected setUrl(url: string) {
    this.url = url;
  }

  async navigate(): Promise<void> {
    await this.browser.navigate(this.url);
  }

  constructor(protected browser: Browser) {}
}

import { Browser } from '../core';

export class Pages {
  constructor(public browser: Browser) {}

  async dispose() {
    await this.browser.close();
  }
}

import { Builder, ThenableWebDriver, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export class Browser {
  private driver: ThenableWebDriver;

  public constructor(browserName: string) {
    this.driver = new Builder()
      .forBrowser(browserName)
      .setChromeOptions(
        new chrome.Options().addArguments(
          // "--headless",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--window-size=1920,1080"
        )
      )
      .build();
    this.driver.manage().setTimeouts({
      implicit: 60000,
      pageLoad: 120000,
    });
  }

  async navigate(url: string): Promise<void> {
    await this.driver.navigate().to(url);
  }

  async move(selector: string, x?: number, y?: number): Promise<void> {
    const element = await this.driver.findElement(By.xpath(selector));
    const actions = this.driver.actions({ async: true });
    await actions.move({ origin: element, x: x ?? 0, y: y ?? 0 }).perform();
  }

  async moveAndDoubleClick(
    selector: string,
    x?: number,
    y?: number
  ): Promise<void> {
    const element = await this.driver.findElement(By.xpath(selector));
    const actions = this.driver.actions({ async: true });
    await actions
      .move({ origin: element, x: x ?? 0, y: y ?? 0 })
      .doubleClick()
      .perform();
  }

  async dragAndDrop(selector: string, x?: number, y?: number): Promise<void> {
    const element = await this.driver.findElement(By.xpath(selector));
    const actions = this.driver.actions({ async: true });
    await actions
      .dragAndDrop(element, { x: x ?? 0, y: y ?? 0 })
      .doubleClick()
      .perform();
  }

  /**
   * Provide decorator folder findBy function
   * @param selector
   * @returns
   */
  findElement(selector: string) {
    return this.driver.findElement(By.xpath(selector));
  }

  async findElements(selector: string) {
    return this.driver.findElements(By.xpath(selector));
  }

  async findElementAsync(selector: string) {
    return this.driver.wait(until.elementLocated(By.xpath(selector)), 15000);
  }

  async close(): Promise<void> {
    await this.driver.close();
  }

  async back(): Promise<void> {
    await this.driver.navigate().back();
  }

  async refresh(): Promise<void> {
    await this.driver.navigate().refresh();
  }

  async executeScript(javaScript: string, ...args: any[]) {
    return await this.driver.executeScript(javaScript, ...args);
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }
}

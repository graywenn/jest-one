import { WebElementPromise } from "selenium-webdriver";
import { getNumberFromString } from "../utils";

export class WebComponent {
  constructor(protected element: WebElementPromise, public selector: string) {
    this.element = element;
    this.selector = selector;
  }

  public logs(message: string) {
    console.log(`${new Date().toLocaleString()} ${message}`);
  }

  public async click() {
    this.logs(`[CLICK] ${this.selector}`);
    try {
      const _element = await this.element.click();
      return _element;
    } catch (error) {
      try {
        await this.element
          .getDriver()
          .executeScript("arguments[0].click();", this.element);
      } catch {
        throw error;
      }
    }
  }

  public async isDisplayed() {
    this.logs(`[CHECK DISPLAY] ${this.selector}`);
    try {
      return await this.element.isDisplayed();
    } catch (ex) {
      return false;
    }
  }

  public async getText() {
    const text = await this.element.getText();
    this.logs(`[GET TEXT] ${this.selector} ${text}`);
    return text;
  }

  public async getNumberFromText() {
    return getNumberFromString(await this.element.getText());
  }

  public async getLink() {
    const href = await this.element.getAttribute("href");
    this.logs(`[GET HREF] ${this.selector} ${href}`);
    return href;
  }

  public async getChecked() {
    const checked = await this.element.getAttribute("checked");
    this.logs(`[GET CHECKED] ${this.selector} ${checked}`);
    return checked;
  }

  public async getFill() {
    return this.element.getAttribute("fill");
  }

  public async getCurrent() {
    return this.element.getAttribute("aria-current");
  }

  public async getTabIndex() {
    return this.element.getAttribute("tabindex");
  }

  public async getRect() {
    return this.element.getRect();
  }

  public async getCssValue(styleName: string) {
    return this.element.getCssValue(styleName);
  }
}

export class Button extends WebComponent {
  protected element: WebElementPromise;
  public selector: string;

  constructor(element: WebElementPromise, selector: string) {
    super(element, selector);
    this.element = element;
    this.selector = selector;
  }

  public async isDisabled() {
    try {
      const disabled = await this.element.getAttribute("disabled");
      this.logs(`[CHECK DISPLAY] ${this.selector} ${disabled}`);
      return disabled === "true";
    } catch (ex) {
      return false;
    }
  }
}

export class TextInput extends WebComponent {
  protected element: WebElementPromise;

  public selector: string;

  constructor(element: WebElementPromise, selector: string) {
    super(element, selector);
    this.element = element;
    this.selector = selector;
  }

  public setValue(value: string) {
    this.logs(`[SET VALUE] ${this.selector} ${value}`);
    return this.element.sendKeys(value);
  }
}

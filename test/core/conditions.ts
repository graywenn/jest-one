import { WebElement } from "selenium-webdriver";
import { Browser, WebComponent } from ".";

export type WaitCondition = (browser: Browser) => Promise<boolean>;

export function elementIsVisible(
  locator: () => WebComponent | WebElement
): WaitCondition {
  return () => locator().isDisplayed();
}

export function elementIsPresent(locator: () => WebComponent): WaitCondition {
  return async () => locator() !== undefined;
}

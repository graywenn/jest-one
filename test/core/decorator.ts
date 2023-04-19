import "reflect-metadata";
export function findBy(selector: string) {
  return (target: any, propertyKey: string) => {
    const type = Reflect.getMetadata("design:type", target, propertyKey);
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get() {
        const promise = this.browser.findElement(selector);
        return new type(promise, selector);
      },
    });
  };
}

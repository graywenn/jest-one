// ./node_modules/jest/bin/jest.js -t 'fuck|add-fuck|add-test'
describe('demo', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('add-1test', async () => {
    await wait(3000);
    expect(1).toEqual(1);
    expect(2).toEqual(1);
  });
  it('3test', () => {
    expect(2).toEqual(2);
  });
  it('3subtract', () => {
    expect(1).toEqual(1);
  });
});

describe('demo one', () => {
  it('1demo one add', () => {
    expect(1).toEqual(1);
  });
  it('1demo one test', () => {
    expect(2).toEqual(2);
  });
  it('1demo one subtract', () => {
    expect(1).toEqual(1);
  });
});

describe('demo two', () => {
  it('2demo two add', async () => {
    // await wait(10000);
    expect(1).toEqual(1);
  });
  it.skip('2demo two test', () => {
    expect(2).toEqual(2);
  });
  it('2demo two subtract', () => {
    expect(1).toEqual(1);
  });
});

afterAll((done) => {
  done();
});

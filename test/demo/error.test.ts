const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const aa = 'aa';
const obj = null as any;
describe('demo', () => {
  it('这是一个错误的测试', async () => {
    // JSON.parse('{{');
    expect(0).toEqual(1);
  });

  it.skip('这个一个引用错误的测试', async () => {
    obj.a;
    expect(0).toEqual(0);
  });
});

afterAll((done) => {
  done();
});

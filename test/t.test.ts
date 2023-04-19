describe('1. this is test', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  it('1. test', () => {
    expect(1).toEqual(1);
  });
});

afterAll((done) => {
  done();
});

describe('1. this is test demo describe.', () => {
  const obj = null as any;
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('1. demo test add', async () => {
    console.log('this is first test!');
    expect(1).toEqual(1);
  });

  it('1.1 demo test timeout', async () => {
    console.log('wait 10000ms start');
    await wait(100000);
    console.log('wait 10000ms end');
    expect(1).toEqual(1);
  });

  it.skip('2. demo test skip', async () => {
    expect(1).toEqual(1);
  });

  it('3. demo test error', async () => {
    console.log('test error');
    expect(1).toEqual(2);
  });

  it('4. demo test code error', async () => {
    obj.aa = '1234';
    expect(1).toEqual(1);
  });

  it('5. demo test expect multiple', async () => {
    expect(1).toEqual(1);
    expect(2).toEqual(2);
  });

  it('6. demo test expect multiple error one', async () => {
    expect(1).toEqual(2);
    expect(2).toEqual(2);
  });

  it('7. demo test expect multiple error all', async () => {
    expect(1).toEqual(2);
    expect(2).toEqual(1);
  });
});

// describe('2. this is test demo describe2.', () => {
//   it('1. demo test expect multiple error all', async () => {
//     expect(1).toEqual(2);
//     expect(2).toEqual(1);
//   });

//   it('2. demo test add', async () => {
//     console.log('2. demo test add');
//     expect(1).toEqual(1);
//   });
// });

afterAll((done) => {
  done();
});

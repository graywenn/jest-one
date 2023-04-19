describe('environment', () => {
  it('env test', () => {
    const variables = JSON.parse(process.env.JEST_ONE_VARIABLES || '');
    console.log('process.env.VARIABLES', process.env.JEST_ONE_VARIABLES);
    expect(variables.env).toEqual('local');
  });
});

afterAll((done) => {
  done();
});

export default {
  transform: jest.fn((code) => {
    if (code === 'fail') throw new Error();
    return { code };
  }),
};

const mockBabel = {
  transform: jest.fn((code) => {
    if (code === 'fail') throw new Error();
    return { code };
  }),
};

module.exports = mockBabel;

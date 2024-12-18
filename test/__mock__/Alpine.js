let watchers = [];

export default {
  init: async (data) => {
    watchers = [];
    data.$watch = (_, callback) => watchers.push(callback);
    await data.init();
    watchers.forEach(f => f());
  },

  fireWatchers: (data) => {
    watchers.forEach(f => f());
  },
};

export const posts = (collection) =>
  collection.getFilteredByTag('post').reverse();

export const latestPosts = (collection) =>
  collection.getFilteredByTag('post').reverse().slice(0, 4);

export const all = function (collection) {
  return collection.getAll();
};

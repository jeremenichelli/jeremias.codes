export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const getItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(error);
  }
};

export const removeItem = (key) => {
  try {
    return localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

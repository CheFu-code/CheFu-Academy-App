// utils/safeRouter.js
let isNavigating = false;

export const safePush = (router, path, params = {}) => {
  if (isNavigating) return;

  isNavigating = true;
  router.push({ pathname: path, params });

  setTimeout(() => {
    isNavigating = false;
  }, 1000); // adjust delay if needed
};

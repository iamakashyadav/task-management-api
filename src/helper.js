const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const isProd = () => {
  return process.env.NODE_ENV === 'prod';
}

export {
  asyncHandler,
  isProd,
}
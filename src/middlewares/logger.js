const logger = (req, res, next) => {
    console.log(`${req.headers['X-Request-ID']} ${req.method} ${req.path} ${req.body ? JSON.stringify(req.body) : ''}`);
    next();
}

export default logger;
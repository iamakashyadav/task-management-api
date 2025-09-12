export default (schema, isQuery = false) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(isQuery ? req.query : req.body);
        if (error) {
            console.log(error, error.message);
            res.status(401).json({ error: error.message });
            return;
        }else {
            next();
        }
    };
}
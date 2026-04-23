const { ZodError } = require("zod");
const { sendError } = require("../utils/apiResponse");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendError(
          res,
          400,
          "Validation failed",
          error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        );
      }

      return next(error);
    }
  };
};

module.exports = validate;

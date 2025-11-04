const { status } = require("http-status");

const { runValidation, responseHandler } = require("../helpers/utils");

function validate(schema) {
  return (req, res, next) => {
    const { success, errors, validatedData } = runValidation(schema, req);

    if (!success) {
      const response = responseHandler(
        "Data Validation Error",
        errors,
        false,
        status.BAD_REQUEST,
        true
      );
      return res.status(response.httpResponse).send(response);
    }
    console.log("VALIDATED DATA ===> ", JSON.stringify(validatedData));
    // Assign validated values back to req
    req.body = validatedData.body;
    req.params = validatedData.params;
    req.query = validatedData.query;
    req.file = validatedData.file;
    next();
  };
}

module.exports = validate;

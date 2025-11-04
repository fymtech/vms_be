const { status: httpStatus } = require("http-status");
const fs = require("fs");
const path = require("path");
// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const { URLPaths } = require("./constants");

const responseHandler = (
  message,
  data,
  status = true,
  httpResponse = httpStatus.OK,
  isError = false
) => {
  return {
    message: message,
    data: data,
    status: status,
    httpResponse: httpResponse,
    isError: isError,
  };
};

const responseHandlerForPagination = (
  message,
  data,
  status = true,
  httpResponse = httpStatus.OK,
  isError = false,
  pageNumber = 1,
  totalPages,
  totalItems
) => {
  return {
    messageEn: message,
    data: data,
    status: status,
    httpResponse: httpResponse,
    isError: isError,
    pagination: {
      currentPage: pageNumber,
      totalPages: totalPages,
      totalItems: totalItems,
    },
  };
};

const errorResponseHandler = (error) => {
  let errorMessage;
  if (error.code === 11000) {
    const duplicatedKey = Object.keys(error.keyValue)[0];
    errorMessage = `${duplicatedKey} '${error.keyValue[duplicatedKey]}' already exists.`;
    return responseHandler(
      errorMessage,
      error,
      false,
      httpStatus.CONFLICT,
      true
    );
  }

  if (error.errors) {
    const errorKey = Object.keys(error.errors)[0];
    if (!error.errors[errorKey].properties) {
      errorMessage = `${error._message}. Error in ${errorKey}.`;
    } else {
      errorMessage = error.errors[errorKey].properties.message;
    }
    return responseHandler(
      errorMessage,
      error,
      false,
      httpStatus.BAD_REQUEST,
      true
    );
  }

  if (error.name === "CastError") {
    errorMessage = "Invalid parameter ID";
    return responseHandler(
      errorMessage,
      error,
      false,
      httpStatus.BAD_REQUEST,
      true
    );
  }

  if (error.name === "JsonWebTokenError") {
    return responseHandler(
      "Invalid token",
      error,
      false,
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  if (error.name === "TokenExpiredError") {
    return responseHandler(
      `Access token expired at ${error.expiredAt}. Please login again.`,
      error,
      false,
      httpStatus.UNAUTHORIZED,
      true
    );
  }
  return responseHandler(
    "Could not perform action.",
    error,
    false,
    httpStatus.INTERNAL_SERVER_ERROR,
    true
  );
};

// const generateOnBoardingToken = async (agentID, businessID, userID) => {
//   try {
//     const onBoardURL = `${env.BASE_URL}/agent/onBoard/`;
//     const payload = {
//       onBoardURL,
//       agentID,
//       businessID,
//       userID,
//     };
//     const onBoardingToken = jwt.sign(payload, "password123");
//     return responseHandler(
//       CustomSuccessResponse.CREATED,
//       onBoardingToken,
//       true,
//       httpStatus.CREATED
//     );
//   } catch (error) {
//     return errorResponseHandler(error);
//   }
// };

function runValidation(schema, req) {
  const requestData =
    !req.body && !req.params && !req.query && !req.file
      ? req
      : Object.fromEntries(
          Object.entries({
            body: req.body,
            params: req.params,
            query: req.query,
            file: req.file,
          }).filter(
            ([, value]) =>
              value &&
              (typeof value === "object" ? Object.keys(value).length > 0 : true)
          )
        );
  console.log(JSON.stringify(requestData), " =====> requestData");
  // Validate the existing requestData
  const { error, value } = schema.validate(requestData, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => {
      // const obj = {};
      // const fieldPath = detail.path[detail.path.length - 1];
      // const message = detail.message.replace(/['"]/g, "");
      // obj["field"] = fieldPath;
      // obj["message"] = message;
      // return obj;
      return {
        field: detail.path[detail.path.length - 1],
        message: detail.message.replace(/['"]/g, ""),
      };
    });
    return { success: false, errors };
  } else {
    // Return validated values
    return { success: true, validatedData: value };
  }
}

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

const sendVerificationEmail = async (email, userType) => {
  try {
    console.log("Sending verification email to: ", email);

    const transporter = nodemailer.createTransport(env.emailConfig);

    const templatePath = path.join(__dirname, "../templates/verify-email.html");
    const htmlContent = fs.readFileSync(templatePath, "utf8");
    const verificationLink = `${process.env.BASE_URL}${userType}${URLPaths.EMAIL_VERIFY}${email}`;
    // Replace the placeholder in the HTML with your actual verification link
    const customizedHtml = htmlContent.replace(
      "{{ verification_link }}",
      verificationLink
    );

    const mailOptions = {
      from: "fuzi98@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Hello from Nodemailer! Please verify your email: ${verificationLink}`,
      html: customizedHtml,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + JSON.stringify(info));
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const generateLoginAuthToken = async (user) => {
  try {
    const payload = await createLoginPayload(user);
    const loginToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return loginToken;
  } catch (error) {
    return errorResponseHandler(error);
  }
};

const createLoginPayload = async (user) => ({
  userId: user._id,
  name: `${user.firstName} ${user.lastName}`,
  role: user.role,
  ...(user.email && { email: user.email }),
  ...(user.phone && { phone: user.phone }),
});

module.exports = {
  responseHandler,
  responseHandlerForPagination,
  errorResponseHandler,
  runValidation,
  objectIdValidator,
  sendVerificationEmail,
  generateLoginAuthToken,
};

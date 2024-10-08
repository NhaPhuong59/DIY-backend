const { catchAsync, sendResponse } = require("../helpers/utils");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const { AppError } = require("../helpers/utils");
const crypto = require("crypto");
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const usersController = {};

usersController.createUser = catchAsync(async (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;
  let user = await Users.findOne({ email }, "+password");
  if (user) {
    throw new AppError(409, "User already exists", "Create User Error");
  }
  const salt = await bcrypt.genSalt(12);
  password = await bcrypt.hash(password, salt);

  user = await Users.create({
    firstName,
    lastName,
    email,
    password,
    avatar: "",
    bio: "",
  });

  const accessToken = user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create account successfully"
  );
});

usersController.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email }, "+password");
  if (!user) {
    throw new AppError(
      400,
      "Your email or password is incorrect",
      "Login Error"
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(
      400,
      "Your email or password is incorrect",
      "Login Error"
    );
  }
  const accessToken = user.generateToken();
  res.cookie("session", accessToken, { httpOnly: true });
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "successful"
  );
});

usersController.getCurrentUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  const currentUser = await Users.findById(currentUserId);
  if (!currentUser) {
    throw new AppError(404, "User not found", "Get User Error");
  }
  return sendResponse(res, 200, true, currentUser, null);
});

usersController.updateUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Users.findByIdAndUpdate(id, {
    ...req.body,
  });
  const newDataUser = await Users.findById(id);
  return sendResponse(res, 200, true, newDataUser, null, "Update successful");
});

usersController.putForgotPassword = catchAsync(async (req, res, next) => {
  const token = await crypto.randomBytes(20).toString("hex");
  const { email } = req.body;
  let user = await Users.findOne({ email });
  if (!user) {
    throw new AppError(
      400,
      "No account with that email",
      "Renew Password Error"
    );
  }
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  user = await user.save();

  let msg = {
    from: '"Nok Nok Campsite Admin" <campsite2022@gmail.com>',
    to: `${email}`,
    subject: "CampSite - Forgot Password / Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or copy and paste it into your browser to complete the process: ${req.headers.origin}/userReset/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`,
  };

  //   sgMail
  //     .send(msg)
  //     .then((respose) => console.log("email sent..."))
  //     .catch((error) => console.log(error.message));

  const success = `An email has been sent to ${email} with further instruction. If you do not see our email, please check the spam!`;
  return sendResponse(res, 200, success, {}, null, "Successful");
});

usersController.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  let { newPassword } = req.body;
  let user = await Users.findOne(
    {
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    "+password"
  );
  if (!user) {
    throw new AppError(
      400,
      "Password reset token is invalid or has expired!",
      "Reset Password Error"
    );
  }

  const salt = await bcrypt.genSalt(12);
  newPassword = await bcrypt.hash(newPassword, salt);

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user = await user.save();

  let msg = {
    from: '"Campsite Admin" <campsite2022@gmail.com>',
    to: `${user.email}`,
    subject: "CampSite - Password Changed",
    text: `Hello ${user.firstName} ${user.lastName}!, This email is to confirm that the password for your account has just been changed. If you did not make this change, please hit reply and notify us at once.`,
  };

  //   sgMail
  //     .send(msg)
  //     .then((respose) => console.log("email sent..."))
  //     .catch((error) => console.log(error.message));

  return sendResponse(
    res,
    200,
    "Password successfully updated!",
    user,
    null,
    "Successful"
  );
});

module.exports = usersController;

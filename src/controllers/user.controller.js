import { User } from "../models/user.model.js";
import { passwordRecover } from "../utils/emailPasswordRecovery.utils.js";
import { validation } from "../utils/validation.utils.js";

/*
 
 
-----------------        Sign Up User        -----------------


*/
const registerUser = async (req, res) => {
  const { username, number, email, userType, password, country, town, area } =
    req.body;

  // validation
  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  if (typeof username !== "string") {
    return res.status(400).json({ error: "username must be a string" });
  }

  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (username.length < 7) {
    return res
      .status(400)
      .json({ error: "username must contain at least seven characters" });
  }

  if (!number) {
    return res.status(400).json({ error: "number is required" });
  }

  if (typeof number !== "number") {
    return res.status(400).json({ error: "number must be a string" });
  }

  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (number.length < 7) {
    return res
      .status(400)
      .json({ error: "number must contain at least seven characters" });
  }
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  if (typeof email !== "string") {
    return res.status(400).json({ error: "email must be a string" });
  }

  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (email.length < 7) {
    return res
      .status(400)
      .json({ error: "email must contain at least seven characters" });
  }
  if (!userType) {
    return res.status(400).json({ error: "userType is required" });
  }

  if (typeof userType !== "string") {
    return res.status(400).json({ error: "userType must be a string" });
  }

  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (userType.length < 7) {
    return res
      .status(400)
      .json({ error: "userType must contain at least seven characters" });
  }
  if (!password) {
    return res.status(400).json({ error: "password is required" });
  }

  if (typeof password !== "string") {
    return res.status(400).json({ error: "password must be a string" });
  }

  // Check for the minimum length of the brand (if you want at least 2 characters)
  if (password.length < 7) {
    return res
      .status(400)
      .json({ error: "password must contain at least seven characters" });
  }



  // E-Mail Check Existed or not

  const ExistedUser = await User.findOne({ email });
  if (ExistedUser) {
    return res
      .status(400)
      .json({ error: `User with this E-Mail already Exist` });
  }

  // User Type Check must be user

  if (userType !== "user") {
    return res.status(400).json({ error: "Invalid userType" });
  }

  try {
    // Create a user in Data Base

    const user = await User.create({
      username,
      number,
      email,
      userType,
      password,
      country,
      town,
      area
    });
    return res.status(200).json({ message: `User Created`, user });
  } catch (error) {
    return res
      .status(400)
      .json({ error: `Error while storing Data in Data Base ${error}` });
  }
};
// --------------------------------------------------------------

/*
 
 
-----------------        Sign In User        -----------------


*/
const signinUser = async (req, res) => {
  const { email, password } = req.body;
  //Validation
  const EmailValidation = validation("E-mail", email, "string", 10);
  const PasswordValidation = validation("password", password, "string", 8);
  if (EmailValidation) {
    return res.status(400).json(EmailValidation);
  }
  if (PasswordValidation) {
    return res.status(400).json(PasswordValidation);
  }
  // E-Mail Check Existed or not

  const ExistedUser = await User.findOne({ $and: [{ email }, { password }] });
  if (!ExistedUser) {
    return res
      .status(400)
      .json({ error: `User with this E-Mail or Password not Exist` });
  }

  const AccessToken = await ExistedUser.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("AccessToken", AccessToken, options)
    .json({ message: `Login Successfully`, AccessToken: AccessToken });
};
// --------------------------------------------------------------

/*
 
-----------------        User Profile        -----------------

*/
const getProfile = async (req, res) => {
  const user = req.user.id;
  console.log(user);
  try {
    const UserProfile = await User.findById(user);
    if (UserProfile) {
      return res.status(200).json({ message: `profile Fetched`, UserProfile });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ message: `Unable to profile Fetched`, error });
  }
};
// --------------------------------------------------------------

/*
 
-----------------        Get All User        -----------------

*/
const getallUser = async (req, res) => {
  try {
    const { UserType } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    if (UserType.length != 0) {
      const UserTypeValidation = validation("userType", UserType, "string", 3);
      if (UserTypeValidation) {
        return res.status(400).json(UserTypeValidation);
      }
    }
    console.log("!2");
    const filter = UserType ? { userType: UserType } : {};
    let users;
    if (filter) {
      users = await User.find(filter).skip(skip).limit(limit).exec();
    } else {
      users = await User.find().skip(skip).limit(limit).exec();
    }
    if (users.length === 0) {
      return res.status(404).json({ message: "No Users Found" });
    }
    console.log(users);
    const TotalUsers = await User.countDocuments(filter);
    const TotalPages = Math.ceil(TotalUsers / limit);
    return res
      .status(200)
      .json({
        message: "Users Fetched Successfully",
        users,
        TotalPages: TotalPages,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed while Fetching Data`, error: error.message });
  }
};
// --------------------------------------------------------------

/*
 
-----------------        User Delete        -----------------

*/
const deleteUser = async (req, res) => {
  const user = req.user.id;
  console.log(user);
  try {
    const UserDeleted = await User.findByIdAndDelete(user);
    if (UserDeleted) {
      return res.status(200).json({ message: "User Deleted Successful" });
    }
  } catch (error) {
    return res.status(500).json({ message: `unable to Delete User ${error}` });
  }
};
// --------------------------------------------------------------

/*
 
-----------------        Update User         -----------------

*/
const UpdateUser = async (req, res) => {
  try {
    const { username, number, country, town, area, email } = req.body;
    const user = req.user.id;
    console.log(`User ${user}`);
    const ExistUser = await User.findById(user);
    if (!ExistUser) {
      return res.status(400).json({ error: "User Not Exist in the Data Base" });
    }
    const ValidationFields = [
      { name: "User Name", value: username, type: "string", length: 6 },
      { name: "Number", value: number, type: "number", length: 12 },
      { name: "Country", value: country, type: "string", length: 3 },
      { name: "Town", value: town, type: "string", length: 3 },
      { name: "Area", value: area, type: "string", length: 3 },
      { name: "E-Mail", value: email, type: "string", length: 8 },
    ];
    ValidationFields.forEach(({ name, value, type, length }) => {
      if (value) {
        const ValidationResults = validation(name, value, type, length);
        if (ValidationResults) {
          return res.status(400).json({ ValidationResults });
        }
      }
    });
    if (username) {
      ExistUser.username = username;
    }
    if (number) {
      ExistUser.number = number;
    }
    if (country) {
      ExistUser.country = country;
    }
    if (town) {
      ExistUser.town = town;
    }
    if (area) {
      ExistUser.area = area;
    }
    if (email) {
      ExistUser.email = email;
    }
    const UpdateUser = await ExistUser.save({ validateBeforeSave: false });
    return res.status(200).json({ message: "Updated Successful", UpdateUser });
  } catch (error) {
    return res.status(500).json({ message: "Error while Update Data in DB" });
  }
};
// --------------------------------------------------------------

/*
 
-----------------        Forget E-Mail/ Password         -----------------

*/
const forgetEmail_password = async (req, res) => {
  const { email, username, password, token } = req.body; // Removed password and Token since they are not used
  console.log(`email=${email} username=${username} password=${password}`);

  let filter = {};
  if (email) filter.email = email;
  if (username) filter.username = username;

  const existedUser = await User.findOne(filter);
  console.log(`ExistedUser=${existedUser}`);

  if (!existedUser) {
    return res.status(400).json({ error: "User does not exist" });
  }
  if (!password) {
    const userToken = await existedUser.generatePasswordResetToken();
    if (!userToken) {
      return res
        .status(400)
        .json({ message: "Failed to generate token", existedUser });
    }
    const { message } = await passwordRecover(existedUser.email, userToken);
    if (message.includes("Failed")) {
      return res.status(400).json({ message });
    } else {
      return res.status(200).json({ message });
    }
  } else {
    console.log(`Token Recived ${token}`);
    const verifiedToken = await existedUser.verifyResetToken(token);
    console.log(`Verification ${verifiedToken}`);

    if (verifiedToken) {
      const passwordReset = existedUser.resetPassword(password);
      if (passwordReset) {
        return res.status(200).json({ message: "Password Reset Successful" });
      }
    } else {
      return res.status(200).json({ message: "Invalid Token or E-Mail" });
    }
  }
};

// --------------------------------------------------------------

export {
  registerUser,
  signinUser,
  getProfile,
  deleteUser,
  getallUser,
  UpdateUser,
  forgetEmail_password,
};

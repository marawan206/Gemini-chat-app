import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email is Required."],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is Required."],
    unique: false,
  },
  firstName: {
    type: String,
    require: false,
  },
  lastName: {
    type: String,
    require: false,
  },
  image: {
    type: String,
    require: false,
  },
  color: {
    type: String,
    require: false,
  },
  profileSetup: {
    type: String,
    require: false,
  },
});

// Note to self, don't use arrow async arrow function with "this"
userSchema.pre("save", async function (next) { 
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
   } catch (error) {
   return next(error) 
  }
});
  

const User = mongoose.model("Users", userSchema);

export default User;

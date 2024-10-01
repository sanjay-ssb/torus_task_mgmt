import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true,"Must provide an User name"],
            minLength:[5,"Name must have min 3 Characters"],
            maxLength:[30,"Name mustnot exceed max 30 Characters"],
            trim: true
        },
        email: {
            type: String,
            required: [true,"Must provide an email"],
            unique: true,
            validate:[validator.isEmail,"Please Provide an valid email"],
            trim: true,
            
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select:false,
            validate: {
              validator: function (v) {
                // Ensure the password is at least 6 characters long
                return validator.isLength(v, { min: 6 }) && validator.isStrongPassword(v, {
                  minLength: 6,         // Minimum length
                  minLowercase: 1,      // At least one lowercase letter
                  minUppercase: 1,      // At least one uppercase letter
                  minNumbers: 1,        // At least one number
                  minSymbols: 0         // No symbols required (optional, you can change it)
                });
              },
              message: "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
            }
          },
        role: {
            type: String,
            enum: ['user', 'admin','superadmin'], // admin users can assign tasks
            default: 'user'
        },
        createdBy: {
          type: String,
          trim: true,
          validate: {
            validator: async function (createdByValue) {
              // Validate that the `createdBy` field matches an existing user's email or username.
              const userExists = await mongoose.model('User').findOne({ email: createdByValue });
              return userExists != null; // Ensure the user exists
            },
            message: props => `User with email "${props.value}" does not exist`
          },
          default:"jakesanjay.bhandari@gmail.com",
          required: true // Assuming this field is required
        }
          
    },
    {timestamps:true}
)
// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
userSchema.methods.comparePassword=async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword,this.password)
}
userSchema.methods.getJWTToken=function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  }); 
}
  
export const User=mongoose.model("User",userSchema)
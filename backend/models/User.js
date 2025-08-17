// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },  // must be "password"
//     osState: {
//         wallpaper: { type: String, default: 'default-wallpaper.jpg' },
//         apps: {
//             notes: { content: { type: String, default: 'Welcome!' } }
//         }
//     }
// });

// // hash before save
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// module.exports = mongoose.model('User', UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // 👈 use "password", not "passwordHash"
  osState: {
    wallpaper: { type: String, default: "default-wallpaper.jpg" },
    apps: {
      notes: { content: { type: String, default: "Welcome!" } }
    }
  }
});

export default mongoose.model("User", UserSchema);

import mongoose, { model, Schema, models } from "mongoose";

const adminEmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,}
}, {
    timestamps: true,
});

export const Admin = models.Admin || model('Admin', adminEmailSchema);

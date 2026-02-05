import { Document, Schema, model } from "mongoose";

interface IDeveloper extends Document {
    name: string;
    email: string;
    password: string;
    apiKey: string;
    isActive: boolean;
    otp: number;
    otpExpiresAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DeveloperSchema = new Schema<IDeveloper>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    otp: { type: Number, required: false },
    otpExpiresAt: { type: Date, required: false },
    passwordResetToken: { type: String, required: false },
    passwordResetExpires: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

DeveloperSchema.pre<IDeveloper>('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Developer = model<IDeveloper>('Developer', DeveloperSchema);


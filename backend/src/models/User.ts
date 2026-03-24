import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'admin';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rollNumber?: string;
  department?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(candidate: string): Promise<boolean>;
}

interface UserModel extends Model<IUser> {}

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    rollNumber: { type: String },
    department: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.matchPassword = async function matchPassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;

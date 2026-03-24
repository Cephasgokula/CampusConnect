import mongoose, { Schema } from 'mongoose';

export type RegistrationStatus = 'registered' | 'cancelled' | 'attended';

export interface IRegistration extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: RegistrationStatus;
  registeredAt: Date;
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended'],
      default: 'registered',
      required: true
    },
    registeredAt: { type: Date, default: Date.now },
    checkedInAt: { type: Date }
  },
  { timestamps: true }
);

registrationSchema.index({ student: 1, event: 1 }, { unique: true });

const Registration = mongoose.model<IRegistration>('Registration', registrationSchema);

export default Registration;

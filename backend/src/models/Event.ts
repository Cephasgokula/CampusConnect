import mongoose, { Schema } from 'mongoose';

export type EventCategory = 'workshop' | 'seminar' | 'cultural' | 'sports' | 'technical' | 'other';

export interface IEvent extends mongoose.Document {
  title: string;
  description: string;
  category: EventCategory;
  date: Date;
  endDate?: Date;
  venue: string;
  capacity: number;
  registeredCount: number;
  banner?: string;
  organizer: mongoose.Types.ObjectId;
  tags: string[];
  isActive: boolean;
  isCancelled: boolean;
  cancelReason?: string;
  registrationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['workshop', 'seminar', 'cultural', 'sports', 'technical', 'other']
    },
    date: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    banner: { type: String },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: false },
    cancelReason: { type: String },
    registrationDeadline: { type: Date }
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;

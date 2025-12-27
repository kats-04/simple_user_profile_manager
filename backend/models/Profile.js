import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true //
  },
  profileName: { 
    type: String, 
    required: [true, 'Profile name is required'],
    trim: true
  },
  profileType: {
    type: String,
    required: true,
    enum: ['Work', 'Personal'] //
  },
  // Data specific to the context
  jobTitle: String,
  company: String,
  bio: String,
  hobbies: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
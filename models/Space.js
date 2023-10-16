import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }
});

export default mongoose.model('Space', spaceSchema);
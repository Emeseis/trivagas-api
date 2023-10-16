import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: false },
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: true, unique: false },
  model: { type: String, required: true, unique: false },
  year:  { type: String, required: true, unique: false },
  owner: { type: String, required: true, unique: false },
});

export default mongoose.model('Vehicle', vehicleSchema);
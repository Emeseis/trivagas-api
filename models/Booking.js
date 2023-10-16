import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  space_id: { type: String, required: true, unique: false },
  booked_by: { type: String, required: true, unique: false },
  vehicle_plate: { type: String, required: true, unique: false },
  date: { type: Date, required: true, unique: false }
});

export default mongoose.model('Booking', bookingSchema);
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  cpf: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: false },
  mail: { type: String, required: true, unique: true },
  pass: { type: String, required: true, unique: false },
});

export default mongoose.model('User', userSchema);
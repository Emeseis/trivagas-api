import express from 'express';
import User from '../models/User.js';
import Space from '../models/Space.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import { isValidObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/findAllUsers/', async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({ status: 'OK', result: users });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.get('/findUser/:id', async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ status: 'ERR', msg: 'Invalid ID' });
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'User not found' });

    return res.status(200).json({ status: 'OK', result: user });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.get('/findUserBookings/:id', async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ status: 'ERR', msg: 'Invalid ID' });
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'User not found' });

    const bookings = await Booking.find({ booked_by: id });
    
    return res.status(200).json({ status: 'OK', result: bookings });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.get('/findUserVehicles/:id', async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ status: 'ERR', msg: 'Invalid ID' });
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'User not found' });

    const vehicles = await Vehicle.find({ owner: id });

    return res.status(200).json({ status: 'OK', result: vehicles });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.post('/registerUser', async (req, res) => {
  const { cpf, mail, name, pass } = req.body;
  try {
    const hashPass = await bcrypt.hash(pass, 10);
    const user = await User.create({ cpf, mail, name, pass: hashPass }); 

    const resultUser = user.toObject();
    delete resultUser.pass;

    return res.status(200).json({ status: 'OK', msg: 'User successfully created', result: resultUser });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ status: 'ERR', msg: `Duplicated key (${Object.keys(err.keyPattern)})` });
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.delete('/deleteUser/:id', async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.status(400).json({ status: 'ERR', msg: 'Invalid ID' });
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'User not found' });

    const vehicles = await Vehicle.find({ owner: id });
    if (vehicles.length) return res.status(409).json({ status: 'ERR', msg: `Delete the user's vehicles before to delete it` });

    await User.deleteOne({ _id: id });
    
    const resultUser = user.toObject();
    delete resultUser.pass;

    return res.status(200).json({ status: 'OK', msg: 'User successfully deleted', result: resultUser });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

export default router;

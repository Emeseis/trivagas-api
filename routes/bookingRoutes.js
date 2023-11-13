import express from 'express';
import Booking from '../models/Booking.js';
import Space from '../models/Space.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

router.get('/findAllBookings', async (req, res) => {
  try {
    const bookings = await Booking.find();

    return res.status(200).json({ status: 'OK', result: bookings});
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.post('/findBookings', async (req, res) => {
  const { id, space_id, date, booked_by, vehicle_plate } = req.body;

  const newDate = new Date(date)

  let params = {};
  if (id) params._id = id;
  if (date) params.date = newDate.setHours(0,0,0,0);
  if (space_id) params.space_id = space_id;
  if (booked_by) params.booked_by = booked_by;
  if (vehicle_plate) params.vehicle_plate = vehicle_plate;

  try {
    const bookings = await Booking.find(params);
    if (!bookings) return res.status(404).json({ status: 'ERR', msg: `Booking not found` }); 

    return res.status(200).json({ status: 'OK', result: bookings });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.post('/createBooking', async (req, res) => {
  const { space_id, user_id, date, vehicle_plate } = req.body;

  let newDate = new Date(date);
  newDate.setHours(0,0,0,0)
  // let newDate = new Date(); date.setHours(0,0,0,0);

  try {
    const space = await Space.findOne({ id: space_id });
    if (!space) return res.status(404).json({ status: 'ERR', msg: 'Space not found' });

    const user = await User.findOne({ _id: user_id });
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'User not found' });

    const vehicle = await Vehicle.findOne({ plate: vehicle_plate });
    if (!vehicle) return res.status(404).json({ status: 'ERR', msg: 'Vehicle not found' });
    if (vehicle.owner !== user_id) return res.status(409).json({ status: 'ERR', msg: 'Vehicle is not from this user' });

    const spaceBooked = await Booking.find({ newDate, space_id });
    if (spaceBooked.length) return res.status(409).json({ msg: 'There is already a booking at this space today' });

    const vehicleBooked = await Booking.find({ newDate, vehicle_plate });
    if (vehicleBooked.length) return res.status(409).json({ status: 'ERR', msg: 'This vehicle already has a booking in another space today' });

    const booking = await Booking.create({ space_id, booked_by: user_id, vehicle_plate, newDate });

    return res.status(200).json({ status: 'OK', msg: 'Booking successfully booked', result: booking });    
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.delete('/deleteBooking/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const booking = await Booking.findOne({ _id: id });
    if (!booking) return res.status(404).json({ status: 'ERR', msg: 'Booking not found' });
    
    await Booking.deleteOne({ _id: id });

    return res.status(200).json({ status: 'OK', msg: 'Booking successfully deleted', result: booking });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

export default router;

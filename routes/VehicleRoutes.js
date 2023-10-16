import express from 'express';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/findAllVehicles/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    return res.status(200).json({ status: 'OK', result: vehicles });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.get('/findVehicle/:plate', async (req, res) => {
  const plate = req.params.plate;
  try {
    const vehicle = await Vehicle.findOne({ plate });
    if (!vehicle) return res.status(404).json({ status: 'ERR', msg: 'Vehicle not found' });

    return res.status(200).json({ status: 'OK', result: vehicle });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.post('/registerVehicle', async (req, res) => {
  const { type, plate, brand, model, year, owner } = req.body;
  try {
    const user = User.findOne({ _id: owner });
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'User not found' });  

    const vehicle = await Vehicle.create({ type, plate, brand, model, year, owner });

    return res.status(200).json({ status: 'OK', msg: 'Vehicle successfully created', result: vehicle });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ status: 'ERR', msg: `Duplicated key (${Object.keys(err.keyPattern)})` });
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.delete('/deleteVehicle/:plate', async (req, res) => {
  const plate = req.params.plate;
  try {
    const vehicle = await Vehicle.findOne({ plate });
    if (!vehicle) return res.status(404).json({ status: 'ERR', msg: 'Vehicle not found' });

    const vehicleSpace = await Space.find({ vehicle_plate: plate });
    if (vehicleSpace.length) return res.status(409).json({ status: 'ERR', msg: 'Unbook this vehicle before to delete it' });

    await Vehicle.deleteOne({ plate });

    return res.status(200).json({ status: 'OK', msg: 'Vehicle successfully deleted', result: vehicle });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

export default router;

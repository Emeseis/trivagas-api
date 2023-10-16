import express from 'express';
import Space from '../models/Space.js';
import Booking from '../models/Booking.js';

const router = express.Router();

router.get('/findAllSpaces', async (req, res) => {
  try {
    const spaces = await Space.find();

    return res.status(200).json({ status: 'OK', result: spaces});
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.get('/findSpace/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const space = await Space.findOne({ id });
    if (!space) return res.status(404).json({ status: 'ERR', msg: `Space not found` }); 

    return res.status(200).json({ status: 'OK', result: space });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.post('/createSpace', async (req, res) => {
  const { id } = req.body;
  try {
    const space = await Space.create({ id });

    return res.status(200).json({ status: 'OK', msg: 'Space successfully created', result: space });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ status: 'ERR', msg: `Duplicated key (${Object.keys(err.keyPattern)})` });
    return res.status(500).json({ status: 'ERR', err });
  }
});

router.delete('/deleteSpace/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const space = await Space.findOne({ id });
    if (!space) return res.status(404).json({ status: 'ERR', msg: 'Space not found' });
    
    await Space.deleteOne({ id });
    await Booking.deleteMany({ space_id: id });

    return res.status(200).json({ status: 'OK', msg: 'Space successfully deleted', result: space });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

export default router;

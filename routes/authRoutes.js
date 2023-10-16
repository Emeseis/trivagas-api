import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { cpf, mail, pass } = req.body;
  if (!cpf && !mail) return res.status(400).json({ status: 'ERR', msg: 'Need CPF or Email to login' });
  try {
    let params = {};
    if (cpf) params.cpf = cpf;
    if (mail) params.mail = mail;

    const user = await User.findOne(params); 
    if (!user) return res.status(404).json({ status: 'ERR', msg: 'Invalid credentials' });

    const valid = await bcrypt.compare(pass, user.pass);
    if (!valid) return res.status(404).json({ status: 'ERR', msg: 'Invalid credentials' });

    const resultUser = user.toObject();
    delete resultUser.pass;
    
    return res.status(200).json({ status: 'OK', msg: 'Valid', result: resultUser });
  } catch (err) {
    return res.status(500).json({ status: 'ERR', err });
  }
});

export default router;

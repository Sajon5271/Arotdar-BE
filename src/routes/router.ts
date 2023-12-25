import { Router } from 'express';
import { CreateUser } from '../controllers/Users.Controller';

export const router = Router();

router.get('/', async (req, res) => {
  try {
    res.status(200).send('App working');
  } catch (error) {
    console.log(error);
    res.status(500).send('Something Went Wrong');
  }
});
router.post('/CreateUser', CreateUser);

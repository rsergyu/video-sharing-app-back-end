import express from 'express'
import { signup , signin, googleAuth} from '../controllers/auth.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/auth', googleAuth);

export default router;
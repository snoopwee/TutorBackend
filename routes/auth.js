const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { registerStudent,registerTutor, loginUser, fetchUserProfile } = require('../controllers/authController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/registerStudent', upload.fields([
    { name: 'avatar', maxCount: 1 }
  ]), registerStudent);
router.post('/registerTutor', upload.fields([

    { name: 'avatar', maxCount: 1 },
    { name: 'degreeFile', maxCount: 1 },
    { name: 'credentialFile', maxCount: 1 }

  ]), registerTutor);
  
router.post('/login', loginUser);
router.get('/profile', auth, fetchUserProfile);


module.exports = router;

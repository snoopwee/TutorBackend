const User = require('../models/User');
const Student = require('../models/Student'); 
const Tutor = require('../models/Tutor'); 
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.registerStudent = async (req, res) => {
  const { email, userName, password, fullName, dateOfBirth, phone, address, grade, school } = req.body;

  console.log('Received Data:', { email, userName, password, fullName, dateOfBirth, phone, address, grade, school });
  
  const avatar = req.files.avatar ? req.files.avatar[0].buffer : 0;
  try {
    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      email,
      userName,
      password, // Make sure to hash the password in the User model's create method
      fullName,
      avatar,
      dateOfBirth,
      phone,
      address,
      role: 'ST'
    });

    // Create student
    const student = await Student.createStudent(user.userId, {
      
      grade,
      school
    });

    // Generate authentication token
    const token = User.generateAuthToken(user);

    res.status(201).json({ token, user, student });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerTutor = async (req, res) => {
  const { email, userName, password, fullName, dateOfBirth, phone, address, workplace, description} = req.body;

  if (!req.files || !req.files.avatar || !req.files.avatar.length) {
    return res.status(400).json({ message: 'Avatar is required' });
  } 

  if (!req.files || !req.files.degreeFile || !req.files.degreeFile.length) {
    return res.status(400).json({ message: 'degreeFile is required' });
  }

  if (!req.files || !req.files.credentialFile || !req.files.credentialFile.length) {
    return res.status(400).json({ message: 'credentialFile is required' });
  }
  
  
  
  const avatar = req.files.avatar[0].buffer;

  const identityCard = req.files.credentialFile[0].buffer; 
  const degrees = req.files.degreeFile[0].buffer; 
  
  try {
    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      email,
      userName,
      password, // Make sure to hash the password in the User model's create method
      fullName,
      avatar,
      dateOfBirth,
      phone,
      address,
      role: 'TT'
    });

    // Create tutor
    const tutor = await Tutor.createTutor(user.userId, {
      degrees,
      identityCard,
      
      workplace,
      description,
      
    });

    // Generate authentication token
    const token = User.generateAuthToken(user);

    res.status(201).json({ token, user, tutor });
  } catch (error) {
    console.error('Error registering tutor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = User.generateAuthToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.fetchUserProfile = async (req, res) => {
  try {
    const user = await User.findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

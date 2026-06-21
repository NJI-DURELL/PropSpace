const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }
  const [existEmail, existUsername] = await Promise.all([
    userRepo.findByEmail(email),
    userRepo.findByUsername(username),
  ]);
  if (existEmail) return res.status(400).json({ message: 'Email already in use' });
  if (existUsername) return res.status(400).json({ message: 'Username already taken' });

  const user = await userRepo.create({ username, email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const user = await userRepo.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
};

module.exports = { register, login };

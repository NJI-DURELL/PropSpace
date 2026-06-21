const userRepo = require('../repositories/userRepository');

const getProfile = async (req, res) => {
  const user = await userRepo.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

const updateProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await userRepo.updateById(req.user.id, { name, phone, avatar });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'oldPassword and newPassword are required' });
  }
  const user = await userRepo.findByIdWithPassword(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await user.comparePassword(oldPassword);
  if (!match) return res.status(401).json({ message: 'Old password is incorrect' });

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
};

module.exports = { getProfile, updateProfile, changePassword };

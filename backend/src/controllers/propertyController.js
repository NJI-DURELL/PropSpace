const propertyRepo = require('../repositories/propertyRepository');

const getAllProperties = async (req, res) => {
  const { city, minPrice, maxPrice } = req.query;
  const filter = {};
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const properties = await propertyRepo.findAll(filter);
  res.json(properties);
};

const getMyProperties = async (req, res) => {
  const properties = await propertyRepo.findByOwner(req.user.id);
  res.json(properties);
};

const getPropertyById = async (req, res) => {
  const property = await propertyRepo.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
};

const createProperty = async (req, res) => {
  const { title, description, price, city, country, type, images } = req.body;
  if (!title || !description || !price || !city || !country || !type) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }
  const validTypes = ['Apartment', 'House', 'Studio'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid property type' });
  }
  const property = await propertyRepo.create({
    title, description, price, city, country, type,
    images: images || [],
    owner: req.user.id,
  });
  res.status(201).json(property);
};

const updateProperty = async (req, res) => {
  const property = await propertyRepo.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.owner._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: not the owner' });
  }
  const updated = await propertyRepo.updateById(req.params.id, req.body);
  res.json(updated);
};

const deleteProperty = async (req, res) => {
  const property = await propertyRepo.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.owner._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: not the owner' });
  }
  await propertyRepo.deleteById(req.params.id);
  res.json({ message: 'Property deleted' });
};

module.exports = { getAllProperties, getMyProperties, getPropertyById, createProperty, updateProperty, deleteProperty };

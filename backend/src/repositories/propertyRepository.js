const Property = require('../models/Property');

const findAll = (filter = {}) => Property.find(filter).populate('owner', 'username name');
const findById = (id) => Property.findById(id).populate('owner', 'username name');
const findByOwner = (ownerId) => Property.find({ owner: ownerId });
const create = (data) => Property.create(data);
const updateById = (id, data) => Property.findByIdAndUpdate(id, data, { new: true });
const deleteById = (id) => Property.findByIdAndDelete(id);

module.exports = { findAll, findById, findByOwner, create, updateById, deleteById };

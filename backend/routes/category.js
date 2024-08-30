// routes/category.js
const express = require('express');
const  Category  = require('../models/category');
const User = require("../models/user");
const router = express.Router();

// Error handling middleware
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Create a category
router.post('/', asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);

}));

// Get all categories
router.get('/', asyncHandler(async (req, res) => {

    try {
        const categories = await Category.findAll(); // Use Sequelize or your DB library
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));

// Get a single category by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
}));

// Update a category by ID
router.put('/:id', asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.status(200).json(category);
}));

// Delete a category by ID
router.delete('/:id', asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy(); // Soft delete because of `paranoid: true`
    res.status(204).json({ message: 'Category deleted' });
}));

module.exports = router;

const express = require('express');
const { Unit } = require('../../models/associations');
const authenticateToken = require('../../middleware/auth');
const { ValidationError, Op } = require('sequelize');
const router = express.Router();

// Utility function to handle async routes
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Validate unit input
const validateUnitInput = (name, abbreviation, description) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        const error = new Error('Valid name is required');
        error.status = 400;
        throw error;
    }
    if (!abbreviation || typeof abbreviation !== 'string' || abbreviation.trim() === '') {
        const error = new Error('Valid abbreviation is required');
        error.status = 400;
        throw error;
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
        const error = new Error('Valid description is required');
        error.status = 400;
        throw error;
    }
};

// Check for duplicate unit name or abbreviation
const checkDuplicate = async (name, abbreviation, id = null) => {
    const whereClause = {
        [Op.or]: [
            { name: { [Op.iLike]: name.toLowerCase() } }, // Use toLowerCase() for clarity
            { abbreviation: { [Op.iLike]: abbreviation.toLowerCase() } } // Use toLowerCase() for clarity
        ]
    };
    if (id) {
        whereClause.id = { [Op.ne]: id };
    }
    const existingUnit = await Unit.findOne({ where: whereClause });
    return !!existingUnit; // Return true if a duplicate exists, false otherwise
};

// Emit socket event to all clients except the sender
const emitToOthers = (req, event, data) => {
    try {
        const socketId = req.headers['x-socket-id'];
        if (req.io && typeof req.io.emit === 'function') {
            req.io.emit(event, data, { except: socketId });
        }
    } catch (error) {
        console.error('Error emitting socket event:', error);
    }
};

// Middleware for handling 400 and 500 errors
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        status: err.status || 500
    });
};

// Create a unit
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const { name, abbreviation, description } = req.body;
        validateUnitInput(name, abbreviation, description);
        const isDuplicate = await checkDuplicate(name, abbreviation); // Check for duplicate
        if (isDuplicate) {
            return res.status(400).json({ message: 'Unit with this name or abbreviation already exists' });
        }
        const unit = await Unit.create({ name, abbreviation, description, createdBy: req.user.id });
        res.status(201).json({ data: { value: unit }, message: 'Unit created successfully' }); // Added message field
        emitToOthers(req, 'newUnit', unit);
    } catch (error) {
        if (error.status === 400) {
            res.status(400).json({ message: error.message });
        } else {
            throw error;
        }
    }
}));

// Get all units
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const units = await Unit.findAll();
        res.status(200).json({ data: { value: units }, message: 'Units fetched successfully' }); // Changed response structure
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));

// Get a single unit by ID
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid unit ID' });
        }

        const unit = await Unit.findByPk(id);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.status(200).json({ data: { value: unit }, message: 'Unit fetched successfully' }); // Changed response structure
    } catch (error) {
        console.error('Error fetching unit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));

// Update a unit
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const { name, abbreviation, description } = req.body;
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid unit ID' });
        }

        validateUnitInput(name, abbreviation, description);
        const isDuplicate = await checkDuplicate(name, abbreviation, id); // Check for duplicate
        if (isDuplicate) {
            return res.status(400).json({ message: 'Unit with this name or abbreviation already exists' });
        }

        console.log('Updating unit:', { id, name, abbreviation, description }); // Log for debugging

        const [updatedRowsCount, [updatedUnit]] = await Unit.update(
            { name, abbreviation, description },
            { where: { id }, returning: true }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Unit not found' });
        }

        res.status(200).json({ data: { value: updatedUnit }, message: 'Unit updated successfully' }); // Added message field
        emitToOthers(req, 'updateUnit', updatedUnit);
    } catch (error) {
        if (error.status === 400) {
            res.status(400).json({ message: error.message });
        } else {
            console.error('Error updating unit:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}));

// Delete a unit
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid unit ID' });
        }

        const deletedRowsCount = await Unit.destroy({ where: { id } });
        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        res.status(200).json({ message: 'Unit deleted successfully' });
        emitToOthers(req, 'deleteUnit', id);
    } catch (error) {
        console.error('Error deleting unit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));

// Error handling middleware
router.use(handleError);

module.exports = router;
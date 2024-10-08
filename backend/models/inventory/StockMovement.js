const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Variant = require('../product/variant');
const Warehouse = require('../warehouse'); // Assuming you have a Warehouse model
const Store = require('../store'); // Assuming you have a Store model

const StockMovement = sequelize.define('StockMovement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    variantId: {
        type: DataTypes.INTEGER,
        references: {
            model: Variant,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
        // e.g., 'Stock In (From Supplier)', 'Return from Client', etc.
    },
    sourceType: {
        type: DataTypes.ENUM('warehouse', 'client', 'supplier', 'store', 'opening_balance'),
        allowNull: true,
    },
    sourceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    destinationType: {
        type: DataTypes.ENUM('warehouse', 'client', 'supplier', 'store'),
        allowNull: true,
    },
    destinationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sourceWarehouseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Warehouse,
            key: 'id',
        }
    },
    destinationWarehouseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Warehouse,
            key: 'id',
        }
    },
    sourceStoreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Store,
            key: 'id',
        }
    },
    destinationStoreId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Store,
            key: 'id',
        }
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
}, {
    timestamps: true,
    underscored: true,
});

module.exports = StockMovement;

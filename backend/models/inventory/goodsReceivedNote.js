// models/GoodsReceivedNote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const PurchaseOrder = require('../purchases/purchaseOrder');
const Warehouse = require('../warehouse');
const Store = require('../store');

const GoodsReceivedNote = sequelize.define('GoodsReceivedNote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    purchaseOrderId: {
        type: DataTypes.INTEGER,
        references: {
            model: PurchaseOrder,
            key: 'id',
        },
        allowNull: false,
    },
    warehouseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Warehouse,
            key: 'id',
        },
        allowNull: true,
    },
    storeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Store,
            key: 'id',
        },
        allowNull: true,
    },
    receivedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'complete', 'partial'),
        defaultValue: 'complete',
    },

}, {
    timestamps: true,
    underscored: true,
});

module.exports = GoodsReceivedNote;

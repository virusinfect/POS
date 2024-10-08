const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const Variant = require('./variant');
const AttributeValue = require('./attributeValue');

const VariantAttributeValue = sequelize.define('VariantAttributeValue', {
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
    attributeValueId: {
        type: DataTypes.INTEGER,
        references: {
            model: AttributeValue,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
    paranoid: false,
    underscored: true,
});



module.exports = VariantAttributeValue;

const db = require('../database');

module.exports = function (sequelize, DataTypes) {
    const Category = sequelize.define('categories', {
        active: { type: DataTypes.BOOLEAN },
        name: { type: DataTypes.STRING(100) },
    });

    return Category;
};
const db = require('../database');

const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Vehicle = sequelize.define('vehicles', {
        companyId: { type: DataTypes.UUID },
        category: { type: DataTypes.STRING(100), },
        model: { type: DataTypes.STRING(100), },
        year: { type: DataTypes.INTEGER },
        kmInitial: { type: DataTypes.INTEGER },
        kmCurrent: { type: DataTypes.INTEGER },
        value: { type: DataTypes.DECIMAL },
        description: { type: DataTypes.STRING(1000) },
        image: { type: DataTypes.STRING(500) },
    });

    Vehicle.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

    return Vehicle;
};
const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('users', {
        companyId: { type: DataTypes.UUID },
        userAWSId: { type: DataTypes.STRING(50) },
        name: { type: DataTypes.STRING(255) },
        email: { type: DataTypes.STRING(255) },
        cpfCnpj: { type: DataTypes.STRING(50) },
        image: { type: DataTypes.STRING(500) },
        commissionMonth: { type: DataTypes.DECIMAL },
        phone: { type: DataTypes.STRING(30) },
        type: { type: DataTypes.STRING(30) },
        active: { type: DataTypes.BOOLEAN },
        state: { type: DataTypes.STRING(100), },
        city: { type: DataTypes.STRING(100), },
        address: { type: DataTypes.STRING(300), },
        dateOfBirth: { type: DataTypes.DATE },
        dateOfBirthMonth: { type: DataTypes.INTEGER },
        hiringDate: { type: DataTypes.DATE },
        salesRepresentative: { type: DataTypes.STRING(255) },
        capture: { type: DataTypes.STRING(300), },
        nature: { type: DataTypes.STRING(30) },
    });

    User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    return User;
};
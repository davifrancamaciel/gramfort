const db = require('../database');

const Company = require('./Company')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Visit = sequelize.define('visits', {
        companyId: { type: DataTypes.UUID },   
        clientId: { type: DataTypes.INTEGER },        
        userId: { type: DataTypes.INTEGER },
        value: { type: DataTypes.DECIMAL },     
        km: { type: DataTypes.INTEGER },
        description: { type: DataTypes.STRING(1000) },
        state: { type: DataTypes.STRING(100), },
        city: { type: DataTypes.STRING(100), },
        address: { type: DataTypes.STRING(300), },
        image: { type: DataTypes.STRING(500) },
        date: { type: DataTypes.DATE },     
        paymentDate: { type: DataTypes.DATE },     
        paidOut: { type: DataTypes.BOOLEAN },
        carriedOut: { type: DataTypes.BOOLEAN },
        proposal: { type: DataTypes.BOOLEAN },
        sale: { type: DataTypes.BOOLEAN },
    });
    
    Visit.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });   
    Visit.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Visit.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

    return Visit;
};
const db = require('../database');

const Company = require('./Company')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);
const Sale = require('./Sale')(db.sequelize, db.Sequelize);
const Product = require('./Product')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Application = sequelize.define('applications', {
        companyId: { type: DataTypes.UUID },
        userId: { type: DataTypes.INTEGER },
        clientId: { type: DataTypes.INTEGER },
        saleId: { type: DataTypes.INTEGER },
        productId: { type: DataTypes.INTEGER },
        date: { type: DataTypes.DATE },
        type: { type: DataTypes.STRING(15), },
        amount: { type: DataTypes.INTEGER },
        note: { type: DataTypes.STRING(1000), },
        image1: { type: DataTypes.STRING(500) },
        image2: { type: DataTypes.STRING(500) },
        image3: { type: DataTypes.STRING(500) },
        image4: { type: DataTypes.STRING(500) },
        approved: { type: DataTypes.BOOLEAN },
    });

    Application.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Application.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
    Application.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' });
    Application.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    return Application;
};
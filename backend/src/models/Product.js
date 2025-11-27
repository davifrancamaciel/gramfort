const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const Category = require('./Category')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('products', {
        companyId: { type: DataTypes.UUID },
        supplierId: { type: DataTypes.INTEGER },
        categoryId: { type: DataTypes.INTEGER },

        name: { type: DataTypes.STRING(255) },
        price: { type: DataTypes.DECIMAL },
        image: { type: DataTypes.STRING(500) },
        description: { type: DataTypes.STRING(100) },
        inventoryCount: { type: DataTypes.INTEGER },
        active: { type: DataTypes.BOOLEAN }
    });

    Product.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Product.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });

    return Product;
};
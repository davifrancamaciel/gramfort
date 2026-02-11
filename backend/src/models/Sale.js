const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);
const SaleProduct = require('./SaleProduct')(db.sequelize, db.Sequelize);
const Visit = require('./Visit')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Sale = sequelize.define('sales', {

        companyId: { type: DataTypes.UUID },
        userId: { type: DataTypes.INTEGER },
        clientId: { type: DataTypes.INTEGER },
        visitId: { type: DataTypes.INTEGER },

        products: { type: DataTypes.TEXT },
        productsFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return JSON.parse(this.products);
            },
        },        
        note: { type: DataTypes.STRING(500) },
        value: { type: DataTypes.DECIMAL },
        valueInput: { type: DataTypes.DECIMAL },
        valuePerMeter: { type: DataTypes.DECIMAL },
        commission: { type: DataTypes.DECIMAL },
        invoiceNumber: { type: DataTypes.STRING(50) }, // numero da NF

        contact: { type: DataTypes.STRING(100) },
        capture: { type: DataTypes.STRING(30) },
        nature: { type: DataTypes.STRING(30) },
        saleDate: { type: DataTypes.DATE },
        distance: { type: DataTypes.INTEGER },
        germinationLevel: { type: DataTypes.INTEGER },
        satisfaction: { type: DataTypes.INTEGER },
        invoice: { type: DataTypes.BOOLEAN },// tem nota NF?
        demand: { type: DataTypes.STRING(30) },
        // CONTRATO
        approved: { type: DataTypes.BOOLEAN },
        internalNote: { type: DataTypes.STRING(500) },
        access: { type: DataTypes.INTEGER },
        complexityLevel: { type: DataTypes.INTEGER },
        daysExecution: { type: DataTypes.INTEGER },
        expectedDateForApplication: { type: DataTypes.DATE },
        discountDescription: { type: DataTypes.STRING(50) },
        discountValue: { type: DataTypes.DECIMAL },
        phSoil: { type: DataTypes.STRING(100) },
        sunOrientation: { type: DataTypes.STRING(100) },
        paymentMethod: { type: DataTypes.STRING(200) },
        hash: { type: DataTypes.UUID },
        image1: { type: DataTypes.STRING(500) },
        image2: { type: DataTypes.STRING(500) },
        image3: { type: DataTypes.STRING(500) },
        image4: { type: DataTypes.STRING(500) },
        image5: { type: DataTypes.STRING(500) },
        image6: { type: DataTypes.STRING(500) },
        lineBreak: { type: DataTypes.STRING(500) },
    });

    Sale.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Sale.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
    Sale.belongsTo(Visit, { foreignKey: 'visitId', as: 'visit' })
    Sale.hasMany(SaleProduct, { foreignKey: 'saleId', as: 'productsSales' })
    return Sale;
};
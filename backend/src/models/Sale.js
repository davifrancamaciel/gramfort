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
        inputs: { type: DataTypes.TEXT },
        inputsFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return JSON.parse(this.inputs);
            },
        },
        note: { type: DataTypes.STRING(500) },
        value: { type: DataTypes.DECIMAL },
        valueInput: { type: DataTypes.DECIMAL },
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
        hash: { type: DataTypes.UUID },
    });

    Sale.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Sale.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
    Sale.hasMany(SaleProduct, { foreignKey: 'saleId', as: 'productsSales' })
    Sale.belongsTo(Visit, { foreignKey: 'visitId', as: 'visit' })
    return Sale;
};
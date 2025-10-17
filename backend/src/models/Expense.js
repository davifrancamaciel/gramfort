const db = require('../database');
const ExpenseType = require('./ExpenseType')(db.sequelize, db.Sequelize);
const Company = require('./Company')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);
const Vehicle = require('./Vehicle')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Expense = sequelize.define('expenses', {
        companyId: { type: DataTypes.UUID },   
        expenseTypeId: { type: DataTypes.INTEGER },
        expenseDadId: { type: DataTypes.INTEGER },
        userId: { type: DataTypes.INTEGER },
        dividedIn: { type: DataTypes.VIRTUAL },
        value: { type: DataTypes.DECIMAL },
        title: { type: DataTypes.STRING(256) },
        description: { type: DataTypes.STRING(1000) },
        paidOut: { type: DataTypes.BOOLEAN },
        paymentDate: { type: DataTypes.DATE },     
    });
    
    Expense.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });  
    Expense.belongsTo(ExpenseType, { foreignKey: 'expenseTypeId', as: 'expenseType' });
    Expense.belongsTo(Expense, { foreignKey: 'expenseDadId', as: 'expense' });
    Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Expense.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

    return Expense;
};
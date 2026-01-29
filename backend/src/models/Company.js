const uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const Company = sequelize.define('companies', {
        name: { type: DataTypes.STRING(255) },
        active: { type: DataTypes.BOOLEAN },
        groups: { type: DataTypes.STRING(1000) },
        groupsFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.groups ? JSON.parse(this.groups) : [];
            },
        },
        email: { type: DataTypes.STRING(150) },
        phone: { type: DataTypes.STRING(30) },
        pixKey: { type: DataTypes.STRING(100) },
        image: { type: DataTypes.STRING(500) },
        individualCommission: { type: DataTypes.BOOLEAN },
        banner: { type: DataTypes.STRING(500) },

        manager: { type: DataTypes.STRING(100), },
        state: { type: DataTypes.STRING(100), },
        city: { type: DataTypes.STRING(100), },
        address: { type: DataTypes.STRING(300), },

        fantasyName: { type: DataTypes.STRING(100), },
        imageHeaderContract: { type: DataTypes.STRING(500), },
        imageFooterContract: { type: DataTypes.STRING(500), },
        agencyBank: { type: DataTypes.STRING(100), },
        site: { type: DataTypes.STRING(100), },
        instagran: { type: DataTypes.STRING(100), },
        cnpj: { type: DataTypes.STRING(50), },
        zipCode: { type: DataTypes.STRING(50), },
        currency: { type: DataTypes.STRING(10), },
        financeName: { type: DataTypes.STRING(100), },
        financePhone: { type: DataTypes.STRING(20), },
        sizeTank: { type: DataTypes.INTEGER },
    });

    Company.beforeCreate(c => c.id = uuid.v4());

    return Company;
};
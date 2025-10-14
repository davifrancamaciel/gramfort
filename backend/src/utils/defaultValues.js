"use strict";

const roules = {
    administrator: 'administrador',
    users: 'usuarios',    
    products: 'produtos',   
    sales: 'vendas',
    saleUserIdChange: 'vendedor_vendas',
    expenses: 'despesas',
    clients: 'clientes',
    supplier: 'fornecedores',
    visits: 'visitas',
};

const cognito = {
    adminEnableUser: 'adminEnableUser',
    adminDisableUser: 'adminDisableUser',
    adminSetUserPassword: 'adminSetUserPassword',
    listUsers: 'listUsers',
    adminListGroupsForUser: 'adminListGroupsForUser',
    adminCreateUser: 'adminCreateUser',
    adminUpdateUserAttributes: 'adminUpdateUserAttributes',
    adminDeleteUser: 'adminDeleteUser',
    adminAddUserToGroup: 'adminAddUserToGroup',
    adminRemoveUserFromGroup: 'adminRemoveUserFromGroup',
    listUsersInGroup: 'listUsersInGroup'
}

const companyIdDefault = '723f5715-3d2e-4484-8eb1-d24927a78c55' // Ari delicatessen
const { STAGE } = process.env
const stageLink = STAGE === 'prd' ? 'prod' : STAGE;
const linkServices = `http://gramfort-${stageLink}.s3-website-us-east-1.amazonaws.com`;

const userType = {
    USER: 'USER',
    CLIENT: 'CLIENT',
    SUPPLIER: 'SUPPLIER'
}

module.exports = { roules, cognito, companyIdDefault, userType, linkServices }
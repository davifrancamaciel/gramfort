"use strict";

const db = require('../../database');
const Category = require('../../models/Category')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

module.exports.listAll = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.products))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const whereStatement = { };
        
        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await Category.findAll({
            where: whereStatement,
            order: [['name', 'ASC']],
        })

        const respFormated = resp.map(item => ({
            ...item,
            value: item.id,
            label: item.name,
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};
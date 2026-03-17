"use strict";

const db = require('../../database');
const ExpenseType = require('../../models/ExpenseType')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.listAll = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await ExpenseType.findAll({
            attributes: ['id', 'name', 'description'],
            order: [['name', 'ASC']],
        })

        const respFormated = resp.filter(x => x.id != 1).map(item => ({
            value: item.id,
            label: item.name,
            description: item.description
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};
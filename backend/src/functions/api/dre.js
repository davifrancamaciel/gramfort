"use strict";

const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect } = require("../../services/ExecuteQueryService");
const { roules } = require("../../utils/defaultValues");
const salesRepository = require('../../repositories/salesRepository')
const expensesRepository = require('../../repositories/expensesRepository')
const { formatDate } = require("../../utils/formatDate");

module.exports.handler = async (event, context) => {
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        let data = {
            sales: { count: 0, totalValueCommissionMonth: 0, totalValueMonth: 0, users: 0 },            
        }

        let isAdm = checkRouleProfileAccess(user.groups, roules.administrator);
        let date = new Date();
        const { queryStringParameters } = event
        if (queryStringParameters && queryStringParameters.dateReference)
            date = new Date(queryStringParameters.dateReference)

        const { companyId } = queryStringParameters;
        if (checkRouleProfileAccess(user.groups, roules.sales)) {
            // data.sales = await salesRepository.salesMonthDashboard(date, isAdm, user, false, companyId)
            data.visits = await salesRepository.visitsPaidOutDre(date, isAdm, user, companyId)
            data.expenses = await expensesRepository.expensesMonthByTypeDre(date, isAdm, user, companyId);
        }

        return handlerResponse(200, data)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};



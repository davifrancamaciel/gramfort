"use strict";

const db = require('../../database');
const { Op } = require('sequelize');
const Expense = require('../../models/Expense')(db.sequelize, db.Sequelize);
const { startOfMonth, endOfMonth, startOfDay, endOfDay, subDays, parseISO, addYears } = require('date-fns');
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect, executeUpdate } = require("../../services/ExecuteQueryService");
const { roules } = require("../../utils/defaultValues");
const salesRepository = require('../../repositories/salesRepository')
const { formatDate } = require("../../utils/formatDate");

module.exports.cards = async (event, context) => {
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        let data = {
            sales: { count: 0, totalValueCommissionMonth: 0, totalValueMonth: 0, users: 0 },
            user: { count: 0, totalValueCommissionMonth: 0, totalValueMonth: 0, users: 0 }
        }

        let isAdm = checkRouleProfileAccess(user.groups, roules.administrator);
        let date = new Date();
        const { queryStringParameters } = event
        if (queryStringParameters && queryStringParameters.dateReference)
            date = new Date(queryStringParameters.dateReference)
        const { companyId } = queryStringParameters;
        if (checkRouleProfileAccess(user.groups, roules.sales)) {
            data.sales = await salesRepository.salesMonthDashboard(date, isAdm, user, false, companyId)
            const query = `SELECT id FROM companies WHERE id = '${user.companyId}' AND individualCommission = true`;
            const [individualCommission] = await executeSelect(query);
            if (individualCommission || isAdm)
                data.user = await salesRepository.salesMonthDashboard(date, isAdm, user, true, companyId);
            else
                data.user = data.sales;
        }

        if (checkRouleProfileAccess(user.groups, roules.expenses)) {
            data.expenses = await expensesMonth(date, isAdm, user, companyId);
            data.expensesByType = await expensesMonthByType(date, isAdm, user, companyId);
        }

        return handlerResponse(200, data)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const andCompany = (alias, companyId) =>
    companyId ? `AND ${alias}.companyId = '${companyId}'` : ''

module.exports.productGraphBar = async (event, context) => {
    try {
        const { pathParameters } = event
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        let isAdm = checkRouleProfileAccess(user.groups, roules.administrator);
        let data = null;

        if (pathParameters.type === 'products')
            data = await productsSalesTotal(isAdm, user);

        return handlerResponse(200, data)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

module.exports.expenses = async (event, context) => {
    try {
        const { queryStringParameters } = event
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        const { paidOut, paymentDate } = queryStringParameters

        let isAdm = checkRouleProfileAccess(user.groups, roules.administrator);

        const query = ` SELECT DATE(e.paymentDate) paymentDate, COUNT(e.id) amount, SUM(e.value) value, paidOut, 
                               GROUP_CONCAT(id ORDER BY id ASC SEPARATOR ', ') AS ids
                        FROM expenses e
                        WHERE DATE(e.paymentDate) >= DATE('${paymentDate}') AND 
                              DATE(e.paymentDate) <= DATE(DATE_ADD(NOW(), INTERVAL 30 DAY)) AND 
                              e.paidOut = ${paidOut} 
                              ${isAdm ? '' : `AND e.companyId = '${user.companyId}'`}
                        GROUP BY DATE(e.paymentDate) 
                        ORDER BY DATE(e.paymentDate) ASC 
                        LIMIT 30;`
        let data = await executeSelect(query);
        const ids = data.map(x => x.ids).join(',')

        const expenses = await Expense.findAll({
            where: { id: { [Op.in]: ids.split(',') } }
        })

        const resp = data.map(x => ({
            ...x,
            expenses: getExpenses(expenses, x.ids)
        }))

        return handlerResponse(200, resp)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const getExpenses = (expenses, ids) => {
    const searchIds = ids.split(',')
    return searchIds.map(id => expenses.find(e => e.id == id))
}

module.exports.expensesUpdate = async (event, context) => {
    try {
        const body = JSON.parse(event.body)
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const { paidOut, ids, paymentDate } = body

        let isAdm = checkRouleProfileAccess(user.groups, roules.expenses);

        const query = ` UPDATE expenses 
                            SET paidOut = ${paidOut}, updatedAt = NOW() 
                        WHERE id IN (${ids}) ${isAdm ? '' : `AND companyId = '${user.companyId}'`}`;
        const data = await executeUpdate(query);

        return handlerResponse(200, data, `Despesas ${ids} da data ${formatDate(paymentDate)} alteradas com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const expensesMonth = async (date, isAdm, user, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, e.paidOut FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    AND e.saleId IS NULL ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.paidOut`

    const result = await executeSelect(query);
    return result
}

const expensesMonthByType = async (date, isAdm, user, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, t.name, t.id FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    AND e.saleId IS NULL ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.expenseTypeId`

    const result = await executeSelect(query);
    return result
}

const productsSalesTotal = async (isAdm, user) => {
    const query = ` SELECT sp.productId id, p.name label, SUM(sp.amount) value
                    FROM saleProducts sp 
                    INNER JOIN products p ON p.id = sp.productId 
                    ${isAdm ? '' : `WHERE sp.companyId = '${user.companyId}'`}
                    GROUP BY sp.productId
                    ORDER BY SUM(sp.amount) DESC LIMIT 100`;
    return await executeSelect(query);
}


"use strict";

const { startOfMonth, endOfMonth } = require('date-fns');
const { executeSelect } = require("../services/ExecuteQueryService");

const andCompany = (alias, companyId) =>
    companyId ? `AND ${alias}.companyId IN ('${companyId}')` : ''

const where = (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId) => {
    if (expenseTypeId == 1)
        expenseTypeName = 'COMPRAS'

    const queryDate = paymentDateStart && paymentDateEnd ? `AND e.paymentDate BETWEEN '${paymentDateStart}' AND '${paymentDateEnd}'` : '';
    const queryType = expenseTypeName ? `AND t.name LIKE '%${expenseTypeName}%'` : '';
    const queryCompany = isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId);

    const query = ` WHERE e.id > 0 ${queryDate} ${queryType} ${queryCompany} 
                    AND e.title LIKE '%${title}%' `
    return query;
}

const expensesByPeriod = async (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, e.paidOut FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    ${where(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId)}  
                    GROUP BY e.paidOut`
    const result = await executeSelect(query);
    return result;
}

const expensesMonthByType = async (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, t.name, t.id FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    ${where(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId)}
                    GROUP BY e.expenseTypeId`;
    const result = await executeSelect(query);
    return result;
}

const expensesMonthDash = async (date, isAdm, user, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, e.paidOut FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    AND e.saleId IS NULL ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.paidOut`

    const result = await executeSelect(query);
    return result
}

const expensesMonthByTypeDash = async (date, isAdm, user, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, t.name, t.id FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    AND e.saleId IS NULL ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.expenseTypeId`

    const result = await executeSelect(query);
    return result
}


const expensesMonthByTypeDre = async (date, isAdm, user, companyId) => {
    const dateString = startOfMonth(date).toISOString()
    const query = ` SELECT et.name, SUM(e.value) total,MONTH(e.paymentDate) month, YEAR(e.paymentDate) year, e.expenseTypeId 
                    FROM expenses e 
                    INNER JOIN expenseTypes et ON et.id = e.expenseTypeId
                    WHERE YEAR(e.paymentDate) = YEAR('${dateString}') 
                          ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}  
                    GROUP BY et.name, MONTH (e.paymentDate), YEAR(e.paymentDate), e.expenseTypeId  
                    ORDER BY YEAR(e.paymentDate) DESC, MONTH (e.paymentDate) DESC, et.name`
    //-- AND e.paidOut = true
    const result = await executeSelect(query);
    return result
}
module.exports = { expensesMonthDash, expensesMonthByTypeDash, expensesByPeriod, expensesMonthByType, expensesMonthByTypeDre }
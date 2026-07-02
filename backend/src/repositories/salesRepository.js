"use strict";

const { startOfMonth, endOfMonth, startOfYear } = require('date-fns');
const { executeSelect } = require("../services/ExecuteQueryService");
const { limitCurrentYear, andCompany } = require("./utils");

const salesMonthDashboard = async (date, isAdm, user, individualCommission, companyId, acc = false) => {
    const start = !acc ? startOfMonth(date).toISOString() : startOfYear(date).toISOString();
    const query = ` SELECT 
                        COUNT(s.id) count,                      
                        SUM(s.value) totalValueMonth, 
                        SUM(s.valueInput) totalValueInputMonth                     
                    FROM sales s                     
                    WHERE s.approved = true AND s.saleDate BETWEEN '${start}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? andCompany('s', companyId) : andCompany('s', user.companyId)}
                    ${individualCommission ? ` AND s.userId = ${user.userId}` : ''}`
    const [result] = await executeSelect(query);
    const [visits] = await visitsPaidOut(date, isAdm, user, companyId, acc);
    if (acc)
        return { ...result, ...visits };

    const [m2] = await productsM2(date, isAdm, user, companyId);
    const [satisfaction] = await salesSatisfaction(isAdm, user, companyId);
    const [applications] = await tanksApplied(date, isAdm, user, companyId);

    return { ...result, ...m2, ...visits, ...satisfaction, ...applications };
}

const salesDre = async (date, isAdm, user, companyId, approved = true) => {
    const dateString = startOfMonth(date).toISOString()

    const query = ` SELECT 	'FATURAMENTO_BRUTO' name, 
                            SUM(s.value) total, 
                            SUM(s.valueInput) totalCost, 
                            SUM(s.valuePerMeter) valuePerMeter, 
                            COUNT(s.id) count, 
                            MONTH(s.saleDate) month, YEAR(s.saleDate) year 
                    FROM sales s 
                    WHERE s.approved = ${approved} AND YEAR(s.saleDate) = YEAR('${dateString}') ${limitCurrentYear(date, 's.saleDate')}
                    ${isAdm ? andCompany('s', companyId) : andCompany('s', user.companyId)}
                    GROUP BY MONTH (s.saleDate), YEAR(s.saleDate)
                    ORDER BY YEAR(s.saleDate) DESC, MONTH (s.saleDate) DESC`

    const result = await executeSelect(query);
    return result
}

const m2Dre = async (date, isAdm, user, companyId) => {
    const dateString = startOfMonth(date).toISOString()
    const query = ` SELECT 	'M2' name, 
                            SUM(sp.amount) total, 
                            MONTH(s.saleDate) month, YEAR(s.saleDate) year
                    FROM saleProducts sp 
                    INNER JOIN sales s ON s.id = sp.saleId 
                    INNER JOIN products p ON p.id = sp.productId 
                    INNER JOIN companies c ON c.id = s.companyId 
                    WHERE s.approved = true AND 
                        YEAR(s.saleDate) = YEAR('${dateString}') AND 
                        p.categoryId = 4 ${limitCurrentYear(date, 's.saleDate')}
                    ${isAdm ? andCompany('s', companyId) : andCompany('s', user.companyId)}
                    GROUP BY MONTH (s.saleDate), YEAR(s.saleDate)
                    ORDER BY YEAR(s.saleDate) DESC, MONTH (s.saleDate) DESC`

    const result = await executeSelect(query);
    return result
}

const productsM2 = async (date, isAdm, user, companyId) => {
    const query = ` SELECT SUM(sp.amount) m2 
                    FROM saleProducts sp 
                    INNER JOIN sales s ON s.id = sp.saleId 
                    INNER JOIN products p ON p.id = sp.productId 
                    INNER JOIN companies c ON c.id = s.companyId 
                    WHERE s.approved = true AND 
                          s.saleDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' AND 
                          p.categoryId = 4 ${isAdm ? andCompany('s', companyId) : andCompany('s', user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const visitsPaidOut = async (date, isAdm, user, companyId, acc) => {
    const start = !acc ? startOfMonth(date).toISOString() : startOfYear(date).toISOString();
    const query = ` SELECT COUNT(s.id) countVisis, SUM(s.value) totalValueVisitsMonth FROM visits s 
                    WHERE s.paidOut = true AND 
                          s.paymentDate BETWEEN '${start}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? andCompany('s', companyId) : andCompany('s', user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const visitsPaidOutDre = async (date, isAdm, user, companyId) => {
    const dateString = startOfMonth(date).toISOString()
    const query = ` SELECT 'FATURAMENTO_BRUTO' name, 
                            SUM(v.value) total, 
                            SUM(v.km) km, 
                            COUNT(v.id) count, 
                            MONTH(v.paymentDate) month, YEAR(v.paymentDate) year FROM visits v
                    WHERE v.paidOut = true AND YEAR(v.paymentDate) = YEAR('${dateString}') ${limitCurrentYear(date, 'v.paymentDate')}
                    ${isAdm ? andCompany('v', companyId) : andCompany('v', user.companyId)}
                    GROUP BY MONTH (v.paymentDate), YEAR(v.paymentDate)
                    ORDER BY YEAR(v.paymentDate) DESC, MONTH (v.paymentDate) DESC`

    const result = await executeSelect(query);
    return result
}

const salesSatisfaction = async (isAdm, user, companyId) => {
    const query = ` SELECT SUM(s.satisfaction) satisfactionValue, COUNT(s.id) satisfactionCount
                    FROM sales s WHERE s.satisfactionSurveyDate IS NOT NULL
                    ${isAdm ? andCompany('s', companyId) : andCompany('s', user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const applicationDre = async (date, isAdm, user, companyId) => {
    const dateString = startOfMonth(date).toISOString()
    const query = ` SELECT 	'TANQUES' name, 
                            SUM(a.amount) total, 
                            MONTH(a.date) month, YEAR(a.date) year 
                    FROM applications a 
                    WHERE YEAR(a.date) = YEAR('${dateString}')  ${limitCurrentYear(date, 'a.date')}
                    ${isAdm ? andCompany('a', companyId) : andCompany('a', user.companyId)}
                    GROUP BY MONTH (a.date), YEAR(a.date)
                    ORDER BY YEAR(a.date) DESC, MONTH (a.date) DESC`

    const result = await executeSelect(query);
    return result
}

const tanksApplied = async (date, isAdm, user, companyId) => {
    const query = ` SELECT 	SUM(a.amount) tanksApplied                           
                    FROM applications a 
                    WHERE a.date BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? andCompany('a', companyId) : andCompany('a', user.companyId)}`
    const result = await executeSelect(query);
    return result
}

const salesMonthExpenseCommission = async (date) => {
    const query = ` SELECT 
                        u.id,
                        u.name,
                        u.email,
                        u.commissionMonth,
                        c.name AS companyName,
                        c.individualCommission,
                        s.companyId,
                        COUNT(s.id) count,
                        COUNT(DISTINCT s.userId) users,                                                   
                        SUM(s.value) totalValueMonth, 
                        SUM(s.value * (s.commission / 100)) totalValueCommissionMonth     
                    FROM sales s 
                    INNER JOIN users u ON u.id = s.userId 
                    INNER JOIN companies c ON c.id = s.companyId
                    WHERE s.approved = true AND c.active = true AND 
                          s.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    GROUP BY s.userId, s.companyId;`
    const result = await executeSelect(query);
    return result
}

module.exports = { salesMonthExpenseCommission, salesMonthDashboard, visitsPaidOutDre, salesDre, m2Dre, applicationDre }
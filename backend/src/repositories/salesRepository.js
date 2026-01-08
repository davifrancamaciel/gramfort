"use strict";

const { startOfMonth, endOfMonth } = require('date-fns');
const { executeSelect } = require("../services/ExecuteQueryService");

const salesMonthDashboard = async (date, isAdm, user, individualCommission, companyId) => {
    const query = ` SELECT 
                        COUNT(s.id) count, 
                        COUNT(DISTINCT s.userId) users,                        
                        SUM(s.value) totalValueMonth, 
                        SUM(s.valueInput) totalValueInputMonth, 
                        SUM(s.value * (s.commission / 100)) totalValueCommissionMonth
                    FROM sales s 
                    WHERE s.approved = true AND s.saleDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? andCompany(companyId) : andCompany(user.companyId)}
                    ${individualCommission ? ` AND s.userId = ${user.userId}` : ''}`
    const [result] = await executeSelect(query);
    const [m2] = await productsM2(date, isAdm, user, companyId);
    const [visits] = await visitsPaidOut(date, isAdm, user, companyId);
    const [visitsInSales] = await totalValueVisitsInSalesMonth(date, isAdm, user, companyId);
    return { ...result, ...m2, ...visits, ...visitsInSales }
}

const productsM2 = async (date, isAdm, user, companyId) => {
    const query = ` SELECT SUM(sp.amount) m2 FROM saleProducts sp 
                    INNER JOIN sales s ON s.id = sp.saleId 
                    INNER JOIN products p ON p.id = sp.productId 
                    WHERE s.approved = true AND 
                          s.saleDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' AND 
                          p.categoryId = 4 ${isAdm ? andCompany(companyId) : andCompany(user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const visitsPaidOut = async (date, isAdm, user, companyId) => {
    const query = ` SELECT COUNT(s.id) countVisis, SUM(s.value) totalValueVisitsMonth FROM visits s 
                    WHERE s.paidOut = true AND 
                          s.paymentDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? andCompany(companyId) : andCompany(user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const visitsPaidOutDre = async (date, isAdm, user, companyId) => {
    const dateString = startOfMonth(date).toISOString()
    const query = ` SELECT 'VISITAS' name, SUM(v.value) total, MONTH(v.paymentDate) month, YEAR(v.paymentDate) year FROM visits v
                    WHERE v.paidOut = true AND YEAR(v.paymentDate) = YEAR('${dateString}')
                    ${isAdm ? andCompany(companyId, 'v') : andCompany(user.companyId, 'v')}
                    GROUP BY MONTH (v.paymentDate), YEAR(v.paymentDate)
                    ORDER BY YEAR(v.paymentDate) DESC, MONTH (v.paymentDate) DESC`

    const result = await executeSelect(query);
    return result
}

const totalValueVisitsInSalesMonth = async (date, isAdm, user, companyId) => {
    const start = startOfMonth(date).toISOString();
    const end = endOfMonth(date).toISOString();
    const query = ` SELECT SUM(v.value) totalValueVisitsInSalesMonth FROM visits v 
                    INNER JOIN sales s ON s.visitId = v.id 
                    WHERE v.paidOut = true AND 
                          s.approved = true AND 
                          v.paymentDate BETWEEN '${start}' AND '${end}' AND 
                          s.saleDate    BETWEEN '${start}' AND '${end}' 
                    ${isAdm ? andCompany(companyId) : andCompany(user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const andCompany = (companyId, alias = 's') =>
    companyId ? `AND ${alias}.companyId = '${companyId}'` : ''


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

module.exports = { salesMonthExpenseCommission, salesMonthDashboard, visitsPaidOutDre }
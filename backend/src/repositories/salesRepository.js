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
                    WHERE s.saleDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? andCompany(companyId) : andCompany(user.companyId)}
                    ${individualCommission ? ` AND s.userId = ${user.userId}` : ''}`
    const [result] = await executeSelect(query);
    const [m2] = await productsM2(date, isAdm, user, companyId);
    return { ...result, ...m2 }
}

const productsM2 = async (date, isAdm, user, companyId) => {
    const query = ` SELECT SUM(sp.amount) m2 FROM saleProducts sp 
                    INNER JOIN sales s ON s.id = sp.saleId 
                    INNER JOIN products p ON p.id = sp.productId 
                    WHERE s.saleDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' AND 
                          p.categoryId = 4 ${isAdm ? andCompany(companyId) : andCompany(user.companyId)}`

    const result = await executeSelect(query);
    return result
}

const andCompany = (companyId) =>
    companyId ? `AND s.companyId = '${companyId}'` : ''


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
                    WHERE s.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' AND c.active = true 
                    GROUP BY s.userId, s.companyId;`
    const result = await executeSelect(query);
    return result
}

module.exports = { salesMonthExpenseCommission, salesMonthDashboard }
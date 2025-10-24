"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../../database');
const Expense = require('../../models/Expense')(db.sequelize, db.Sequelize);
const ExpenseType = require('../../models/ExpenseType')(db.sequelize, db.Sequelize);
const Vehicle = require('../../models/Vehicle')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { executeSelect } = require("../../services/ExecuteQueryService");

const RESOURCE_NAME = 'Despesa'

module.exports.list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereExpenseTypes = {};
        const whereStatementUsers = {};
        const whereStatementSuppiers = {};
        const whereStatementVehicles = {};


        const {
            id, expenseTypeName, title, description, paidOut, expenseTypeId, vehicleModel, userName,
            paymentDateStart, paymentDateEnd, createdAtStart, createdAtEnd, myCommision, companyId
        } = event.queryStringParameters

        if (companyId) whereStatement.companyId = companyId;

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (id) whereStatement.id = id;

        if (expenseTypeName)
            whereExpenseTypes.name = { [Op.like]: `%${expenseTypeName}%` }

        if (paidOut !== undefined && paidOut !== '')
            whereStatement.paidOut = paidOut === 'true';
        if (description)
            whereStatement.description = { [Op.like]: `%${description}%` }
        if (userName && !expenseTypeId)
            whereStatementUsers.name = { [Op.like]: `%${userName}%` }
        if (userName && expenseTypeId)
            whereStatementSuppiers.name = { [Op.like]: `%${userName}%` }

        if (vehicleModel)
            whereStatementVehicles.model = { [Op.like]: `%${vehicleModel}%` }

        if (title)
            whereStatement.title = { [Op.like]: `%${title}%` }

        if (createdAtStart)
            whereStatement.createdAt = {
                [Op.gte]: startOfDay(parseISO(createdAtStart)),
            };

        if (createdAtEnd)
            whereStatement.createdAt = {
                [Op.lte]: endOfDay(parseISO(createdAtEnd)),
            };
        if (createdAtStart && createdAtEnd)
            whereStatement.createdAt = {
                [Op.between]: [
                    startOfDay(parseISO(createdAtStart)),
                    endOfDay(parseISO(createdAtEnd)),
                ],
            };

        if (paymentDateStart)
            whereStatement.paymentDate = {
                [Op.gte]: startOfDay(parseISO(paymentDateStart)),
            };

        if (paymentDateEnd)
            whereStatement.paymentDate = {
                [Op.lte]: endOfDay(parseISO(paymentDateEnd)),
            };
        if (paymentDateStart && paymentDateEnd)
            whereStatement.paymentDate = {
                [Op.between]: [
                    startOfDay(parseISO(paymentDateStart)),
                    endOfDay(parseISO(paymentDateEnd)),
                ],
            };
        if (myCommision)
            whereStatement.userId = user.userId
        if (expenseTypeId)
            whereStatement.expenseTypeId = expenseTypeId
        else
            whereStatement.expenseTypeId = { [Op.gt]: 1, }

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId;

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            whereStatement.userId = user.userId;

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Expense.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['expenseType', 'name', 'ASC'], ['paymentDate', 'ASC']],
            include: [
                { model: Company, as: 'company', attributes: ['name'] },
                {
                    model: ExpenseType,
                    as: 'expenseType',
                    attributes: ['name'],
                    where: whereExpenseTypes
                },
                {
                    model: User, as: 'user',
                    attributes: ['name'],
                    where: whereStatementUsers,
                    required: whereStatementUsers.name ? true : false
                },
                {
                    model: Vehicle, as: 'vehicle',
                    attributes: ['model'],
                    where: whereStatementVehicles,
                    required: whereStatementVehicles.model ? true : false
                },
                {
                    model: User, as: 'supplier',
                    attributes: ['name'],
                    where: whereStatementSuppiers,
                    required: whereStatementSuppiers.name ? true : false
                },
            ]
        })
        let data;
        if (Number(pageNumber) == 1) {
            const isAdm = checkRouleProfileAccess(user.groups, roules.administrator);
            data = await expensesByPeriod(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId);
        }
        return handlerResponse(200, { count, rows, data })

    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const expensesByPeriod = async (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeName, expenseTypeId, companyId) => {
    if (expenseTypeId == 1)
        expenseTypeName = 'COMPRAS'

    const queryDate = paymentDateStart && paymentDateEnd ? `AND e.paymentDate BETWEEN '${paymentDateStart}' AND '${paymentDateEnd}'` : '';
    const queryType = expenseTypeName ? `AND t.name LIKE '%${expenseTypeName}%'` : '';
    const queryCompany = companyId ? `AND e.companyId = '${isAdm ? companyId : user.companyId}'` : '';

    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, e.paidOut FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.id > 0 ${queryDate} ${queryType} ${queryCompany} 
                    AND e.title LIKE '%${title}%'   
                    GROUP BY e.paidOut`
    return await executeSelect(query);
}

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Expense.findByPk(pathParameters.id, {
            include: [
                {
                    model: ExpenseType,
                    as: 'expenseType',
                    attributes: ['name'],
                }]
        })
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && result.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        return handlerResponse(200, result)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body
        objOnSave.dividedIn = Number(body.dividedIn || 1);

        if (!checkRouleProfileAccess(user.groups, roules.administrator) || !objOnSave.companyId)
            objOnSave.companyId = user.companyId

        if (!objOnSave.paymentDate)
            objOnSave.paymentDate = new Date()

        if (objOnSave.dividedIn > 1) {
            // objOnSave.title = `1ª parcela de ${objOnSave.dividedIn} ${objOnSave.title ? objOnSave.title : ''}`
            objOnSave.value = Number(body.value) / objOnSave.dividedIn
        }

        const result = await Expense.create(objOnSave);

        if (objOnSave.dividedIn > 1 && objOnSave.dividedIn <= 24) {
            let espensesList = []
            for (let i = 1; i < objOnSave.dividedIn; i++) {
                const obtOnSavePortion = {
                    ...objOnSave,
                    // title: objOnSave.title.replace('1ª', `${i + 1}ª`),
                    expenseDadId: result.id,
                    paymentDate: addMonths(parseISO(objOnSave.paymentDate), i)
                }
                espensesList.push(obtOnSavePortion)
            }
            await Expense.bulkCreate(espensesList);
        }

        return handlerResponse(201, result, `${getTitle(objOnSave.expenseTypeId)} criada com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Expense.findByPk(Number(id))
        let message = ''

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        return handlerResponse(200, result, `${getTitle(item.expenseTypeId)} alterada com sucesso. ${message}`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

module.exports.delete = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Expense.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Expense.destroy({ where: { id } });
        return handlerResponse(200, {}, `${getTitle(item.expenseTypeId)} código (${id}) removida com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

const getTitle = (type, isPlural = false) => {
    switch (type) {
        case 1:
            return `Compra${isPlural ? 's' : ''}`;

        default:
            return `Despesa${isPlural ? 's' : ''}`;
    }
};
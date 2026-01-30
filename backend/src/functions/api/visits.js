"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../../database');
const Visit = require('../../models/Visit')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const imageService = require("../../services/ImageService");

const RESOURCE_NAME = 'Visita'

module.exports.list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereStatementUsers = {};
        const whereStatementClients = {};

        if (event.queryStringParameters) {
            const {
                id, userName, paidOut, clientName, dateStart, dateEnd, companyId,
                paymentDateStart, paymentDateEnd, createdAtStart, createdAtEnd,
            } = event.queryStringParameters

            if (companyId) whereStatement.companyId = companyId;
            if (id) whereStatement.id = id;

            if (userName)
                whereStatementUsers.name = { [Op.like]: `%${userName}%` }
            if (clientName)
                whereStatementClients.name = { [Op.like]: `%${clientName}%` }

            if (paidOut !== undefined && paidOut !== '')
                whereStatement.paidOut = paidOut === 'true';

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

            if (dateStart)
                whereStatement.date = {
                    [Op.gte]: startOfDay(parseISO(dateStart)),
                };

            if (dateEnd)
                whereStatement.date = {
                    [Op.lte]: endOfDay(parseISO(dateEnd)),
                };
            if (dateStart && dateEnd)
                whereStatement.date = {
                    [Op.between]: [
                        startOfDay(parseISO(dateStart)),
                        endOfDay(parseISO(dateEnd)),
                    ],
                };
        }

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId;

        if (!checkRouleProfileAccess(user.groups, roules.visits))
            whereStatement.userId = user.userId;

        const { pageSize, pageNumber, field, order } = event.queryStringParameters
        let arrayOrder = [[field ? field : 'id', order ? order : 'desc']];
        const { count, rows } = await Visit.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: arrayOrder,
            include: [
                {
                    model: Company, as: 'company', attributes: ['name', 'pixKey', 'image', 'fantasyName', 'cnpj', 'address', 'city', 'state', 'currency', 'textVisit']
                },
                {
                    model: User, as: 'user', attributes: ['name'], where: whereStatementUsers
                },
                {
                    model: User, as: 'client', attributes: ['name'], where: whereStatementClients
                }
            ]
        })

        return handlerResponse(200, { count, rows })

    } catch (err) {
        return await handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.visits))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Visit.findByPk(pathParameters.id, {
            include: [
                {
                    model: User, as: 'user', attributes: ['name']
                },
                {
                    model: User, as: 'client', attributes: ['name']
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

        if (!checkRouleProfileAccess(user.groups, roules.visits))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        if (!objOnSave.clientId)
            return handlerResponse(400, {}, 'Informe o cliente')
        if (!objOnSave.userId)
            objOnSave.userId = user.userId
        if (!objOnSave.companyId)
            objOnSave.companyId = user.companyId


        const result = await Visit.create(objOnSave);

        await imageService.add('visits', result.dataValues, body.fileList);

        return handlerResponse(201, result, `${RESOURCE_NAME} criada com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.visits))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Visit.findByPk(Number(id))
        let message = ''

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        await imageService.add('visits', result.dataValues, body.fileList);

        return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso. ${message}`)
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

        if (!checkRouleProfileAccess(user.groups, roules.visits))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Visit.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Visit.destroy({ where: { id } });

        await imageService.remove(item.image);

        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removida com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.listAll = async (event) => {
    let clientId
    if (event && event.queryStringParameters) {
        const { queryStringParameters } = event
        clientId = queryStringParameters.clientId
    }
    try {
        const whereStatement = {};
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, `Usuário não encontrado`)
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId
        if (clientId)
            whereStatement.clientId = clientId;

        const resp = await Visit.findAll({
            where: whereStatement,
            order: [['date', 'DESC']],
        })

        return handlerResponse(200, resp)
    } catch (err) {
        return await handlerErrResponse(err, queryStringParameters)
    }
}
"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const db = require('../../database');
const Application = require('../../models/Application')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Sale = require('../../models/Sale')(db.sequelize, db.Sequelize);
const Product = require('../../models/Product')(db.sequelize, db.Sequelize);
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getCompaniesIds } = require("../../repositories/companiesRepository");
const imageService = require("../../services/ImageService");

const RESOURCE_NAME = 'Aplicação'

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
            const { id, userName, saleId, clientName, dateStart, dateEnd, companyId } = event.queryStringParameters

            if (checkRouleProfileAccess(user.groups, roules.administrator)) {
                const ids = await getCompaniesIds(user);
                whereStatement.companyId = { [Op.in]: ids };
            }

            if (companyId) whereStatement.companyId = companyId;
            if (saleId) whereStatement.saleId = Number(saleId);
            if (id) whereStatement.id = id;

            if (userName)
                whereStatementUsers.name = { [Op.like]: `%${userName}%` }
            if (clientName)
                whereStatementClients.name = { [Op.like]: `%${clientName}%` }

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

        if (!checkRouleProfileAccess(user.groups, roules.applications))
            whereStatement.userId = user.userId;

        const { pageSize, pageNumber, field, order } = event.queryStringParameters
        let arrayOrder = [[field ? field : 'id', order ? order : 'desc']];
        const { count, rows } = await Application.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: arrayOrder,
            include: [
                { model: Company, as: 'company', attributes: ['name', 'image', 'currency'] },
                { model: User, as: 'user', attributes: ['name'], where: whereStatementUsers },
                { model: User, as: 'client', attributes: ['name'], where: whereStatementClients },
                { model: Sale, as: 'sale' },
                { model: Product, as: 'product' },
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
        if (!checkRouleProfileAccess(user.groups, roules.applications))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Application.findByPk(pathParameters.id, {
            include: [
                { model: User, as: 'user', attributes: ['name'] },
                { model: User, as: 'client', attributes: ['name'] },
                { model: Sale, as: 'sale' },
                { model: Product, as: 'product' },]
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

        if (!checkRouleProfileAccess(user.groups, roules.applications))
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

        const result = await Application.create(objOnSave);
        await addImage(result, body);

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

        if (!checkRouleProfileAccess(user.groups, roules.applications))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Application.findByPk(Number(id))
        let message = ''

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        await addImage(result, body);

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

        if (!checkRouleProfileAccess(user.groups, roules.applications))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Application.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Application.destroy({ where: { id } });
        await imageService.remove(item.image1);
        await imageService.remove(item.image2);
        await imageService.remove(item.image3);
        await imageService.remove(item.image4);

        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removida com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

const addImage = async (result, body) => {
    if (body.fileList)
        for (let i = 0; i < body.fileList.length; i++) {
            const element = body.fileList[i];
            await imageService.add('applications', result.dataValues, [element], `image${i + 1}`);
        }
}
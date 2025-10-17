"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../../database');
const Vehicle = require('../../models/Vehicle')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const imageService = require("../../services/ImageService");

const RESOURCE_NAME = 'Veiculo'

module.exports.list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};


        if (event.queryStringParameters) {
            const {
                id, year, dateStart, dateEnd, model, category,
                createdAtStart, createdAtEnd,
            } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (year)
                whereStatement.year = year;

            if (model)
                whereStatement.model = { [Op.like]: `%${model}%` }

            if (category)
                whereStatement.category = { [Op.like]: `%${category}%` }

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
        }

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId;



        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Vehicle.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['id', 'DESC']],
            include: [
                {
                    model: Company, as: 'company', attributes: ['name']
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
        if (!checkRouleProfileAccess(user.groups, roules.vehicles))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Vehicle.findByPk(pathParameters.id)
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

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

        if (!checkRouleProfileAccess(user.groups, roules.Vehicles))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body

        if (!checkRouleProfileAccess(user.groups, roules.administrator) || !objOnSave.companyId)
            objOnSave.companyId = user.companyId

        const result = await Vehicle.create(objOnSave);

        await imageService.add('vehicles', result.dataValues, body.fileList);

        return handlerResponse(201, result, `${RESOURCE_NAME} criado com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.vehicles))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Vehicle.findByPk(Number(id))
        let message = ''

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        await imageService.add('vehicles', result.dataValues, body.fileList);

        return handlerResponse(200, result, `${RESOURCE_NAME} alterado com sucesso. ${message}`)
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

        if (!checkRouleProfileAccess(user.groups, roules.vehicles))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Vehicle.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Vehicle.destroy({ where: { id } });

        await imageService.remove(item.image);

        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.listAll = async (event) => {
    const { queryStringParameters } = event
    try {

        const whereStatement = {};
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, `Usuário não encontrado`)
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId


        const resp = await Vehicle.findAll({
            where: whereStatement,
            attributes: ['id', 'model', 'year'],
            order: [['model', 'ASC']],
        })

        const respFormated = resp.map(item => ({
            value: item.id,
            label: `${item.model} ${item.year}`,
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err, queryStringParameters)
    }
}

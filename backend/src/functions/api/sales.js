"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');

const Sale = require('../../models/Sale')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const Product = require('../../models/Product')(db.sequelize, db.Sequelize);
const SaleProduct = require('../../models/SaleProduct')(db.sequelize, db.Sequelize);
const Visit = require('../../models/Visit')(db.sequelize, db.Sequelize);

const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect, executeDelete, executeUpdate } = require("../../services/ExecuteQueryService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const imageService = require("../../services/ImageService");

const RESOURCE_NAME = 'Venda'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereStatementUser = {};
        const whereStatementClient = {};

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const isAdm = checkRouleProfileAccess(user.groups, roules.administrator)
        if (event.queryStringParameters) {
            const { id, product, userName, clientName, valueMin, valueMax, createdAtStart, createdAtEnd, note, companyId } = event.queryStringParameters

            if (companyId) whereStatement.companyId = companyId;

            if (!isAdm)
                whereStatement.companyId = user.companyId

            if (id) whereStatement.id = id;

            if (product)
                whereStatement.products = { [Op.like]: `%${product}%` }
            if (userName)
                whereStatementUser.name = { [Op.like]: `%${userName}%` }
            if (clientName)
                whereStatementClient.name = { [Op.like]: `%${clientName}%` }
            if (note)
                whereStatement.note = { [Op.like]: `%${note}%` }

            if (valueMin)
                whereStatement.value = {
                    [Op.gte]: Number(valueMin),
                };
            if (valueMax)
                whereStatement.value = {
                    [Op.lte]: Number(valueMax),
                };
            if (valueMin && valueMax)
                whereStatement.value = {
                    [Op.between]: [
                        Number(valueMin),
                        Number(valueMax),
                    ],
                };
            if (createdAtStart)
                whereStatement.saleDate = {
                    [Op.gte]: startOfDay(parseISO(createdAtStart)),
                };

            if (createdAtEnd)
                whereStatement.saleDate = {
                    [Op.lte]: endOfDay(parseISO(createdAtEnd)),
                };
            if (createdAtStart && createdAtEnd)
                whereStatement.saleDate = {
                    [Op.between]: [
                        startOfDay(parseISO(createdAtStart)),
                        endOfDay(parseISO(createdAtEnd)),
                    ],
                };
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        let { count, rows } = await Sale.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: [['saleDate', 'ASC']],
            include: [{
                model: User, as: 'user', attributes: ['name'], where: whereStatementUser
            }, {
                model: User, as: 'client',
                attributes: ['name', 'phone'],
                where: whereStatementClient,
                required: whereStatementClient.name ? true : false
            }, {
                model: Company, as: 'company', attributes: ['name', 'image', 'individualCommission'],
            }, {
                model: Visit, as: 'visit', attributes: ['date', 'value'],
            }]
        })
        const salesIds = rows.map(x => x.id)
        const salesProductsList = await SaleProduct.findAll({
            where: { saleId: { [Op.in]: salesIds } },
            attributes: ['amount', 'valueAmount', 'value', 'productId', 'saleId'],
            include: [{ model: Product, as: 'product', attributes: ['name', 'price', 'size', 'isInput'] }],
        })
        const newRows = rows.map(s => {
            const productsSales = salesProductsList.filter(sp => sp.saleId === s.id)
            return { ...s.dataValues, productsSales: productsSales.map(x => x.dataValues) }
        });

        return handlerResponse(200, { count, rows: newRows })

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
        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await listByIdResult(pathParameters.id);
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && result.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        return handlerResponse(200, result)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.listByIdPublic = async (event) => {
    const { pathParameters, queryStringParameters } = event;
    const result = await listByIdResult(pathParameters.id);
    if (!result)
        return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

    const { hash } = queryStringParameters;
    if (hash !== result.hash)
        return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada hash ${hash} informado não confere`)
    return handlerResponse(200, result)
}

const listByIdResult = async (id) => {
    const result = await Sale.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name'],
            },
            {
                model: User,
                as: 'client',
                attributes: ['name', 'cpfCnpj', 'email', 'phone'],
            },
            {
                model: Visit,
                as: 'visit',
                attributes: ['km', 'state', 'city', 'address', 'date', 'value', 'note'],
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                }]
            },
            {
                model: Company,
                as: 'company',
                attributes: ['name', 'image'],
            },
            {
                model: SaleProduct,
                as: 'productsSales',
                attributes: ['id', 'amount', 'valueAmount', 'value', 'productId', 'description'],
                include: [{ model: Product, as: 'product', attributes: ['name', 'price', 'isInput', 'description', 'categoryId'] }]
            },]
    })

    return result;
}

module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const objOnSave = {
            ...body,
            userId: user.userId
        }

        if (!objOnSave.companyId)
            objOnSave.companyId = user.companyId

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        if (checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && body.userId)
            objOnSave.userId = body.userId;

        if (!objOnSave.saletDate)
            objOnSave.saletDate = new Date();

        const result = await createSale(objOnSave, body);

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

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Sale.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('VENDA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        const value = body.productsSales.reduce(function (acc, p) { return acc + Number(p.valueAmount); }, 0);
        const valueInput = body.inputsSales.reduce(function (acc, p) { return acc + Number(p.valueAmount); }, 0);
        const objOnSave = {
            ...body,
            value,
            valueInput,
            userId: user.userId,
        }
        if (checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && body.userId)
            objOnSave.userId = body.userId;

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        if (!checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && item.userId !== user.userId)
            return handlerResponse(403, {}, 'Usuário não tem permissão alterar esta venda');

        if (!checkRouleProfileAccess(user.groups, roules.saleUserIdChange))
            objOnSave.userId = body.userId;

        objOnSave.commission = await getCommission(objOnSave.userId);
        const result = await item.update(objOnSave);

        await createProductsSales(body, result, true);

        console.log('PARA ', result.dataValues)

        return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

module.exports.updatePublic = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const { id, hash } = body
        const item = await Sale.findByPk(Number(id));

        if (!item)
            return handlerResponse(400, {}, `Proposta não encontrada`)
        if (item.hash !== hash)
            return handlerResponse(400, {}, `Proposta não encontrada`)

        const objOnSave = {
            approved: true
        }

        // const result = await item.update(objOnSave);

        return handlerResponse(200, {}, `Proposta aprovada com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Sale.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão remover este cadastro');

        if (!checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && item.userId !== user.userId)
            return handlerResponse(403, {}, 'Usuário não tem permissão remover este cadastro');

        await Sale.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

const createProductsSales = async (body, result, isDelete) => {
    const { companyId, id } = result
    console.log('isDelete', isDelete)
    if (isDelete)
        await executeDelete(`DELETE FROM saleProducts WHERE saleId = ${id} AND companyId = '${companyId}'`);

    await createSalesProduct(companyId, id, body.inputsSales);

    const list = await createSalesProduct(companyId, id, body.productsSales);

    if (!isDelete) {
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const query = ` UPDATE products 
                                SET inventoryCount = inventoryCount - ${element.amount}, updatedAt = NOW() 
                            WHERE companyId = '${companyId}' AND id =  ${element.productId}`;
            await executeUpdate(query);
        }
    }
    
    await imageService.add('sales', result.dataValues, body.fileList1, 'image1');
    await imageService.add('sales', result.dataValues, body.fileList2, 'image2');
    await imageService.add('sales', result.dataValues, body.fileList3, 'image3');
    await imageService.add('sales', result.dataValues, body.fileList4, 'image4');
    await imageService.add('sales', result.dataValues, body.fileList5, 'image5');
    await imageService.add('sales', result.dataValues, body.fileList6, 'image6');
}

const createSalesProduct = async (companyId, saleId, productsSales) => {
    const list = productsSales.map(ps => ({
        companyId,
        saleId,
        productId: ps.productId,
        value: ps.value,
        valueAmount: ps.valueAmount,
        amount: ps.amount,
        description: ps.description,
    }))

    await SaleProduct.bulkCreate(list);

    return list;
}

const getCommission = async (userId) => {
    const [queryResult] = await executeSelect(`SELECT commissionMonth FROM users WHERE id = ${userId};`);
    return queryResult.commissionMonth;
}

const createSale = async (objOnSave, body) => {

    objOnSave.commission = await getCommission(objOnSave.userId);
    objOnSave.value = body.productsSales.reduce(function (acc, p) { return acc + Number(p.valueAmount); }, 0);
    objOnSave.valueInput = body.inputsSales.reduce(function (acc, p) { return acc + Number(p.valueAmount); }, 0);

    const result = await Sale.create(objOnSave);

    await createProductsSales(body, result);

    return result;
}
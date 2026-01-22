"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const uuid = require('uuid');

const Sale = require('../../models/Sale')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const Product = require('../../models/Product')(db.sequelize, db.Sequelize);
const SaleProduct = require('../../models/SaleProduct')(db.sequelize, db.Sequelize);
const Visit = require('../../models/Visit')(db.sequelize, db.Sequelize);

const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect, executeDelete, executeUpdate } = require("../../services/ExecuteQueryService");
const { roules, path, productCategoriesEnum } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const imageService = require("../../services/ImageService");
const { sum } = require('../../utils');

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
            const { id, product, userName, clientName, valueMin, valueMax, createdAtStart, createdAtEnd, note, companyId, path } = event.queryStringParameters

            if (companyId) whereStatement.companyId = companyId;

            if (!isAdm)
                whereStatement.companyId = user.companyId

            if (id) whereStatement.id = id;

            if (path && path == 'sales')
                whereStatement.approved = true;

            if (path && path == 'contracts')
                whereStatement.hash = { [Op.ne]: null, }; // diferente

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

        const { pageSize, pageNumber, field, order } = event.queryStringParameters
        let arrayOrder = [[field ? field : 'saleDate', order ? order : 'asc']];

        let { count, rows } = await Sale.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: arrayOrder,
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
                model: Visit, as: 'visit', attributes: ['km', 'state', 'city', 'address', 'date', 'value', 'note'],
            }]
        })
        const salesIds = rows.map(x => x.id)
        const salesProductsList = await SaleProduct.findAll({
            where: { saleId: { [Op.in]: salesIds } },
            attributes: ['amount', 'valueAmount', 'value', 'productId', 'saleId'],
            include: [{ model: Product, as: 'product', attributes: ['name', 'price', 'size', 'categoryId'] }],
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
                as: 'company'                
            },
            {
                model: SaleProduct,
                as: 'productsSales',
                attributes: ['id', 'amount', 'valueAmount', 'value', 'productId', 'description'],
                include: [{ model: Product, as: 'product', attributes: ['name', 'price', 'description', 'categoryId'] }]
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

        if (body.action)
            return updateSimple(item, body);

        const value = sum(body.productsSales, 'valueAmount');
        const valueInput = sum(body.costsSales, 'valueAmount');
        const valuePerMeter = calcValueMeter(body);
        const objOnSave = {
            ...body,
            value,
            valueInput: valueInput ? valueInput : 0,
            valuePerMeter,
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
        await addImage(result, body)
        console.log('PARA ', result.dataValues)

        await setSaleVisit(result);

        return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

const updateSimple = async (item, objOnSave) => {
    const result = await item.update(objOnSave);
    return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso`)
}

module.exports.updatePublic = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const { id, hash } = body
        const item = await Sale.findByPk(Number(id));

        if (!item)
            return handlerResponse(400, {}, `Contrato não encontrado`)
        if (item.hash !== hash)
            return handlerResponse(400, {}, `Contrato não encontrado`)

        const objOnSave = { approved: true }
        const result = await item.update(objOnSave);

        await setSaleVisit(result);

        return handlerResponse(200, result, `Contrato aprovado com sucesso`)
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

    await createSalesProduct(companyId, id, body.costsSales);

    const list = await createSalesProduct(companyId, id, body.productsSales);

    if (!isDelete) {
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element && element.productId && element.amount) {
                const query = ` UPDATE products 
                    SET inventoryCount = inventoryCount - ${element.amount}, updatedAt = NOW() 
                    WHERE companyId = '${companyId}' AND id =  ${element.productId}`;
                await executeUpdate(query);
            }
        }
    }

    await addImage(result, body)
}
const addImage = async (result, body) => {
    for (let i = 0; i < body.fileList.length; i++) {
        const element = body.fileList[i];
        await imageService.add('sales', result.dataValues, [element], `image${i + 1}`);
    }
}

const createSalesProduct = async (companyId, saleId, productsSales) => {
    const validProducts = productsSales.filter(p => p.productId)
    if (validProducts === null || !validProducts.length)
        return [];

    const list = validProducts.map(ps => ({
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
    objOnSave.value = sum(body.productsSales, 'valueAmount');
    objOnSave.valuePerMeter = calcValueMeter(body);

    const valueInput = sum(body.costsSales, 'valueAmount');
    objOnSave.valueInput = valueInput ? valueInput : 0

    if (body.path === path.contracts)
        objOnSave.hash = uuid.v4();
    if (body.path === path.sales)
        objOnSave.approved = true;

    const result = await Sale.create(objOnSave);

    await setSaleVisit(result);

    await createProductsSales(body, result);

    return result;
}

const setSaleVisit = async (result) => {
    if (result.visitId && result.approved) {
        const visit = await Visit.findByPk(result.visitId)
        await visit.update({ sale: true });
    }
    if (result.visitId && !result.approved) {
        const visit = await Visit.findByPk(result.visitId)
        await visit.update({ proposal: true, sale: false });
    }
}

const getTitle = (type, isPlural = false) => {
    switch (type) {
        case path.sales:
            return `Venda${isPlural ? 's' : ''}`;

        default:
            return `Contrato${isPlural ? 's' : ''}`;
    }
};

const calcValueMeter = (body) => {

    const produts = body.productsSales.filter(p => p.product.categoryId === productCategoriesEnum.SERVICO_M2);
    const value = sum(produts, 'valueAmount');
    const amount = sum(produts, 'amount');
    const valuePerMeter = value / amount;

    return valuePerMeter;
}
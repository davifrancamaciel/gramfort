'use strict';

const TABLE_NAME = 'expenseTypes';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, load(), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};

function load() {
  const list = [];
  for (let i = 0; i < data_array.length; i++) {
    list.push({
      name: data_array[i],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return list;
}

const data_array = [
  // 'COMPRAS',  
  // 'RETIRADAS',
  // 'COMISSÕES',
  // 'DESPESAS FIXAS',
  // 'PAGAMENTOS',
  // 'IMPOSTOS',
  // 'SEGUROS ',
  // 'INVESTIMENTO ',
  // 'MARKETING',
  // 'MATERIAL PUBLICITÁRIO',
  // 'COMBUSTIVEL',
  // 'PEDAGIO',
  // 'ALIMENTAÇÃO',
  // 'MANUTENÇÕES',
  // 'EXTRAS',
  // 'EQUIPAMENTO E FERRAMENTAS',
  // 'INSUMOS'
];


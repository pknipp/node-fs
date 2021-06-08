'use strict';

const bcrypt = require('bcryptjs');
const createPassword = () => bcrypt.hashSync('password');
const r = o => ({...o, createdAt: new Date(), updatedAt: new Date()});

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('Users',
    // ['demo@aol.com', 'jdoe@aol.com'].map(async email => {
    //   return {email, hashedPassword: await bcrypt.hash('password', 10), createdAt: new Date(), updatedAt: new Date()};
    // })),
    // ['demo@aol.com', 'jdoe@aol.com'].reduce(async (userArray, email) => {
    //   return [...userArray, r({email, hashedPassword: await bcrypt.hash('password', 10)})];
    // }, []))
    [
      r({email:'demo@aol.com',hashedPassword:await bcrypt.hash('password',10)}),
      r({email: 'jdoe@aol.com', hashedPassword:await bcrypt.hash('password', 10)})
    ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users')
};

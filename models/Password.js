const Sequelize = require('sequelize');
const seqelize = require("../util/database");

const Password = seqelize.define('password', {

    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE

})


module.exports= Password;
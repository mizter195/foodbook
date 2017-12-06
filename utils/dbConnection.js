const Sequelize = require('sequelize');
const config = require('../utils/config');
const dbConfig = config.configDb;

exports.Sequelize = Sequelize;
exports.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    operatorsAliases: false,
    define: {
        timestamps: true
    },
    host: dbConfig.host,
	port: dbConfig.port,
    dialect: dbConfig.dialect/*'mssql'|'sqlite'|'postgres'|'mssql'*/,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// exports.connect = function () {
//     console.log(dbConfig);
//     sequelize.authenticate().then(function (err) {
//         console.log('sequelize Connection has been established successfully.');
//     }).catch(function (err) {
//         console.log('err');
//     });
//     db.sequelize = sequelize;
//     db.Sequelize = Sequelize;
//     return db;
// };


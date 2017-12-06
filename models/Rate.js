exports.sequelize = function (sequelize, DataTypes) {
    return sequelize.define('rates', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNul: false
        },
        review_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNul: false
        }
    })
};
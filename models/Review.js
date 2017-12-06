exports.sequelize = function (sequelize, DataTypes) {
    return sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNul: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rate: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_pending: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
};
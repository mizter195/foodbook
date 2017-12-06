exports.sequelize = function (sequelize, DataTypes) {
    return sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNul: false
        },
        review_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
};
exports.sequelize = function (sequelize, DataTypes) {
    return sequelize.define('user_click_categories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        click: {
            type: DataTypes.INTEGER,
            allowNull:false
        }
    })
};
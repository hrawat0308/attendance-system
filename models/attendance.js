'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Employees, { foreignKey: 'emp_id', targetKey: 'emp_id' });
    }
  }
  Attendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    emp_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    dateTime: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    freezeTableName: true,
    timestamps: false,
    indexes: [{
      name: 'Employees_emp_id_Attendance_emp_id',
      using: 'BTREE',
      fields: ['emp_id']
    },]
  });
  return Attendance;
};
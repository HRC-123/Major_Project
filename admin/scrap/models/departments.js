import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";

const Department = sequelize.define("Department", {
  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Department;

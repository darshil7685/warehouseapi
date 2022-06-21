module.exports = (sequelize, Sequelize) => {
  const AWb = sequelize.define("awb", {
    awb_number: {
      type: Sequelize.STRING
    }
  });

  return AWb;
};
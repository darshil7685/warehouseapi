module.exports = {
  HOST: "localhost",
  USER: "darshil",
  PASSWORD: "darshil",
  DB: "warehouse1",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
require('dotenv').config()

module.exports = {
    "dev": {
      "name": "Vybog",
      "port": process.env.DEV_APP_PORT,
      "host": "localhost",
      "mode": "development",
      "protocol": "http",
      "serverUrl": "localhost",
      "serverUrlWebUrlLink": "localhost:4200/",
      "database": {
        "username": process.env.DEV_USER_NAME,
        "password": process.env.DEV_PASSWORD,
        "database": process.env.DEV_DATABASE,
        "host": process.env.DEV_HOST,
        "dialect": process.env.DEV_DIALECT,
        "port": process.env.DEV_DB_PORT,
        "logging": false,
        "timezone": "+05:30"
      }
      
    },
    "test": {
      "username": "",
      "password": "",
      "database": "",
      "host": "",
      "dialect": "mysql"
    },
    "production": {
      "username": "",
      "password": "",
      "database": "",
      "host": "",
      "dialect": "mysql"
    }
  }

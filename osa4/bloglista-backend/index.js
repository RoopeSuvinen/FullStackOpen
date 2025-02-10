const app = require('./app') // Express app
const config = require('./utils/config')
const logger = require('./utils/logger')
require('dotenv').config()

console.log('NODE_ENV:', process.env.NODE_ENV)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
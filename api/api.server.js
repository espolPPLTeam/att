const moment = require('moment')
const validator = require('validator')

const responses = require('./config/responses')
const logger = require('./config/logger')
const messages = require('./config/messages')
const db = require('./config/models')

const routes = require('./api.routes')
const controllerRequire = require('./api.controller')
const modelRequire = require('./api.model')

const model = modelRequire({ db, logger, messages })
const controller = controllerRequire({ responses, messages, model, logger, validator })

module.exports = (app) => {
  routes({ app, controller, logger })
}
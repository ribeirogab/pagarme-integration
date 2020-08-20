const path = require('path')
const fs = require('fs')
const router = require('express').Router()

const controllersDir = path.resolve('src', 'controllers')

fs.readdirSync(controllersDir)
  .filter(file => file !== 'controller.js' && file.includes('.controller.'))
  .map(file => {
    const controller = require(path.resolve(controllersDir, file))
    router.use(controller.router)
  })

module.exports = router
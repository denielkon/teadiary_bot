const Router = require('express');
const Controllers = require('../controllers/controllers')
const router = new Router()
router.post('/user', Controllers.createUser)

module.exports = router
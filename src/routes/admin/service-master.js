const { Router } = require('express')
const { userAuth } = require('../../middlewares/admin/auth-middleware')
const { validationMiddleware } = require('../../middlewares/admin/validations-middleware')

const {
  getObjects,
  add,
  read,
  update,
  destroy,
  status
} = require('../../controllers/admin/service-master')

const { 
  createValidation,
  updateValidation,
  idValidation,
  statusValidation
} = require('../../validators/admin/service-master')


const router = Router()

router.get('/get', userAuth, getObjects)
router.post('/add', userAuth, createValidation, validationMiddleware, add)

router.route('/:id')
    .get(userAuth,idValidation,validationMiddleware,read)
    .put(userAuth,updateValidation,validationMiddleware, update)
    .delete(userAuth, idValidation, validationMiddleware, destroy)
    .patch(userAuth, statusValidation, validationMiddleware, status);
  
module.exports = router
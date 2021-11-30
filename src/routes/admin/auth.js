const { Router } = require('express')

const {
  getUsers,
  register,
  login,
  protected,
  logout,
  forgotPassword,
  resetPassword,
} = require('../../controllers/admin/auth')

const {
  validationMiddleware,
} = require('../../middlewares/admin/validations-middleware')

const { 
  forgotPasswordValidation, 
  resetPasswordValidation, 
  registerValidation, 
  loginValidation 
} = require('../../validators/admin/auth')

const { userAuth } = require('../../middlewares/admin/auth-middleware')

const router = Router()

router.get('/get-users', getUsers)
router.get('/protected', userAuth, protected)
router.post('/register', registerValidation, validationMiddleware, register)
router.post('/login', loginValidation, validationMiddleware, login)
router.get('/logout', userAuth, logout)

router.post('/password/forgot',  forgotPasswordValidation, validationMiddleware, forgotPassword)
router.put('/password/reset/:token',  resetPasswordValidation, validationMiddleware, resetPassword)

module.exports = router
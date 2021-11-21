const { check } = require('express-validator')
const db = require('../../db')
const { compare } = require('bcryptjs')

// firstname
const firstname = check('firstname').exists()
  .withMessage('Firstname field is required.')

// lastname
const lastname = check('lastname').exists()
  .withMessage('Lastname field is required.')

//password
const password = check('password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters.');

const validateConfirmPassword = check('confirmPassword')
  .trim()
  .isLength({min:4, max:16})
  .withMessage('Password must be between 4 to 16 characters')
  .custom(async (confirmPassword, {req}) => {
    const password = req.body.password
    if(password !== confirmPassword) {
      throw new Error('Passwords must be same')
    }
  })

//email
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email.')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from admin_users WHERE email = $1', [
    value,
  ])

  if (rows.length) {
    throw new Error('Email already exists.')
  }
})

const emailNotExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from admin_users WHERE email = $1', [
    value,
  ])

  if (!rows.length) {
    throw new Error('Email not exists.')
  }
})

//login validation
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
  const user = await db.query('SELECT * from admin_users WHERE email = $1', [value])

  if (!user.rows.length) {
    throw new Error('Email does not exists.')
  }

  const validPassword = await compare(req.body.password, user.rows[0].password)

  if (!validPassword) {
    throw new Error('Wrong password')
  }

  req.user = user.rows[0]
})


// Reset password validation
module.exports = {
  registerValidation: [firstname, lastname, email, password, validateConfirmPassword, emailExists],
  loginValidation: [loginFieldsCheck],
  forgotPasswordValidation: [email, emailNotExists],
  resetPasswordValidation: [password, validateConfirmPassword]
}

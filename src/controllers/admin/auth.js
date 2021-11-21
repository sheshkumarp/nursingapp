const db = require('../../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET, SERVER_URL } = require('../../constants')
const crypto = require('crypto');
const sendEmail = require('../../utils/sendEmail')


exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query('select id, firstname, lastname, email from admin_users')

    return res.status(200).json({
      success: true,
      users: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body
  try {
    const hashedPassword = await hash(password, 10)

    await db.query('insert into admin_users(firstname,lastname,email,password) values ($1,$2,$3,$4)', [
      firstname,
      lastname,
      email,
      hashedPassword,
    ])

    return res.status(201).json({
      success: true,
      message: 'The registraion was succefull',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.login = async (req, res) => {
  let user = req.user

  let payload = {
    id: user.id,
    email: user.email,
  }

  try {
    const token = await sign(payload, SECRET)

    return res.status(200).cookie('token', token, { httpOnly: true }).json({
      success: true,
      message: 'Logged in succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.protected = async (req, res) => {
  try {
    return res.status(200).json({
      info: 'protected info',
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie('token', { httpOnly: true }).json({
      success: true,
      message: 'Logged out in succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.forgotPassword = async (req, res) => {

  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to reset password token
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");

  // set token expired time
  var expiryDate = new Date();
  expiryDate.setMinutes( expiryDate.getMinutes() + 30 );
  const resetPasswordExpire = expiryDate;

  try{

      await db.query('UPDATE admin_users SET reset_token = $1, reset_token_expiry = $2 where email = $3', [
        resetPasswordToken,
        resetPasswordExpire,
        req.body.email
      ])
    
      // create reset password url
      const resetUrl = `${SERVER_URL}/api/admin/password/reset/${resetToken}`;
    
      // message
      const message = `Your password reset link is as follows:\n\n${ resetUrl }\n\nIf you have not requested this email then ignore it.`;

      await sendEmail({
          email:req.body.email,
          subject:'Nursing Admin Password Recovery',
          message
      })
      
      res.status(200).send({
          success:true,
          message: `Email sent to: ${req.body.email}`
      })

  } 
  catch(err) 
  {

    await db.query('UPDATE admin_users SET reset_token = $1, reset_token_expiry = $2 where email = $3', [
      null,
      null,
      req.body.email
    ])

    return res.status(500).json({
      error: err.message,
    })
  }
}

exports.resetPassword = async (req, res) => {

  // Hash url token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  let email;

  try {

    $datenow = new Date();

    const user = await db.query('SELECT * from admin_users WHERE reset_token = $1 AND reset_token_expiry > $2', [
      resetPasswordToken,
      $datenow
    ])

    if (!user.rows.length) 
    {
      return res.status(500).json({
        error: 'Password reset token is invalid or has been expired',
      })
    }

    email = user.rows[0].email;

  } 
  catch (error) 
  {
    return res.status(500).json({
      error: error.message,
    })
  }

  // Setup new password
  try{

    const hashedPassword = await hash(req.body.password, 10)

    const updated = await db.query(`UPDATE admin_users SET password = $1, reset_token = $2, reset_token_expiry = $3 where email = $4 `, [
      hashedPassword,
      null,
      null,
      email
    ])

    console.log(updated);

    res.status(200).send({
        success:true,
        message: 'Password updated successfully',
    })

  }catch (error) {

    return res.status(500).json({
      error: error.message
    })

  }

}
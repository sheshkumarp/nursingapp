const db = require('../../db')
const { SECRET, SERVER_URL } = require('../../constants')

exports.getObjects = async (req, res) => {
  try {
    const { rows } = await db.query('select * from service_type_master')

    return res.status(200).json({
      success: true,
      collections: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.add = async (req, res) => {

  let { name, status } = req.body

  if(typeof status === 'undefined') {
    status = 0;
  }

  try {

    await db.query('insert into service_type_master(name,status) values ($1,$2)', [
      name,
      status
    ])

    return res.status(201).json({
      success: true,
      message: 'Service added successfully',
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

exports.read = async (req, res) => {

    let { id } = req.params;

    try {
        const { rows } = await db.query('select * from service_type_master where id = $1',[ id ])
    
        return res.status(200).json({
          success: true,
          collection: rows[0],
        })
    } catch (error) {
    console.log(error.message)
    }
}

exports.update = async (req, res) => {
    
    let { name, status } = req.body
    let { id } = req.params

    if(typeof status === 'undefined') {
        status = 0;
    }

    try{

        const updated = await db.query(`UPDATE service_type_master SET name = $1, status = $2 where id = $3 `, [
            name,
            status,
            id
        ])

        res.status(200).send({
            success:true,
            message: 'Service updated successfully',
        })

    }catch (error) {

        return res.status(500).json({
        error: error.message
        })

    }

}

exports.destroy = async (req, res) => {

    let { id } = req.params

    try{

        const updated = await db.query(`DELETE FROM service_type_master where id = $1 `, [
            id
        ])

        res.status(200).send({
            success:true,
            message: 'Service deleted successfully',
        })

    }catch (error) {

        return res.status(500).json({
        error: error.message
        })

    }
}

exports.status = async (req, res) => {
    
    let { status } = req.body
    let { id } = req.params

    if(typeof status === 'undefined') {
        status = 0;
    }

    try{

        const updated = await db.query(`UPDATE service_type_master SET status = $1 where id = $2 `, [
            status,
            id
        ])

        res.status(200).send({
            success:true,
            message: 'Service status updated successfully',
        })

    }catch (error) {

        return res.status(500).json({
        error: error.message
        })

    }

}
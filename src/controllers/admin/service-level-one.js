const db = require('../../db')
const { SECRET, SERVER_URL } = require('../../constants')

exports.getObjects = async (req, res) => {
  try {
    const { rows } = await db.query('select * from service_type_level_one')

    return res.status(200).json({
      success: true,
      collections: rows,
    })
  } catch (error) {
    console.log(error.message)
  }
}

exports.add = async (req, res) => {

  let { name, status, service_type_id, addional_commission } = req.body

  if(typeof status === 'undefined') {
    status = 0;
  }

  try {

    await db.query('insert into service_type_level_one(name,status,service_type_id,addional_commission) values ($1,$2,$3,$4)', [
      name,
      status,
      service_type_id,
      addional_commission
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
        const { rows } = await db.query('select * from service_type_level_one where id = $1',[ id ])
    
        return res.status(200).json({
          success: true,
          collection: rows[0],
        })
    } catch (error) {
    console.log(error.message)
    }
}

exports.update = async (req, res) => {
    
    let { name, status, service_type_id, addional_commission } = req.body
    let { id } = req.params

    if(typeof status === 'undefined') {
        status = 0;
    }

    try{

        const updated = await db.query(`UPDATE service_type_level_one SET name = $1, status = $2, service_type_id = $3, addional_commission = $4 where id = $5 `, [
            name,
            status,
            service_type_id,
            addional_commission,
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

        const updated = await db.query(`DELETE FROM service_type_level_one where id = $1 `, [
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

        const updated = await db.query(`UPDATE service_type_level_one SET status = $1 where id = $2 `, [
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
const { check } = require('express-validator')
const db = require('../../db')

const name = check('name').exists().withMessage('Service name field is required.')

const serviceTypeId = check('service_type_id').exists().withMessage('Master service field is required.')

const addionalCommission = check('addional_commission')
                        .exists()
                        .withMessage('Service addional commission field is required.')
                        .isDecimal()
                        .withMessage('Service addional commission must be valid amount.')

const status = check('status').exists().withMessage('Service status field is required.')

const nameExists = check('name').custom(async (value) => {

    const { rows } = await db.query('SELECT * from service_type_level_one WHERE name = $1', [
        value,
    ])

    if (rows.length) {
        throw new Error('Service already exists.')
    }
})

const nameExistsOnUpdate = check('name').custom(async (value, { req }) => {

    let { id } = req.params;

    const { rows } = await db.query('SELECT * from service_type_level_one WHERE name = $1 AND id != $2', [
        value,
        id
    ])

    if (rows.length) {
        throw new Error('Service already exists.')
    }
})

const serviceid = check('id').custom(async (value) => {

    const { rows } = await db.query('SELECT * from service_type_level_one WHERE id = $1', [
        value,
    ])

    if (!rows.length) {
        throw new Error('Service not found.')
    }
})

module.exports = {
    createValidation: [name, nameExists,addionalCommission,serviceTypeId],
    updateValidation: [serviceid, name, nameExistsOnUpdate,addionalCommission,serviceTypeId],
    statusValidation:[serviceid, status],
    idValidation:[serviceid]
}

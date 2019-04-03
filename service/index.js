const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function createToken (user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN)
}

const decodeToken = (token) => {
    try {
        const payload = jwt.decode(token, config.SECRET_TOKEN)
        if (payload.exp <= moment.unix()) {
            throw new Error('Error'), { status: 401, message: 'Token expired' }
        }
        return (payload.sub)
    } catch (err) {
        throw new Error('Error'), { status: 403, message: 'Unhandled Token Error' }
    }
}

module.exports = {
    createToken,
    decodeToken
}

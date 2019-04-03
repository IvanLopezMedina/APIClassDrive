const services = require('../service')

const isAuth = async (req, res, next) => {
    if (!req.headers.authorization && !res.body.id) {
        return res.status(403).send({ message: 'Access forbidden' })
    }

    const token = req.headers.authorization.split(' ')[1]
    try {
        const response = await services.decodeToken(token)
        req.user = response
        if (req.user === req.body.id) {
            next()
        } else {
            return res.status(403).send({ message: 'Access forbidden. Invalid credentials' })
        }
    } catch (e) {
        res.status(e.status).send({ message: e.message })
    }
}

module.exports = isAuth

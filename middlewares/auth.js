const services = require('../service')

const isAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Access forbidden' })
    }

    const token = req.headers.authorization.split(' ')[1]
    try {
        const response = await services.decodeToken(token)
        req.user = response
        next()
    }
    catch (e) {
        res.status(e.status).send({message: e.message})
        }
   
}

module.exports = isAuth

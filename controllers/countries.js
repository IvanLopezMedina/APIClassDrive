const Country = require('../models/countries')

const getCountries = (req, res) => {
    Country.find(function (err, countries) {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!countries) return res.status(404).send({ message: `The country doesn't exist: ${err}` })
        res.status(200).send(countries)
    })
}

module.exports = {
    getCountries
}
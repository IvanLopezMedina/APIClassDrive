const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

app.set('port', process.env.PORT || config.port)

mongoose.connect(config.db, (err, res) => {
   if (err) {
      return console.log(`Error connecting to the database: ${err}`)
   }
   console.log('Connection stablished to the database...')

   app.listen(app.get('port'), () => {
      console.log(`API REST running in http://localhost:${config.port}`)
   })
})
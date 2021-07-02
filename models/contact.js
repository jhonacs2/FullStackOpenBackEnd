
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI
console.log('connection to ',url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
    name: {
      type:String,
      required:true,
      unique:true,
      minLength:3
    },
    number: {
      type:String,
      required:true,
      minLength:8
    }
})
noteSchema.plugin(uniqueValidator)
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})


module.exports = mongoose.model('Contact', noteSchema)

require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

// const contact = require('./models/contact');
let persons = []
app.use(express.static('build'))
app.use(express.json())

morgan.token('content',(req) => {
  return req.method === 'POST' 
    ? JSON.stringify(req.body)
    : null 

})

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res)
  ].join(' ')
}))

morgan.token('body', function(req, res, param) {
  return req.body
})
app.use(cors())


// let persons = [
//     {
//         id:1,
//         name:'Arto Hellas',
//         number:'040-123456'
//     },
//     {
//         id:2,
//         name:'Ada lovelace',
//         number:'39-44-4323523'
//     },
//     {
//         id:3,
//         name:'Dan Abramov',
//         number:'12-43-234345'
//     },
//     {
//         id:4,
//         name:'Mary Poppendick',
//         number:'39-23-6423122'
//     }
//     ,
//     {
//         id:5,
//         name:'Jhonatan Soto',
//         number:'23-12-7612122'
//     }
// ]


app.get('/api/persons',(request,response) => {
  Contact.find({}).then( contacts => {
        
        
    persons = contacts
    console.log(persons)
    response.json(contacts)
        
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
    
  if(error.name === 'Validation failed'){
    return response.status(400).send({error : `${error}`})
  }
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).send({error : `${error}`})
  }
    
  
  next(error)
}

app.get('/api/persons/:id',(request,response,next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if(contact){
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons/',(request,response,next) => {
  const {name, number} = request.body
  console.log(number)
  const contact = new Contact({
    name:name,
    number:number.toString()
        
  })
  if(!name || !number){
    return response.status(400).json({
      error:'error you need to add a name or a number'
    })
  }
  contact
    .save()
    .then(savedContact => savedContact.toJSON())
    .then(savedAndFormatted =>{
      response.json(savedAndFormatted)
    })
    .catch(error => {
      next(error)
    })


  //   .then(savedContact => {
  //     if(savedContact){
  //         response.json(savedContact)
  //     }else{
  //         response.status(404).end()
  //     } 
  // })

        
})

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
    
  Contact.findByIdAndRemove(id)
    .then(result => {
      response.status(204).json({
        msg:'la persona fue eliminada'
      })
    })
})

app.get('/info',(request,response)=> {
  Contact.find({}).then( contacts => {
        
        
    const count = contacts.length
    response.send(`
    <h3>Phonebook has info for ${count} people </h3>
    <p>${new Date()}</p>
    `)
        
  })
    
   
    
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  const contact = {
    name:name,
    number: number
  }
  console.log(number)         
  Contact.findByIdAndUpdate(request.params.id, contact, { new: true, runValidators: true,context: 'query'},)
    .then(updatedNote => {
      console.log(updatedNote)
      response.json(updatedNote)
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)
app.use(errorHandler)
app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`)
})
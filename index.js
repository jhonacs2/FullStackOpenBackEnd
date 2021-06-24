const { request, response } = require('express');
const express = require('express')
const app = express();
const PORT = 3001
const morgan = require('morgan')
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
    return req.body;
});

let persons = [
    {
        id:1,
        name:'Arto Hellas',
        number:'040-123456'
    },
    {
        id:2,
        name:'Ada lovelace',
        number:'39-44-4323523'
    },
    {
        id:3,
        name:'Dan Abramov',
        number:'12-43-234345'
    },
    {
        id:4,
        name:'Mary Poppendick',
        number:'39-23-6423122'
    }
    ,
    {
        id:5,
        name:'Jhonatan Soto',
        number:'23-12-7612122'
    }
]


app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(400).json({
            msg:'person not found'
        })
    }

})

app.post('/api/persons/',(request,response) => {
    const {name, number} = request.body
    
    if(!name || !number){
        return response.status(400).json({
            msg:`you need to add a name or a number`
        })
    }
    const sameName = persons.find(person => person.name.toLowerCase() === name.toLowerCase()) 
    
    if(sameName){
       return response.status(400).json({
            msg:`there is the same name in the phonebook`
        })
    }else{
        const person = {
            name:name,
            number:number,
            id:Math.floor(Math.random() * 10000000)
        }
    
        persons = persons.concat(person)
        response.json(person)
    }
    
    
})

app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).json({
        msg:'persona eliminada'
    })
})

app.get('/info',(request,response)=> {
    const count = persons.length
   
    response.send(`
    <h3>Phonebook has info for ${count} people </h3>
    <p>${new Date()}</p>
    `)
})





app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})
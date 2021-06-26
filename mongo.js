const mongoose = require("mongoose");


const password = process.argv[2];
const url = `mongodb+srv://user_jhona:${password}@miclusterc.wvmyu.mongodb.net/telguide?retryWrites=true`;
console.log(process.argv.length)
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact',contactSchema)

if(process.argv.length === 3){
    Contact.find({}).then(result => {
        result.forEach(element => {
        console.log(element)    
        });
        mongoose.connection.close()
    })
}else{

    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    //crear nuevo Contacto
    
    contact.save().then(result => {
        console.log(`added ${contact.name} number ${contact.number} to phonebook`)
        mongoose.connection.close()
    })
}



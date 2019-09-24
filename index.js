const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')

app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const cors = require('cors')

app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {

    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    console.log(generateId())
    res.send(`<div>
    <p>Phone book has infro for ${persons.length} people</p>
    <p>${new Date}</p>
    </div>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id);
    console.log(persons)
    res.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 10000);
    return id
}


app.post('/api/persons', (req, res) => {
    const body = req.body
    // console.log(body)
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or Number is missing. Please try again!'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'Name Already Exists. Please try again!'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }


    persons = persons.concat(person)
    res.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
import express from 'express';

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(express.json())

const loggingMiddleWare = (request, response, next) => {
    console.log(`${request.method}_${request.url}`)
    next()
}

app.use(loggingMiddleWare, () => {
    console.log('Logging Completed...')
})


app.listen(PORT, () => {
    `Running on port ${PORT}`;
});

const MOCK_USERS = [
    {
        "id": 1,
        "name": "Leanne Graham",
    },
    {
        "id": 2,
        "name": "Ervin Howell"
    }]

app.get('/', (request, response) => {
    response.status(201).send({msg: "Hello World"})
});

app.get('/api/users', (request, response
) => {
    const {query: {filter, value}} = request
    if (filter && value) {
        const result = MOCK_USERS.filter((user) => user[filter].includes(value))
        return response.status(200).send(result)
    }
    return response.status(200).send(MOCK_USERS)
})

app.get('/api/users/:id', (request, response) => {
    const {params: {id}} = request
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        return response.send(400).send('Bad Request. Invalid Id')
    }
    const user = MOCK_USERS.find((user) => user.id === parsedId)
    if (!user) {
        return response.sendStatus(404)
    }
    return response.status(200).send(user)
})

app.post('/api/users', (request, response) => {
    const {body} = request
    const newUser = {
        id: MOCK_USERS[MOCK_USERS.length - 1].id + 1,
        ...body
    }
    MOCK_USERS.push(newUser)
    return response.status(201).send(newUser)
})

app.put('/api/users/:id', (request, response) => {
    const {params: {id}, body} = request
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        return response.sendStatus(400)
    }
    const index = MOCK_USERS.findIndex((user) => user.id === parsedId)
    if (index === -1) {
        return response.sendStatus(404)
    }
    MOCK_USERS[index] = {id: parsedId, ...body}
    return response.sendStatus(204)

})

app.patch('/api/users/:id', (request, response) => {
    const {params: {id}, body} = request
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        return response.sendStatus(400)
    }
    const index = MOCK_USERS.findIndex((user) => user.id === parsedId)
    if (index === -1) {
        return response.sendStatus(404)
    }
    MOCK_USERS[index] = {...MOCK_USERS[index], ...body}
    return response.sendStatus(204)
})

app.delete('/api/users/:id', (request, response) => {
    const {params: {id}} = request
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        return response.sendStatus(400)
    }
    const index = MOCK_USERS.findIndex((user) => user.id === parsedId)
    if (index === -1) {
        return response.sendStatus(404)
    }
    MOCK_USERS.splice(index, 1)
    return response.sendStatus(200)
})
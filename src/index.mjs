import express from 'express';
import {checkSchema, query, validationResult, body, matchedData} from 'express-validator'
import {createUserValidationSchema} from "./utils/validationSchemas.mjs";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(express.json())

const loggingMiddleWare = (request, response, next) => {
    console.log(`${request.method}_${request.url}`)
    next()
}

// app.use(loggingMiddleWare, () => {
//     console.log('Logging Completed...')
// })

const resolveIndexByUserId = (request, response, next) => {
    const {params: {id}} = request
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
        return response.send(400).send('Bad Request. Invalid Id')
    }
    const userIndex = MOCK_USERS.findIndex((user) => user.id === parsedId)
    if (userIndex === -1) {
        return response.sendStatus(404)
    }
    request.userIndex = userIndex
    next()
}

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

app.get('/api/users', query('filter').optional().isString().isLength({
    min: 4
}).withMessage('Length Should be greater than 3'), (request, response
) => {
    const bodyValidationResult = validationResult(request)
    if (!bodyValidationResult.isEmpty()) {
        return response.status(400).send(bodyValidationResult)
    }
    const {query: {filter, value}} = request
    if (filter && value) {
        const result = MOCK_USERS.filter((user) => user[filter].includes(value))
        return response.status(200).send(result)
    }
    return response.status(200).send(MOCK_USERS)
})

app.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const {userIndex} = request
    return response.status(200).send(MOCK_USERS[userIndex])
})

app.post('/api/users', checkSchema(createUserValidationSchema), (request, response) => {
    const bodyValidationResult = validationResult(request)
    if (!bodyValidationResult.isEmpty()) {
        return response.status(400).send(bodyValidationResult)
    }
    const data = matchedData(request)
    const newUser = {
        id: MOCK_USERS[MOCK_USERS.length - 1].id + 1,
        ...data
    }
    MOCK_USERS.push(newUser)
    return response.status(201).send(newUser)
})

app.put('/api/users/:id', resolveIndexByUserId, body('name').isString().notEmpty(), (request, response) => {
    const bodyValidationResult = validationResult(request)
    if (!bodyValidationResult.isEmpty()) {
        return response.status(400).send(bodyValidationResult)
    }
    const {userIndex, body} = request
    MOCK_USERS[userIndex] = {id: MOCK_USERS[userIndex].id, ...body}
    return response.sendStatus(204)

})

app.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const {userIndex, body} = request
    MOCK_USERS[userIndex] = {...MOCK_USERS[userIndex], ...body}
    return response.sendStatus(204)
})

app.delete('/api/users/:id', (request, response) => {
    const {userIndex} = request
    MOCK_USERS.splice(userIndex, 1)
    return response.sendStatus(200)
})
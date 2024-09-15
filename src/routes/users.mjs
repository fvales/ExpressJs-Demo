import {Router} from 'express'
import {body, checkSchema, matchedData, query, validationResult} from "express-validator"
import {MOCK_USERS} from '../constants/constants.mjs'
import {createUserValidationSchema} from "../utils/validationSchemas.mjs";
import {resolveIndexByUserId} from '../utils/middlewares.mjs'

const usersRouter = Router()

usersRouter.get('/api/users', query('filter').optional().isString().isLength({
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

usersRouter.get('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const {userIndex} = request
    return response.status(200).send(MOCK_USERS[userIndex])
})

usersRouter.post('/api/users', checkSchema(createUserValidationSchema), (request, response) => {
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

usersRouter.put('/api/users/:id', resolveIndexByUserId, body('name').isString().notEmpty(), (request, response) => {
    const bodyValidationResult = validationResult(request)
    if (!bodyValidationResult.isEmpty()) {
        return response.status(400).send(bodyValidationResult)
    }
    const {userIndex, body} = request
    MOCK_USERS[userIndex] = {id: MOCK_USERS[userIndex].id, ...body}
    return response.sendStatus(204)

})

usersRouter.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
    const {userIndex, body} = request
    MOCK_USERS[userIndex] = {...MOCK_USERS[userIndex], ...body}
    return response.sendStatus(204)
})

usersRouter.delete('/api/users/:id', (request, response) => {
    const {userIndex} = request
    MOCK_USERS.splice(userIndex, 1)
    return response.sendStatus(200)
})

export default usersRouter
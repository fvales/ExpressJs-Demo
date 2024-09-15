import {MOCK_USERS} from "../constants/constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
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
import express from 'express';
import usersRouter from './routes/users.mjs'

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(express.json())
app.use(usersRouter)

const loggingMiddleWare = (request, response, next) => {
    console.log(`${request.method}_${request.url}`)
    next()
}

// app.use(loggingMiddleWare, () => {
//     console.log('Logging Completed...')
// })

app.listen(PORT, () => {
    `Running on port ${PORT}`;
});

app.get('/', (request, response) => {
    response.status(201).send({msg: "Hello World"})
});


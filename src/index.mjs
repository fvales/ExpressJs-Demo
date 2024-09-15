import express from 'express';
import router from './routes/index.mjs'

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(express.json())
app.use(router)

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


import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import bodyParser from 'body-parser';


// Middleware

const app = express()
const port = process.env.PORT||4000;

app.use(express.json())
app.use(cors())
app.use(express.static("public"))
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//user routes
import userRouter from './routes/user.routes.js';
app.use(userRouter);

//products routes
import productsRoutes from  './routes/products.routes.js'
app.use(productsRoutes)

export {app}









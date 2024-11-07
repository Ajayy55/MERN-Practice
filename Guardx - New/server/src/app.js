import express from 'express'
import 'dotenv/config'
import cors from 'cors'
const app = express()
const port = process.env.PORT 


//middlewares
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server Running on port ${port}!`))


//user routes
import userRouter from './routes/user.routes.js'
app.use(userRouter)

//house routes
import houseRouter from './routes/house.routes.js'
import { upload } from './utils/Multer.js'
app.use(houseRouter)




export {app}
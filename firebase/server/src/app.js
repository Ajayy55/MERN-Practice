const express = require('express')
const cors = require('cors')


require('dotenv').config()

const app = express()
const port = process.env.PORT || 4046 ;

//middlewares
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//user routes
const userRoutes= require('./routes/user.routes.js')
app.use(userRoutes)

//noticiation routes
const notificationRoutes =require('./routes/notification.routes.js')
app.use(notificationRoutes)



module.exports= {app}


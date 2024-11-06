import express from 'express'
import 'dotenv/config'

const app = express()
const port = process.env.PORT 

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server Running on port ${port}!`))





export {app}
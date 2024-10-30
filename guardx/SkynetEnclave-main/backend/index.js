const express = require('express')
const app = express()
var path = require('path');
app.use(express.json())
const cors = require('cors')
app.use(cors())
require('./Db')
const router = require('./routes/userRoutes')

const PORT = 2512
//Updated this Line
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.static('public'));
app.use(express.static(path.resolve(__dirname, './build')));
app.use('/api/', router)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Port is running at server ${PORT}`)
})





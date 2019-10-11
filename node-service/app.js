const express = require('express')
const port = process.env.NODE_SERVICE_PORT
const app = express()

app.get('/', (req, res) => res.sendFile(__dirname+"/index.html"))

// app.get('/upload', function(req,res){
  
//   //upload a file to cloud
//   res.send('This is your upload page')
// })

app.listen(port, () => console.log(`node service is listening on port ${port}!`))
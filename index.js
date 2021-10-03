const { application } = require('express');
const { server } = require('./service.js')
const port = process.env.PORT || "9000";
server.use(
  express.static(path.join(__dirname,'/client/build'))
);
server.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'/client/build','index.html'))
})
server.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`)
})
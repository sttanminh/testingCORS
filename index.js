const express = require('express')
const cors = require('cors')
const server = express()
const request = require('superagent')
const jsdom = require("jsdom");

server.use(cors())
server.use((_, res, next) => {
  res.header('Content-Type', 'application/json')
  next()
})

server.get('/victoria-cases', async function(_, res) {
  console.log(`Proxy accessed`)
  let vicCases = []
  let response = await callApi()
  let htmlData = response.text
  const dom = new jsdom.JSDOM(htmlData);
  let table = dom.window.document.querySelector("table.DAILY-CASES");
  for (let i = table.children[0].children.length - 1; i >= 0; i--) {
    let eachDateObject = {}
    eachDateObject.date = table.children[0].children[i].children[0].textContent
    eachDateObject.cases = parseInt(table.children[0].children[i].children[1].textContent)
    vicCases.push(eachDateObject)
  }
  console.log(vicCases)
  res.status(201)
  res.json(vicCases)
})

function callApi() {
  return new Promise((resolve, reject) => {
    return request
      .get(`https://covidlive.com.au/report/daily-cases/vic`)
      .end((err, res) => {
        if (!err) {
          console.log("GET finished")
          resolve(res)
        }
        else {
          console.log("GET failed")
          reject(err)
        }
      })
  })
}

const port = process.env.PORT || 9000;
if (process.env.NODE_ENV === "production") {
server.use('/static', express.static('client/build'));
server.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'))
})
}
server.listen(port, () => {
  console.log(`Proxy server listening on http://localhost:${port}`)
})

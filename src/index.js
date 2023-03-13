const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const data = require('./data')

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json())

const { connection } = require('./connector')

app.post("/", async (req, res) => {
    try {
        let user = await connection.create({
            state: req.body.state,
            infected: req.body.infected,
            recovered: req.body.recovered,
            death: req.body.death
        })
        res.send(user)
    }
    catch (e) {
        console.log(e.message)
    }
})
app.get('/', async (req, res) => {
    try {
        let user = await connection.find()
        res.send(user)
    } catch (e) {
        console.log(e.message)
    }
})
// 1. /totalRecovered data  format {data: {_id: "total", recovered:135481}}
app.get('/totalRecovered', async (req, res) => {
    try {
        let user = await connection.find()
        let recover = 0;
        for (let i = 0; i < user.length; i++) {
            recover += Number(user[i].recovered)
        }
        res.send(`data: {_id: "total", recovered ${recover}}`)
    } catch (e) {
        console.log(e.message)
    }
})
// 2. /totalActive format {data: {_id: "total", active:11574}}.

app.get("/totalActive", async (req, res) => {
    try{
        let user = await connection.find()
        let active = 0;
        for(let i=0; i<user.length; i++){
            let sum = Number(user[i].infected - user[i].recovered);
            active += sum;
        }
        res.send(`data: {_id: "total", active ${active}}`)
    }
    catch(e){
        console.log(e.message)
    }
})
// 3. /totalDeath  format {data: {_id:"total", death:11574}
app.get("/totalDeath", async(req, res) => {
    try{
        let user = await connection.find()
        let death = 0;
        for(let i=0; i<user.length; i++){
            let data = Number(user[i].death)
            death += data;
        }
        res.send(`data: {_id: "total", death ${death}}`);
    }catch(e){
        console.log(e.message)
    }
})
// 4. /hotspotStates  greater than 0.1. rate value can be calculated as ((infected - recovered)/infected) 
//  format {data: [{state: "Maharashtra", rate: 0.17854}, {state: "Punjab", rate: 0.15754}]}.
app.get("/hotspotStates", async (req, res) => {
    try{
        let user = await connection.find();
        let rate = 0.1;
        let something = "data: "
        for(let i=0; i<user.length; i++){
            let data = Number(user[i].infected - user[i].recovered) / Number(user[i].infected)
            if(data.toFixed(5) > 0.1){
                something += `{state: "${user[i].state}", rate: ${data.toFixed(5)}}, `
            }
        }
        res.send(something)
    }   
    catch(e){
        console.log(e.message)
    }
})

// 5. /healthyStates  mortality value is less than 0.005. mortality value can be calculated as (death/infected). 
// format {data: [{state: "Maharashtra", mortality: 0.0004}, {state: "Punjab", mortality: 0.0007}]}

app.get("/healthyStates", async (req, res) => {
    try{
        let user = await connection.find();
        let everything = "data: "
        let mortality = 0.005
        for(let i=0; i<user.length; i++){
            let data = Number(user[i].death / user[i].infected)
            if(data.toFixed(5) < mortality){
                everything += `{state: "${user[i].state}", mortality: ${data.toFixed(5)}}, `
            }
        }
        res.send(everything)
    }
    catch(e){
        console.log(e.message)
    }
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
import express from 'express'
import mysql from 'mysql'
import dotenv from 'dotenv'
import { engine } from 'express-handlebars'

import { 
  selectAll, 
  selectOne, 
  insertOne, 
  deleteOne, 
  updateOne 
} from './queries.js'

const app = express()
const PORT = 3000

dotenv.config()
app.use(express.json())

app.engine('.hbs', engine({
  extname: '.hbs',
  defaultLayout: "",
  layoutsDir: ""
}))
app.set('view engine', '.hbs')
app.set("views", "./views/")

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PSWD,
  database: process.env.DATABASE
})

connection.connect((err) => {
  if (err) throw err
  console.log("[+] Se ha realizado correctamente la conexión a la base de datos")
})

app.get('/', (req, res) => {
  res.render('main')
})

app.get('/api/users', (req, res) => {
  console.log("pet GET: /api/users")
  selectAll(connection, result => {
    res.json(result)
  })
})

app.get('/api/users/:username', (req, res) => {
  const { username } = req.params
  console.log(`pet GET: /api/users/${username}`)
  selectOne(connection, username, (result) => {
    if (!!result.length) { res.json(result) }
    else { res.json({ "error": "no se ha encontrado ningún usuario" }) }
  })
})

app.post('/api/users/new', (req, res) => {
  const { body } = req
  console.log("pet POST: /api/users/new")
  console.log("body: ", body)
  insertOne(connection, body, (result) => {
    if (!!result.affectedRows) {
      let msg = {
        "ok": "el usuario se ha agregado correctamente",
        "body": body,
        "result": result
      }
      res.json(msg)
    } else {
      res.json({ "error": "el usuario o el correo ya estan registrados" })
    }
  })
})

app.delete('/api/users/:username', (req, res) => {
  const { username } = req.params
  console.log(`pet DELETE: /api/users/${username}`)
  deleteOne(connection, username, (result) => {
    if (!!result.affectedRows) {
      res.json({ "ok": `el usuario ${username} ha sido removido` })
    } else {
      res.json({ "error": "asegurese de que el usuario existe" })
    }
  })
})

app.put('/api/users/:username', (req, res) => {
  const { body } = req
  const { username } = req.params
  console.log(`pet PUT: /api/users/${username}`)
  console.log("body: ", body)
  updateOne(connection, [body, username], (result) => {
    if (!!result.affectedRows) {
      res.json(result)
    } else {
      res.json({ "error": "ningún usuario se ha actualizado" })
    }
  })
})

app.get('/*', (req, res) => {
  // res.send('<div style="display: flex; align-items: center; justify-content: center; height: 100%;"><span style="font-size: 3.5rem">404 - Not Found</span></div>')
  res.render('404')
})

app.listen(PORT, () => {
  console.log(`[+] SERVER IN RUNNING IN: http://localhost:${PORT}/`)
})


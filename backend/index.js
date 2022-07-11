import express from 'express'
import mysql from 'mysql'
import dotenv from 'dotenv'

import { selectAll, selectOne, insertOne, deleteOne, updateOne } from './queries.js'

dotenv.config()

const app = express()
app.use(express.json())

const connection = mysql.createConnection({
  "host": "localhost",
  "user": process.env.USER,
  "password": process.env.PSWD,
  "database": process.env.DATABASE
})

connection.connect((err) => {
  if (err) throw err
  console.log("[+] Se ha realizado correctamente la conexión a la base de datos")
})

app.get('/', (req, res) => {
  let html = "<h1>API</h1><nav><a href='/api/users'>/api/users</a><a href='/api/users/steven'>/api/users/:username</a></nav>"
  res.send(html)
})

// READ
app.get('/api/users', (req, res) => {
  selectAll(connection, result => {
    res.json(result)
  })
})

// READ
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params
  selectOne(connection, username, (result) => {
    console.log(result)
    if (!!result.length) { res.json(result) }
    else { res.json({ "error": "no se ha encontrado ningún usuario" }) }
  })
})

// CREATE
app.post('/api/users/new', (req, res) => {
  const { body } = req
  insertOne(connection, body, (result) => {
    console.log(result)
    if (!!result.affectedRows) {
      let msg = {
        "ok": "el usuario se ha agregado correctamente",
        "body": body,
        "result": result
      }
      res.json(msg)
    }
    res.json({ "error": "el usuario o el correo ya estan registrados" })
  })
})

// DELETE
app.delete('/api/users/:username', (req, res) => {
  const { username } = req.params
  deleteOne(connection, username, (result) => {
    if (!!result.affectedRows) {
      res.json({ "ok": `el usuario ${username} ha sido removido` })
    }
    res.json({ "error": "asegurese de que el usuario existe" })
  })
})

// UPDATE
app.put('/api/users/:username', (req, res) => {
  const { body } = req
  const { username } = req.params
  updateOne(connection, [body, username], (result) => {
    if (!!result.affectedRows) {
      res.json(result)
    }
    res.json({"error": "ningún usuario se ha actualizado"})
  })
})

app.get('/*', (req, res) => {
  res.send('404')
})

app.listen(3000, () => {
  console.log('[+] SERVER IN RUNNING IN: http://localhost:3000/')
})

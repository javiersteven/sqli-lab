import mysql from 'mysql'

function selectAll(connection, callback) {
  let readQuery = "SELECT * FROM users;"
  connection.query(readQuery, (err, result) => {
    if (err) { throw err }
    callback(result)
  })
}

function selectOne(connection, username, callback) {
  let readQuery = "SELECT * FROM users WHERE username = ?;"
  let query = mysql.format(readQuery, [username])
  connection.query(query, (err, result) => {
    if (err) { throw err }
    callback(result)
  })
}

function insertOne(connection, {username, password, email }, callback) {
  let insertQuery = "INSERT INTO users (username,password,email) SELECT * FROM (SELECT ?,?,?) AS tmp WHERE NOT EXISTS (SELECT username,email FROM users WHERE username = ? OR email = ?);"
  let query = mysql.format(insertQuery, [username, password, email, username, email])
  connection.query(query, (err, result) => {
    if (err) { throw err }
    callback(result)
  })
}

function deleteOne(connection, username, callback) {
  let deleteQuery = "DELETE FROM users WHERE username = ?"
  let query = mysql.format(deleteQuery, [username])
  connection.query(query, (err, result) => {
    if (err) { throw err }
    callback(result)
  })
}

function updateOne(connection, [body, username], callback) {
  const {uptUsername, uptPassword, uptEmail} = body
  let updateQuery = "UPDATE users SET username=?, password=?, email=? WHERE username=?;"
  let query = mysql.format(updateQuery, [uptUsername, uptPassword, uptEmail, username])
  connection.query(query, (err, result) => {
    if (err) { throw err}
    callback(result)
  })
}

export { selectAll, selectOne, insertOne, deleteOne, updateOne }

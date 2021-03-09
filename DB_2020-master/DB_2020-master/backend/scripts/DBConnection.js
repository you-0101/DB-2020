// DBConnection.js
// Exports: 
// 1. MakeQuery: DB에 연결하고 and mySQL query를 질의함
//               파라미터: mySQL query
//               리턴: DB 리턴값

const mariadb = require('mariadb')
const vals = require('./DBconsts.js')
const pool = mariadb.createPool({
  host: vals.DBHost, port: vals.DBPort,
  user: vals.DBUser, password: vals.DBPass,
  connectionLimit: 100
});
var results = new Array();

async function MakeQuery(query){
  try {
    conn = await pool.getConnection();
    len = query.length;
    await conn.query('use main_db;');
    results = await conn.query(query);
    return results;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

module.exports = {
  MakeQuery: MakeQuery
}

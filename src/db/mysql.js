const mysql = require('mysql');
const {MYSQL_CONF} = require('../conf/db'); 

const con = mysql.createConnection(MYSQL_CONF);

con.connect();

function exec(sql){
    const promise = new Promise((resolev, reject)=>{
        con.query(sql,(error, result)=>{
            if(error){
                reject(error);
                return;
            }else{
                resolev(result)
            }
        })
    });
    return promise;
}

module.exports = { exec }
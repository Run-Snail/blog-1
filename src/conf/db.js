const env = process.env.NODE_ENV;

let MYSQL_CONF;

if(env === 'dev'){
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        port: '3306',
        password: 'chen8825507YU!',
        database: 'myblog'
    }
} 

if(env === 'production'){
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        port: '3306',
        password: 'chen8825507YU!',
        database: 'myblog'
    }
} 

module.exports = {MYSQL_CONF}
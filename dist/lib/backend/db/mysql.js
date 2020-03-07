const mysql = require('mysql');//引入第三方模块

//建立连接池
let pool =mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    port:3306,
    database:'juanpizk',
    multipleStatements:true
});
function query(sql){
    return new Promise((resolve,reject)=>{
        pool.query(sql,(err,data)=>{
            if(err) reject(err); //如果有错误就返回错误
            resolve(data);//实参,回调函数把data数据传到声明体 
        });
    });
}
module.exports =query;
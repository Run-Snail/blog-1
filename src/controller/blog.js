const { exec } = require('../db/mysql');

//获取博客列表
const getList =(author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if(author){
        sql += `and author = '${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc`;
    return exec(sql)
}

//获取博客内容
const getDetail = (id) => {
    const sql = `select * from blogs where id = ${id}`
    return exec(sql).then(rows=>{
        return rows[0]
    })
}

//新增一个博客
const newBlog = (blogData={}) => {
    const { title, content, author} = blogData;
    const createtime = Date.now();
    const sql = `insert into blogs (title, content, author, createtime) values('${title}','${content}','${author}',${createtime})`;
    console.log('blogData: ', blogData)
    return exec(sql).then(res=>{
        return {
            id: res.insertId
        }
    })
    // return {
    //     id: 3
    // }
}

//更新博客内容
const updateBlog = (id, blogData={}) => {
    //id为博客的id
    //blogData为更新的内容
    const {title, content} = blogData;
    const sql = `update blogs set title = '${title}', content = '${content}' where id = ${id}`
    return exec(sql).then(res=>{
        console.log('res:', res)
        if(res.affectedRows > 0){
            return true;
        }
        return false;
    })
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id=${id} and author='${author}'`;
    return exec(sql).then(res=>{
        if(res.affectedRows > 0){
            return true
        }
        return false;
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
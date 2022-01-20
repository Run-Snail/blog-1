const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const getPostData =(req) => {
    return new Promise((resolve,reject)=>{
        if(req.method !== 'POST'){
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = '';
        req.on('data', chunk=>{
            postData += chunk.toString()
        })
        req.on('end', ()=>{
            if(!postData){
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
       
    })
  
}

const serverHandler =(req, res) => {
    //设置返回格式
    res.setHeader('Content-type','application/json')
    const url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1])
    getPostData(req).then(postData => {
        req.body = postData;

        const blogResult = handleBlogRouter(req, res);

        if(blogResult){
            blogResult.then(blogData=>{
                if(blogData){
                    console.log('blogData:',JSON.stringify(blogData))
                    res.end(JSON.stringify(blogData))
                }
            })
            return;
        }
        
        const userResult = handleUserRouter(req, res);
        if(userResult){
            userResult.then(userData=>{
                res.end(JSON.stringify(userData))
            })
            return;
        }

        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write('404 not found \n')
        res.end()
    })



}

module.exports = serverHandler;
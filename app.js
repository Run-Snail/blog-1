const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')

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

const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

//存放session
// const SESSION_DATA = {};

const serverHandler =(req, res) => {
    //设置返回格式
    res.setHeader('Content-type','application/json')
    const url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1]);
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if(!item){
           return; 
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    });

    // SESSION_DATA方式存储session
    // let userId = req.cookie.userid;
    // let needSetCookie = false;
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {};
    //     }
    // }else{
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //使用redis方式存储session
    let userId = req.cookie.userid;
    let needSetCookie = false;
    if(!userId){
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`
        set(userId, {})
    }
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if(sessionData == null){
            req.session = null
        }else{
            req.session = sessionData
        }
        console.log('req.session:', req.session)
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData;

        const blogResult = handleBlogRouter(req, res);

        if(blogResult){
            blogResult.then(blogData=>{
                if(blogData){
                    if(needSetCookie){
                        res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }
                    res.end(JSON.stringify(blogData))
                }
            })
            return;
        }
        
        const userResult = handleUserRouter(req, res);
        if(userResult){
            userResult.then(userData=>{
                if(userData){
                    if(needSetCookie){
                        res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                    }
                    res.end(JSON.stringify(userData))
                }
            })
            return;
        }

        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write('404 not found \n')
        res.end()
    })

}


module.exports = serverHandler;
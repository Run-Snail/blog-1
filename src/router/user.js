const { login } = require('../controller/user')
const { SuccessModel, ErrorModel} = require('../model/resModel')
const { set } = require('../db/redis')



const handleUserRouter = (req, res) => {
    const method = req.method
    // const { username, password} = req.body
    const { username, password} = req.query

    //登陆接口
    if(method === 'GET' && req.path === '/api/user/login'){
        const result = login(username, password);
        return result.then(loginData=>{
            if(loginData && loginData.username){
                req.session.username = loginData.username;
                req.session.realname = loginData.realname;
                set(req.sessionId, req.session);
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败，请稍后重试')
        })  
    }

    if(method === "GET" && req.path === '/api/user/login-test'){
        if(req.session.username){
            return Promise.resolve(
                new SuccessModel({
                    session: req.session
                })
            )
        }else{
            return Promise.resolve(
                new ErrorModel('登陆失败')
            )
        }
        
    }
}
module.exports = handleUserRouter;
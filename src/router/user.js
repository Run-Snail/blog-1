const { login } = require('../controller/user')
const { SuccessModel, ErrorModel} = require('../model/resModel')


const handleUserRouter = (req, res) => {
    const method = req.method
    const { username, password} = req.body

    //登陆接口
    if(method === 'POST' && req.path === '/api/user/login'){
        const result = login(username, password);
        return result.then(loginData=>{
            console.log('loginData= ',loginData)
            if(loginData && loginData.username){
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败，请稍后重试')
        })  
    }
}
module.exports = handleUserRouter;
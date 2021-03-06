const { getList,getDetail, newBlog, updateBlog, delBlog } = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id;
    
    //获取列表接口
    if(method === 'GET' && req.path === '/api/blog/list'){
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const result = getList(author, keyword);
        
        return result.then(listData=>{
            return new SuccessModel(listData)
        })
        // return getList(author, keyword).then(listData=>{
        //     return new SuccessModel(listData)
        // })
    }

     //获取博客内容
     if(method === 'GET' && req.path === '/api/blog/detail'){
         const result = getDetail(id)
         return result.then(blogData=>{
             return new SuccessModel(blogData)
         })
    }

     //新增博客
     if(method === 'POST' && req.path === '/api/blog/new'){
         req.body.author = 'zhangsan';
         const result = newBlog(req.body);
         return result.then(data=>{
             return new SuccessModel(data)
         })
        // return new SuccessModel(data)
    }

    //更新博客
    if(method === 'POST' && req.path === '/api/blog/update'){
        const result = updateBlog(id, req.body)
        return result.then(updateData=>{
            if(updateData){
                return new SuccessModel()
            }else{
                return new ErrorModel('博客更新失败')
            }
        })
    }

     //删除博客
     if(method === 'POST' && req.path === '/api/blog/del'){
         const author = "zhangsan";
        const result = delBlog(id,author);
        return result.then(delData=>{
            if(delData){
                return new SuccessModel()
            }
            return new ErrorModel('删除博客失败')
        })
    }
}

module.exports = handleBlogRouter;
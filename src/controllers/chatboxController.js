import chatboxServices from '../Services/chatboxServices'
let chatboxStart = async (req,res) =>{
    try{
        // let data= await db.User.findAll();
        let data = await chatboxServices.chatboxStartService(req.body)
        return res.status(200).json(data); 
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getMessagesByChatboxId = async (req,res)=>{
    try {
        // console.log('getMessagesByChatboxIdService',req.query.id)
        let data = await chatboxServices.getMessagesByChatboxIdService(req.query.id)
        return res.status(200).json(data); s
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let sendMessage = async(req,res)=>{
    try {
        let data = await chatboxServices.sendMessageService(req.body)
        // console.log('sendMessage req.body: ',req.body)
        return res.status(200).json(data); 
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllAdminChatboxByAdminId= async(req,res)=>{
    try {
        let data = await chatboxServices.getAllAdminChatboxByAdminIdService(req.query.id)
        return res.status(200).json(data); 

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports ={
    chatboxStart : chatboxStart,
    getMessagesByChatboxId : getMessagesByChatboxId,
    sendMessage : sendMessage,
    getAllAdminChatboxByAdminId : getAllAdminChatboxByAdminId
}
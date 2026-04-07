
// import db from '../models/index'
import userService from "../Services/userServices";
let getHomePage = async (req,res) =>{
    try{
        // let data= await db.User.findAll();
    

        return res.render('homePage.ejs'); 
    }catch(e){
        console.log(e)
    }
}

let getAboutme = (req,res) =>{
    return res.render('test/about.ejs');
}
let getAuctionAnnouncement=(async(req,res)=>{
    try {
        // console.log('getAuctionAnnouncement body',req.body)
        let data = await userService.getAuctionAnnouncementService(req.body)
        // console.log('req.header: ',req.header)
        // console.log('Controller run !!!',data)
        
        return res.status(200).json(data);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
            getAuctionAnnouncementBody:req.body
        })
    }

})
let handleSendMail=(async(req,res)=>{
    try {
        // console.log('check handle send mail controller: ',req.body)
        let data = await userService.sendMail(req.body)
        return res.status(200).json({
            errCode: 0,
            errMessage: data
        });

    } catch (e) {
        console.log('Handle send mail controller error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }

})
let handleSignUp=(async(req,res)=>{
    try {
        // console.log('check handleSignUp controller: ',req.body)
        let data = await userService.SignUp(req.body)
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle signup error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
})
let handleLogin=(async(req,res)=>{
    try {
        // console.log('check handleLogin controller: ',req.body)
        let data = await userService.Login(req.body)
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle handleLogin error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
})

let handleCreateRealEstate = (async(req,res)=>{
    try {
        let data = await userService.createRealEstate(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Handle handleCreateRealEstate error: ',e)
    }
})
let handleSettingRealEstate = (async(req,res)=>{
    try {
        let data = await userService.settingRealEstate(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Handle handleSettingRealEstate error: ',e)
    }
})
let handleAdditionalInformationRealEstate = (async(req,res)=>{
    try {
        let data = await userService.additionalInformationRealEstate(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Handle handleSettingRealEstate error: ',e)
    }
})

let handleCreateRental = (async(req,res)=>{
    try {
        let data = await userService.handleCreateRentalService(
            req.body,
            req.file   // 👈 truyền file xuống
        );
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle handleCreateRentalService error: ', e);
        return res.status(500).json({ error: e.message });
    }
})
let handleCreateRentalProperty = (async(req,res)=>{
    try {
        let data = await userService.handleCreateRentalPropertyService(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle handleCreateRentalService error: ', e);
        return res.status(500).json({ error: e.message });
    }
})
let handlePublicDateToFile =  (async(req,res)=>{
    try {
        let data = await userService.handlePublicDateToFileService(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle handlePublicDateToFileService error: ', e);
        return res.status(500).json({ error: e.message });
    }
})
let handleGetPublicDateFromFile =  (async(req,res)=>{
    try {
        let data = await userService.GetPublicDateFromFileService();
        return res.status(200).json(data);
    } catch (e) {
        console.log('Handle handlePublicDateToFileService error: ', e);
        return res.status(500).json({ error: e.message });
    }
})




module.exports = {
    getHomePage: getHomePage,
    getAboutme : getAboutme,
    getAuctionAnnouncement : getAuctionAnnouncement,
    handleSendMail : handleSendMail,
    handleSignUp : handleSignUp,
    handleLogin : handleLogin,
    handleCreateRealEstate : handleCreateRealEstate,
    handleSettingRealEstate : handleSettingRealEstate,
    handleAdditionalInformationRealEstate : handleAdditionalInformationRealEstate,
    handleCreateRental : handleCreateRental,
    handleCreateRentalProperty : handleCreateRentalProperty,
    handlePublicDateToFile : handlePublicDateToFile,
    handleGetPublicDateFromFile : handleGetPublicDateFromFile
    
}
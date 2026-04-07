import  express  from "express";
import homeController from "../controllers/homeController";
import sendEmail from "../sendEmail"
import { authenticateToken,authorizeRoles } from "../middleware/auth";
import chatboxController from "../controllers/chatboxController"
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

let router = express.Router();

let initWebRoutes = (app)=>{
    router.get('/', homeController.getHomePage);

    // router.get('/aboutme',homeController.getAboutme)
    // router.post('/api/create-new-recruitment', homeController.handleCreateNewRecruitment);//tao donn tuyen dsung

    router.post('/api/auctionAnnouncement',
        // authenticateToken,
        // authorizeRoles('Admin'),
        homeController.getAuctionAnnouncement)
    
    router.post('/api/send-mail', homeController.handleSendMail);//handle send mailsss

    //
    router.post('/api/signup', homeController.handleSignUp);//đăng ký
    router.post('/api/login', homeController.handleLogin);//đăng nhập

    //chatbox
    router.post('/api/chatbox/start', chatboxController.chatboxStart);//bắt đầu/tạo chatbox 
    router.get('/api/get-messages-by-chatbox-id', chatboxController.getMessagesByChatboxId)// lấy tin nhắn trong phòng
    router.post('/api/messages/send', chatboxController.sendMessage)// gửi tin nhắn

    router.get('/api/getAllAdminChatbox-by-admin-id', chatboxController.getAllAdminChatboxByAdminId)// gửi tin nhắn

    
    //Bất động sản
    router.post('/api/create-real-estate', homeController.handleCreateRealEstate)// tạo bđs
    router.put('/api/setting-real-estate', homeController.handleSettingRealEstate)// tạo/sửa thông tin chính
    router.put('/api/additional-information-real-estate', homeController.handleAdditionalInformationRealEstate)// tạo/sửa thông tin thêm
    
    //Quyền thuê
    router.post('/api/create-rental-property-data', 
        upload.single("file"),  // 👈 QUAN TRỌNG
        homeController.handleCreateRental)// tạo tài sản cho thuê


    router.post('/api/create-rental-property',homeController.handleCreateRentalProperty)// tạo tài sản cho thuê

    //Nhắc nhở đăng cổng lần 2
    router.post('/api/public-date-to-file', homeController.handlePublicDateToFile);//ghi ngày đăng cổng vào file
    router.get('/api/get-public-date-from-file', homeController.handleGetPublicDateFromFile);//ghi ngày đăng cổng vào file
    //rest api : sử dụng get, post,...
    return app.use("/", router);
}

module.exports = initWebRoutes
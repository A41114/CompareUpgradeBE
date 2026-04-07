import { Model, where } from "sequelize";
import db from "../models/index";
import { error } from "selenium-webdriver";
import { resolve } from "path";
import { rejects } from "assert";

const bcrypt = require('bcrypt');

const axios = require('axios');
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');
// const { Builder, By } = require('selenium-webdriver');
const { chromium } = require('playwright');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

let chatboxStartService = (data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
           
            let chat = await db.Chatbox.findOne({
                where:{
                    customer_id: data.customer_id,
                    admin_id: data.admin_id
                }
            })

            if (!chat) {
                //chat = await db.chatbox.create({ customer_id: data.customer_id, admin_id: data.admin_id, status: 'open' });
                chat = await db.Chatbox.create({
                    customer_id: data.customer_id,
                    // admin_id: data.admin_id, 
                    admin_id: 19, 
                    status:'open',
                });
                resolve({
                    errCode:0,
                    message: 'Mở phòng chat thành công!',
                    chat
                });
            }else{
                resolve({
                    errCode:0,
                    message: 'Phòng chat đã tồn tại',
                    chat
                });
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getMessagesByChatboxIdService = (id)=>{
    // console.log('id from services: ',id)
    return new Promise(async(resolve,reject)=>{
        try {
            let messages = await db.Message.findAll({
                where:{
                    chat_room_id: id
                },
                order:[['createdAt','ASC']]
                // order:[['createdAt','DESC']]
            })
            resolve({
                errCode:0,
                message:'Lấy tin nhắn thành công!',
                messages
            })
        } catch (e) {
            reject(e)
        }
    })
}
let sendMessageService = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let message = await db.Message.create({
                chat_room_id:data.chat_room_id,
                sender_id:data.sender_id,
                sender_role:data.sender_role,
                message:data.message
            })
            io.to(`room_${chat_room_id}`).emit('new_message', message);
            resolve({
                errCode:0,
                message
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getAllAdminChatboxByAdminIdService = (admin_id)=>{
    return new Promise(async(resolve,rejects)=>{
        try {
            let chat = await db.Chatbox.findAll({
                where:{
                    admin_id : admin_id
                }
            })
            resolve({
                errCode:0,
                message:'Get chat succeeds!',
                chat
            })
        } catch (e) {
            rejects(e)
        }
    })
}
module.exports={
    chatboxStartService : chatboxStartService,
    getMessagesByChatboxIdService : getMessagesByChatboxIdService,
    sendMessageService : sendMessageService,
    getAllAdminChatboxByAdminIdService : getAllAdminChatboxByAdminIdService
}
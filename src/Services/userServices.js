import { where } from "sequelize";
import db from "../models/index";
import { error } from "selenium-webdriver";
import { resolve } from "path";
import { rejects } from "assert";
import { resolve4 } from "dns";
import fs from "fs";

const bcrypt = require('bcrypt');

const axios = require('axios');
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');
// const { Builder, By } = require('selenium-webdriver');
const { chromium } = require('playwright');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const XLSX = require("xlsx");
const FormData = require("form-data");

let htmlContent='';
let links='';

let SD_Matrix = []
let ED_Matrix = []

let BSD_Matrix = []
let BED_Matrix = []
let PN=[]

let partnerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfY3QiOiJwZXJzb25hbCIsIl9pZCI6IjY3ZDdlY2ViNjdlOWJjYjg5YmEzYmFlMSIsIl9kaWQiOiIzMTY1MzQwMjQ5YmM3YWRjYjczODE0MjAwYTRkMTBmNiIsIl9hciI6InBhcnRuZXIiLCJfcHIiOlsiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fmNvbW1vbn42ODY5NWY5ZTkyNTEyMzZjMjE4OThkZmJ-Njg2YjMyMDk1Yzc4MzAyMDg1ZTlhYWQzIiwiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fnJlYWwtZXN0YXRlfjY4Y2I3MjI4YTA2ZTgyOTU1M2M0NjQ1Zn42OGNiODhmODZiYmEzNDA1MWMzYmU5ZTUiXSwiX3JpZCI6ImZkNDdkMTg0MDY2YjYzMDYiLCJfdCI6MSwiaWF0IjoxNzc1NDM3MzYwLCJleHAiOjE3NzU1MjM3NjB9.uLit0oZryezvSXMmWltViZfAZq8J7xbdMmGKRxz0M7I'

async function fetchData(url) {
    if(url){
        try {
                
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] }); // headless: false để thấy trình duyệt hoạt động
                const context = await browser.newContext();
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://partner.daugiavna.vn/taisankhac/product'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // // Nhập thông tin đăng nhập
                await page.fill('input[type="text"]', 'dohoangquan.1112002@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[type="password"]', 'Abc@1234'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhậps
                await page.click('button[type="button"]'); // Thay 'button[type="submit"]' với selector tương ứng
                await page.waitForNavigation();
                
                await page.click('button[type="button"]'); // Thay chọn phân hệ
                await page.waitForNavigation();

                //Chuyển sang đã kết thúc
                // await page.click('button[type="button"]'); // Thay chọn phân hệ
                // await page.waitForNavigation();

                await page.goto(url, { waitUntil: 'networkidle',timeout: 60000 });

                const place = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Nơi xem tài sản" })
                .locator("input")
                .inputValue();

                const checkProperty = await page
                .locator("div.col-md-12")
                .filter({ hasText: "Thời gian xem tài sản" })
                .locator("input")
                .inputValue();

                
                await page.locator('//button[normalize-space()="Thông tin đấu giá"]').click();
                
                //
                const register_Deposit_Start = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian mở đăng ký (*)" })
                .locator("input")
                .inputValue();


                const register_Deposit_End = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian kết thúc đăng ký (*)" })
                .locator("input")
                .inputValue();

                

                const start_bidding = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian bắt đầu trả giá (*)" })
                .locator("input")
                .inputValue();
                
                
                const bidding_time = await page
                .locator("div.col-md-4")
                .filter({ hasText: "Thời gian đấu giá (*)" })
                .locator("input")
                .inputValue();
                
                const bidding_time_unit = await page
                .locator('div.col-md-2:has-text("Đơn vị") .multiselect-single-label-text')
                .textContent();
                let end_bidding = parseDateTime(start_bidding)
                if(bidding_time_unit.trim()==='Phút'){
                    // end_bidding = end_bidding.toLocaleString("vi-VN")
                    // console.log('Start phút: ', end_bidding.toLocaleString("vi-VN"))ss
                    //console.log('Số phút: ', bidding_time)
                    end_bidding.setMinutes(end_bidding.getMinutes()+Number(bidding_time))
                    end_bidding = end_bidding.toLocaleString("vi-VN")
                    
                    // console.log('end_bidding: ',end_bidding.toLocaleString("vi-VN"));
                }else if(bidding_time_unit.trim()==='Giờ'){
                    
                    end_bidding.setHours(end_bidding.getHours()+Number(bidding_time))
                    end_bidding = end_bidding.toLocaleString("vi-VN")
                    //console.log('end_bidding: ',end_bidding.toLocaleString("vi-VN"));
                }
                
                // console.log('end_bidding: ',end_bidding)
                // console.log('start_bidding: ',start_bidding)
                // console.log('bidding_time: ',bidding_time)
                // console.log('bidding_time_unit: ',bidding_time_unit.trim())

                const fee = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Tiền hồ sơ đấu giá (*)" })
                .locator("input")
                .inputValue();

                const deposit = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Tiền đặt trước (*)" })
                .locator("input")
                .inputValue();

                const starting_price = await page
                .locator("div.col-md-4")
                .filter({ hasText: "Giá khởi điểm (*)" })
                .locator("input")
                .inputValue()

                const step = await page
                .locator("div.col-md-3")
                .filter({ hasText: "Bước giá (*)" })
                .locator("input")
                .inputValue();

                await page.click('button:has-text("Thông tin thêm")');

                const owner = await page
                .locator("div.col-md-4")
                .filter({ hasText: "Đơn vị có tài sản" })
                .locator("input")
                .inputValue();

                
                
                // Đóng trình duyệt
                await browser.close();
                return {place, checkProperty, register_Deposit_Start, register_Deposit_End, start_bidding, end_bidding, fee, deposit, starting_price,
                    step, owner
                };

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}
function parseDateTime(str) {
    const [date, time] = str.split(" ");
    const [day, month, year] = date.split("/").map(Number);
    const [hour, minute, second] = time.split(":").map(Number);
  
    return new Date(year, month - 1, day, hour, minute, second);
}
async function fetchDataBDS(url) {
    if(url){
        try {
                
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] }); // headless: false để thấy trình duyệt hoạt động
                const context = await browser.newContext();
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://partner.daugiavna.vn/taisankhac/product'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // // Nhập thông tin đăng nhập
                await page.fill('input[type="text"]', 'dohoangquan.1112002@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[type="password"]', 'Abc@1234'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhậps
                await page.click('button[type="button"]'); // Thay 'button[type="submit"]' với selector tương ứng
                await page.waitForNavigation();

                await page.selectOption("div.mb-3:nth-of-type(2) select.form-select", "real-estate");

                await page.click('button[type="button"]'); // Thay chọn phân hệ
                await page.waitForNavigation();

                await page.goto(url, { waitUntil: 'networkidle',timeout: 60000 });


                const area = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Diện tích (m²) (*)" })
                .locator("input")
                .inputValue();

                const place = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Nơi xem bất động sản" })
                .locator("input")
                .inputValue();

                const checkProperty = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian xem bất động sản" })
                .locator("input")
                .inputValue();

                const propertyCode = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Ký hiệu lô đất" })
                .locator("input")
                .inputValue();

                
                await page.locator('//button[normalize-space()="Thông tin đấu giá"]').click();
                
                //
                const register_Deposit_Start = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian mở đăng ký (*)" })
                .locator("input")
                .inputValue();


                const register_Deposit_End = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian kết thúc đăng ký (*)" })
                .locator("input")
                .inputValue();

                const start_bidding = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Thời gian bắt đầu trả giá (*)" })
                .locator("input")
                .inputValue();

                const bidding_time = await page
                .locator("div.col-md-4")
                .filter({ hasText: "Thời gian đấu giá (*)" })
                .locator("input")
                .inputValue();

                const bidding_time_unit = await page
                .locator('div.col-md-2:has-text("Đơn vị") .multiselect-single-label-text')
                .textContent();
                let end_bidding = parseDateTime(start_bidding)

                if(bidding_time_unit.trim()==='Phút'){
                    // console.log('end_bidding: ',end_bidding.toLocaleString("vi-VN"));
                 
                    end_bidding.setMinutes(end_bidding.getMinutes()+Number(bidding_time))

                    // console.log('end_bidding_after: ',end_bidding.toLocaleString("vi-VN"));

                    end_bidding = end_bidding.toLocaleString("vi-VN")
                    
                    //console.log('end_bidding: ',end_bidding);
                    //console.log('end_bidding_toLocaleString("vi-VN"): ',end_bidding.toLocaleString("vi-VN"));
                }else if(bidding_time_unit.trim()==='Giờ'){
                    
                    end_bidding.setHours(end_bidding.getHours()+Number(bidding_time))
                    end_bidding = end_bidding.toLocaleString("vi-VN")
                    // console.log('end_bidding: ',end_bidding.toLocaleString("vi-VN"));
                }
                
                // console.log('end_bidding: ',end_bidding)
                // console.log('start_bidding: ',start_bidding)
                // console.log('bidding_time: ',bidding_time)
                // console.log('bidding_time_unit: ',bidding_time_unit.trim())

                
                const fee = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Phí tham gia đấu giá (*)" })
                .locator("input")
                .inputValue();

                const deposit = await page
                .locator("div.col-md-6")
                .filter({ hasText: "Tiền đặt trước (*)" })
                .locator("input")
                .inputValue();

                const starting_price = await page
                .locator("div.col-md-4")
                .filter({ hasText: "Giá khởi điểm/m² (*)" })
                .locator("input")
                .inputValue()

                const step = await page
                .locator("div.col-md-3")
                .filter({ hasText: "Bước giá (*)" })
                .locator("input")
                .inputValue();

                

                await page.click('button:has-text("Thông tin thêm")');

                const owner = await page
                .locator("div.col-md-4")
                .filter({ hasText: "Đơn vị có tài sản" })
                .locator("input")
                .inputValue();

                
                
                // Đóng trình duyệt
                await browser.close();
                return {place, checkProperty, register_Deposit_Start, register_Deposit_End, start_bidding, end_bidding, fee, deposit, starting_price,
                    step, owner
                };

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}

async function fetchDataDgts(data) {
    if(data){
        try {
                
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false,
                    args: [
                        '--disable-blink-features=AutomationControlled',
                        '--disable-web-security',
                        '--disable-features=IsolateOrigins,site-per-process'
                      ]
                 }); // headless: false để thấy trình duyệt hoạt động
                // const context = await browser.newContext();
                const context = await browser.newContext({
                    viewport: null,     // dùng kích thước thật của màn hình
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
                    javaScriptEnabled: true,
                  });
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://dgts.moj.gov.vn/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // Nhập thông tin đăng nhập
                await page.fill('input[id="username"]', 'vnahanoi_tc_hanoi'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[id="password"]', 'vna2020'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhậps
                await page.click('button[id="btnLogin"]'); // Thay 'button[type="submit"]' với selector tương ứng

                await page.waitForNavigation();

                await page.click('a[class="btn btn-success"]')


                //Tạo thông báo

                //Tên địa chỉ chủ tài sản
                await page.fill('input[id="fullName"]', data.owner)
                await page.fill('input[id="address"]', data.owner_Address)

                //Tg địa điểm tổ chức đg
                await page.fill('input[id="aucTime"]', data.bidding_Start_Fulltime)
                await page.fill('input[id="aucAddr"]', data.aucAddress)
                //Tg đăng ký
                await page.fill('input[id="aucRegTimeStart"]', data.aucRegTimeStart)
                await page.fill('input[id="aucRegTimeEnd"]', data.aucRegTimeEnd)
                //Cách thức đăng ký
                await page.fill('textarea[id="aucCondition"]', data.aucCondition)
                //Tg đặt trước
                await page.fill('input[id="aucTimeDepositStart"]', data.aucRegTimeStart)
                await page.fill('input[id="aucTimeDepositEnd"]', data.aucRegTimeEnd)

                //Nhập thêm thông tin
                await page.click('a[id="advanceOrSimpleLink"]')
                //Tg địa điểm xem ts/ bán HS
                await page.fill('textarea[id="propertyViewLocation"]', data.propertyViewLocation)
                await page.fill('textarea[id="fileSellLocation"]', data.fileSellLocation)
                //Hình thức/phương thức đấu giá
                await page.selectOption('select[id="aucType"]', data.aucType.toString());
                await page.selectOption('select[id="aucMethod"]', data.aucMethod.toString())
                
                //Thêm mới tài sản
                await page.click('button[data-target="#addPropertyInfo"]')
                //Tên, địa điểm xem tài sản
                await page.fill('input[id="propertyName"]', data.propertyName)
                await page.fill('input[id="propertyPlace"]', data.propertyPlace)
                //Giá khởi điểm
                await page.fill('input[id="propertyStartPrice"]', data.propertyStartPrice.replaceAll('.',''))
                //Đon vị đặt cọc
                await page.selectOption('select[id="depositUnit"]', data.depositUnit.toString());
                //Tiền đặt trước
                await page.fill('input[id="deposit"]', data.deposit.replaceAll('.',''))
                //Tiền mua hồ sơ
                await page.fill('input[id="fileCost"]', data.fileCost.replaceAll('.',''))

                //Lưu tài sản
                await page.click('button[id="btnSavePropertyInfo"]')





                // await browser.close();

                return ;

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}

async function fetchDataVnaPartnerNew(data) {
    if(data){
        try {
                 
                // console.log('fetchDataVnaPartnersssNew: ',data)
                // Khởi tạo trình duyệt
                const browser = await chromium.launch({ headless: false }); // headless: false để thấy trình duyệt hoạt động
                const context = await browser.newContext();
                const page = await context.newPage();

                // Điều hướng đến trang đăng nhập
                await page.goto('https://partner.daugiavna.vn/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

                // Nhập thông tin đăng nhập
                await page.fill('input[type="text"]', 'dohoangquan.1112002@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
                await page.fill('input[type="password"]', 'Abc@1234'); // Thay 'input[name="password"]' với selector tương ứng

                // Gửi biểu mẫu đăng nhậps
                await page.click('button[type="button"]'); // Thay 'button[type="submit"]' với selector tương ứng
                await page.waitForNavigation();
                
                await page.click('button[type="button"]'); // Thay chọn phân hệ
                await page.waitForNavigation();

                await page.goto('https://partner.daugiavna.vn/taisankhac/product');



                if(data.status==='create'){
                    // console.log('Tạo tài sản')
                    // Tạo tài sản
                    await page.click('button[class="mt-1 mb-0 btn btn-success btn-sm mt-sm-0 px-4"]')
                    //class = form-control form-control-text Socialss

                    //
                    if(data.isCar){
                        await page.click('input.multiselect-search');
                        await page.type('input.multiselect-search', 'Tài sản Xe ôtô');
                        await page.waitForSelector('.multiselect-option');
                        await page.click('.multiselect-option');
                    }else{
                        await page.click('input.multiselect-search');
                        await page.type('input.multiselect-search', 'Danh mục tài sản của tôi');
                        await page.waitForSelector('.multiselect-option');
                        await page.click('.multiselect-option');
                    }
                    await page.fill('input[class="form-control form-control-text"]', data.shortPropertyName);
                    await page.fill('div.ql-editor', data.propertyName);

                    // await page.click('button[title="Socials"]')

                    const propertyPlace = page.locator('div.col-md-6:has(label:has-text("Nơi xem tài sản")) input');
                    await propertyPlace.fill(data.propertyPlace);

                    const propertyViewTime = page.locator('div.col-md-12:has(label:has-text("Thời gian xem tài sản")) input');
                    await propertyViewTime.fill(data.propertyViewTime);

                    // await page.fill('input[placeholder="Nơi xem tài sản"]', data.propertyPlace);
                    // await page.fill('input[placeholder="Thời gian xem tài sản"]', data.propertyViewTime);

                    await page.click('button[type="submit"]')
                    
                }
                if(data.status==='edit'){
                    //Chỉnh sửa tài sản
                    await page.click('input[id="stsNháp"]')
                    await page.waitForSelector('tr');
                    // const row = await page.locator('tr', { hasText: data.shortPropertyName});
                    const row = page.locator('tr').filter({
                        hasText: data.shortPropertyName,
                    }).filter({
                        hasText: 'Nháp',
                    });
                    // console.log('ROW: ',row)
                    await row.locator('button[class="btn btn-outline-primary btn-icon-only btn-rounded mb-0 me-1 btn-sm"]').click();
                    await page.click('button[type="submit"]')
                }

                
                // await row.locator('button[title="Thông tin đấu giá"]').click();
                // await row.locator('button[class="btn btn-outline-primary btn-icon-only btn-rounded mb-0 me-1 btn-sm"]').click();
                
                 
                const regStart = page.locator('div.col-md-6:has(label:has-text("Thời gian mở đăng ký")) input');
                await regStart.fill(data.aucRegTimeStart+':00');
                await regStart.press('Enter');

                const regEnd = page.locator('div.col-md-6:has(label:has-text("Thời gian kết thúc đăng ký")) input');
                await regEnd.fill(data.aucRegTimeEnd+':00');
                await regEnd.press('Enter');

                // const depositStart = page.locator('div.col-md-6:has(label:has-text("Thời gian bắt đầu nộp tiền cọc")) input');
                // await depositStart.fill(data.aucRegTimeStart+':00');
                // await depositStart.press('Enter');

                // const depositEnd = page.locator('div.col-md-6:has(label:has-text("Thời gian kết thúc nộp tiền cọc")) input');
                // await depositEnd.fill(data.aucRegTimeEnd+':00');
                // await depositEnd.press('Enter');

                const biddingStart = page.locator('div.col-md-6:has(label:has-text("Thời gian bắt đầu trả giá")) input');
                await biddingStart.fill(data.bidding_Start_Fulltime+':00');
                await biddingStart.press('Enter');

                const biddingTime = page.locator('div.col-md-4:has(label:has-text("Thời gian đấu giá")) input');
                if(data.testStt==='test'){
                    // console.log('yep')
                    await biddingTime.fill('5');
                }else{
                    await biddingTime.fill('30');
                }
                const fileCost = page.locator('div.col-md-6:has(label:has-text("Tiền hồ sơ đấu giá")) input');
                await fileCost.fill(data.fileCost.replaceAll('.',''));
                
                const deposit = page.locator('div.col-md-6:has(label:has-text("Tiền đặt trước")) input');
                await deposit.fill(data.deposit.replaceAll('.',''));

                const propertyStartPrice = page.locator('div.col-md-4:has(label:has-text("Giá khởi điểm")) input');
                await propertyStartPrice.fill(data.propertyStartPrice.replaceAll('.',''));

                const step = page.locator('div.col-md-3:has(label:has-text("Bước giá (*)")) input');
                await step.fill(data.step.replaceAll('.',''));

                //Cho phép đấu 1 người
                const onePersonAllowed = page.locator('div.col-md-4:has(label:text("Cho phép đấu giá 1 người"))');
                // Click mở dropdown
                await onePersonAllowed.locator('input.multiselect-search').click();
                // Gõ từ khoá tìm kiếm
                await onePersonAllowed.locator('input.multiselect-search').fill(data.onePersonAllowed);
                // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                const onePersonAllowedFirstOption = onePersonAllowed.locator('.multiselect-option').first();
                await onePersonAllowedFirstOption.waitFor({ state: 'visible' });
                // Click chọn dòng đầu tiên
                await onePersonAllowedFirstOption.click();

                //Tài khoản nhận tiền
                if(data.bank!=="Tài khoản chính"){
                    const bank = page.locator('div.col:has(label:text("Tài khoản nhận tiền"))');

                    // Click mở dropdown
                    await bank.locator('input.multiselect-search').click();

                    // Gõ từ khoá tìm kiếm
                    await bank.locator('input.multiselect-search').fill(data.bank.toString());
                    // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                    const bankFirstOption = bank.locator('.multiselect-option').first();
                    await bankFirstOption.waitFor({ state: 'visible' });

                    // Click chọn dòng đầu tiên
                    await bankFirstOption.click();
                }
                //Đấu giá viên
                const auctioneer = page.locator('div.col-md-3:has(label:text("Đấu giá viên (*)"))');
                // Click mở dropdown
                await auctioneer.locator('input.multiselect-search').click();
                // Gõ từ khoá tìm kiếm
                await auctioneer.locator('input.multiselect-search').fill(data.auctioneer);
                // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                const auctioneerFirstOption = auctioneer.locator('.multiselect-option').first();
                await auctioneerFirstOption.waitFor({ state: 'visible' });
                // Click chọn dòng đầu tiên
                await auctioneerFirstOption.click();


                // //Chủ tài sản
                // const ownerContainer = page.locator('div.col-md-3:has(label:text("Chủ tài sản"))');
                // // Click mở dropdown
                // await ownerContainer.locator('input.multiselect-search').click();
                // // Gõ từ khoá tìm kiếm
                // await ownerContainer.locator('input.multiselect-search').fill(data.owner);
                // // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                // const firstOption = ownerContainer.locator('.multiselect-option').first();
                // await firstOption.waitFor({ state: 'visible' });
                // // Click chọn dòng đầu tiên
                // await firstOption.click();
                

                //Thư ký
                const secretary = page.locator('div.col-md-3:has(label:text("Thư ký"))');

                // Click mở dropdown
                await secretary.locator('input.multiselect-search').click();

                // Gõ từ khoá tìm kiếm
                await secretary.locator('input.multiselect-search').fill(data.secretary);


                // Chờ kết quả đầu tiên xuất hiện (giả sử option là <li class="multiselect-option"> hoặc <div>)
                const secretaryFirstOption = secretary.locator('.multiselect-option').first();
                await secretaryFirstOption.waitFor({ state: 'visible' });

                // Click chọn dòng đầu tiên
                await secretaryFirstOption.click();
                
                //Thông tin thêm
                await page.click('button:has-text("Thông tin thêm")');
                const ownerUnit = page.locator('div.col-md-4:has(label:text-is("Đơn vị có tài sản")) input');
                await ownerUnit.fill(data.owner);

                const HDDV = page.locator('div.col-md-12:has(label:has-text("Căn cứ hợp đồng")) textarea');
                await HDDV.fill(data.HDDGDV);

                const guest = page.locator('div.col-md-6:has(label:has-text("Khách mời chứng kiến (1)")) input');
                await guest.fill('Không có');

                //Số quy chế và quy chế
                const rules_num = page.locator('div.col-md-12:has(label:has-text("Quy chế số")) input');
                await rules_num.fill(data.rules_num);

                await page.fill('.ql-editor', data.rulesContent);

                // await browser.close();

                return ;

        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    }else{
        return ''
    }
}

async function fetchDataSchedule (data) {
    SD_Matrix = []
    ED_Matrix = []

    BSD_Matrix = []
    BED_Matrix = []
    PN=[]
    // Khởi tạo trình duyệt
    const browser = await chromium.launch({ headless: false }); // headless: false để thấy trình duyệt hoạt động
    const context = await browser.newContext();
    const page = await context.newPage();

    // Điều hướng đến trang đăng nhập
    await page.goto('https://partner.daugiavna.vn/login'); // Thay 'https://example.com/login' bằng URL trang đăng nhập thực tế

    // Nhập thông tin đăng nhập
    await page.fill('input[type="text"]', 'dohoangquan.1112002@gmail.com'); // Thay 'input[name="username"]' với selector tương ứng
    await page.fill('input[type="password"]', 'Abc@1234'); // Thay 'input[name="password"]' với selector tương ứng

    // Gửi biểu mẫu đăng nhậps
    await page.click('button[type="button"]'); // Thay 'button[type="submit"]' với selector tương ứng

    await page.waitForNavigation();

    await page.goto('https://partner.daugiavna.vn/taisankhac/product');
    
    


    //Đếm số lượng cột và tìm cột cụ thể
    await page.waitForSelector('table thead tr th'); // Đợi phần tử xuất hiện
    const headers = page.locator('table thead tr th');
    const headerCount = await headers.count();
    // console.log('headerCount: ',headerCount)

    let timeColumnIndex = -1;
    let codeNameColumnIndex=-1;
    let biddingTimeColumnIndex=-1;
    let propertyNameColumnIndex=-1;
    for (let i = 0; i < headerCount; i++) {
        const text = await headers.nth(i).innerText();
        
        if (text.trim() === 'MÃ TÀI SẢN') {
            codeNameColumnIndex = i;
            // console.log(codeNameColumnIndex)
        }

        if (text.trim() === 'THỜI GIAN ĐĂNG KÝ') {
            timeColumnIndex = i;
            // console.log(timeColumnIndex)
        }

        if (text.trim() === 'THỜI GIAN TRẢ GIÁ') {
            biddingTimeColumnIndex = i;
            // console.log(biddingTimeColumnIndex)
        }
        if (text.trim() === 'TÊN TÀI SẢN / CUỘC ĐẤU GIÁ') {
            propertyNameColumnIndex = i;
            // console.log(biddingTimeColumnIndex)
        }
    }
    if (codeNameColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "MÃ TÀI SẢN');
    }
    if (timeColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "THỜI GIAN ĐĂNG KÝ"');
    }
    if (biddingTimeColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "THỜI GIAN TRẢ GIÁ"');
    }
    if (propertyNameColumnIndex === -1) {
        throw new Error('Không tìm thấy cột "TÊN TÀI SẢN / CUỘC ĐẤU GIÁ"');
    }
    
    
    // Bước 2: Lấy tất cả các dòng trong bảng (bỏ qua dòng tiêu đề) (dùng  waitForSelector để đợi cho hàng xuát hiện)
    await page.waitForSelector('table tbody tr');
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    // console.log('rowCount',rowCount)

    let SD=[],ST=[],ED=[],ET=[],code=[]
    let BSD=[],BST=[],BED=[],BET=[]
    
    for (let i = 0; i < rowCount; i++) {
        const cell = rows.nth(i).locator('td').nth(timeColumnIndex);
        const timeValue = await cell.innerText();
        const lines = timeValue.split('\n')
        const [startDate,startTime] = lines[0].split(' ')
        const [endDate,endTime] = lines[1].split(' ')
        SD.push(startDate)
        ST.push(startTime)
        ED.push(endDate)
        ET.push(endTime)

        const cellCodeName = rows.nth(i).locator('td').nth(codeNameColumnIndex)
        const codeNameValue = await cellCodeName.innerText();
        const codeName = codeNameValue.split('-')
        code.push(codeName[0].replace('VNAHS',''))
        // console.log('code',code)


        const cellBiddingTime = rows.nth(i).locator('td').nth(biddingTimeColumnIndex)
        const biddingTimeValue = await cellBiddingTime.innerText();
        const linesBiddingTime = biddingTimeValue.split('\n')
        const [biddingStartDate,biddingStartTime] = linesBiddingTime[0].split(' ')
        const [biddingEndDate,biddingEndTime] = linesBiddingTime[1].split(' ')
        // console.log(biddingStartDate,biddingStartTime,biddingEndDate,biddingEndTime)
        BSD.push(biddingStartDate)
        BST.push(biddingStartTime)
        BED.push(biddingEndDate)
        BET.push(biddingEndTime)

        const cellPropertyName = rows.nth(i).locator('td').nth(propertyNameColumnIndex)
        const propertyNameValue = await cellPropertyName.innerText();
        // console.log('propertyNameValue: ',propertyNameValue)
        PN.push(codeName[0].replace('VNAHS',''),propertyNameValue)
        
        // console.log('code',code)
        

    }
    // console.log('PN',PN)
    const uniqueValuesSD = [...new Set(SD)]
    const uniqueValuesED = [...new Set(ED)]
    const uniqueValuesBSD = [...new Set(BSD)]
    const uniqueValuesBED = [...new Set(BED)]


    //Ma trận bắt đầu đăng ký và chốt
    // let SD_Matrix = []
    // let ED_Matrix = []
    
    for(let i = 0;i<uniqueValuesSD.length;i++){
        let temp=[]
        temp.push(uniqueValuesSD[i])
        for(let j = 0;j<SD.length;j++){
            if(uniqueValuesSD[i]===SD[j]){
                temp.push(code[j])
            }
        }
        SD_Matrix.push(temp)
    }
    // console.log('SD_Matrix: ',SD_Matrix)

    for(let i = 0;i<uniqueValuesED.length;i++){
        let temp=[]
        temp.push(uniqueValuesED[i])
        for(let j = 0;j<ED.length;j++){
            if(uniqueValuesED[i]===ED[j]){
                temp.push(code[j])
            }
        }
        ED_Matrix.push(temp)
    }
    // console.log('ED_Matrix: ',ED_Matrix)


    //Ma trận bắt đầu và kết thúc đấu giá
    // let BSD_Matrix = []
    // let BED_Matrix = []
    
    for(let i = 0;i<uniqueValuesBSD.length;i++){
        let temp=[]
        temp.push(uniqueValuesBSD[i])
        for(let j = 0;j<BSD.length;j++){
            if(uniqueValuesBSD[i]===BSD[j]){
                temp.push(code[j]+' - '+BST[j])
            }
        }
        BSD_Matrix.push(temp)
    }
    // console.log('BSD_Matrix: ',BSD_Matrix)

    for(let i = 0;i<uniqueValuesBED.length;i++){
        let temp=[]
        temp.push(uniqueValuesBED[i])
        for(let j = 0;j<BED.length;j++){
            if(uniqueValuesBED[i]===BED[j]){
                temp.push(code[j]+' - '+BET[j])
            }
        }
        BED_Matrix.push(temp)
    }
    // console.log('BED_Matrix: ',BED_Matrix)
    await browser.close();
    return ;

}


let getAuctionAnnouncementService = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {    
            let res=''
            if(data.type==='compare'){  
                res = await fetchData(data.url);
                // res = await fetchDataBDS(data.url)
            }else if(data.type==='dgts'){
                res = fetchDataDgts(data)
            }else if(data.type==='VnaPartner'){
                res = fetchDataVnaPartnerNew(data)
            }else if(data.type==='schedule'){
                res = await fetchDataSchedule(data)
            }
            resolve({
                errCode:0,
                message:'getAuctionAnnouncementService succeeds !',
                res,
                SD_Matrix,
                ED_Matrix ,
                BSD_Matrix,
                BED_Matrix,
                PN
            })
        } catch (e) {
            reject(e);
        }
    })
}
////////////////////////////Mail/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gửi email
let sendMail = (data)=>{
    // console.log(data)
    return new Promise(async(resolve, reject)=>{
        try{
            // Tạo transporter (Gmail, Outlook, hoặc SMTP tùy chọn)
            const transporter = nodemailer.createTransport({
                service: "gmail", // hoặc dùng 'hotmail', hoặc cấu hình SMTP thủ công
                auth: {
                user: "dohoangquan1112002@gmail.com", // Email gửi
                pass: "ixlt edis iqpy jllb",    // App password (không dùng mật khẩu tài khoản Google thông thường)
                },
            });
            
            // Cấu hình nội dung email
            const mailOptions = {
                from: data.from,
                to: data.to, // Có thể là nhiều email cách nhau bằng dấu phẩy
                subject: data.subject,
                html: data.text.replace(/\n/g, '<br/>'),
                // text: data.text.replace(/\n/g, '<br/>'), Dùng text để có dạng text hoặc html để lấy dạng html
            };
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.error("Gửi email thất bại:", error);
                resolve({
                    errCode:1,
                    message:'Gửi email thất bại...',
                })
            } else {
                // console.log("Email đã được gửi:", info.response);
                resolve({
                    errCode:0,
                    message:'Gửi email thành công!',
                })
            }
            });
        }catch(e){
            reject(e)
        }

    })
}
//Đăng ký
let SignUp = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            // console.log('check data from service: ',data)
            // const password = 'myPassword123';
            const saltRounds = 10;
            const newUser = await db.User.create({
                email: data.email,
                fullName: data.fullName, 
                password:await hashPassword(data.password),
                address:data.address,
                phoneNumber:data.phoneNumber,
                gender:data.gender,
                roleId:data.roleId
            });
            // console.log('hashPassword:',await hashPassword(data.password))
            resolve({
                errCode:0,
                message:'Create user succeeds !',
                newUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
// Mã hóa
async function hashPassword(password) {
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
    //   console.log('Mật khẩu đã mã hóa:', hash);
      return hash  
    //   const isMatch = await bcrypt.compare(password, hash);
    //   console.log('Mật khẩu khớp?', isMatch);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  }
//Đăng nhập
let Login =(data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            // let port = process.env.SECRET_KEY;
            // console.log(port)
            const user = await db.User.findOne({
                where:{
                    email:data.email
                }
            })
            if(!user){
                resolve({
                    errCode:1,
                    message: 'Không tìm thấy người dùng...'
                })
            }else{
                const isMatch = await bcrypt.compare(data.password, user.password);
                // console.log('isMatch',isMatch)ss
                if(isMatch){
                    const token = jwt.sign({ id: user.id, username: user.username, roleId: user.roleId }, process.env.SECRET_KEY, {
                        expiresIn: '1h' // token hết hạn sau 1 giờ
                    });
                    resolve({
                        errCode:0,
                        message: 'Đăng nhập thành công !',
                        user,
                        token
                    })
                }else{
                    resolve({
                        errCode:2,
                        message: 'Sai mật khẩu...'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let createRealEstate = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const url = "https://api.daugiavna.vn/partner/products";
            //Bearer token
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfY3QiOiJwZXJzb25hbCIsIl9pZCI6IjY3ZDdlY2ViNjdlOWJjYjg5YmEzYmFlMSIsIl9kaWQiOiIzMTY1MzQwMjQ5YmM3YWRjYjczODE0MjAwYTRkMTBmNiIsIl9hciI6InBhcnRuZXIiLCJfcHIiOlsiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fmNvbW1vbn42ODY5NWY5ZTkyNTEyMzZjMjE4OThkZmJ-Njg2YjMyMDk1Yzc4MzAyMDg1ZTlhYWQzIiwiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fnJlYWwtZXN0YXRlfjY4Y2I3MjI4YTA2ZTgyOTU1M2M0NjQ1Zn42OGNiODhmODZiYmEzNDA1MWMzYmU5ZTUiXSwiX3JpZCI6ImUwM2FkYTYxOWQ3NTMzMDQiLCJfdCI6MSwiaWF0IjoxNzc1MjAwNDEyLCJleHAiOjE3NzUyODY4MTJ9.c1hYz5xvQ9NdNs3urulhllOpm7G0tOgccpv01WXeSD4";
            const xTid = "68695f9e9251236c21898df5";
            const xSubsystem = "real-estate";

            const body = {
                name : data.name,
                categoryId: data.categoryId,
                landArea: data.landArea,
                viewingLocation: data.viewingLocation,
                viewingTime: data.viewingTime,
                lotCode: data.lotCode,
                description: data.description

            };
            fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-TID": xTid,
                  "X-Subsystem": xSubsystem
                },
                body: JSON.stringify(body)
              })
                .then(res => res.json())
                .then(data => {
                //   console.log("Success:", data);
                    resolve({
                        errCode:0,
                        message: 'Đăng nhập thành công !',
                        data
                    })
                })
                .catch(err => {
                  console.error("Error:", err);
                });

        } catch (e) {
            reject(e)
        }
    })
}
let settingRealEstate = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const url = `https://api.daugiavna.vn/partner/auctions/${data.lastAuctionId}/setting`;
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfY3QiOiJwZXJzb25hbCIsIl9pZCI6IjY3ZDdlY2ViNjdlOWJjYjg5YmEzYmFlMSIsIl9kaWQiOiIzMTY1MzQwMjQ5YmM3YWRjYjczODE0MjAwYTRkMTBmNiIsIl9hciI6InBhcnRuZXIiLCJyZXF1aXJlU2V0dGluZ1Bhc3N3b3JkIjpmYWxzZSwicmVxdWlyZVZlcmlmeUNvbnRhY3QiOmZhbHNlLCJfcHIiOlsiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fmNvbW1vbn42ODY5NWY5ZTkyNTEyMzZjMjE4OThkZmJ-Njg2YjMyMDk1Yzc4MzAyMDg1ZTlhYWQzIiwiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fnJlYWwtZXN0YXRlfjY4Y2I3MjI4YTA2ZTgyOTU1M2M0NjQ1Zn42OGNiODhmODZiYmEzNDA1MWMzYmU5ZTUiXSwiX3JpZCI6ImE2YTM1ODhkYzZlNmYyMGQiLCJfdCI6MSwiaWF0IjoxNzc1MTEyODQ4LCJleHAiOjE3NzUxOTkyNDh9.Bz0MAKiIIjhxbsNpylUzXEepdl5fDWFtcIwwhplMsRI";
            const xTid = "68695f9e9251236c21898df5";
            const xSubsystem = "real-estate";

            const body = {
                allowSingleBidder: data.allowSingleBidder,
                assistantId: data.assistantId,
                auctioneerId: data.auctioneerId,
                bidEndTime: data.bidEndTime,
                bidStartTime: data.bidStartTime,
                depositAmount: data.depositAmount,
                depositEndTime: data.depositEndTime,
                depositStartTime: data.depositStartTime,
                isDepositRequired: data.isDepositRequired,
                isRegFeeRequired: data.isRegFeeRequired,
                maxExtraRounds: data.maxExtraRounds,
                maxStepPerBid: data.maxStepPerBid,
                method: data.method,
                partnerBankAccountId: data.partnerBankAccountId,
                priceStep: data.priceStep,
                realEstatePricingOption: data.realEstatePricingOption,
                regEndTime: data.regEndTime,
                regFeeAmount: data.regFeeAmount,
                regStartTime: data.regStartTime,
                startPrice: data.startPrice
            };

            fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-TID": xTid,
                  "X-Subsystem": xSubsystem
                },
                body: JSON.stringify(body)
              })
                .then(res => res.json())
                .then(data => {
                //   console.log("Success:", data);
                    resolve({
                        errCode:0,
                        message: 'Đăng nhập thành công !',
                        data
                    })
                })
                .catch(err => {
                  console.error("Error:", err);
                });
            

        } catch (e) {
            reject(e)
        }
    })
}

let additionalInformationRealEstate = (data)=>{
    return new Promise (async(resolve, reject)=>{
        try {
            const url = "https://api.daugiavna.vn/partner/auctions/695e0e455457d6150b265028/additional-information";
            //Bearer token
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfY3QiOiJwZXJzb25hbCIsIl9pZCI6IjY3ZDdlY2ViNjdlOWJjYjg5YmEzYmFlMSIsIl9kaWQiOiIzMTY1MzQwMjQ5YmM3YWRjYjczODE0MjAwYTRkMTBmNiIsIl9hciI6InBhcnRuZXIiLCJfcHIiOlsiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fmNvbW1vbn42ODY5NWY5ZTkyNTEyMzZjMjE4OThkZmJ-Njg2YjMyMDk1Yzc4MzAyMDg1ZTlhYWQzIiwiNjg2OTVmOWU5MjUxMjM2YzIxODk4ZGY1fnJlYWwtZXN0YXRlfjY4Y2I3MjI4YTA2ZTgyOTU1M2M0NjQ1Zn42OGNiODhmODZiYmEzNDA1MWMzYmU5ZTUiXSwiX3JpZCI6ImUwM2FkYTYxOWQ3NTMzMDQiLCJfdCI6MSwiaWF0IjoxNzc1MjAwNDEyLCJleHAiOjE3NzUyODY4MTJ9.c1hYz5xvQ9NdNs3urulhllOpm7G0tOgccpv01WXeSD4";
            const xTid = "68695f9e9251236c21898df5";
            const xSubsystem = "real-estate";

            const body = {
                contractBasis: "Thực hiện Hợp đồng dịch vụ đấu giá tài sản số 548/2025/HĐĐG ký ngày 01/12/2025 giữa Trung tâm phát triển quỹ đất Phú Thọ với Công ty Đấu giá hợp danh VNA",
                orgOwnerAsset: `{"name":"Trung tâm phát triển quỹ đất Phú Thọ","representativeName":"Nguyễn Quốc Tuấn","representativePosition":"Giám đốc"}`,
                observers: `[{"name":"Không có","position":"","businessAddress":""}]`,
                ownerMembers: `[{"name":"Trung tâm phát triển quỹ đất Phú Thọ","userId":"692fbf75104ccdcfde8d2574"}]`,
                regulationNumber: "548",
                regulationContent: "QUY CHẾ CUỘC ĐẤU GIÁ Áp dụng hình thức đấu giá trực tuyến trên Trang thông tin điện tử đấu giá trực tuyến: https://daugiavna.vn"

            };

            fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-TID": xTid,
                  "X-Subsystem": xSubsystem
                },
                body: JSON.stringify(body)
              })
                .then(res => res.json())
                .then(data => {
                //   console.log("Success:", data);
                    resolve({
                        errCode:0,
                        message: 'Đăng nhập thành công !',
                        data
                    })
                })
                .catch(err => {
                  console.error("Error:", err);
                });

        } catch (e) {
            reject(e)
        }
    })
}
//multiple property
let handleCreateRentalService = async (body, file) => {
    return new Promise(async(resolve,reject)=>{
        try {
            // console.log("Body:", body);
            // console.log("File:", file);

            if (!file) {
                throw new Error("Không nhận được file");
            }
            // Đọc workbook từ buffer
            const workbook = XLSX.read(file.buffer, { type: "buffer" });

            // Lấy sheet đầu tiên
            const sheetName = workbook.SheetNames[0];

            const sheet = workbook.Sheets[sheetName];

            // Chuyển sheet thành JSON
            const data = XLSX.utils.sheet_to_json(sheet);

            // console.log("Dữ liệu từ Excel:", data);

            resolve({
                errCode:0,
                message: 'Lấy thông tin tài sản từ excel thành công !',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
    
};
let handleCreateRentalPropertyService = async (data) => {
    return new Promise(async(resolve,reject)=>{
        try {
            // console.log(data)
            
            for (let i=0;i<data.multipleProperty.length;i++){
                let formData = new FormData();
                formData.append("name", data.multipleProperty?.[i]?.["Tên tài sản"]);
                formData.append("categoryId", "6627722e214b93f8297ebec2");
                formData.append("viewingLocation", data.multipleProperty?.[i]?.["Nơi xem tài sản"]);
                formData.append("viewingTime", data.multipleProperty?.[i]?.["Thời gian xem tài sản"]);
                formData.append("description", data.multipleProperty?.[i]?.["Mô tả chi tiết"]);

                let resThongTinTaiSan = await axios.post(
                    "https://api.daugiavna.vn/partner/products",
                    formData,
                    {
                        headers: {
                            ...formData.getHeaders(),
                            Authorization: partnerToken,
                            "x-tid": "68695f9e9251236c21898df5",
                            "x-subsystem": "common"
                        }
                    }
                );
                let lastAuctionId = await resThongTinTaiSan.data.data.lastAuctionId
                // console.log(i,'resThongTinTaiSan id: ',lastAuctionId)
                // console.log(i,'multipleProperty: ',data.multipleProperty)
                let assistantId = await getAssistant(data.multipleProperty?.[i]?.["Thư ký"])
                let auctioneerId = await getAuctioneer(data.multipleProperty?.[i]?.["Đấu giá viên"])

                let partnerBankAccountId = await getBank(data.multipleProperty?.[i]?.["Tài khoản nhận tiền"])
                let regEndTime = await formatDate(data.multipleProperty?.[i]?.["Thời gian kết thúc đăng ký"])
                let regStartTime = await formatDate(data.multipleProperty?.[i]?.["Thời gian mở đăng ký"])
                // console.log('regEndTime: ',regEndTime)
                let bidEndTime = await formatDate(data.multipleProperty?.[i]?.["Thời gian kết thúc trả giá"])
                let bidStartTime = await formatDate(data.multipleProperty?.[i]?.["Thời gian bắt đầu trả giá"])

                // console.log('assistantId: ',assistantId)
                // console.log('auctioneerId: ',auctioneerId)
                // console.log('data.multipleProperty?.[i]?.["Đấu giá viên"]:  ',data.multipleProperty?.[i]?.["Đấu giá viên"])

                // console.log('lastAuctionId: ',lastAuctionId) 
                let resThongTinChinh = await axios.put(
                    `https://api.daugiavna.vn/partner/auctions/${lastAuctionId}/setting`,
                    {
                        allowSingleBidder: data.multipleProperty?.[i]?.["Cho phép đấu giá 1 người"],

                        // assistantId: data.multipleProperty?.[i]?.["Thư ký"],
                        // auctioneerId: data.multipleProperty?.[i]?.["Đấu giá viên"],

                        assistantId: assistantId,
                        auctioneerId: auctioneerId,
                        // assistantId: "67905e5acb3f7305b05d1040",
                        // auctioneerId: "66a49bff5fb00c03eb86b40e",


                        bidEndTime: bidEndTime,
                        bidStartTime: bidStartTime,
                        depositAmount: data.multipleProperty?.[i]?.["Tiền đặt trước"],
                        depositEndTime: regEndTime,
                        depositStartTime: regStartTime ,
                        isDepositRequired: true,
                        isRegFeeRequired: true,
                        maxExtraRounds: -1,
                        maxStepPerBid: 0,
                        method: 1,
                        partnerBankAccountId: partnerBankAccountId,
                        priceStep: data.multipleProperty?.[i]?.["Bước giá"],
                        realEstatePricingOption: 0,
                        regEndTime: regEndTime,
                        regFeeAmount: data.multipleProperty?.[i]?.["Tiền mua hồ sơ"],
                        regStartTime: regStartTime,
                        startPrice: data.multipleProperty?.[i]?.["Giá khởi điểm"],
                        
                    },
                    {
                        headers: {
                            Authorization: partnerToken,
                            "x-tid": "68695f9e9251236c21898df5",
                            "x-subsystem": "common",
                            "Content-Type": "application/json"
                        }
                    }
                );
                // console.log('resThongTinTaiSan.data: ',resThongTinTaiSan.data)
                // console.log(i,'resThongTinChinh: ',resThongTinChinh)
                // console.log(resThongTinChinh.data.error.details);

                let formData2 = new FormData();
                // formData2.append("contractBasis ", data.multipleProperty?.[i]?.["Căn cứ hợp đồng"]);
                // formData2.append("orgOwnerAsset ", {"name":data.multipleProperty?.[i]?.["Đơn vị có tài sản"],"representativeName":data.multipleProperty?.[i]?.["Người đại diện"],"representativePosition":data.multipleProperty?.[i]?.["Chức vụ"]});
                // formData2.append("observers", [{"name":"Không có","position":"","businessAddress":""}]);
                // formData2.append("ownerMembers", []);
                // formData2.append("regulationNumber", data.multipleProperty?.[i]?.["Quy chế số"]);
                formData2.append("contractBasis", data.multipleProperty?.[i]?.["Căn cứ hợp đồng"]);

                formData2.append(
                "orgOwnerAsset",
                JSON.stringify({
                    name: data.multipleProperty?.[i]?.["Đơn vị có tài sản"],
                    representativeName: data.multipleProperty?.[i]?.["Người đại diện"],
                    representativePosition: data.multipleProperty?.[i]?.["Chức vụ"]
                })
                );

                formData2.append(
                "observers",
                JSON.stringify([
                    { name: "Không có", position: "", businessAddress: "" }
                ])
                );

                formData2.append(
                "ownerMembers",
                JSON.stringify([])
                );

                formData2.append(
                "regulationNumber",
                data.multipleProperty?.[i]?.["Quy chế số"]
                );
                // console.log('form',[...formData2.entries()]);
                //console.log("formData2",formData2);
                
                let resThongTinThem = await axios.put(
                    `https://api.daugiavna.vn/partner/auctions/${lastAuctionId}/additional-information`,
                    formData2,
                    {
                        headers: {
                            ...formData2.getHeaders(),
                            Authorization: partnerToken,
                            "x-tid": "68695f9e9251236c21898df5",
                            "x-subsystem": "common"
                        }
                    }
                );
            }
            
            resolve({
                errCode:0,
                message: 'Lấy thông tin tài sản từ excel thành công !',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
    
};
let getAssistant = (assistantName)=>{
    let assistantId = ''
    if(assistantName==='Nguyễn Thị Hoài Thương'){
        assistantId = '672ccaf30f5ca47997a248e6'     
    }
    if(assistantName==='Phạm Đức Nhã'){
        assistantId = '673422d98f70463eabe00ffb'     
    }
    if(assistantName==='Nguyễn Thu Minh'){
        assistantId = '67905e5acb3f7305b05d1040'
    }
    if(assistantName==='Lê Văn Thọ'){
        assistantId = '67618029c7e3230a85f4d608'
    }
    if(assistantName==='Đỗ Hoàng Quân'){
        assistantId = '67d7eceb67e9bcb89ba3bae1'
    }
    if(assistantName==='Đặng Xuân Tú'){
        assistantId = '67232df42fde33d886bbb94f'
    }
    if(assistantName==='Đào Anh Tuấn'){
        assistantId = '6746d094085a7ef21961fc1b'
    }
    if(assistantName==='Nguyễn Đình Chiến'){
        assistantId = '68db8d70c79abafb5879bdf2'
    }
    if(assistantName==='Bùi Khánh Ly'){
        assistantId = '6911ae93d64f498795aab9a1'
    }
    if(assistantName==='Lê Thị Hường'){
        assistantId = '697066ff515f81ac599369fd'
    }
    if(assistantName==='Ngô Việt Hà'){
        assistantId = '697ae0dcf111b9203b04a683'
    }
    if(assistantName==='Hoàng Dương Tuyển'){
        assistantId = '69ae207f6406a688f85914ce'
    }
    return assistantId
}
let getAuctioneer = (auctioneerName)=>{
    let auctioneerId = ''
    if(auctioneerName==='Nguyễn Phan Bình'){
        auctioneerId = '66a49bff5fb00c03eb86b40e'     
    }
    if(auctioneerName==='Lưu Đức Vượng'){
        auctioneerId = '66ccc5a94f917bcf1d63a316'     
    }
    if(auctioneerName==='Nguyễn Thị Hằng'){
        auctioneerId = '66c980bdd3489513a206d865'
    }
    if(auctioneerName==='Bùi Phan Anh'){
        auctioneerId = '6760f075ec7429d7edf72a5e'
    }
    if(auctioneerName==='Dương Kim Sơn'){
        auctioneerId = '6760ef7da903e09e0144384e'
    }
    if(auctioneerName==='Đỗ Thị Thu Hường'){
        auctioneerId = '678dfb4d18d52ad686a114e0'
    }
    return auctioneerId
}
let getBank  = (bankCode)=>{
    let bankId = ''
    if(bankCode==='VPB'){
        bankId = '67d15b7a971895e1985affff'     
    }
    if(bankCode==='BIDV'){
        bankId = '6841100473a0fab0ae7fcd2b'     
    }
    
    return bankId
}
let formatDate = (inputDate) =>{
    inputDate = inputDate.split(' ')
    let time = inputDate[0]
    let date = inputDate[1]

    time=time.replaceAll('h',':')
    time=time + ':00'

    date = date.split('/')
    date = date[2]+'-'+date[1]+'-'+date[0]

    return date+'T'+time+'+07:00'
}
let handlePublicDateToFileService = async (data)=>{
    return new Promise (async(resolve,reject)=>{
        try {
            let rules_num_from_FE = data.rules_num
            if(data.CN_NamDinh){
                rules_num_from_FE = rules_num_from_FE + 'nđ'
            }

            let content = rules_num_from_FE + ' - ' + data.date1 + ' - ' + data.date2;
            let path = "D:/VNA/Ngày đăng cổng lần 2/Output.txt";

            //Kiểm tra xem đã có data chưa
            let rules_num_check = false
            let contentCheck = fs.readFileSync(path, "utf8");
            // chuyển thành mảng theo từng dòng
            let arr_check = contentCheck.split(/\r?\n/);
            let result_check = arr_check.map(line => {
                let [rules_num, date1, date2] = line.split(" - ");
                if(rules_num===rules_num_from_FE){
                    console.log('rules_num',rules_num)
                    console.log('rules_num_from_FE',rules_num_from_FE)
                    rules_num_check=true
                }
            });
            if(rules_num_check){
                resolve({
                    errCode: 0,
                    message: 'Hồ sơ này đã được ghi vào file...'
                })
            }else{
                // fs.writeFileSync(path, content, "utf8"); ghi đè
                let needNewLine = fs.existsSync(path) && fs.readFileSync(path, "utf8").length > 0;
                if (needNewLine) {
                    content = "\r\n" + content;
                }
                await fs.appendFileSync(path, content, "utf8");// ghi thêm
                // console.log(content)
                
                resolve({
                    errCode:0,
                    message: 'Đã thêm '+ rules_num_from_FE + ' - ' + data.date1 + ' - ' + data.date2 +' !'
                })
            }
        
        } catch (e) {
            reject(e)
        }
    })
}
let GetPublicDateFromFileService = ()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let path = "D:/VNA/Ngày đăng cổng lần 2/Output.txt";

            // đọc file
            let content = fs.readFileSync(path, "utf8");
            // chuyển thành mảng theo từng dòng
            let arr = content.split(/\r?\n/);
            let result = arr.map(line => {
                let [rules_num, date1, date2] = line.split(" - ");
                return { rules_num, date1, date2 };
            });
            
            resolve({
                errCode:0,
                message:'Đọc file thành công !',
                result
            })
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAuctionAnnouncementService : getAuctionAnnouncementService,
    sendMail : sendMail,
    SignUp : SignUp,
    Login : Login,
    createRealEstate : createRealEstate,
    settingRealEstate : settingRealEstate,
    additionalInformationRealEstate : additionalInformationRealEstate,
    handleCreateRentalService : handleCreateRentalService,
    handleCreateRentalPropertyService : handleCreateRentalPropertyService,
    handlePublicDateToFileService : handlePublicDateToFileService,
    GetPublicDateFromFileService : GetPublicDateFromFileService
}
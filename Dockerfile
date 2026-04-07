# Dùng image chính thức đã cài Playwright + Chromium
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY . .

# Cài đặt dependencies Node.js
RUN npm install

# Cài trình duyệt Playwright (đã có lib hệ thống từ base image)
RUN npx playwright install

# Chạy app
CMD ["npm", "start"]

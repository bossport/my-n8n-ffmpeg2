# استفاده از Node.js 18 رسمی
FROM node:18-bullseye

# نصب ffmpeg و پاکسازی کش apt برای کاهش حجم
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های پروژه
COPY package.json .
COPY server.js .

# نصب وابستگی‌ها
RUN npm install --production

# expose پورت 3000
EXPOSE 3000

# اجرای سرور
CMD ["node", "server.js"]

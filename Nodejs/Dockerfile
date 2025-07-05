# 🐳 Image בסיס עם Node.js
FROM node:18

# 🧰 התקנת LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean;

# 📁 תיקיית העבודה לאפליקציה
WORKDIR /app

# 📦 התקנת תלויות
COPY package*.json ./
RUN npm install

# 📄 העתקת שאר הקבצים
COPY . .

# 🌐 פתיחת פורט
EXPOSE 3001

# ▶️ הפעלת האפליקציה
CMD [ "node", "server.js" ]

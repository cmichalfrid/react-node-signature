# שלב 1: בניית React
FROM node:18-slim AS build-react

WORKDIR /react-app
COPY React/my-app/package*.json ./
RUN npm install
COPY React/my-app ./
RUN npm run build

# שלב 2: בניית ה־Image הסופי
FROM node:18-slim

# התקנת LibreOffice (אם דרוש)
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# נגיע ל־/app כמשקף את תיקיית ה־Nodejs שלך
WORKDIR /app

# העתקת והתממשקות התלויות של ה‑Node
COPY Nodejs/package*.json ./Nodejs/
RUN cd Nodejs && npm install

# העתקת שאר הקוד של ה‑Node (כולל express.js ורוטרס) בדיוק לתוך /app/Nodejs
COPY Nodejs/ ./Nodejs/

# העתקת build של React לתוך /app/Nodejs/build
COPY --from=build-react /react-app/build ./Nodejs/build

# חשיפת הפורט
EXPOSE 3000

# הרצת השרת מתוך Nodejs/express.js
CMD ["node", "Nodejs/express.js"]

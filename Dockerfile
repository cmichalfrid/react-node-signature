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

# הגדרת תיקיית הריצה
WORKDIR /app/Nodejs

# העתקת והתממשקות התלויות של ה‑Node
COPY Nodejs/package*.json ./
RUN npm install

# העתקת שאר הקוד של ה‑Node (כולל express.js ורוטרס)
COPY Nodejs ./

# העתקת הבנייה של React אל תיקיית build במשנה של ה‑Node
COPY --from=build-react /react-app/build ./build

# חשיפת הפורט
EXPOSE 3000

# הרצת השרת מתוך Nodejs/express.js
CMD ["node", "express.js"]

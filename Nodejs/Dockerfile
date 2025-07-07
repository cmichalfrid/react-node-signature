# שלב 1: בניית React
FROM node:18-slim as build-react

WORKDIR /react-app
COPY React/my-app/package*.json ./
RUN npm install
COPY React/my-app ./
RUN npm run build


# שלב 2: אפליקציית Node.js
FROM node:18-slim

# התקנת LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# הגדרת תיקיית העבודה
WORKDIR /app

# העתקת קבצי התלויות והתקנתן
COPY Nodejs/package*.json ./
RUN npm install

# העתקת קוד Node.js עצמו
COPY . .

# העתקת תוצאת הבנייה של React
COPY --from=build-react /react-app/build ./public

# פתיחת פורט
EXPOSE 3000

# הרצת השרת
CMD ["node", "express.js"]

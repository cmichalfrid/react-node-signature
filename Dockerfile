# שלב 1: בניית אפליקציית React
FROM node:18-slim as build-react

WORKDIR /react-app
COPY React/my-app/package*.json ./
RUN npm install
COPY React/my-app ./
RUN npm run build

# שלב 2: הרצת שרת Node.js
FROM node:18-slim

# התקנת LibreOffice (אם דרוש למסמכים)
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# התקנת תלויות Node.js
COPY Nodejs/package*.json ./Nodejs/
RUN cd Nodejs && npm install

# העתקת קוד Node.js
COPY Nodejs ./Nodejs

# ✅ העתקת תיקיית React build אל Nodejs/build
COPY --from=build-react /react-app/build ./Nodejs/build

# הגדרת הפורט
EXPOSE 3000

# הרצת השרת
CMD ["node", "Nodejs/express.js"]

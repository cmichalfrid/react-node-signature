# שלב 1: בניית אפליקציית React
FROM node:18-slim as build-react

WORKDIR /react-app
COPY React/my-app/package*.json ./
RUN npm install
COPY React/my-app ./
RUN npm run build

# שלב 2: הרצת שרת Node.js
FROM node:18-slim

# התקנת LibreOffice (למסמכים)
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# תיקייה ראשית להרצת השרת
WORKDIR /app

# התקנת תלויות Node.js
COPY Nodejs/package*.json ./
RUN npm install

# העתקת כל קבצי Node.js
COPY Nodejs ./

# ✅ העתקת build ל־/app/build (כדי ש־Express ימצא)
COPY --from=build-react /react-app/build ./build

# פתיחת הפורט
EXPOSE 3000

# הרצת השרת
CMD ["node", "express.js"]

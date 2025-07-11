# שלב 1: בניית React
FROM node:18-slim as build-react

WORKDIR /react-app
COPY React/my-app/package*.json ./
RUN npm install
COPY React/my-app ./
RUN npm run build

# שלב 2: Node.js
FROM node:18-slim

# התקנת LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# התקנת תלויות Node.js
COPY Nodejs/package*.json ./Nodejs/
RUN cd Nodejs && npm install

# העתקת קוד Nodejs
COPY Nodejs ./Nodejs

# ✅ העתקת React build ל־Nodejs/build (שימו לב – זה השינוי!)
COPY --from=build-react /react-app/build ./Nodejs/build

# פורט
EXPOSE 3000

# הרצת השרת
CMD ["node", "Nodejs/express.js"]

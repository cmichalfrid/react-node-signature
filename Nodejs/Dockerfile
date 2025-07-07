FROM node:18-slim

# כדי למנוע שאלות אינטראקטיביות במהלך התקנה
ENV DEBIAN_FRONTEND=noninteractive

# עדכון ותקינת perl ו libreoffice בלי שאלות, עם ניקוי קאש
RUN apt-get update && \
    apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" \
    perl libreoffice apt-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN which soffice
# המשך תהליך הבנייה שלך, לדוגמה:
WORKDIR /app
COPY . .

# התקנת תלותות Node.js (אם יש)
RUN npm install

# פקודת הרצה לדוגמה (תתאים לפי הצורך)
CMD ["node", "index.js"]

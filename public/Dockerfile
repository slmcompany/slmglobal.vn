FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Nếu site cần data được generate trước khi build (products.json...), bỏ comment dòng dưới
# RUN npm run fetch-data

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3001"]
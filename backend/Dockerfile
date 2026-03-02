FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# use whatever your backend start command is:
# If you have "start": "node server.js"
CMD ["npm", "start"]

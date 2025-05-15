FROM node:18-alpine

# Install netcat for connection testing
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Make wait-for-it.sh executable
RUN chmod +x wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "mssql", "1433", "npm", "start"] 
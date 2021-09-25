FROM node

WORKDIR /app

COPY package.json /app

RUN npm install
RUN npm install -g nodemon

EXPOSE 3000

CMD ["nodemon", "/src/server.js"]
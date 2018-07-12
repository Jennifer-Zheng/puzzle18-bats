FROM node:alpine

WORKDIR /usr/src/app
RUN mkdir -p ./public/images ./data
COPY ./bin ./bin
RUN cd
COPY package*.json ./
RUN npm install
EXPOSE 3000
RUN npm install -g nodemon
CMD [ "nodemon" ]

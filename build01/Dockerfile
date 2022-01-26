FROM node

WORKDIR /usr/src/app

COPY ./node/* ./

RUN npm install

CMD [ "node", "RTSPserver.js" ]

EXPOSE 2000
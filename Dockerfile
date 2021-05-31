FROM node:12

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENTRYPOINT ["./entry-point.sh"]
CMD ["npm", "run" ,"dev"]

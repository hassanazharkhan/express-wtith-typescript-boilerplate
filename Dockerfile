FROM node:12

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run" ,"watch"]

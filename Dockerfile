FROM node:21

WORKDIR /usr/src/app
ENV PORT 8000

COPY package*.json ./

RUN npm cache clean --force && \
    npm install --verbose && \
    npm install --no-package-lock

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]

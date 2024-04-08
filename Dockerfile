FROM node:14

WORKDIR /app

RUN chown -R node:node /app

COPY --chown=node:node . .

USER node

RUN npm i --only=production

# disable notifier warning
RUN npm config set update-notifier false

CMD ["npm", "run", "serve"]


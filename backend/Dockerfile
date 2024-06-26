# use latest node lts alpine version
FROM node:lts-alpine

# change working directory of image
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to work dir (app)
# prevents rebuilding modules for each container rebuild
COPY . . 

# host image port as 3000
EXPOSE 3000

# run server
CMD [ "npx", "tsx", "./src/api/server.ts" ]


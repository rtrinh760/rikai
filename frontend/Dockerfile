FROM node:lts-alpine

# install server for static content
RUN npm install -g http-server

WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to work dir (app)
# prevents rebuilding modules for each container rebuild
COPY . . 

# build app for production with minification
RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]


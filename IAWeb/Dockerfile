FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN cd server && npm install

RUN cd ..

EXPOSE 1234
EXPOSE 9091
CMD ./run.sh
FROM node:18 AS build

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Generate build
COPY package.json /app
COPY package-lock.json /app
RUN npm install

# Add app
COPY . /app

# Start app
CMD ["npm", "start"]

EXPOSE 3000

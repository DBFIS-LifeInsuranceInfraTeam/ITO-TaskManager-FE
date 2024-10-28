#Build Stage Start
#Specify a base image
FROM node:20-slim as builder

# 빌드 시 환경 변수 전달
#ARG REACT_APP_BASE_URL
#ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}

#Specify a working directory
WORKDIR '/app'

#Copy the dependencies file
COPY package.json .

#Install dependencies
RUN npm install --loglevel=error

#Copy remaining files
COPY . .

#Build the project for production
RUN npm run build

#Run Stage Start
FROM nginx:stable-alpine

#RUN rm /etc/nginx/conf.d/default.conf
#COPY ./default.conf /etc/nginx/conf.d/default.conf


#Copy production build files from builder phase to nginx
COPY --from=builder /app/build /usr/share/nginx/html

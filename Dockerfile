# Build Stage Start
FROM node:20-slim as builder

WORKDIR /app

# Copy dependencies file and install
COPY package.json package-lock.json ./
RUN npm install --loglevel=error

# Copy the rest of the files
COPY . .

# Ensure all files are copied correctly
RUN ls -R /app

# Build the project
RUN npm run build

# Run Stage Start
FROM nginx:stable-alpine

# Copy production build files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

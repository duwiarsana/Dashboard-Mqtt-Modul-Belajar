# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Install tools
RUN apk add --no-cache bash

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories and set permissions
RUN mkdir -p /var/log/nginx/ && \
    mkdir -p /var/cache/nginx/ && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log && \
    chown -R nginx:nginx /var/log/nginx/ && \
    chmod -R 755 /var/log/nginx/ && \
    chown -R nginx:nginx /var/cache/nginx/ && \
    chmod -R 755 /var/cache/nginx/ && \
    chown -R nginx:nginx /usr/share/nginx/html/ && \
    chmod -R 755 /usr/share/nginx/html/ && \
    chmod 644 /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Run as non-root user
USER nginx

# Verify nginx config
RUN nginx -t

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

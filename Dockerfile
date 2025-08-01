ARG NODE_VERSION=22.14.0

# Create build stage
FROM node:${NODE_VERSION}-alpine AS build

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to the working directory
COPY ./package.json .
COPY ./pnpm-lock.yaml .

## Install dependencies
RUN pnpm install --shamefully-hoist

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN pnpm run generate


## Stage 2 — Serve static files with Nginx
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/.output/public .

# При необходимости добавить конфигурацию
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

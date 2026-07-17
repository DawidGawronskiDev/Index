FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# search_engine.db and index-cache.json land in the cwd, so a data dir
# gets mounted as a volume and used as cwd, keeping the container itself
# stateless.
CMD ["sh", "-c", "mkdir -p /data && cd /data && exec node /app/dist/index.js"]

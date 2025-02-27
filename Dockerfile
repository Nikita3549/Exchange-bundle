FROM node:22-alpine as build
WORKDIR opt/api
COPY package.json nest-cli.json ./
RUN npm install -f
COPY ./src ./prisma ./
RUN npx prisma generate
COPY tsconfig.json ./
RUN npm run build

FROM node:22-alpine
WORKDIR opt/api
COPY package.json ./
COPY prisma ./
RUN npm install --only=prod -f
COPY --from=build /opt/api/dist ./dist
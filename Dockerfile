FROM node:22-alpine
WORKDIR /app
COPY server.js ./
COPY index.html index.js styles.css sw.js manifest.webmanifest public/
COPY icons/ public/icons/
# Default costs, used to seed the data file the first time the app loads.
COPY monthly-costs-example.json public/monthly-costs.json
ENV DATA_FILE=/data/monthly-costs.json
VOLUME /data
EXPOSE 80
CMD ["node", "server.js"]

# puzzle18-bats
A HackTX 2018 puzzle and innovation team project.

Entrance URL: `http://localhost:3002/start`

## Config
To run just the puzzle:
1. Make sure you have Node and npm installed, then run `npm install`
2. Run `node www`
3. Go to http://localhost:4000

To run with Docker:
1. Run `docker-compose up` inside the host
3. Go to http://localhost:3000

The docker-compose.yml file has the following changes:
```
  bats:
    build: ../puzzle18-bats
    depends_on:
      - db
    ports:
      - "3001:4001"
    environment:
      - "VIRTUAL_HOST=puzzle18-bats.example.com"
    volumes:
      - ../puzzle18-bats:/usr/src/app
      - /usr/src/app/node_modules
      - /usr/src/app/data
```

Note: Make sure to copy the example.env file to .env

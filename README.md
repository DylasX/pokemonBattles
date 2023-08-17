# Pokemon Battle Simulation Project using Nest.js, Redis, Sockets, and Docker

Welcome to the Pokemon Battle Simulation project! This application simulates a turn-based Pokemon battle using the Nest.js framework, Redis for data storage and caching, sockets for real-time communication, and Docker for containerization.

## Table of Contents

- [Pokemon Battle Simulation Project using Nest.js, Redis, Sockets, and Docker](#pokemon-battle-simulation-project-using-nestjs-redis-sockets-and-docker)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Features


- Utilize Redis pub/sub storing battle data, improving performance.
- Real-time updates using WebSockets to display battle progress to players.
- Dockerized for easy deployment and scalability.

## Prerequisites

Make sure you have the following tools installed:

- Node.js (v14 or higher)
- Docker
- Docker Compose

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/pokemon-battle-simulation.git
   cd pokemon-battle-simulation
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure .env
   ```bash
   PUBLIC_API_URL=https://pokeapi.co/api/v2/
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REPO_IMAGES=https://img.pokemondb.net/sprites/black-white/anim/
   ```

## Usage

1. Start the redis server and the Nest.js app
    ```bash
    docker-compose up -d
    npm run start:dev
    ```

## Front end
Can be found here [Front Application](https://github.com/DylasX/pokemonBattlesFront)



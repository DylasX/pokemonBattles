import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { RedisIoAdapter } from '../adapters/redis.adapter';
import * as io from 'socket.io-client';
import { PokemonService } from '../pokemon/pokemon.service';
import { HttpModule } from '@nestjs/axios';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connectToSocketIO: () => any;
  let pokemonService;
  const mockJoinRoom = {
    room: 'general',
    pokemon: {
      id: 1,
      selectedMoves: [1, 2, 3, 4],
    },
  };
  const mockPokemon = {
    abilities: [],
    base_experience: 1,
    forms: [],
    game_indices: [],
    height: 1,
    held_items: [],
    id: 1,
    image: 'x',
    is_default: true,
    location_area_encounters: 'x',
    moves: [],
    name: 'x',
    order: 1,
    past_types: [],
    species: {},
    sprites: {},
    stats: [],
    types: [],
    weight: 1,
  };

  const mockMoves = [
    {
      accuracy: 1,
      id: 1,
      pp: 1,
      power: 1,
      priority: 1,
      target: {},
      type: {},
      stat_changes: [],
      name: 'testMove',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [PokemonService],
    }).compile();

    pokemonService = moduleFixture.get<PokemonService>(PokemonService);

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    await app.init();
    await app.listen(4000);
    const httpServer = app.getHttpServer();
    connectToSocketIO = () =>
      io.connect(`http://127.0.0.1:${httpServer.address().port}`, {
        transports: ['websocket'],
      });
  });

  afterEach(async () => {
    await app.close();
  });

  it('should connect and disconnect', (done) => {
    const socket = connectToSocketIO();

    socket.on('connect', () => {
      socket.disconnect();
    });

    socket.on('disconnect', (reason) => {
      expect(reason).toBe('io client disconnect');
      done();
    });
    socket.on('error', done);
  });

  it('should join room', async (done) => {
    const socket = connectToSocketIO();

    //mock
    jest.spyOn(pokemonService, 'getPokemon').mockResolvedValue(mockPokemon);

    jest
      .spyOn(pokemonService, 'generateMoves')
      .mockReturnValue([Promise.resolve(mockMoves)]);

    socket.on('connect', () => {
      socket.emit('joinRoom', mockJoinRoom);
      socket.on('joinedRoom', (data) => {
        delete data.user.userId;
        expect(data).toMatchSnapshot();
        socket.disconnect();
      });
    });

    socket.on('disconnect', (reason) => {
      expect(reason).toBe('io client disconnect');
      done();
    });
    socket.on('error', done);
  });

  // it('should send previous pokemon', async (done) => {
  //   const promisifySocketHandler = (socket, event) =>
  //     new Promise((resolve) => socket.on(event, resolve));

  //   const allSocketsHandle = (sockets, event) =>
  //     sockets.map((socket) => promisifySocketHandler(socket, event));

  //   const sockets = [connectToSocketIO(), connectToSocketIO()];
  //   sockets.forEach((socket) => socket.on('error', done));

  //   await allSocketsHandle(sockets, 'connect');
  //   await sockets[0].emit('joinRoom');

  //   sockets[0].on('joinedRoom', async (data) => {
  //     await sockets[0].emit('previousPokemon');
  //   });
  // });
});

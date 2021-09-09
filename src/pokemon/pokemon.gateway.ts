import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { PokemonService } from './pokemon.service';

@WebSocketGateway()
export class PokemonGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('PokemonGateway');

  constructor(
    private configService: ConfigService,
    private pokemonService: PokemonService,
  ) {}

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    if (
      data.room &&
      data.pokemon &&
      Object.keys(this.server.of('/').in(data.room).adapter.sids).length < 3
    ) {
      client.join(data.room);
      client.room = data.room;
      try {
        //Get general data
        const res = await this.pokemonService.getPokemon(
          data.pokemon?.id.toString(),
        );
        res.image = `${this.configService.get('REPO_IMAGES')}${res.name}.gif`;
        client.pokemon = res;

        //Get data abilities
        client.pokemon.moves = await Promise.all(
          this.pokemonService.generateMoves(data.pokemon.selectedMoves),
        );

        client.broadcast.to(data.room).emit('newOpponent', {
          room: client.room,
          user: { pokemon: client.pokemon, userId: client.id },
        });

        return client.emit('joinedRoom', {
          room: client.room,
          user: { pokemon: client.pokemon, userId: client.id },
        });
      } catch (error) {
        console.error(error);
        this.logger.error(`Invalid pokemon with Id: ${data.pokemon}`);
      }
    } else {
      this.logger.error('Full room or body no supplied');
    }
  }

  @SubscribeMessage('previousPokemon')
  handlePreviousPokemon(client: Socket) {
    const payload = {
      room: client.room,
      user: { pokemon: client.pokemon, userId: client.id },
    };
    client.broadcast.to(client.room).emit('previousOpponent', payload);
  }

  sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket) {
    this.server.to(client.room).emit('leftRoom', {
      room: client.room,
      pokemon: client.pokemon,
      userId: client.id,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('disconnectAll')
  disconnectAll(client: Socket) {
    const clients = Object.values(this.server.of('/').connected);
    clients.forEach((s: Socket) => {
      s.disconnect();
    });
    this.server;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.server.to(client.room).emit('leftRoom', {
      room: client.room,
      pokemon: client.pokemon,
      userId: client.id,
    });
    client.leave();
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}

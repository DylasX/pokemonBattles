import {
  SubscribeMessage,
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

  private connectedUsers = {};

  constructor(
    private configService: ConfigService,
    private pokemonService: PokemonService,
  ) {}

  @SubscribeMessage('pokemonFight')
  handleMessage(client: Socket, message: { sender: string; message: string }) {
    this.server.to(client.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(client: Socket, data: any) {
    if (data.room && data.pokemon) {
      client.room = data.room;
      if (
        !this.connectedUsers[data.room] ||
        this.connectedUsers[data.room]?.length < 2
      ) {
        try {
          const res = await this.pokemonService.getPokemon(
            data.pokemon?.toString(),
          );
          res.image = `${this.configService.get('REPO_IMAGES')}${
            data.pokemon
          }.png`;
          client.pokemon = res;
          client.join(data.room);

          let previousUser = null;
          if (
            !this.connectedUsers[client.room] ||
            !this.connectedUsers[client.room].length
          ) {
            this.connectedUsers[client.room] = [client];
            client.emit('joinedRoom', {
              room: client.room,
              user: { pokemon: client.pokemon, userId: client.id },
            });
          } else {
            previousUser = {
              pokemon: this.connectedUsers[client.room][0].pokemon,
              userId: this.connectedUsers[client.room][0].id,
            };
            this.connectedUsers[client.room].push(client);
            client.emit('joinedRoom', {
              room: client.room,
              user: { pokemon: client.pokemon, userId: client.id },
              previousUser,
            });
            this.connectedUsers[client.room][0].emit('newOpponent', {
              pokemon: client.pokemon,
              userId: client.id,
              room: client.room,
            });
          }
        } catch (error) {
          console.error(error);
          this.logger.error(`Invalid pokemon with Id: ${data.pokemon}`);
        }
      } else {
        this.logger.error('Arena full');
      }
    } else {
      this.logger.error('No body supplied');
    }
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket) {
    if (this.connectedUsers[client.room]) {
      let removedClient = null;
      this.connectedUsers[client.room] = this.connectedUsers[
        client.room
      ].filter((el) => {
        removedClient = {
          id: client.id,
          pokemon: client.pokemon,
          room: client.room,
        };
        return el.id !== client.id;
      });
      this.server.to(client.room).emit('leftRoom', removedClient);
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.connectedUsers[client.room]) {
      let removedClient = null;
      this.connectedUsers[client.room] = this.connectedUsers[
        client.room
      ].filter((el) => {
        removedClient = {
          id: client.id,
          pokemon: client.pokemon,
          room: client.room,
        };
        return el.id !== client.id;
      });
      this.server.to(client.room).emit('leftRoom', removedClient);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}

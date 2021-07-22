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
import { PokemonService } from './pokemon.service';
import { ConfigService } from '@nestjs/config';

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
            data.pokemon.toString(),
          );
          res.image = `${this.configService.get('REPO_IMAGES')}${
            data.pokemon
          }.png`;
          client.pokemon = res;
          client.join(data.room);
          client.emit('joinedRoom', {
            room: client.room,
            pokemon: client.pokemon,
          });
          if (!this.connectedUsers[client.room]) {
            this.connectedUsers[client.room] = [client];
          } else {
            this.connectedUsers[client.room].push(client);
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
    client.emit('leftRoom', client.room);
    if (this.connectedUsers[client.room]) {
      this.connectedUsers[client.room] = this.connectedUsers[
        client.room
      ].filter((el) => el.id !== client.id);
    }
  }
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (this.connectedUsers[client.room]) {
      this.connectedUsers[client.room] = this.connectedUsers[
        client.room
      ].filter((el) => el.id !== client.id);
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'chat', path: '/chat' })
//@WebSocketGateway(81, { transports: ['websocket'] })
export class ChatGateway {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { name: string; text: string },
  ): WsResponse<unknown> {
    if (client.room) {
      this.logger.log('Sending messages');
      return this.server.to(client.room).emit('msgToClient', message);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): void {
    this.logger.log(`Join ${client.id} to ${data.room}`);
    client.room = data.room;
    return client.join(data.room);
  }
}

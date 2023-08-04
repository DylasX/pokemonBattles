import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(4001, {
  transports: ['websocket'],
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @ConnectedSocket() client: Socket & Partial<Record<string, string>>,
    @MessageBody() message: { name: string; text: string },
  ): boolean {
    if (client.room) {
      this.logger.log('Sending messages');
      return this.server.to(client.room).emit('msgToClient', message);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket & Partial<Record<string, string>>,
    @MessageBody() data: { room: string },
  ) {
    this.logger.log(`Join ${client.id} to ${data.room}`);
    client.room = data.room;
    return client.join(data.room);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  getRoom(client: Socket, index: number): Array<string> | string {
    const rooms = Array.from(client.rooms);
    if (index) {
      return rooms[index];
    }
    return rooms;
  }
}

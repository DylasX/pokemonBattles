import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    const event = 'events';
    console.log({ process: process.pid });
    client.join('general');
    this.server.to('general').emit('events', { process: process.pid, data });
    return { event, data };
  }
}

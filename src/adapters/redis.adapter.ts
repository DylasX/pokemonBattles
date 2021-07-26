import { IoAdapter } from '@nestjs/platform-socket.io';
import * as io from 'socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import * as redis from 'redis';

export class RedisIoAdapter extends IoAdapter {
  protected ioServer: io.Server;
  constructor(app: any) {
    super();
    const httpServer = app.getHttpServer();
    this.ioServer = io(httpServer);
  }
  createIOServer(port: number, options?: io.ServerOptions): any {
    let server;
    //same port with main application
    if (port == 0 || port == parseInt(process.env.PORT || '3000'))
      server = this.ioServer;
    //different port with main application
    else server = super.createIOServer(port, options);

    const pub = redis.createClient({
      host: process.env.REDISHOST || 'localhost',
      port: parseInt(process.env.REDISPORT || '6379'),
    });
    const sub = redis.createClient({
      host: process.env.REDISHOST || 'localhost',
      port: parseInt(process.env.REDISPORT || '6379'),
    });
    const redisAdapter = redisIoAdapter({ pubClient: pub, subClient: sub });
    //const redisAdapter = redisIoAdapter({ port: parseInt(process.env.REDISPORT || '6379'), host: process.env.REDISHOST || 'localhost' });

    server.adapter(redisAdapter);
    return server;
  }
}

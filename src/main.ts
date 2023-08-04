import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppClusterService } from './app-cluster.service';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.set('trust proxy', 1);
  app.useWebSocketAdapter(redisIoAdapter);
  // app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(4000);
}

//bootstrap();
AppClusterService.clusterize(bootstrap);

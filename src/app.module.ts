import { Module, HttpModule } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { PokemonGateway } from './pokemon/pokemon.gateway';
import { PokemonService } from './pokemon/pokemon.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        PUBLIC_API_URL: Joi.string().required(),
        REPO_IMAGES: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [PokemonGateway, PokemonService],
})
export class AppModule {}

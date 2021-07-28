import { Module, HttpModule } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { ChatModule } from './events/chat.module';
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
    PokemonModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

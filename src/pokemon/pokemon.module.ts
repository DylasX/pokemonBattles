import { Module } from '@nestjs/common';
import { PokemonGateway } from './pokemon.gateway';
import { PokemonService } from './pokemon.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [PokemonGateway, PokemonService],
})
export class PokemonModule {}

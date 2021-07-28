import { Module, HttpModule } from '@nestjs/common';
import { PokemonGateway } from './pokemon.gateway';
import { PokemonService } from './pokemon.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [PokemonGateway, PokemonService],
})
export class PokemonModule {}

import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { Pokemon } from './pokemon.interface';

@Injectable()
export class PokemonService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  getPokemon(id: string): Promise<Pokemon> {
    return this.http
      .get<{ [data: string]: Pokemon }>(
        `${this.configService.get('PUBLIC_API_URL')}pokemon/${id}`,
      )
      .pipe(map((res: AxiosResponse) => res.data))
      .toPromise();
  }

  generateAbilities(pokemon: Pokemon): any[] {
    //TODO: Change this to allow user to choose moves
    //MOCK FUNCTION ABILITIES
    return [
      {
        move: pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)]
          .move.name,
        power: Math.floor(Math.random() * 10),
      },
      {
        move: pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)]
          .move.name,
        power: Math.floor(Math.random() * 10),
      },
      {
        move: pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)]
          .move.name,
        power: Math.floor(Math.random() * 10),
      },
      {
        move: pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)]
          .move.name,
        power: Math.floor(Math.random() * 10),
      },
    ];
  }
}

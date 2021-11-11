import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Pokemon, PokemonMove } from './pokemon.interface';

@Injectable()
export class PokemonService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  getPokemon(id: string): any {
    return this.http
      .get<{ [data: string]: Pokemon }>(
        `${this.configService.get('PUBLIC_API_URL')}pokemon/${id}`,
      )
      .pipe(map((res: AxiosResponse) => res.data))
      .toPromise();
  }

  generateMoves(selectedMoves: number[] | string[]): Promise<any>[] {
    //TODO: Change this to allow user to choose moves
    //MOCK FUNCTION ABILITIES
    const urlMoves = `${this.configService.get('PUBLIC_API_URL')}/move/`;
    const moves = selectedMoves.map((el) => {
      return this.http
        .get<Promise<PokemonMove>>(`${urlMoves}${el}/`)
        .pipe(map((res: AxiosResponse) => res.data))
        .toPromise();
    });
    return moves;
  }
}

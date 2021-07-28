export interface Pokemon {
  abilities: [];
  base_experience: number;
  forms: [];
  game_indices: [];
  height: number;
  held_items: [];
  id: number;
  image: string;
  is_default: boolean;
  location_area_encounters: string;
  moves: any[];
  name: string;
  order: number;
  past_types: [];
  species: Record<string, unknown>;
  sprites: Record<string, unknown>;
  stats: [];
  types: [];
  weight: number;
}

export interface PokemonMove {
  accuracy: number;
  id: number;
  pp: number;
  power: number;
  priority: number;
  target: Record<string, unknown>;
  type: Record<string, unknown>;
  stat_changes: any[];
  name: string;
}

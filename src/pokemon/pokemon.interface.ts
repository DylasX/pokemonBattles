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

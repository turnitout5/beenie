export type Direction = 'down' | 'up' | 'left' | 'right';

export type RoomId = 
  | 'overworld'
  | 'bureau'
  | 'museum'
  | 'court'
  | 'archive'
  | 'observatory'
  | 'garden'
  | 'dream_estates'
  | 'castle_realm'
  | 'mafia_realm'
  | 'islamabad_realm'
  | 'bakery_realm'
  | 'haveli_realm';

export interface Position {
  x: number;
  y: number;
}

export interface InteractableObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  promptLabel: string;
  type: 
    | 'door'
    | 'npc_ted'
    | 'filing_cabinet'
    | 'bureau_desk'
    | 'bureau_drawer'
    | 'museum_portrait_1'
    | 'museum_portrait_2' // holds the brass key!
    | 'museum_achievements'
    | 'museum_phenomenon'
    | 'court_judge'
    | 'court_prosecution'
    | 'court_defense'
    | 'court_bench_secret'
    | 'archive_crystal_1'
    | 'archive_crystal_2'
    | 'archive_crystal_3'
    | 'observatory_telescope'
    | 'observatory_altar'
    | 'garden_bench'
    | 'signpost'
    | 'birthday_cake'
    | 'garage_vehicles'
    | 'jet_tarmac'
    | 'feast_table'
    | 'paisay_vault'
    | 'sports_arena'
    | 'house_islamabad'
    | 'house_mafia'
    | 'house_bakery'
    | 'house_castle'
    | 'house_haveli';
  targetRoom?: RoomId;
  targetPos?: Position;
}

export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomDefinition {
  id: RoomId;
  name: string;
  width: number;
  height: number;
  defaultSpawn: Position;
  interactables: InteractableObject[];
  collisionBoxes: CollisionBox[];
  theme: string;
}

export type EmoteType = 'heart' | 'exclamation' | 'question' | 'music' | 'blush' | 'sparkle' | 'sleep' | null;

export interface LightSource {
  x: number;
  y: number;
  radius: number;
  intensity: number;
  color?: string;
}

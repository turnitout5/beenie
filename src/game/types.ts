export type Direction = 'down' | 'up' | 'left' | 'right';

export type RoomId = 
  | 'overworld'
  | 'bureau'
  | 'museum'
  | 'court'
  | 'archive'
  | 'observatory'
  | 'garden';

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
    | 'signpost';
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

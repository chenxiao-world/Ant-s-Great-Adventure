
export type Point = { x: number; y: number };

export enum EntityType {
  PLATFORM = 'platform',
  OBSTACLE = 'obstacle',
  GOAL = 'goal',
  ENEMY = 'enemy',
  WATER = 'water',
  SWITCH = 'switch',
  GATE = 'gate',
  SECRET_WALL = 'secret_wall',
  SECRET_GOAL = 'secret_goal',
  FOOD = 'food'
}

export interface Entity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  targetId?: string; // For switches to target gates
  isActive?: boolean; // Current state
  range?: number;
  vx?: number;
  vy?: number;
  enemyType?: 'beetle' | 'spider' | 'wasp' | 'worm';
  value?: number; // For food
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  worldWidth: number;
  worldHeight: number;
  startPos: Point;
  goalPos: Point;
  entities: Entity[];
}

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const GRAVITY = 0.8;
export const JUMP_FORCE = -16;
export const MOVE_SPEED = 6;

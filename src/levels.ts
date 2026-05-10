import { EntityType, LevelData } from './types';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "The Mechanical Gate",
    description: "Find the leaf switch to open the thick vine gate. Collect food points to buy upgrades.",
    worldWidth: 1000,
    worldHeight: 600,
    startPos: { x: 100, y: 400 },
    goalPos: { x: 850, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1000, height: 50, color: '#3f6212' },
      { id: 'gate1', type: EntityType.GATE, x: 700, y: 400, width: 20, height: 150, color: '#14532d', isActive: true },
      { id: 'p1', type: EntityType.PLATFORM, x: 300, y: 350, width: 100, height: 20, color: '#78350f' },
      { id: 's1', type: EntityType.SWITCH, x: 340, y: 330, width: 20, height: 20, color: '#fbbf24', targetId: 'gate1' },
      { id: 'f1', type: EntityType.FOOD, x: 200, y: 500, width: 20, height: 20, value: 10 },
      { id: 'f2', type: EntityType.FOOD, x: 250, y: 500, width: 20, height: 20, value: 10 },
      { id: 'f3', type: EntityType.FOOD, x: 300, y: 500, width: 20, height: 20, value: 10 },
    ]
  },
  {
    id: 2,
    name: "The Dual Path",
    description: "One switch is not enough.",
    worldWidth: 1200,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1100, y: 400 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1200, height: 50, color: '#3f6212' },
      { id: 'gateA', type: EntityType.GATE, x: 500, y: 400, width: 20, height: 150, color: '#14532d', isActive: true },
      { id: 'gateB', type: EntityType.GATE, x: 900, y: 400, width: 20, height: 150, color: '#14532d', isActive: true },
      
      { id: 'p1', type: EntityType.PLATFORM, x: 200, y: 300, width: 100, height: 20, color: '#78350f' },
      { id: 'sA', type: EntityType.SWITCH, x: 240, y: 280, width: 20, height: 20, color: '#fbbf24', targetId: 'gateA' },
      
      { id: 'p2', type: EntityType.PLATFORM, x: 600, y: 300, width: 100, height: 20, color: '#78350f' },
      { id: 'sB', type: EntityType.SWITCH, x: 640, y: 280, width: 20, height: 20, color: '#fbbf24', targetId: 'gateB' },

      { id: 'f1', type: EntityType.FOOD, x: 250, y: 200, width: 20, height: 20, value: 5 },
      { id: 'f2', type: EntityType.FOOD, x: 300, y: 200, width: 20, height: 20, value: 5 },
      { id: 'f3', type: EntityType.FOOD, x: 650, y: 200, width: 20, height: 20, value: 10 },
    ]
  },
  {
    id: 3,
    name: "The Patrol",
    description: "Watch out for the moving enemy.",
    worldWidth: 1200,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1100, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1200, height: 50, color: '#3f6212' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'beetle', x: 400, y: 490, width: 50, height: 50, range: 150, vx: 2 },
      { id: 'f1', type: EntityType.FOOD, x: 400, y: 350, width: 20, height: 20, value: 15 },
      { id: 'f2', type: EntityType.FOOD, x: 450, y: 350, width: 20, height: 20, value: 15 },
    ]
  },
  {
    id: 4,
    name: "Spider's Thread",
    description: "Sometimes the threat comes from above.",
    worldWidth: 1200,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1100, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1200, height: 50, color: '#3f6212' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'spider', x: 400, y: 200, width: 50, height: 50, range: 200, vy: 3 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'spider', x: 800, y: 400, width: 50, height: 50, range: 200, vy: -2 },
    ]
  },
  {
    id: 5,
    name: "Wasp Skies",
    description: "They guard the airways.",
    worldWidth: 1500,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1400, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1500, height: 50, color: '#3f6212' },
      { id: 'p1', type: EntityType.PLATFORM, x: 400, y: 450, width: 100, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 800, y: 350, width: 100, height: 20, color: '#78350f' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'wasp', x: 300, y: 400, width: 50, height: 50, range: 300, vx: 3 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'wasp', x: 1000, y: 300, width: 50, height: 50, range: 300, vx: -2 },
    ]
  },
  {
    id: 6,
    name: "Worm Traps",
    description: "Tread carefully.",
    worldWidth: 1200,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1100, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1200, height: 50, color: '#3f6212' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'worm', x: 400, y: 550, width: 50, height: 50 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'worm', x: 800, y: 550, width: 50, height: 50 },
    ]
  },
  {
    id: 7,
    name: "The Swarm",
    description: "It takes all of them.",
    worldWidth: 1500,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1400, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1500, height: 50, color: '#3f6212' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'spider', x: 400, y: 200, width: 50, height: 50, range: 250, vy: 4 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'beetle', x: 700, y: 490, width: 50, height: 50, range: 100, vx: 2 },
      { id: 'e3', type: EntityType.ENEMY, enemyType: 'wasp', x: 1000, y: 300, width: 50, height: 50, range: 250, vx: 3 },
    ]
  },
  {
    id: 8,
    name: "Treacherous Waters",
    description: "Jump precisely.",
    worldWidth: 1500,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1400, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 300, height: 50, color: '#3f6212' },
      { id: 'w1', type: EntityType.WATER, x: 300, y: 560, width: 900, height: 40, color: '#3b82f6' },
      { id: 'g2', type: EntityType.PLATFORM, x: 1200, y: 550, width: 300, height: 50, color: '#3f6212' },
      { id: 'p1', type: EntityType.PLATFORM, x: 400, y: 450, width: 100, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 700, y: 350, width: 100, height: 20, color: '#78350f' },
      { id: 'p3', type: EntityType.PLATFORM, x: 1000, y: 450, width: 100, height: 20, color: '#78350f' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'wasp', x: 600, y: 300, width: 50, height: 50, range: 200, vx: 2 },
    ]
  },
  {
    id: 9,
    name: "The Gauntlet",
    description: "Almost there.",
    worldWidth: 1500,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1400, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1500, height: 50, color: '#3f6212' },
      { id: 'gate1', type: EntityType.GATE, x: 600, y: 400, width: 20, height: 150, color: '#14532d', isActive: true },
      { id: 's1', type: EntityType.SWITCH, x: 400, y: 530, width: 20, height: 20, color: '#fbbf24', targetId: 'gate1' },
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'beetle', x: 800, y: 490, width: 50, height: 50, range: 150, vx: 3 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'worm', x: 1100, y: 550, width: 50, height: 50 },
    ]
  },
  {
    id: 10,
    name: "The Secret Area",
    description: "Every 10 levels, keep an eye out for illusions.",
    worldWidth: 1500,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1400, y: 490 }, // Normal goal
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1500, height: 50, color: '#3f6212' },
      // A large wall blocking the path, but part of it is an illusion
      { id: 'wall1', type: EntityType.PLATFORM, x: 600, y: 250, width: 100, height: 300, color: '#4b5563' },
      // The secret passage goes right through the base of the wall
      { id: 'sec_wall', type: EntityType.SECRET_WALL, x: 600, y: 450, width: 100, height: 100, color: '#1e293b' },
      { id: 'sec_goal', type: EntityType.SECRET_GOAL, x: 750, y: 490, width: 60, height: 60 },
      // Alternatively, the player might jump over
      { id: 'p1', type: EntityType.PLATFORM, x: 300, y: 400, width: 100, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 500, y: 250, width: 100, height: 20, color: '#78350f' },
    ]
  },
  {
    id: 11,
    name: "The Great Chasm",
    description: "Don't fall in.",
    worldWidth: 1800,
    worldHeight: 600,
    startPos: { x: 50, y: 300 },
    goalPos: { x: 1700, y: 300 },
    entities: [
      { id: 'start_p', type: EntityType.PLATFORM, x: 0, y: 400, width: 200, height: 200, color: '#3f6212' },
      { id: 'w1', type: EntityType.WATER, x: 200, y: 550, width: 1400, height: 50, color: '#3b82f6' },
      { id: 'goal_p', type: EntityType.PLATFORM, x: 1600, y: 400, width: 200, height: 200, color: '#3f6212' },
      
      { id: 'p1', type: EntityType.PLATFORM, x: 300, y: 400, width: 80, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 550, y: 300, width: 80, height: 20, color: '#78350f' },
      { id: 'p3', type: EntityType.PLATFORM, x: 800, y: 450, width: 80, height: 20, color: '#78350f' },
      { id: 'p4', type: EntityType.PLATFORM, x: 1050, y: 350, width: 80, height: 20, color: '#78350f' },
      { id: 'p5', type: EntityType.PLATFORM, x: 1300, y: 250, width: 80, height: 20, color: '#78350f' },
      
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'wasp', x: 450, y: 250, width: 50, height: 50, range: 100, vx: 3 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'wasp', x: 950, y: 400, width: 50, height: 50, range: 100, vx: -3 },
      { id: 'e3', type: EntityType.ENEMY, enemyType: 'spider', x: 1200, y: 100, width: 50, height: 50, range: 250, vy: 4 },

      { id: 'f1', type: EntityType.FOOD, x: 330, y: 370, width: 20, height: 20, value: 5 },
      { id: 'f2', type: EntityType.FOOD, x: 830, y: 420, width: 20, height: 20, value: 5 },
      { id: 'f3', type: EntityType.FOOD, x: 1330, y: 220, width: 20, height: 20, value: 10 },
    ]
  },
  {
    id: 12,
    name: "Infestation",
    description: "It's raining spiders.",
    worldWidth: 1500,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1400, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1500, height: 50, color: '#3f6212' },
      { id: 'p1', type: EntityType.PLATFORM, x: 300, y: 400, width: 400, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 800, y: 250, width: 400, height: 20, color: '#78350f' },
      
      { id: 'e1', type: EntityType.ENEMY, enemyType: 'spider', x: 200, y: 100, width: 50, height: 50, range: 350, vy: 5 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'spider', x: 400, y: 50, width: 50, height: 50, range: 400, vy: 6 },
      { id: 'e3', type: EntityType.ENEMY, enemyType: 'spider', x: 600, y: 150, width: 50, height: 50, range: 300, vy: 4 },
      { id: 'e4', type: EntityType.ENEMY, enemyType: 'spider', x: 800, y: 0, width: 50, height: 50, range: 400, vy: 7 },
      { id: 'e5', type: EntityType.ENEMY, enemyType: 'spider', x: 1000, y: 100, width: 50, height: 50, range: 300, vy: 5 },
      { id: 'e6', type: EntityType.ENEMY, enemyType: 'spider', x: 1200, y: 50, width: 50, height: 50, range: 350, vy: 6 },
      
      { id: 'e7', type: EntityType.ENEMY, enemyType: 'beetle', x: 400, y: 350, width: 50, height: 50, range: 150, vx: 4 },
      { id: 'e8', type: EntityType.ENEMY, enemyType: 'beetle', x: 900, y: 200, width: 50, height: 50, range: 150, vx: 4 },

      { id: 'f1', type: EntityType.FOOD, x: 500, y: 360, width: 20, height: 20, value: 10 },
      { id: 'f2', type: EntityType.FOOD, x: 1000, y: 210, width: 20, height: 20, value: 10 },
      { id: 'f3', type: EntityType.FOOD, x: 1300, y: 510, width: 20, height: 20, value: 20 },
    ]
  },
  {
    id: 13,
    name: "Switching Gears",
    description: "Think before you leap.",
    worldWidth: 1600,
    worldHeight: 600,
    startPos: { x: 50, y: 400 },
    goalPos: { x: 1500, y: 490 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 550, width: 1600, height: 50, color: '#3f6212' },
      
      { id: 'gate1', type: EntityType.GATE, x: 400, y: 350, width: 20, height: 200, color: '#14532d', isActive: true },
      { id: 'gate2', type: EntityType.GATE, x: 1000, y: 350, width: 20, height: 200, color: '#14532d', isActive: true },
      
      { id: 'p1', type: EntityType.PLATFORM, x: 200, y: 200, width: 100, height: 20, color: '#78350f' },
      { id: 's1', type: EntityType.SWITCH, x: 240, y: 180, width: 20, height: 20, color: '#fbbf24', targetId: 'gate1' },

      { id: 'p2', type: EntityType.PLATFORM, x: 500, y: 400, width: 100, height: 20, color: '#78350f' },
      { id: 'p3', type: EntityType.PLATFORM, x: 700, y: 250, width: 100, height: 20, color: '#78350f' },
      { id: 's2', type: EntityType.SWITCH, x: 740, y: 230, width: 20, height: 20, color: '#fbbf24', targetId: 'gate2' },

      { id: 'e1', type: EntityType.ENEMY, enemyType: 'worm', x: 450, y: 550, width: 50, height: 50 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'worm', x: 600, y: 550, width: 50, height: 50 },
      { id: 'e3', type: EntityType.ENEMY, enemyType: 'worm', x: 800, y: 550, width: 50, height: 50 },

      { id: 'e4', type: EntityType.ENEMY, enemyType: 'wasp', x: 800, y: 300, width: 50, height: 50, range: 150, vx: 2 },
      
      { id: 'f1', type: EntityType.FOOD, x: 240, y: 150, width: 20, height: 20, value: 5 },
      { id: 'f2', type: EntityType.FOOD, x: 740, y: 200, width: 20, height: 20, value: 5 },
      { id: 'f3', type: EntityType.FOOD, x: 1200, y: 510, width: 20, height: 20, value: 15 },
    ]
  },
  {
    id: 14,
    name: "The Wall",
    description: "Climb to survive.",
    worldWidth: 1000,
    worldHeight: 1200,
    startPos: { x: 50, y: 1000 },
    goalPos: { x: 850, y: 50 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 1150, width: 1000, height: 50, color: '#3f6212' },
      
      { id: 'p1', type: EntityType.PLATFORM, x: 200, y: 950, width: 80, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 450, y: 800, width: 80, height: 20, color: '#78350f' },
      { id: 'p3', type: EntityType.PLATFORM, x: 700, y: 650, width: 80, height: 20, color: '#78350f' },
      { id: 'p4', type: EntityType.PLATFORM, x: 450, y: 500, width: 80, height: 20, color: '#78350f' },
      { id: 'p5', type: EntityType.PLATFORM, x: 200, y: 350, width: 80, height: 20, color: '#78350f' },
      { id: 'p6', type: EntityType.PLATFORM, x: 450, y: 200, width: 80, height: 20, color: '#78350f' },
      
      { id: 'goal_plat', type: EntityType.PLATFORM, x: 750, y: 100, width: 250, height: 20, color: '#3f6212' },

      { id: 'e1', type: EntityType.ENEMY, enemyType: 'wasp', x: 300, y: 850, width: 50, height: 50, range: 100, vx: 2 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'wasp', x: 600, y: 700, width: 50, height: 50, range: 100, vx: -2 },
      { id: 'e3', type: EntityType.ENEMY, enemyType: 'wasp', x: 550, y: 550, width: 50, height: 50, range: 100, vx: 3 },
      { id: 'e4', type: EntityType.ENEMY, enemyType: 'wasp', x: 300, y: 250, width: 50, height: 50, range: 150, vx: -3 },
      
      { id: 'e5', type: EntityType.ENEMY, enemyType: 'spider', x: 100, y: 50, width: 50, height: 50, range: 500, vy: 5 },
      
      { id: 'f1', type: EntityType.FOOD, x: 480, y: 770, width: 20, height: 20, value: 10 },
      { id: 'f2', type: EntityType.FOOD, x: 480, y: 470, width: 20, height: 20, value: 10 },
      { id: 'f3', type: EntityType.FOOD, x: 480, y: 170, width: 20, height: 20, value: 10 },
    ]
  },
  {
    id: 15,
    name: "Gauntlet II",
    description: "Everything you've learned.",
    worldWidth: 2000,
    worldHeight: 800,
    startPos: { x: 50, y: 600 },
    goalPos: { x: 1850, y: 250 },
    entities: [
      { id: 'g1', type: EntityType.PLATFORM, x: 0, y: 750, width: 300, height: 50, color: '#3f6212' },
      { id: 'w1', type: EntityType.WATER, x: 300, y: 760, width: 1400, height: 40, color: '#3b82f6' },
      { id: 'g2', type: EntityType.PLATFORM, x: 1700, y: 750, width: 300, height: 50, color: '#3f6212' },
      
      { id: 'p1', type: EntityType.PLATFORM, x: 400, y: 650, width: 80, height: 20, color: '#78350f' },
      { id: 'p2', type: EntityType.PLATFORM, x: 700, y: 550, width: 80, height: 20, color: '#78350f' },
      
      { id: 'gate1', type: EntityType.GATE, x: 950, y: 300, width: 20, height: 400, color: '#14532d', isActive: true },
      { id: 's1', type: EntityType.SWITCH, x: 740, y: 530, width: 20, height: 20, color: '#fbbf24', targetId: 'gate1' },

      { id: 'wall1', type: EntityType.PLATFORM, x: 1050, y: 500, width: 50, height: 200, color: '#4b5563' },
      { id: 'p3', type: EntityType.PLATFORM, x: 1100, y: 500, width: 100, height: 20, color: '#78350f' },
      { id: 'p4', type: EntityType.PLATFORM, x: 1350, y: 400, width: 100, height: 20, color: '#78350f' },

      { id: 'goal_plat', type: EntityType.PLATFORM, x: 1800, y: 300, width: 200, height: 20, color: '#3f6212' },

      { id: 'e1', type: EntityType.ENEMY, enemyType: 'wasp', x: 500, y: 550, width: 50, height: 50, range: 150, vx: 2 },
      { id: 'e2', type: EntityType.ENEMY, enemyType: 'spider', x: 800, y: 150, width: 50, height: 50, range: 400, vy: 5 },
      
      { id: 'e3', type: EntityType.ENEMY, enemyType: 'beetle', x: 1120, y: 450, width: 50, height: 50, range: 60, vx: 2 },
      { id: 'e4', type: EntityType.ENEMY, enemyType: 'wasp', x: 1500, y: 250, width: 50, height: 50, range: 200, vx: -4 },
      
      { id: 'f1', type: EntityType.FOOD, x: 430, y: 620, width: 20, height: 20, value: 5 },
      { id: 'f2', type: EntityType.FOOD, x: 1150, y: 470, width: 20, height: 20, value: 10 },
      { id: 'f3', type: EntityType.FOOD, x: 1400, y: 370, width: 20, height: 20, value: 15 },
    ]
  }
];

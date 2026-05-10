
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Bug, Skull, Trophy, Play, RefreshCw, ArrowRight, Heart, Zap, Store, Coins } from 'lucide-react';
import { LEVELS } from './levels';
import { EntityType, Point, GAME_WIDTH, GAME_HEIGHT, GRAVITY, JUMP_FORCE, MOVE_SPEED, Entity } from './types';
import { useInput } from './hooks/useInput';

const ANT_SIZE = 32;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'VICTORY' | 'SHOP'>('START');
  const [playerPos, setPlayerPos] = useState<Point>({ x: 0, y: 0 });
  const [health, setHealth] = useState(100);
  const [foodPoints, setFoodPoints] = useState(0);
  const [hasRockAbility, setHasRockAbility] = useState(false);
  const [currentSkin, setCurrentSkin] = useState('#f8fafc');
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['#f8fafc']);
  const [camera, setCamera] = useState<Point>({ x: 0, y: 0 });
  const [levelAnnounce, setLevelAnnounce] = useState(false);
  const [localEntities, setLocalEntities] = useState<Entity[]>([]);

  const keysRef = useInput();
  const prevKeysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, onGround: false, doubleJumped: false, facingRight: true });
  const enemiesRef = useRef<{ id: string; x: number; y: number; vx: number; vy: number, startX: number, startY: number, range: number, enemyType: string, timer: number, hp: number }[]>([]);
  const rockProjectilesRef = useRef<{x: number, y: number, vx: number, vy: number}[]>([]);
  const poisonTimerRef = useRef(0);
  const requestRef = useRef<number>(null);

  const level = LEVELS[currentLevelIdx];

  const initLevel = (idx: number) => {
    const l = LEVELS[idx];
    setLocalEntities(l.entities.map(e => ({ ...e })));
    playerRef.current = { x: l.startPos.x, y: l.startPos.y, vx: 0, vy: 0, onGround: false, doubleJumped: false, facingRight: true };
    setPlayerPos({ x: l.startPos.x, y: l.startPos.y });
    setHealth(100);
    poisonTimerRef.current = 0;
    rockProjectilesRef.current = [];
    
    enemiesRef.current = l.entities
      .filter(e => e.type === EntityType.ENEMY)
      .map(e => ({
        id: e.id,
        x: e.x,
        y: e.y,
        startX: e.x,
        startY: e.y,
        range: e.range ?? 200,
        vx: e.vx ?? 2,
        vy: e.vy ?? 0,
        enemyType: e.enemyType ?? 'beetle',
        timer: 0,
        hp: 10
      }));

    setGameState('PLAYING');
    setLevelAnnounce(true);
    setTimeout(() => setLevelAnnounce(false), 2000);
  };

  const checkCollision = (rect1: { x: number; y: number; w: number; h: number }, rect2: { x: number; y: number; w: number; h: number }) => {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.y + rect1.h > rect2.y
    );
  };

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const keys = keysRef.current;
    const p = playerRef.current;
    
    const jumpPressedThisFrame = (keys.has('ArrowUp') || keys.has('w')) && !(prevKeysRef.current.has('ArrowUp') || prevKeysRef.current.has('w'));
    const throwPressedThisFrame = keys.has(' ') && !prevKeysRef.current.has(' ');

    // Poison
    if (poisonTimerRef.current > 0) {
      poisonTimerRef.current--;
      if (poisonTimerRef.current % 30 === 0) {
        setHealth(h => {
           if (h <= 5) setGameState('GAMEOVER');
           return h - 5;
        });
      }
    }

    // Throw Rocks
    if (throwPressedThisFrame && hasRockAbility) {
       rockProjectilesRef.current.push({
          x: p.x + ANT_SIZE/2,
          y: p.y + ANT_SIZE/2,
          vx: p.facingRight ? 12 : -12,
          vy: -3
       });
    }

    // Movement
    if (keys.has('ArrowLeft') || keys.has('a')) { p.vx = -MOVE_SPEED; p.facingRight = false; }
    else if (keys.has('ArrowRight') || keys.has('d')) { p.vx = MOVE_SPEED; p.facingRight = true; }
    else p.vx = 0;

    if (jumpPressedThisFrame) {
      if (p.onGround) {
        p.vy = JUMP_FORCE;
        p.onGround = false;
      } else if (!p.doubleJumped) {
        p.vy = JUMP_FORCE;
        p.doubleJumped = true;
      }
    }

    // Apply Gravity
    p.vy += GRAVITY;
    
    // Potential positions
    let nextX = p.x + p.vx;
    let nextY = p.y + p.vy;

    // World boundaries
    if (nextX < 0) nextX = 0;
    if (nextX > level.worldWidth - ANT_SIZE) nextX = level.worldWidth - ANT_SIZE;

    // Collision detection
    p.onGround = false;
    let inWater = false;

    localEntities.forEach(ent => {
      // Platform or Active Gate collision
      if (ent.type === EntityType.PLATFORM || (ent.type === EntityType.GATE && ent.isActive)) {
        if (checkCollision({ x: p.x, y: nextY, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
          if (p.vy > 0) { // Falling
            nextY = ent.y - ANT_SIZE;
            p.vy = 0;
            p.onGround = true;
            p.doubleJumped = false;
          } else if (p.vy < 0) { // Jumping up
            nextY = ent.y + ent.height;
            p.vy = 0;
          }
        }
        // Horizontal collision
        if (checkCollision({ x: nextX, y: p.y, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
          nextX = p.x;
          p.vx = 0;
        }
      }

      // Switch interaction
      if (ent.type === EntityType.SWITCH && !ent.isActive) {
        if (checkCollision({ x: nextX, y: nextY, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
          setLocalEntities(prev => prev.map(e => {
            if (e.id === ent.id) return { ...e, isActive: true, color: '#10b981' };
            if (e.id === ent.targetId) return { ...e, isActive: false }; // Open the gate
            return e;
          }));
        }
      }

      // Food collection
      if (ent.type === EntityType.FOOD && ent.isActive !== false) {
         if (checkCollision({ x: nextX, y: nextY, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
            setFoodPoints(prev => prev + (ent.value || 10));
            setLocalEntities(prev => prev.map(e => e.id === ent.id ? { ...e, isActive: false } : e));
         }
      }

      // Water check
      if (ent.type === EntityType.WATER) {
         if (checkCollision({ x: p.x, y: p.y, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
            inWater = true;
         }
      }
    });

    if (inWater) {
       p.vy *= 0.5; // drag
       setHealth(h => {
          if (h <= 1) setGameState('GAMEOVER');
          return h - 1;
       });
    }

    p.x = nextX;
    p.y = nextY;
    
    // Update Rock Projectiles
    rockProjectilesRef.current = rockProjectilesRef.current.filter(rock => {
       rock.x += rock.vx;
       rock.y += rock.vy;
       rock.vy += GRAVITY;

       // collision with map
       let hitWall = false;
       for (const ent of localEntities) {
         if (ent.type === EntityType.PLATFORM || (ent.type === EntityType.GATE && ent.isActive)) {
           if (checkCollision({ x: rock.x - 5, y: rock.y - 5, w: 10, h: 10 }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
              hitWall = true;
              break;
           }
         }
       }
       if (hitWall) return false;
       return rock.y < level.worldHeight;
    });

    // Death by falling off world (if applicable)
    if (p.y > level.worldHeight) {
      setGameState('GAMEOVER');
    }

    // Update Enemies
    enemiesRef.current = enemiesRef.current.filter(enemy => {
      if (enemy.hp <= 0) return false;

      if (enemy.enemyType === 'beetle') {
        enemy.x += enemy.vx;
        if (Math.abs(enemy.x - enemy.startX) > enemy.range) {
          enemy.vx *= -1;
        }
      } else if (enemy.enemyType === 'spider') {
        enemy.y += enemy.vy;
        if (Math.abs(enemy.y - enemy.startY) > enemy.range) {
          enemy.vy *= -1;
        }
      } else if (enemy.enemyType === 'wasp') {
        enemy.timer += 0.05;
        enemy.x += enemy.vx;
        enemy.y = enemy.startY + Math.sin(enemy.timer) * 50;
        if (Math.abs(enemy.x - enemy.startX) > enemy.range) {
          enemy.vx *= -1;
        }
      } else if (enemy.enemyType === 'worm') {
        enemy.timer += 0.02;
        const offset = Math.sin(enemy.timer) * 60;
        enemy.y = enemy.startY - (offset > 0 ? offset : 0);
      }

      // Projectile collision
      let hitByRock = false;
      rockProjectilesRef.current = rockProjectilesRef.current.filter(rock => {
         if (checkCollision({ x: rock.x - 5, y: rock.y - 5, w: 10, h: 10 }, { x: enemy.x, y: enemy.y, w: 50, h: 50 })) {
            enemy.hp -= 10;
            hitByRock = true;
            return false;
         }
         return true;
      });

      // Player collision with enemy
      if (enemy.hp > 0 && checkCollision({ x: p.x, y: p.y, w: ANT_SIZE, h: ANT_SIZE }, { x: enemy.x + 10, y: enemy.y + 10, w: 30, h: 30 })) {
        setHealth(h => {
          if (h <= 20) {
            setGameState('GAMEOVER');
            return 0;
          }
          if (enemy.enemyType === 'spider') {
             poisonTimerRef.current = 180; // 3 seconds poison
          }
          // Simple knockback
          p.vx = (p.x < enemy.x ? -10 : 10);
          p.vy = -10;
          return h - 20;
        });
      }
      return enemy.hp > 0;
    });

    // Check Secret Goal
    localEntities.filter(e => e.type === EntityType.SECRET_GOAL).forEach(ent => {
      if (checkCollision({ x: p.x, y: p.y, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: 60, h: 60 })) {
        setGameState('VICTORY'); // Secret victory
      }
    });

    // Check Goal
    if (checkCollision({ x: p.x, y: p.y, w: ANT_SIZE, h: ANT_SIZE }, { x: level.goalPos.x, y: level.goalPos.y, w: 60, h: 60 })) {
      if (currentLevelIdx === LEVELS.length - 1) {
        setGameState('VICTORY');
      } else {
        const nextIdx = currentLevelIdx + 1;
        setCurrentLevelIdx(nextIdx);
        initLevel(nextIdx);
      }
    }

    setPlayerPos({ x: p.x, y: p.y });
    
    // update previous keys
    prevKeysRef.current = new Set(keysRef.current);
    
    // Side-scrolling camera
    setCamera({
      x: Math.max(0, Math.min(level.worldWidth - GAME_WIDTH, p.x - GAME_WIDTH / 2)),
      y: Math.max(0, Math.min(level.worldHeight - GAME_HEIGHT, p.y - GAME_HEIGHT / 2))
    });

    requestRef.current = requestAnimationFrame(update);
  }, [gameState, level, currentLevelIdx, localEntities]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Deep space background
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(camera.x, camera.y, GAME_WIDTH, GAME_HEIGHT);
    
    // World background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, level.worldHeight);
    bgGradient.addColorStop(0, '#020617');
    bgGradient.addColorStop(1, '#1c1917');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, level.worldWidth, level.worldHeight);

    // Goal (Anthill)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(level.goalPos.x, level.goalPos.y + 60);
    ctx.lineTo(level.goalPos.x + 30, level.goalPos.y);
    ctx.lineTo(level.goalPos.x + 60, level.goalPos.y + 60);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(level.goalPos.x + 30, level.goalPos.y + 50, 10, 0, Math.PI * 2); ctx.fill();

    // Entities
    localEntities.forEach(ent => {
      if (ent.isActive === false && ent.type !== EntityType.GATE) return;

      if (ent.type === EntityType.GATE && !ent.isActive) {
        // Subtle ghost gate
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
        ctx.setLineDash([]);
        return;
      }

      ctx.fillStyle = ent.color || '#ccc';
      if (ent.type === EntityType.WATER) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.globalAlpha = 1.0;
      } else if (ent.type === EntityType.SWITCH) {
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        // Switch icon
        ctx.fillStyle = ent.isActive ? '#fff' : 'rgba(255,255,255,0.5)';
        ctx.fillRect(ent.x + 5, ent.y + 5, 10, 10);
      } else if (ent.type === EntityType.SECRET_WALL) {
        const isInside = checkCollision({ x: playerPos.x, y: playerPos.y, w: ANT_SIZE, h: ANT_SIZE }, { x: ent.x, y: ent.y, w: ent.width, h: ent.height });
        ctx.globalAlpha = isInside ? 0.3 : 1.0;
        ctx.fillStyle = ent.color || '#3f6212';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(ent.x, ent.y, ent.width, 4);
        ctx.globalAlpha = 1.0;
      } else if (ent.type === EntityType.SECRET_GOAL) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.moveTo(ent.x + 30, ent.y + 10); ctx.lineTo(ent.x + 50, ent.y + 50); ctx.lineTo(ent.x + 10, ent.y + 50); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ent.x + 30, ent.y + 35, 10, 0, Math.PI * 2); ctx.fill();
      } else if (ent.type === EntityType.FOOD) {
        // Draw Food
        ctx.fillStyle = '#84cc16';
        ctx.beginPath(); ctx.arc(ent.x + 10, ent.y + 10, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#d9f99d';
        ctx.beginPath(); ctx.arc(ent.x + 7, ent.y + 7, 3, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(ent.x, ent.y, ent.width, 4);
      }
    });

    // Enemies
    enemiesRef.current.forEach(enemy => {
      if (enemy.enemyType === 'wasp') {
          ctx.fillStyle = '#eab308';
          ctx.beginPath(); ctx.ellipse(enemy.x + 25, enemy.y + 25, 20, 15, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#000';
          ctx.fillRect(enemy.x + 15, enemy.y + 10, 5, 30);
          ctx.fillRect(enemy.x + 30, enemy.y + 10, 5, 30);
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.beginPath(); ctx.ellipse(enemy.x + 25, enemy.y + 5, 15, 10, 0, 0, Math.PI * 2); ctx.fill();
      } else if (enemy.enemyType === 'spider') {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(enemy.x + 25, enemy.startY); ctx.lineTo(enemy.x + 25, enemy.y + 25); ctx.stroke();
          ctx.fillStyle = '#4c1d95';
          ctx.beginPath(); ctx.arc(enemy.x + 25, enemy.y + 25, 20, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#4c1d95'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(enemy.x + 5, enemy.y + 25); ctx.lineTo(enemy.x - 10, enemy.y + 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(enemy.x + 45, enemy.y + 25); ctx.lineTo(enemy.x + 60, enemy.y + 10); ctx.stroke();
      } else if (enemy.enemyType === 'worm') {
          if (enemy.y < enemy.startY) {
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.roundRect(enemy.x + 10, enemy.y, 30, enemy.startY - enemy.y + 10, [15, 15, 0, 0]);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillRect(enemy.x + 15, enemy.y + 10, 4, 4);
            ctx.fillRect(enemy.x + 25, enemy.y + 10, 4, 4);
          }
      } else {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.ellipse(enemy.x + 25, enemy.y + 30, 25, 20, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(enemy.x + 10, enemy.y + 40); ctx.lineTo(enemy.x, enemy.y + 55); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(enemy.x + 40, enemy.y + 40); ctx.lineTo(enemy.x + 50, enemy.y + 55); ctx.stroke();
      }
    });

    // Projectiles
    ctx.fillStyle = '#a8a29e';
    rockProjectilesRef.current.forEach(rock => {
      ctx.beginPath(); ctx.arc(rock.x, rock.y, 5, 0, Math.PI * 2); ctx.fill();
    });

    // Player (Ant)
    // Add green tint if poisoned
    if (poisonTimerRef.current > 0) {
      ctx.fillStyle = '#84cc16';
      ctx.strokeStyle = '#84cc16';
    } else {
      ctx.fillStyle = currentSkin; // Skin applied here
      ctx.strokeStyle = currentSkin;
    }
    
    // Ant body
    ctx.beginPath(); ctx.arc(playerPos.x + 8, playerPos.y + 24, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(playerPos.x + 16, playerPos.y + 20, 8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(playerPos.x + 24, playerPos.y + 16, 7, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = 2;
    // legs or antenna depend on direction
    if (playerRef.current.facingRight) {
       ctx.beginPath(); ctx.moveTo(playerPos.x + 24, playerPos.y + 16); ctx.lineTo(playerPos.x + 32, playerPos.y + 4); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(playerPos.x + 24, playerPos.y + 16); ctx.lineTo(playerPos.x + 20, playerPos.y + 4); ctx.stroke();
    } else {
       ctx.beginPath(); ctx.moveTo(playerPos.x + 8, playerPos.y + 16); ctx.lineTo(playerPos.x, playerPos.y + 4); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(playerPos.x + 8, playerPos.y + 16); ctx.lineTo(playerPos.x + 12, playerPos.y + 4); ctx.stroke();
    }

    ctx.restore();
  }, [camera, playerPos, level, localEntities, currentSkin]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative w-full h-screen bg-stone-950 flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* HUD */}
      {gameState === 'PLAYING' && (
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-stone-900/90 backdrop-blur-xl p-4 rounded-2xl border border-stone-800 shadow-2xl flex items-center gap-6"
          >
             <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-black">Level 0{level.id}</span>
                <span className="text-xl font-black text-white leading-tight italic uppercase tracking-tighter">{level.name}</span>
             </div>
             <div className="h-8 w-[2px] bg-stone-800" />
             <div className="flex flex-col gap-1 w-32">
                <div className="flex justify-between text-[10px] uppercase font-bold text-white tracking-widest">
                  <span>Integrität</span>
                  <span className={poisonTimerRef.current > 0 ? "text-red-400" : ""}>{Math.floor(health)}%</span>
                </div>
                <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                   <div 
                     className={`h-full ${poisonTimerRef.current > 0 ? 'bg-red-500' : 'bg-emerald-500'} transition-all`} 
                     style={{ width: `${Math.max(0, health)}%` }} 
                   />
                </div>
             </div>
             <div className="h-8 w-[2px] bg-stone-800" />
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
                   <span className="text-amber-500 font-black text-sm">{foodPoints}</span>
                </div>
             </div>
          </motion.div>
          
          <div className="flex gap-4">
            <button
               onClick={() => setGameState('SHOP')}
               className="bg-stone-900/90 hover:bg-stone-800 backdrop-blur-xl px-6 py-4 rounded-2xl border border-stone-800 shadow-2xl transition-all flex items-center gap-3 pointer-events-auto"
            >
               <Store className="w-4 h-4 text-emerald-500" />
               <span className="text-white font-bold uppercase tracking-widest text-[10px]">Shop</span>
            </button>
          </div>
        </div>
      )}

      {/* Level Announcement */}
      <AnimatePresence>
        {levelAnnounce && (
          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            className="absolute z-30 pointer-events-none flex flex-col items-center"
          >
            <h2 className="text-8xl font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-2xl text-center px-4">
              {level.name}
            </h2>
            <div className="px-4 py-1 bg-amber-500 text-stone-950 font-black uppercase text-xs tracking-[0.3em] rounded-full text-center">
              Target Acquired: Return to Colony
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Stage */}
      <div className="relative group rounded-[2.5rem] overflow-hidden border-[12px] border-stone-900 shadow-[0_0_120px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="bg-stone-950"
        />

        {/* Global Overlays */}
        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="mb-12 relative">
                <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-10 animate-pulse" />
                <div className="relative p-8 bg-stone-900 rounded-[3rem] border border-stone-800 shadow-2xl">
                  <Zap className="w-24 h-24 text-emerald-500" />
                </div>
              </div>

              <h1 className="text-8xl font-black text-white italic tracking-tighter uppercase mb-6 leading-[0.8]">
                Puzzle <br/> <span className="text-emerald-500 underline decoration-stone-800 underline-offset-8">Colony</span>
              </h1>
              
              <p className="text-stone-500 max-w-sm mb-12 text-sm font-medium leading-relaxed tracking-wide">
                Logic and timing are your only tools. Activate the environment to uncover the path home.
              </p>

              <button
                onClick={() => initLevel(0)}
                className="group relative px-16 py-6 bg-white text-stone-950 font-black text-2xl uppercase tracking-tighter rounded-[2rem] hover:bg-emerald-500 transition-all active:scale-95 flex items-center gap-6 shadow-[0_12px_0_#d1d5db] hover:shadow-[0_12px_0_#065f46]"
              >
                <Play className="w-8 h-8 fill-current" />
                Initiate Sequence
              </button>

              <div className="mt-16 flex gap-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    <div className="px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white text-xs font-black">A</div>
                    <div className="px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white text-xs font-black">D</div>
                  </div>
                  <span className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">Vector</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="px-8 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white text-xs font-black">SPACE</div>
                  <span className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">Throw Rock</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="px-8 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white text-xs font-black">W / UP</div>
                  <span className="text-[10px] text-stone-600 uppercase tracking-widest font-bold">Impulse</span>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'SHOP' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-stone-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center"
            >
              <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-4">
                 <Store className="w-12 h-12 text-amber-500" /> Basecamp Shop
              </h2>
              <div className="mb-8 flex items-center gap-3 bg-stone-900 border border-stone-800 px-6 py-3 rounded-full">
                 <Coins className="text-amber-500 w-6 h-6" />
                 <span className="text-white font-black text-xl">{foodPoints} FP Available</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-4xl w-full">
                 {/* Rock Ability */}
                 <div className="bg-stone-900 border border-stone-800 p-6 rounded-3xl text-left flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xl text-white uppercase">Rock Throw</h3>
                      <p className="text-stone-400 text-sm max-w-xs mt-1">Press 'SPACE' to throw rocks and stun/hurt enemies.</p>
                    </div>
                    {hasRockAbility ? (
                      <span className="px-6 py-2 bg-stone-800 text-stone-400 rounded-full font-bold uppercase text-xs">Owned</span>
                    ) : (
                      <button 
                        onClick={() => {
                          if (foodPoints >= 50) {
                            setFoodPoints(p => p - 50);
                            setHasRockAbility(true);
                          }
                        }}
                        className={`px-6 py-3 rounded-xl font-bold uppercase ${foodPoints >= 50 ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400' : 'bg-stone-800 text-stone-500 cursor-not-allowed'}`}
                      >
                         50 FP
                      </button>
                    )}
                 </div>

                 {/* Skins */}
                 {[
                   { name: 'Default Void', color: '#f8fafc', cost: 0 },
                   { name: 'Red Fire', color: '#ef4444', cost: 30 },
                   { name: 'Gold Prime', color: '#fbbf24', cost: 100 },
                   { name: 'Neon Toxic', color: '#34d399', cost: 80 }
                 ].map((skinOption, idx) => {
                    const isUnlocked = unlockedSkins.includes(skinOption.color);
                    const isCurrent = currentSkin === skinOption.color;
                    return (
                      <div key={idx} className="bg-stone-900 border border-stone-800 p-6 rounded-3xl text-left flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: skinOption.color }} />
                           <div>
                             <h3 className="font-bold text-xl text-white uppercase">{skinOption.name}</h3>
                             <p className="text-stone-400 text-sm mt-1">Armor Customization</p>
                           </div>
                        </div>
                        {isCurrent ? (
                          <span className="px-4 py-2 bg-transparent border-2 border-emerald-500 text-emerald-500 rounded-full font-bold uppercase text-xs">Equipped</span>
                        ) : isUnlocked ? (
                          <button 
                            onClick={() => setCurrentSkin(skinOption.color)}
                            className="px-6 py-2 bg-stone-800 text-white rounded-xl font-bold uppercase text-sm hover:bg-stone-700"
                          >
                             Equip
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              if (foodPoints >= skinOption.cost) {
                                setFoodPoints(p => p - skinOption.cost);
                                setUnlockedSkins(s => [...s, skinOption.color]);
                              }
                            }}
                            className={`px-6 py-3 rounded-xl font-bold uppercase ${foodPoints >= skinOption.cost ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' : 'bg-stone-800 text-stone-500 cursor-not-allowed'}`}
                          >
                             {skinOption.cost} FP
                          </button>
                        )}
                      </div>
                    );
                 })}
              </div>

              <button
                onClick={() => setGameState('PLAYING')}
                className="mt-12 px-16 py-4 bg-white text-stone-950 font-black text-xl uppercase tracking-tighter rounded-full hover:bg-stone-200 transition-all active:scale-95"
              >
                Return to Mission
              </button>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-red-950/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-24 h-24 bg-red-900/50 rounded-full flex items-center justify-center mb-8 border border-red-800">
                <Skull className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-7xl font-black text-white italic tracking-tighter uppercase mb-4">Sequence Failed</h2>
              <p className="text-red-300/50 max-w-sm mb-12 text-sm tracking-wide lowercase">Puzzle constraints breached. Recalibrating...</p>
              <button
                onClick={() => initLevel(currentLevelIdx)}
                className="px-12 py-5 bg-white text-red-950 font-black text-xl uppercase tracking-tighter rounded-2xl hover:bg-stone-200 transition-all active:scale-95 flex items-center gap-4"
              >
                <RefreshCw className="w-6 h-6" />
                Re-initiate
              </button>
            </motion.div>
          )}

          {gameState === 'VICTORY' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-30 animate-pulse" />
                <Trophy className="w-32 h-32 text-emerald-500 relative" />
              </div>
              <h2 className="text-8xl font-black text-white italic tracking-tighter uppercase mb-6">Discovery Complete</h2>
              <p className="text-stone-500 max-w-sm mb-12 text-sm leading-relaxed">The macro world has been mapped. The gates are open.</p>
              <button
                onClick={() => { setCurrentLevelIdx(0); setGameState('START'); }}
                className="px-16 py-6 bg-emerald-500 text-stone-950 font-black text-2xl uppercase tracking-tighter rounded-[2rem] hover:bg-emerald-400 transition-all active:scale-95 flex items-center gap-6"
              >
                <ArrowRight className="w-8 h-8" />
                Archive Data
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtitle / Footer */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="px-4 py-1.5 bg-stone-900 rounded-full border border-stone-800 flex items-center gap-3">
          <Bug className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] text-stone-500 font-black uppercase tracking-[0.2em]">Puzzle Edition // Stable V2</span>
        </div>
      </div>
    </div>
  );
}

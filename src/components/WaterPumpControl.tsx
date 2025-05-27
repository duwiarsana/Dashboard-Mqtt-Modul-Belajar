import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { useMqtt } from '../contexts/MqttContext';
import { Droplets, Power } from 'lucide-react';
// Simple cn utility for conditional class names
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Add keyframes for bubble animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.5;
    }
    90% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-100px) translateX(10px);
      opacity: 0;
    }
  }
  
  .animate-float {
    animation: float 5s infinite ease-in-out;
  }
`;
document.head.appendChild(style);

interface WaterPumpControlProps {
  waterLevelTopic: string;
  relayTopic: string;
  publishTopic: string;
}

// Helper function to get water color class based on level
const getWaterColorClass = (level: number): string => {
  if (level < 20) return 'bg-red-500';
  if (level < 50) return 'bg-yellow-500';
  return 'bg-blue-500';
};

// Helper function to get water level status message
const getWaterLevelStatus = (level: number): string => {
  if (level >= 80) return "Tank penuh";
  if (level >= 50) return "Tank cukup";
  if (level >= 20) return "Tank hampir habis";
  return "Tank kosong";
};

// Enhanced water animation with improved fluid dynamics
const WaveAnimation: React.FC<{ level: number }> = ({ level }) => {
  // Refs for SVG paths
  const waveRef1 = useRef<SVGPathElement>(null);
  const waveRef2 = useRef<SVGPathElement>(null);
  const waveRef3 = useRef<SVGPathElement>(null);
  const timeRef = useRef<number>(0);
  const frameId = useRef<number>();
  
  // Wave parameters for more natural movement
  const waves = {
    base: {
      height: 12,
      speed: 0.0005,
      amplitude: 1.8,
      frequency: 0.015,
      points: 24,
      opacity: 0.7
    },
    middle: {
      height: 10,
      speed: 0.0007,
      amplitude: 2.2,
      frequency: 0.018,
      points: 20,
      opacity: 0.6
    },
    top: {
      height: 8,
      speed: 0.0009,
      amplitude: 1.5,
      frequency: 0.025,
      points: 16,
      opacity: 0.5
    }
  };

  // Enhanced water colors with better gradients
  const getWaterColor = (level: number) => {
    if (level < 20) return {
      base: '#3b82f6',
      light: '#60a5fa',
      highlight: '#93c5fd',
      surface: '#bfdbfe'
    };
    if (level < 50) return {
      base: '#60a5fa',
      light: '#93c5fd',
      highlight: '#bfdbfe',
      surface: '#dbeafe'
    };
    return {
      base: '#93c5fd',
      light: '#bfdbfe',
      highlight: '#dbeafe',
      surface: '#eff6ff'
    };
  };
  
  const { base, light, highlight, surface } = getWaterColor(level);

  // Create smooth wave path with bezier curves
  const createWavePath = (time: number, wave: typeof waves.base, width: number, height: number, offset: number = 0) => {
    const points: [number, number][] = [];
    // Generate wave points with noise for more organic feel
    
    // Add starting point at bottom-left
    points.push([0, height]);
    
    // Generate wave points with noise for more organic feel
    for (let i = 0; i < wave.points; i++) {
      const x = (i / (wave.points - 1)) * width;
      const noise = Math.sin(time * 0.0003 + i * 0.2) * 0.5;
      const waveHeight = wave.amplitude * (1 + noise * 0.3);
      const y = Math.sin((i * wave.frequency) + (time * wave.speed) + offset) * waveHeight;
      points.push([x, y + height]);
    }
    
    // Add closing points
    points.push([width, height]);
    points.push([0, height]);
    
    // Create smooth SVG path with bezier curves
    let path = `M ${points[0][0]} ${points[0][1]}`;
    
    for (let i = 1; i < points.length - 1; i++) {
      const [x, y] = points[i];
      const [nextX, nextY] = points[i + 1] || points[0];
      
      const cp1x = x + (nextX - x) * 0.25;
      const cp1y = y;
      const cp2x = x + (nextX - x) * 0.75;
      const cp2y = nextY;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`;
    }
    
    return path + ' Z';
  };

  // Main animation loop
  const animate = (time: number) => {
    if (!waveRef1.current || !waveRef2.current || !waveRef3.current) return;
    
    timeRef.current = time;
    const width = 184;
    const height = 12; // Slightly taller for better wave effect
    
    // Update wave paths
    waveRef1.current.setAttribute('d', createWavePath(time, waves.base, width, height, 0));
    waveRef2.current.setAttribute('d', createWavePath(time, waves.middle, width, height, Math.PI * 0.7));
    waveRef3.current.setAttribute('d', createWavePath(time, waves.top, width, height, Math.PI * 1.3));
    
    // Continue animation
    frameId.current = requestAnimationFrame(animate);
  };

  // Start/stop animation
  useEffect(() => {
    frameId.current = requestAnimationFrame(animate);
    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, []);

  // Generate random bubbles with more natural distribution
  const bubbles = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => {
      const size = Math.random() * 5 + 2;
      return {
        id: i,
        size,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
        drift: (Math.random() - 0.5) * 20,
        opacity: 0.1 + Math.random() * 0.2
      };
    }),
    []
  ) as Array<{
    id: number;
    size: number;
    left: number;
    delay: number;
    duration: number;
    drift: number;
    opacity: number;
  }>;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Base water color with subtle gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `linear-gradient(to bottom, ${base} 0%, ${light} 100%)`,
          opacity: 0.9
        }}
      />
      
      {/* Base wave - slowest and largest */}
      <svg 
        className="absolute bottom-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: waves.base.opacity }}
        viewBox="0 0 184 24"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="baseWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={highlight} stopOpacity="0.8" />
            <stop offset="100%" stopColor={base} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          ref={waveRef1}
          fill="url(#baseWaveGradient)"
          className="transition-colors duration-1000"
        />
      </svg>
      
      {/* Middle wave - medium speed */}
      <svg 
        className="absolute bottom-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: waves.middle.opacity }}
        viewBox="0 0 184 24"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="middleWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={surface} stopOpacity="0.6" />
            <stop offset="100%" stopColor={light} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          ref={waveRef2}
          fill="url(#middleWaveGradient)"
          className="transition-colors duration-1200"
        />
      </svg>
      
      {/* Top wave - fastest and most visible */}
      <svg 
        className="absolute bottom-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: waves.top.opacity }}
        viewBox="0 0 184 24"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="topWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor={highlight} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          ref={waveRef3}
          fill="url(#topWaveGradient)"
          className="transition-colors duration-800"
        />
      </svg>
      
      {/* Water surface highlight with shimmer effect */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none"
      />
      
      {/* Dynamic bubbles with more natural movement */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((bubble: {
          id: number;
          size: number;
          left: number;
          delay: number;
          duration: number;
          drift: number;
          opacity: number;
        }) => (
          <div 
            key={bubble.id}
            className="absolute rounded-full bg-white/30 animate-float"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `calc(${bubble.left}% + ${bubble.drift}px)`,
              bottom: '0',
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              opacity: bubble.opacity,
              transform: 'translateZ(0)' // Force GPU acceleration
            }}
          />
        ))}
      </div>
      
      {/* Subtle water texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }}
      />
    </div>
  );
};

const WaterPumpControl: React.FC<WaterPumpControlProps> = ({
  waterLevelTopic,
  relayTopic,
  publishTopic,
}) => {
  const [level, setLevel] = useState<number>(0);
  const [relayOn, setRelayOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { messages, publish } = useMqtt();

  // Update water level from MQTT
  useEffect(() => {
    if (messages[waterLevelTopic]) {
      const newLevel = parseFloat(messages[waterLevelTopic].toString());
      if (!isNaN(newLevel)) {
        setLevel(Math.min(100, Math.max(0, newLevel)));
      }
    }
  }, [messages, waterLevelTopic]);

  // Update relay state from MQTT
  useEffect(() => {
    if (messages[relayTopic] !== undefined) {
      setRelayOn(messages[relayTopic] === 'ON');
    }
  }, [messages, relayTopic]);

  const toggleRelay = useCallback(async () => {
    const newState = !relayOn;
    setIsLoading(true);
    try {
      await publish(publishTopic, newState ? 'ON' : 'OFF');
      setRelayOn(newState);
    } catch (error) {
      console.error('Failed to toggle pump:', error);
    } finally {
      setIsLoading(false);
    }
  }, [relayOn, publish, publishTopic]);

  const statusMessage = getWaterLevelStatus(level);

  return (
    <Card className="h-full">
      <CardHeader
        title="Water Tank Control"
        subtitle={`Status: ${statusMessage}`}
        icon={
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        }
      />
      
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Tank Visualization */}
          <div className="relative w-40 h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden mb-6">
            {/* Water */}
            <div 
              className={`absolute bottom-0 left-0 right-0 ${getWaterColorClass(level)} transition-all duration-500`}
              style={{ height: `${level}%` }}
            >
              <WaveAnimation level={level} />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
            
            {/* Water level indicator */}
            <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full">
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                {level.toFixed(0)}%
              </span>
            </div>
            
            {/* Scale marks */}
            <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-2">
              {[100, 75, 50, 25, 0].map((mark) => (
                <div key={mark} className="flex items-center h-12">
                  <div className="w-2 h-px bg-gray-400 dark:bg-gray-500 mr-1"></div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{mark}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pump Control */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  relayOn 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-gray-400 dark:bg-gray-500'
                )}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {relayOn ? 'Pump Aktif' : 'Pump Mati'}
                </span>
              </div>
              
              <button
                onClick={toggleRelay}
                disabled={isLoading}
                className={cn(
                  'px-4 py-2 text-sm rounded-md font-medium transition-colors flex items-center space-x-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  relayOn 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50'
                )}
              >
                <Power className="h-4 w-4" />
                <span>{relayOn ? 'Matikan' : 'Nyalakan'}</span>
              </button>
            </div>
            
            {/* Water Level Status */}
            <div className="w-full bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Water Level</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{level.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className={cn(
                    'h-2.5 rounded-full',
                    getWaterColorClass(level).replace('bg-', 'bg-')
                  )}
                  style={{ width: `${level}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { WaterPumpControl };

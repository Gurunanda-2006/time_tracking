import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimerControlProps {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onResume?: () => void;
  isRunning?: boolean;
  isPaused?: boolean;
  elapsedTime?: number;
  taskName?: string;
  onTaskNameChange?: (name: string) => void;
}

const TimerControl = ({
  onStart = () => {},
  onPause = () => {},
  onStop = () => {},
  onResume = () => {},
  isRunning = false,
  isPaused = false,
  elapsedTime = 0,
  taskName = "",
  onTaskNameChange = () => {},
}: TimerControlProps) => {
  const [time, setTime] = useState(elapsedTime);
  const [isHovered, setIsHovered] = useState(false);
  const [isTimeHovered, setIsTimeHovered] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    setTime(elapsedTime);
  }, [elapsedTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  return (
    <div className="perspective-1000">
      <Card
        className={cn(
          "w-full max-w-md mx-auto glass-effect shadow-lg transition-all duration-500 preserve-3d",
          isHovered ? "shadow-neon transform -translate-y-2" : "",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-70 animate-pulse-slow"></div>

          <div className="flex flex-col items-center space-y-6 relative z-10">
            <div
              className={`text-5xl font-bold tracking-wider text-center text-gradient animate-pulse-slow transition-transform duration-300 ${isTimeHovered ? "transform scale-110" : ""}`}
              onMouseEnter={() => setIsTimeHovered(true)}
              onMouseLeave={() => setIsTimeHovered(false)}
            >
              {formatTime(time)}
            </div>

            {!isRunning && !isPaused && (
              <div className="mb-4 w-full">
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => onTaskNameChange(e.target.value)}
                  placeholder="What are you working on?"
                  className="w-full bg-background/30 border border-primary/30 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300 placeholder:text-muted-foreground/70"
                />
              </div>
            )}
            <div className="flex justify-center space-x-4 w-full">
              {!isRunning ? (
                <Button
                  onClick={onStart}
                  size="lg"
                  className="flex items-center gap-2 px-6 bg-primary/90 hover:bg-primary transition-all duration-300 transform hover:scale-105 hover:shadow-neon"
                >
                  <Play className="h-5 w-5 animate-bounce-subtle" />
                  Start
                </Button>
              ) : isPaused ? (
                <Button
                  onClick={onResume}
                  size="lg"
                  className="flex items-center gap-2 px-6 bg-primary/90 hover:bg-primary transition-all duration-300 transform hover:scale-105 hover:shadow-neon"
                >
                  <Play className="h-5 w-5 animate-bounce-subtle" />
                  Resume
                </Button>
              ) : (
                <Button
                  onClick={onPause}
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 px-6 border-primary/50 hover:border-primary/80 transition-all duration-300 transform hover:scale-105"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}

              <Button
                onClick={onStop}
                size="lg"
                variant="destructive"
                disabled={!isRunning && !isPaused}
                className="flex items-center gap-2 px-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerControl;

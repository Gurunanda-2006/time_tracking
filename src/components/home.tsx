import React, { useState, useEffect } from "react";
import TimerControl from "./TimerControl";
import SessionHistory from "./SessionHistory";
import VideoBackground from "./VideoBackground";
import Notepad from "./Notepad";
import { motion } from "framer-motion";

interface Session {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  isPaused: boolean;
  taskName: string;
}

interface SessionEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  taskName: string;
}

const Home: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem("workSessions");
    return savedSessions
      ? JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : null,
        }))
      : [];
  });

  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workSessions", JSON.stringify(sessions));
  }, [sessions]);

  // Timer effect to update elapsed time
  useEffect(() => {
    let interval: number | null = null;

    if (currentSession && !currentSession.isPaused) {
      interval = window.setInterval(() => {
        const now = new Date();
        const startTime = currentSession.startTime;
        let totalPausedTime = 0;

        // Calculate total time accounting for pauses
        setElapsedTime(
          Math.floor((now.getTime() - startTime.getTime()) / 1000) -
            totalPausedTime,
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession]);

  const [taskName, setTaskName] = useState<string>("");

  const startSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: null,
      duration: 0,
      isPaused: false,
      taskName: taskName || "Untitled Task",
    };

    setCurrentSession(newSession);
    setElapsedTime(0);
    setTaskName(""); // Reset task name for next session
  };

  const pauseSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isPaused: true,
      });
    }
  };

  const resumeSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isPaused: false,
      });
    }
  };

  const stopSession = () => {
    if (currentSession) {
      const endTime = new Date();
      const completedSession: Session = {
        ...currentSession,
        endTime,
        duration: elapsedTime,
        isPaused: false,
      };

      setSessions([completedSession, ...sessions]);
      setCurrentSession(null);
      setElapsedTime(0);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
  };

  const renameTask = (sessionId: string, newTaskName: string) => {
    setSessions(
      sessions.map((session) =>
        session.id === sessionId
          ? { ...session, taskName: newTaskName }
          : session,
      ),
    );
  };

  // Format sessions for the SessionHistory component
  const formattedSessions: SessionEntry[] = sessions.map((session) => {
    const formatTimeString = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    };

    return {
      id: session.id,
      date: session.startTime.toISOString().split("T")[0],
      startTime: formatTimeString(session.startTime),
      endTime: session.endTime ? formatTimeString(session.endTime) : "--",
      duration: formatDuration(session.duration),
      taskName: session.taskName || "Untitled Task",
    };
  });

  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden">
      <VideoBackground
        videoUrl="https://streamable.com/bva5gw"
        blur={70}
        brightness={30}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-8"
      >
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          <span className="text-primary">Work Time</span>{" "}
          <span className="text-red-500">Tracker</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <TimerControl
            elapsedTime={elapsedTime}
            isRunning={currentSession !== null && !currentSession?.isPaused}
            isPaused={currentSession !== null && currentSession?.isPaused}
            onStart={startSession}
            onPause={pauseSession}
            onResume={resumeSession}
            onStop={stopSession}
            taskName={taskName}
            onTaskNameChange={setTaskName}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full"
        >
          <SessionHistory
            sessions={formattedSessions}
            onDelete={deleteSession}
            onRenameTask={renameTask}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full relative"
        >
          <Notepad className="mt-6" />
        </motion.div>

        {/* 3D floating elements */}
        <div
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 animate-float-fast"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-accent/10 animate-float-fast"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-secondary/10 animate-float-fast"
          style={{ animationDelay: "1.3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/5 w-24 h-24 rounded-full bg-primary/10 animate-float-fast"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-1/2 right-10 w-12 h-12 rounded-full bg-accent/10 animate-float-fast"
          style={{ animationDelay: "1s" }}
        ></div>
      </motion.div>
    </div>
  );
};

export default Home;

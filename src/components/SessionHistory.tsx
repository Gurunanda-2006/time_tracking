import React, { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export interface SessionEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  taskName: string;
}

interface SessionHistoryProps {
  sessions: SessionEntry[];
  onDelete: (id: string) => void;
  onRenameTask: (id: string, newName: string) => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions = [
    {
      id: "1",
      date: "2023-06-15",
      startTime: "09:00 AM",
      endTime: "12:30 PM",
      duration: "3h 30m",
      taskName: "Project Research",
    },
    {
      id: "2",
      date: "2023-06-15",
      startTime: "02:00 PM",
      endTime: "05:45 PM",
      duration: "3h 45m",
      taskName: "Client Meeting",
    },
    {
      id: "3",
      date: "2023-06-14",
      startTime: "08:30 AM",
      endTime: "04:15 PM",
      duration: "7h 45m",
      taskName: "Development",
    },
  ],
  onDelete = () => {},
  onRenameTask = () => {},
}) => {
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>("");

  const handleDelete = () => {
    if (sessionToDelete) {
      onDelete(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="perspective-1000">
      <Card className="w-full max-w-md mx-auto glass-effect shadow-lg border-border/30">
        <CardContent className="p-4 relative">
          {/* Animated glow effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer bg-[length:200%_100%]"></div>

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary animate-pulse-slow" />
            <span className="text-gradient">Session History</span>
          </h2>

          <ScrollArea className="h-[350px] pr-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No sessions recorded yet
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "glass-effect p-3 rounded-lg transition-all duration-300",
                      hoveredSession === session.id
                        ? "shadow-neon transform -translate-y-1"
                        : "shadow-md",
                    )}
                    onMouseEnter={() => setHoveredSession(session.id)}
                    onMouseLeave={() => setHoveredSession(null)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gradient">
                            {formatDate(session.date)}
                          </p>
                        </div>
                        {editingTaskId === session.id ? (
                          <div className="mt-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editedTaskName}
                              onChange={(e) =>
                                setEditedTaskName(e.target.value)
                              }
                              className="w-full bg-background/30 border border-primary/30 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  onRenameTask(session.id, editedTaskName);
                                  setEditingTaskId(null);
                                } else if (e.key === "Escape") {
                                  setEditingTaskId(null);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 hover:bg-primary/20"
                              onClick={() => {
                                onRenameTask(session.id, editedTaskName);
                                setEditingTaskId(null);
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <p
                            className="text-sm font-medium text-primary/90 cursor-pointer hover:text-primary transition-colors duration-200 mt-1"
                            onClick={() => {
                              setEditedTaskName(session.taskName);
                              setEditingTaskId(session.id);
                            }}
                          >
                            {session.taskName || "(No task name)"}
                          </p>
                        )}
                        <div className="text-sm text-muted-foreground mt-1">
                          <p>
                            {session.startTime} - {session.endTime}
                          </p>
                          <p className="font-medium text-foreground mt-1">
                            Duration:{" "}
                            <span className="text-primary">
                              {session.duration}
                            </span>
                          </p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-300"
                            onClick={() => setSessionToDelete(session.id)}
                          >
                            <Trash2
                              className={cn(
                                "h-4 w-4",
                                hoveredSession === session.id
                                  ? "animate-bounce-subtle"
                                  : "",
                              )}
                            />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass-effect border-primary/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-gradient">
                              Delete Session
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this session? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setSessionToDelete(null)}
                              className="hover:bg-background/60"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-neon transition-all duration-300"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionHistory;

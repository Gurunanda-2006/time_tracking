import React, { useState } from "react";
import { motion } from "framer-motion";

interface NotepadProps {
  className?: string;
}

const Notepad: React.FC<NotepadProps> = ({ className = "" }) => {
  const [notes, setNotes] = useState<string>("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-effect rounded-lg p-4 w-full ${className}`}
    >
      <h3 className="text-xl font-semibold mb-3 text-gradient">Quick Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-32 bg-background/50 border border-primary/20 rounded-md p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />

      {/* Animated elements */}
      <div
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary/20 animate-float-fast"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-accent/20 animate-float-fast"
        style={{ animationDelay: "1.2s" }}
      ></div>
    </motion.div>
  );
};

export default Notepad;

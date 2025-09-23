import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import MainCard from 'ui-component/cards/MainCard';

// Example helper for formatting
const formatTime = (seconds: number) => {
  if (!seconds && seconds !== 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const AudioCard = ({ isLoading }) => {
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [initialPlaybackTime, setInitialPlaybackTime] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [audioError, setAudioError] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  // ✅ Fetch modules only once when component mounts
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch("/api/modules"); // <-- your endpoint
        const data = await res.json();
        setModules(data);
        setSelectedModule(data[0]); // pick first by default
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setAudioError("Could not load training modules.");
      }
    };

    fetchModules();
  }, []); // Empty array → fetch runs only once

  // Fake progress update function (replace with real API call)
  const updateProgress = async (moduleId: number, time: number) => {
    try {
      setIsUpdating(true);
      console.log(`Updating progress for module ${moduleId} at ${time}s`);
      // await fetch(`/api/progress/${moduleId}`, { method: "POST", body: JSON.stringify({ time }) });
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setSelectedModule(null);
  };

  const handleNextModule = () => {
    if (!selectedModule) return;
    const currentIndex = modules.findIndex(
      (m) => m.moduleId === selectedModule.moduleId
    );
    const nextModule = modules[currentIndex + 1];
    if (nextModule) {
      setSelectedModule(nextModule);
      setCurrentTime(0);
      setInitialPlaybackTime(0);
    }
  };

  if (isLoading || !selectedModule) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <MainCard>
      {/* 🎵 Audio player with your functionalities */}
      <audio
        ref={audioRef as React.RefObject<HTMLAudioElement>}
        src={`https://brm-partners.britam.com${selectedModule.filePath}?v=${
          selectedModule.updateDate || Date.now()
        }`}
        onTimeUpdate={(e) => {
          const time = Math.floor((e.target as HTMLAudioElement).currentTime);
          setCurrentTime(time);
          console.log(`Listening at ${formatTime(time)}`);
        }}
        onLoadedMetadata={(e) => {
          (e.target as HTMLAudioElement).currentTime = currentTime;
        }}
        onPlay={(e) => {
          const time = (e.target as HTMLAudioElement).currentTime;
          if (initialPlaybackTime === 0) setInitialPlaybackTime(time);
          setCurrentTime(time);
          console.log(`Playing at ${formatTime(time)}`);
        }}
        onPause={(e) => {
          const time = Math.floor((e.target as HTMLAudioElement).currentTime);
          if (selectedModule && !selectedModule.isComplete && !isUpdating) {
            setCurrentTime(time);
            updateProgress(selectedModule.moduleId, time);
            console.log(`Paused at ${formatTime(time)}`);
          }
        }}
        onEnded={() => {
          if (selectedModule && !selectedModule.isComplete) {
            updateProgress(selectedModule.moduleId, selectedModule.duration);
            console.log(`Ended at ${formatTime(selectedModule.duration)}`);
          }
        }}
        onError={(e) => {
          console.error("Audio error:", e);
          setAudioError("Failed to load audio file. Please try again later.");
        }}
        controls
        style={{ width: "100%", outline: "none" }}
      />

      {/* Extra controls */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button variant="contained" onClick={handleClose} sx={{ mt: 1 }}>
          Close
        </Button>
        <Typography>Duration: {formatTime(selectedModule.duration)}</Typography>
        <Typography>
          Progress: {formatTime(currentTime)} /{" "}
          {formatTime(selectedModule.duration)}
        </Typography>
        <Typography>Status: {selectedModule.status}</Typography>
        {selectedModule.isComplete && (
          <Button
            variant="contained"
            startIcon={<FaArrowRight />}
            onClick={handleNextModule}
            disabled={
              modules.findIndex(
                (m) => m.moduleId > selectedModule.moduleId && !m.isComplete
              ) === -1
            }
            sx={{ mt: 2 }}
          >
            Next Module
          </Button>
        )}
      </Box>
    </MainCard>
  );
};

AudioCard.propTypes = { isLoading: PropTypes.bool };

export default AudioCard;

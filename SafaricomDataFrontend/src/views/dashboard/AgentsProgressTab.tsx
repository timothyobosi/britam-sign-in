import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Paper } from '@mui/material';


const AgentsProgressTab: React.FC = () => {

  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // TODO: Replace with real API for agents progress
    // For now, just show stub data
    setLoading(true);
    setTimeout(() => {
      setAgents([
        { name: 'Timothy W. Obosi', audioComplete: true, testScore: 100 },
        { name: 'Antony Barasa', audioComplete: false, testScore: 60 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Agents Progress</Typography>
      {loading && <CircularProgress />}

      {agents.map((agent, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
          <Typography><b>Name:</b> {agent.name}</Typography>
          <Typography><b>Audio Complete:</b> {agent.audioComplete ? 'Yes' : 'No'}</Typography>
          <Typography><b>Test Score:</b> {agent.testScore}%</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default AgentsProgressTab;

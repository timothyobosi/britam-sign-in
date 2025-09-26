// File: src/safaricom-data/ui-component/cards/TrainingAudioCard.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import TrainingList from './TrainingList';
import TrainingPlayer from './trainingPlayer';

interface TrainingAudioCardProps {
  isLoading?: boolean;
}

const TrainingAudioCard: React.FC<TrainingAudioCardProps> = ({ isLoading = false }) => {
  const { moduleId } = useParams<{ moduleId?: string }>();

  // If moduleId is present, render TrainingPlayer; otherwise, render TrainingList
  return moduleId ? <TrainingPlayer /> : <TrainingList />;
};

export default TrainingAudioCard;
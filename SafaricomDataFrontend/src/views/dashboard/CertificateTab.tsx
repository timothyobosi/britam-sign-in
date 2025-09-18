import React, { useEffect, useState } from 'react';
import { Button, Typography, CircularProgress, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { getFinalScore, getCertificate } from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';

// Define QUIZ_BASE_URL locally
const QUIZ_BASE_URL = `${import.meta.env.VITE_API_TARGET}/api/Quiz`;

const CertificateTab: React.FC = () => {
  const jwtContext = React.useContext(JWTContext);
  const token = localStorage.getItem('serviceToken');
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getFinalScore(token)
      .then(setScore)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownloadCertificate = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${QUIZ_BASE_URL}/get-certificate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setCertificateUrl(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Certificate fetch error:', err);
      setError('Failed to fetch certificate: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="My Certificate">
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {score && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Final Score: {score.scorePercent || score.finalScore || 'N/A'}%</Typography>
          <Typography>Total Questions: {score.totalQuestions || 'N/A'}</Typography>
          <Typography>Correct Answers: {score.correctAnswers || 'N/A'}</Typography>
        </Box>
      )}
      <Button variant="contained" onClick={handleDownloadCertificate} disabled={loading || !token}>
        Download Certificate
      </Button>
      {certificateUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Certificate ready for download.</Typography>
          <a href={certificateUrl} target="_blank" rel="noopener noreferrer">View Certificate</a>
        </Box>
      )}
    </MainCard>
  );
};

export default CertificateTab;
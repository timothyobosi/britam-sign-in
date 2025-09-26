import React, { useEffect, useState } from 'react';
import { Button, Typography, CircularProgress, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { getFinalScore, getCertificate } from 'safaricom-data/api/index';

const CertificateTab: React.FC = () => {
  const token = localStorage.getItem('serviceToken');
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState(false); // Popup for failed score
  const [openProcessingPopup, setOpenProcessingPopup] = useState(false); // Popup for certificate processing

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
    if (score && score.scorePercent < 70) {
      setOpenPopup(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const blob = await getCertificate(token);
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
      if (err.message.includes('No certificate found for the agent')) {
        setOpenProcessingPopup(true);
      } else {
        setError('Failed to fetch certificate: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCloseProcessingPopup = () => {
    setOpenProcessingPopup(false);
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
      <Button
        variant="contained"
        onClick={handleDownloadCertificate}
        disabled={loading || !token || (score && score.scorePercent < 70)}
      >
        Download Certificate
      </Button>
      {certificateUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Certificate ready for download.</Typography>
          <a href={certificateUrl} target="_blank" rel="noopener noreferrer">View Certificate</a>
        </Box>
      )}
      {/* Popup for failed score */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Certificate Unavailable</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You did not meet the pass mark. Kindly redo the test.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Popup for certificate processing */}
      <Dialog open={openProcessingPopup} onClose={handleCloseProcessingPopup}>
        <DialogTitle>Certificate Processing</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kindly wait as we process your certificate.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessingPopup} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default CertificateTab;
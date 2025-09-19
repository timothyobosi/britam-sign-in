import React, { useEffect, useState } from 'react';
import { Button, Typography, CircularProgress, Box, TextField, IconButton, Paper } from '@mui/material';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getAdminQuestions, createAdminQuestion, updateAdminQuestion, deleteAdminQuestion } from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const QuestionsTab: React.FC = () => {
  const jwtContext = React.useContext(JWTContext);
  const token = localStorage.getItem('serviceToken');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    text: '',
    moduleName: '',
    options: [{ text: '' }],
    correctOptionText: ''
  });
  const dispatch = useDispatch();

  const fetchQuestions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAdminQuestions(token);
      setQuestions(data);
    } catch (err: any) {
      setError('Failed to fetch questions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [token]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (idx: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === idx ? { text: value } : opt))
    }));
  };

  const handleAddOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, { text: '' }] }));
  };

  const handleRemoveOption = (idx: number) => {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (editId) {
        await updateAdminQuestion(token, editId, form);
        dispatch(openSnackbar({
          open: true,
          message: 'Question updated successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        }));
      } else {
        await createAdminQuestion(token, form);
        dispatch(openSnackbar({
          open: true,
          message: 'Question created successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        }));
      }
      setForm({ text: '', moduleId: 1, options: [{ text: '' }], correctOptionText: '' });
      setEditId(null);
      fetchQuestions();
    } catch (err: any) {
      setError('Failed to save question: ' + err.message);
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to save question: ' + err.message,
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (q: any) => {
    setEditId(q.questionid);
    setForm({
      text: q.text,
      moduleName: q.moduleName,
      options: q.options,
      correctOptionText: q.options.find((opt: any) => opt.optionid === q.correctoptionid)?.text || ''
    });
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await deleteAdminQuestion(token, id);
      dispatch(openSnackbar({
        open: true,
        message: 'Question deleted successfully',
        variant: 'alert',
        alert: { color: 'success' },
        close: false
      }));
      fetchQuestions();
    } catch (err: any) {
      setError('Failed to delete question: ' + err.message);
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to delete question: ' + err.message,
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    } finally {
      setLoading(false);
    }
  };

  // Group questions by moduleName
  const groupedQuestions: { [key: string]: any[] } = {};
  questions.forEach((q) => {
    const key = q.moduleName || 'Uncategorized';
    if (!groupedQuestions[key]) groupedQuestions[key] = [];
    groupedQuestions[key].push(q);
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Manage Questions</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Question Text"
          fullWidth
          sx={{ mb: 2 }}
          value={form.text}
          onChange={(e) => handleChange('text', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Module Name"
          fullWidth
          sx={{ mb: 2 }}
          value={form.moduleName}
          onChange={(e) => handleChange('moduleName', e.target.value)}
          InputLabelProps={{ shrink: true }}
          helperText={form.moduleName ? form.moduleName : ''}
        />
        <Typography sx={{ mb: 1 }}>Options:</Typography>
        {form.options.map((opt, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label={`Option ${idx + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <IconButton onClick={() => handleRemoveOption(idx)} disabled={form.options.length <= 1}>
              <FaTrash />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<FaPlus />} onClick={handleAddOption} sx={{ mb: 2 }}>
          Add Option
        </Button>
        <TextField
          label="Correct Option Text"
          fullWidth
          sx={{ mb: 2 }}
          value={form.correctOptionText}
          onChange={(e) => handleChange('correctOptionText', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          {editId ? 'Update Question' : 'Create Question'}
        </Button>
        {editId && (
          <Button sx={{ ml: 2 }} onClick={() => { setEditId(null); setForm({ text: '', moduleId: 1, options: [{ text: '' }], correctOptionText: '' }); }}>
            Cancel
          </Button>
        )}
      </Paper>
      <Typography variant="h6" sx={{ mb: 2 }}>All Questions</Typography>
      {Object.keys(groupedQuestions).map((moduleName) => (
        <Box key={moduleName} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{moduleName}</Typography>
          {groupedQuestions[moduleName].map((q) => (
            <Paper key={q.questionid} sx={{ p: 2, mb: 2 }}>
              <Typography><b>Text:</b> {q.text}</Typography>
              <Typography><b>Options:</b> {q.options?.map((opt: any) => opt.text).join(', ')}</Typography>
              <Typography><b>Correct:</b> {q.options?.find((opt: any) => opt.optionid === q.correctoptionid)?.text || ''}</Typography>
              <Box sx={{ mt: 1 }}>
                <IconButton onClick={() => handleEdit(q)}><FaEdit /></IconButton>
                <IconButton onClick={() => handleDelete(q.questionid)}><FaTrash /></IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default QuestionsTab;
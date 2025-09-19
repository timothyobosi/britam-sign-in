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
    moduleId: 1,
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
    // eslint-disable-next-line
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  } 

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
      }
      setForm({ text: '', moduleId: 1, options: [{ text: '' }], correctOptionText: '' });
      setEditId(null);
      fetchQuestions();
    } catch (err: any) {
      setError('Failed to save question: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (q: any) => {
    setEditId(q.questionId);
    setForm({
      text: q.text,
      moduleId: q.moduleId,
      options: q.options,
      correctOptionText: q.correctOptionText
    });
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await deleteAdminQuestion(token, id);
      fetchQuestions();
    } catch (err: any) {
      setError('Failed to delete question: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Manage Questions</Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField label="Question Text" fullWidth sx={{ mb: 2 }} value={form.text} onChange={e => handleChange('text', e.target.value)} />
        <TextField label="Section" type="number" sx={{ mb: 2 }} value={form.moduleId} onChange={e => handleChange('moduleId', Number(e.target.value))} helperText={form.moduleId ? `Section ${form.moduleId}` : ''} />
        <Typography sx={{ mb: 1 }}>Options:</Typography>
        {form.options.map((opt, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField label={`Option ${idx + 1}`} value={opt.text} onChange={e => handleOptionChange(idx, e.target.value)} sx={{ flex: 1 }} />
            <IconButton onClick={() => handleRemoveOption(idx)} disabled={form.options.length <= 1}><FaTrash /></IconButton>
          </Box>
        ))}
        <Button startIcon={<FaPlus />} onClick={handleAddOption} sx={{ mb: 2 }}>Add Option</Button>
        <TextField label="Correct Option Text" fullWidth sx={{ mb: 2 }} value={form.correctOptionText} onChange={e => handleChange('correctOptionText', e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>{editId ? 'Update Question' : 'Create Question'}</Button>
        {editId && <Button sx={{ ml: 2 }} onClick={() => { setEditId(null); setForm({ text: '', moduleId: 1, options: [{ text: '' }], correctOptionText: '' }); }}>Cancel</Button>}
      </Paper>
      <Typography variant="h6" sx={{ mb: 2 }}>All Questions</Typography>
      {questions.map((q) => (
        <Paper key={q.questionId} sx={{ p: 2, mb: 2 }}>
          <Typography><b>Section:</b> {q.moduleId ? `Section ${q.moduleId}` : ''}</Typography>
          <Typography><b>Text:</b> {q.text}</Typography>
          <Typography><b>Options:</b> {q.options.map((opt: any) => opt.text).join(', ')}</Typography>
          <Typography><b>Correct:</b> {q.correctOptionText}</Typography>
          <Box sx={{ mt: 1 }}>
            <IconButton onClick={() => handleEdit(q)}><FaEdit /></IconButton>
            <IconButton onClick={() => handleDelete(q.questionId)}><FaTrash /></IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default QuestionsTab;

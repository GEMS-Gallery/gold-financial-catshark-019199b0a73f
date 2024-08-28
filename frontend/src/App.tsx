import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { backend } from 'declarations/backend';

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'right',
  marginBottom: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        if (result !== null) {
          setDisplay(result.toString());
          setFirstOperand(null);
          setOperation(null);
        } else {
          setDisplay('Error');
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <Display>
          <Typography variant="h4">
            {display}
            {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Typography>
        </Display>
        <Grid container spacing={1}>
          {buttons.map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                fullWidth
                variant="contained"
                color={['+', '-', '*', '/'].includes(btn) ? 'primary' : btn === '=' ? 'success' : 'secondary'}
                onClick={() => {
                  if (btn === '=') handleEqualsClick();
                  else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                  else handleNumberClick(btn);
                }}
                disabled={loading}
              >
                {btn}
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;

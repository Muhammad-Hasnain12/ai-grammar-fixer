import app from './index.js';

const PORT = process.env.PORT || 3001;

// Start server for local development
app.listen(PORT, () => {
  console.log(`🚀 Grammar Fixer Backend running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/`);
  console.log(`🔍 Grammar check: POST http://localhost:${PORT}/check`);
});

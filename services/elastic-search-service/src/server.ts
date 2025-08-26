import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Elastic User Service running on port ${PORT}`);
});

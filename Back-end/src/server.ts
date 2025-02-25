import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on https://locahost:${port}`);
});


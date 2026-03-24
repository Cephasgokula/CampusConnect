import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const port = Number(process.env.PORT || 5000);

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on http://localhost:${port}`);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Seeded admin (if seeded): admin@cems.local / Admin@123');
    }
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});

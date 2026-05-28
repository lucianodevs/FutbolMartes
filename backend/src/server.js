const app = require('./app');
const { testConnection } = require('./config/db');
const { seedAdminIfNeeded } = require('./services/seedService');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await testConnection();
  await seedAdminIfNeeded();

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server:', error);
  process.exit(1);
});

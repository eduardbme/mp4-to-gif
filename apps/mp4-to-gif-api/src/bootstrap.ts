import 'source-map-support/register';
import { injector } from '@mp4-to-gif-api/common/injector';
import { App } from './App';

async function bootstrap() {
  injector.init();

  const app = injector.get(App);
  enableShutdownHooks(app);

  return app.init();
}

function enableShutdownHooks(app: App) {
  process.on('SIGINT', async () => process.exit((await app.destroy()) ? 1 : 0));
  process.on('SIGTERM', async () =>
    process.exit((await app.destroy()) ? 1 : 0)
  );

  process.on('uncaughtException', (error) => {
    app.logger.error(
      'uncaughtException: ' + error.message + '. Stack: ' + error.stack,
      { error }
    );
  });

  process.on('unhandledRejection', (reason: string, p: Promise<unknown>) => {
    app.logger.error('unhandledRejection: ' + reason + '. Promise: ' + p, {
      p,
    });
  });
}

void (async (): Promise<void> => {
  try {
    await bootstrap();
  } catch (error) {
    console.error(`Error on bootstrap: ${error.message}`, error);

    process.exit(1);
  }
})();

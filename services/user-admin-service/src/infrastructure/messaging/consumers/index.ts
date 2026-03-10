import { initProfileUpdateConsumer } from './profileUpdateConsumer';
import { initDLQHandler } from './dlqHandler';

export async function startConsumers() {
  try {
    console.log('🚀 Starting RabbitMQ consumers...');
    await initProfileUpdateConsumer();
    await initDLQHandler();
    console.log('✅ All consumers initialized successfully');
  } catch (error) {
    console.error('❌ Failed to start consumers:', error);
  }
}

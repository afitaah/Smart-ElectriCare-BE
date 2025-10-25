import dotenv from 'dotenv';
import connectDB from '../utils/database';
import { seedDatabase } from '../utils/seedData';

// Load environment variables
dotenv.config();

const runSeed = async () => {
  try {
    console.log('🌱 Starting Smart ElectriCare System Database Seeding...');
    console.log('================================================');
    
    console.log('📡 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    console.log('🌱 Starting database seeding with ObjectId relationships...');
    await seedDatabase();
    
    console.log('================================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 All collections have been populated with proper ObjectId references');
    console.log('🔗 Relationships are now properly established for:');
    console.log('   - Bills → Customers, Rates, Users');
    console.log('   - Payments → Customers, Bills, Users');
    console.log('   - Notifications → Customers');
    console.log('   - Connection Logs → Customers, Users');
    console.log('   - Activity Logs → Users');
    console.log('================================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

runSeed();

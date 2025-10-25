import mongoose from 'mongoose';
import Customer from '../models/Customer';
import Bill from '../models/Bill';
import Payment from '../models/Payment';
import User from '../models/User';
import Rate from '../models/Rate';
import Notification from '../models/Notification';
import ConnectionLog from '../models/ConnectionLog';
import ActivityLog from '../models/ActivityLog';

/**
 * Migration script to convert string-based foreign keys to ObjectId references
 * This script should be run once to migrate existing data
 */

const migrateToObjectId = async () => {
  try {
    console.log('Starting migration to ObjectId references...');

    // Step 1: Create mapping of string IDs to ObjectIds for all collections
    console.log('Creating ID mappings...');
    
    const customerMap = new Map();
    const userMap = new Map();
    const rateMap = new Map();
    
    // Build customer mapping
    const customers = await Customer.find({}, '_id id');
    customers.forEach(customer => {
      customerMap.set(customer.id, customer._id);
    });
    console.log(`Mapped ${customerMap.size} customers`);

    // Build user mapping
    const users = await User.find({}, '_id id');
    users.forEach(user => {
      userMap.set(user.id, user._id);
    });
    console.log(`Mapped ${userMap.size} users`);

    // Build rate mapping
    const rates = await Rate.find({}, '_id id');
    rates.forEach(rate => {
      rateMap.set(rate.id, rate._id);
    });
    console.log(`Mapped ${rateMap.size} rates`);

    // Step 2: Update Bills collection
    console.log('Migrating Bills collection...');
    const bills = await Bill.find({});
    let billsUpdated = 0;
    
    for (const bill of bills) {
      const updates: any = {};
      
      // Convert customerId to customer_id
      if (bill.customerId && customerMap.has(bill.customerId)) {
        updates.customer_id = customerMap.get(bill.customerId);
      }
      
      // Convert rateId to rate_id
      if (bill.rateId && rateMap.has(bill.rateId)) {
        updates.rate_id = rateMap.get(bill.rateId);
      }
      
      // Convert createdBy to created_by
      if (bill.createdBy && userMap.has(bill.createdBy)) {
        updates.created_by = userMap.get(bill.createdBy);
      }
      
      // Remove old fields
      updates.$unset = {
        customerId: 1,
        customerName: 1,
        rateId: 1,
        createdBy: 1
      };
      
      if (Object.keys(updates).length > 1) { // More than just $unset
        await Bill.findByIdAndUpdate(bill._id, updates);
        billsUpdated++;
      }
    }
    console.log(`Updated ${billsUpdated} bills`);

    // Step 3: Update Payments collection
    console.log('Migrating Payments collection...');
    const payments = await Payment.find({});
    let paymentsUpdated = 0;
    
    for (const payment of payments) {
      const updates: any = {};
      
      // Convert customerId to customer_id
      if (payment.customerId && customerMap.has(payment.customerId)) {
        updates.customer_id = customerMap.get(payment.customerId);
      }
      
      // Convert billId to bill_id
      if (payment.billId) {
        const bill = await Bill.findOne({ id: payment.billId });
        if (bill) {
          updates.bill_id = bill._id;
        }
      }
      
      // Convert processedBy to processed_by
      if (payment.processedBy && userMap.has(payment.processedBy)) {
        updates.processed_by = userMap.get(payment.processedBy);
      }
      
      // Remove old fields
      updates.$unset = {
        customerId: 1,
        customerName: 1,
        billId: 1,
        processedBy: 1
      };
      
      if (Object.keys(updates).length > 1) { // More than just $unset
        await Payment.findByIdAndUpdate(payment._id, updates);
        paymentsUpdated++;
      }
    }
    console.log(`Updated ${paymentsUpdated} payments`);

    // Step 4: Update Notifications collection
    console.log('Migrating Notifications collection...');
    const notifications = await Notification.find({});
    let notificationsUpdated = 0;
    
    for (const notification of notifications) {
      const updates: any = {};
      
      // Convert customerId to customer_id
      if (notification.customerId && customerMap.has(notification.customerId)) {
        updates.customer_id = customerMap.get(notification.customerId);
      }
      
      // Convert userId to user_id
      if (notification.userId && userMap.has(notification.userId)) {
        updates.user_id = userMap.get(notification.userId);
      }
      
      // Remove old fields
      updates.$unset = {
        customerId: 1,
        userId: 1
      };
      
      if (Object.keys(updates).length > 1) { // More than just $unset
        await Notification.findByIdAndUpdate(notification._id, updates);
        notificationsUpdated++;
      }
    }
    console.log(`Updated ${notificationsUpdated} notifications`);

    // Step 5: Update ConnectionLogs collection
    console.log('Migrating ConnectionLogs collection...');
    const connectionLogs = await ConnectionLog.find({});
    let connectionLogsUpdated = 0;
    
    for (const log of connectionLogs) {
      const updates: any = {};
      
      // Convert customerId to customer_id
      if (log.customerId && customerMap.has(log.customerId)) {
        updates.customer_id = customerMap.get(log.customerId);
      }
      
      // Convert operatorId to operator_id
      if (log.operatorId && userMap.has(log.operatorId)) {
        updates.operator_id = userMap.get(log.operatorId);
      }
      
      // Remove old fields
      updates.$unset = {
        customerId: 1,
        operatorId: 1
      };
      
      if (Object.keys(updates).length > 1) { // More than just $unset
        await ConnectionLog.findByIdAndUpdate(log._id, updates);
        connectionLogsUpdated++;
      }
    }
    console.log(`Updated ${connectionLogsUpdated} connection logs`);

    // Step 6: Update ActivityLogs collection
    console.log('Migrating ActivityLogs collection...');
    const activityLogs = await ActivityLog.find({});
    let activityLogsUpdated = 0;
    
    for (const log of activityLogs) {
      const updates: any = {};
      
      // Convert userId to user_id
      if (log.userId && userMap.has(log.userId)) {
        updates.user_id = userMap.get(log.userId);
      }
      
      // Remove old fields
      updates.$unset = {
        userId: 1
      };
      
      if (Object.keys(updates).length > 1) { // More than just $unset
        await ActivityLog.findByIdAndUpdate(log._id, updates);
        activityLogsUpdated++;
      }
    }
    console.log(`Updated ${activityLogsUpdated} activity logs`);

    console.log('Migration completed successfully!');
    console.log('Summary:');
    console.log(`- Bills updated: ${billsUpdated}`);
    console.log(`- Payments updated: ${paymentsUpdated}`);
    console.log(`- Notifications updated: ${notificationsUpdated}`);
    console.log(`- Connection logs updated: ${connectionLogsUpdated}`);
    console.log(`- Activity logs updated: ${activityLogsUpdated}`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-electricare';
  
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB');
      return migrateToObjectId();
    })
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default migrateToObjectId;

import Customer from '../models/Customer';
import User from '../models/User';
import Bill from '../models/Bill';
import Payment from '../models/Payment';
import Notification from '../models/Notification';
import Rate from '../models/Rate';
import ConnectionLog from '../models/ConnectionLog';
import ActivityLog from '../models/ActivityLog';
import { 
  CustomerStatus, 
  ConnectionStatus, 
  BillingStatus, 
  PaymentStatus, 
  PrimarySecondaryStatus,
  BillStatus,
  PaymentMethod,
  PaymentProcessStatus,
  UserRole,
  UserStatus,
  NotificationType,
  NotificationPriority,
  PermissionAction,
  ConnectionAction
} from './status';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Customer.deleteMany({});
    await User.deleteMany({});
    await Bill.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    await Rate.deleteMany({});
    await ConnectionLog.deleteMany({});
    await ActivityLog.deleteMany({});

    // Create users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@ses.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        permissions: [
          { id: '1', name: 'Manage Users', resource: 'users', action: PermissionAction.MANAGE, granted: true },
          { id: '2', name: 'View Customers', resource: 'customers', action: PermissionAction.READ, granted: true },
          { id: '3', name: 'Manage Customers', resource: 'customers', action: PermissionAction.MANAGE, granted: true },
          { id: '4', name: 'View Bills', resource: 'bills', action: PermissionAction.READ, granted: true },
          { id: '5', name: 'Manage Bills', resource: 'bills', action: PermissionAction.MANAGE, granted: true }
        ],
        isActive: UserStatus.ACTIVE,
        lastLogin: '2024-10-22T10:30:00Z',
        createdAt: '2024-01-01',
        department: 'IT'
      },
      {
        username: 'manager1',
        email: 'manager1@ses.com',
        password: 'manager123',
        role: UserRole.MANAGER,
        permissions: [
          { id: '1', name: 'View Users', resource: 'users', action: PermissionAction.READ, granted: true },
          { id: '2', name: 'View Customers', resource: 'customers', action: PermissionAction.READ, granted: true },
          { id: '3', name: 'Manage Customers', resource: 'customers', action: PermissionAction.WRITE, granted: true },
          { id: '4', name: 'View Bills', resource: 'bills', action: PermissionAction.READ, granted: true },
          { id: '5', name: 'Manage Bills', resource: 'bills', action: PermissionAction.WRITE, granted: true }
        ],
        isActive: UserStatus.ACTIVE,
        lastLogin: '2024-10-22T09:15:00Z',
        createdAt: '2024-02-01',
        department: 'Operations'
      },
      {
        username: 'operator1',
        email: 'operator1@ses.com',
        password: 'operator123',
        role: UserRole.OPERATOR,
        permissions: [
          { id: '2', name: 'View Customers', resource: 'customers', action: PermissionAction.READ, granted: true },
          { id: '4', name: 'View Bills', resource: 'bills', action: PermissionAction.READ, granted: true }
        ],
        isActive: UserStatus.ACTIVE,
        lastLogin: '2024-10-22T08:45:00Z',
        createdAt: '2024-03-01',
        department: 'Customer Service'
      }
    ]);

    // Create rates
    const rates = await Rate.create([
      {
        id: 'RATE0001',
        rateValue: 2.00,
        description: 'Standard electricity rate per kWh',
        isActive: true,
        effectiveDate: '2024-01-01'
      },
      {
        id: 'RATE0002',
        rateValue: 2.25,
        description: 'Updated electricity rate per kWh',
        isActive: false,
        effectiveDate: '2024-06-01'
      }
    ]);

    // Create customers
    const customers = await Customer.create([
      {
        id: 'CUST0001',
        name: 'John Doe',
        phone: '+1234567890',
        watchId: 'WATCH001',
        status: CustomerStatus.ACTIVE,
        prStatus: PrimarySecondaryStatus.ACTIVE,
        scStatus: PrimarySecondaryStatus.ACTIVE,
        billingStatus: BillingStatus.BILLED,
        paymentStatus: PaymentStatus.PAID,
        connectionStatus: ConnectionStatus.CONNECTED,
        address: '123 Main St, City, State',
        email: 'john.doe@email.com',
        registrationDate: '2024-01-15',
        lastPaymentDate: '2024-10-15'
      },
      {
        id: 'CUST0002',
        name: 'Jane Smith',
        phone: '+1234567891',
        watchId: 'WATCH002',
        status: CustomerStatus.ACTIVE,
        prStatus: PrimarySecondaryStatus.ACTIVE,
        scStatus: PrimarySecondaryStatus.INACTIVE,
        billingStatus: BillingStatus.BILLED,
        paymentStatus: PaymentStatus.UNPAID,
        connectionStatus: ConnectionStatus.UNDER_WARNING,
        address: '456 Oak Ave, City, State',
        email: 'jane.smith@email.com',
        registrationDate: '2024-02-20',
        lastPaymentDate: '2024-09-20'
      },
      {
        id: 'CUST0003',
        name: 'Bob Johnson',
        phone: '+1234567892',
        watchId: 'WATCH003',
        status: CustomerStatus.SUSPENDED,
        prStatus: PrimarySecondaryStatus.INACTIVE,
        scStatus: PrimarySecondaryStatus.INACTIVE,
        billingStatus: BillingStatus.BILLED,
        paymentStatus: PaymentStatus.UNPAID,
        connectionStatus: ConnectionStatus.LOST,
        address: '789 Pine St, City, State',
        email: 'bob.johnson@email.com',
        registrationDate: '2024-03-10',
        lastPaymentDate: '2024-08-10'
      },
      {
        id: 'CUST0004',
        name: 'Alice Brown',
        phone: '+1234567893',
        watchId: 'WATCH004',
        status: CustomerStatus.PENDING,
        prStatus: PrimarySecondaryStatus.INACTIVE,
        scStatus: PrimarySecondaryStatus.INACTIVE,
        billingStatus: BillingStatus.UNBILLED,
        paymentStatus: PaymentStatus.UNPAID,
        connectionStatus: ConnectionStatus.LOST,
        address: '321 Elm St, City, State',
        email: 'alice.brown@email.com',
        registrationDate: '2024-10-01'
      },
      {
        id: 'CUST0005',
        name: 'Charlie Wilson',
        phone: '+1234567894',
        watchId: 'WATCH005',
        status: CustomerStatus.ACTIVE,
        prStatus: PrimarySecondaryStatus.ACTIVE,
        scStatus: PrimarySecondaryStatus.ACTIVE,
        billingStatus: BillingStatus.BILLED,
        paymentStatus: PaymentStatus.PAID,
        connectionStatus: ConnectionStatus.CONNECTED,
        address: '654 Maple Dr, City, State',
        email: 'charlie.wilson@email.com',
        registrationDate: '2024-04-05',
        lastPaymentDate: '2024-10-20'
      }
    ]);

    // Create bills with ObjectId references
    const bills = await Bill.create([
      {
        id: 'BILL0001',
        customer_id: customers[0]._id, // John Doe
        amount: 250.00,
        dueDate: '2024-11-15',
        status: BillStatus.PAID,
        billingPeriod: 'October 2024',
        usageKwh: 125.5,
        rate_id: rates[0]._id, // Standard rate
        watchId: 1,
        createdAt: '2024-10-15',
        paidAt: '2024-10-15',
        created_by: users[0]._id // Admin user
      },
      {
        id: 'BILL0002',
        customer_id: customers[1]._id, // Jane Smith
        amount: 450.00,
        dueDate: '2024-10-20',
        status: BillStatus.OVERDUE,
        billingPeriod: 'September 2024',
        usageKwh: 225.0,
        rate_id: rates[0]._id, // Standard rate
        watchId: 2,
        createdAt: '2024-09-20',
        created_by: users[1]._id // Manager user
      },
      {
        id: 'BILL0003',
        customer_id: customers[2]._id, // Bob Johnson
        amount: 600.00,
        dueDate: '2024-09-10',
        status: BillStatus.OVERDUE,
        billingPeriod: 'August 2024',
        usageKwh: 300.0,
        rate_id: rates[0]._id, // Standard rate
        watchId: 3,
        createdAt: '2024-08-10',
        created_by: users[0]._id // Admin user
      },
      {
        id: 'BILL0004',
        customer_id: customers[4]._id, // Charlie Wilson
        amount: 320.00,
        dueDate: '2024-11-20',
        status: BillStatus.PAID,
        billingPeriod: 'October 2024',
        usageKwh: 160.0,
        rate_id: rates[0]._id, // Standard rate
        watchId: 5,
        createdAt: '2024-10-20',
        paidAt: '2024-10-20',
        created_by: users[1]._id // Manager user
      }
    ]);

    // Create payments with ObjectId references
    const payments = await Payment.create([
      {
        id: 'PAY0001',
        customer_id: customers[0]._id, // John Doe
        bill_id: bills[0]._id, // BILL0001
        amount: 250.00,
        paymentDate: '2024-10-15',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reference: 'TXN000001',
        status: PaymentProcessStatus.COMPLETED,
        processed_by: users[0]._id // Admin user
      },
      {
        id: 'PAY0002',
        customer_id: customers[4]._id, // Charlie Wilson
        bill_id: bills[3]._id, // BILL0004
        amount: 320.00,
        paymentDate: '2024-10-20',
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        reference: 'TXN000002',
        status: PaymentProcessStatus.COMPLETED,
        processed_by: users[1]._id // Manager user
      },
      {
        id: 'PAY0003',
        customer_id: customers[1]._id, // Jane Smith
        bill_id: bills[1]._id, // BILL0002
        amount: 450.00,
        paymentDate: '2024-09-20',
        paymentMethod: PaymentMethod.CASH,
        reference: 'TXN000003',
        status: PaymentProcessStatus.COMPLETED,
        processed_by: users[2]._id // Operator user
      }
    ]);

    // Create notifications with ObjectId references
    await Notification.create([
      {
        id: 'NOTIF0001',
        type: NotificationType.WARNING,
        title: 'Payment Overdue',
        message: 'Jane Smith has an overdue payment of $450.00',
        timestamp: '2024-10-22T10:00:00Z',
        isRead: false,
        customer_id: customers[1]._id, // Jane Smith
        priority: NotificationPriority.HIGH
      },
      {
        id: 'NOTIF0002',
        type: NotificationType.DANGER,
        title: 'Connection Lost',
        message: 'Bob Johnson\'s connection has been lost for 3 days',
        timestamp: '2024-10-22T09:30:00Z',
        isRead: false,
        customer_id: customers[2]._id, // Bob Johnson
        priority: NotificationPriority.HIGH
      },
      {
        id: 'NOTIF0003',
        type: NotificationType.INFO,
        title: 'New Customer Registration',
        message: 'Alice Brown has been registered and is pending activation',
        timestamp: '2024-10-22T08:00:00Z',
        isRead: true,
        customer_id: customers[3]._id, // Alice Brown
        priority: NotificationPriority.MEDIUM
      },
      {
        id: 'NOTIF0004',
        type: NotificationType.SUCCESS,
        title: 'Payment Received',
        message: 'Charlie Wilson has made a payment of $320.00',
        timestamp: '2024-10-22T07:30:00Z',
        isRead: true,
        customer_id: customers[4]._id, // Charlie Wilson
        priority: NotificationPriority.LOW
      }
    ]);

    // Create connection logs with ObjectId references
    await ConnectionLog.create([
      {
        id: 'CONNLOG0001',
        customer_id: customers[0]._id, // John Doe
        action: ConnectionAction.CONNECTED,
        timestamp: '2024-10-15T08:00:00Z',
        reason: 'System initialization',
        operator_id: users[0]._id // Admin user
      },
      {
        id: 'CONNLOG0002',
        customer_id: customers[2]._id, // Bob Johnson
        action: ConnectionAction.DISCONNECTED,
        timestamp: '2024-10-19T14:30:00Z',
        reason: 'Non-payment - 30 days overdue',
        operator_id: users[1]._id // Manager user
      },
      {
        id: 'CONNLOG0003',
        customer_id: customers[1]._id, // Jane Smith
        action: ConnectionAction.WARNING_ISSUED,
        timestamp: '2024-10-20T10:15:00Z',
        reason: 'Payment overdue - 15 days',
        operator_id: users[2]._id // Operator user
      }
    ]);

    // Create activity logs with ObjectId references
    await ActivityLog.create([
      {
        id: 'ACTLOG0001',
        user_id: users[0]._id, // Admin user
        action: 'CREATE',
        resource: 'Customer',
        timestamp: '2024-10-15T09:00:00Z',
        ipAddress: '192.168.1.100',
        details: 'Created new customer: John Doe'
      },
      {
        id: 'ACTLOG0002',
        user_id: users[1]._id, // Manager user
        action: 'UPDATE',
        resource: 'Bill',
        timestamp: '2024-10-20T11:30:00Z',
        ipAddress: '192.168.1.101',
        details: 'Updated bill status to PAID for BILL0004'
      },
      {
        id: 'ACTLOG0003',
        user_id: users[2]._id, // Operator user
        action: 'VIEW',
        resource: 'Payment',
        timestamp: '2024-10-22T08:45:00Z',
        ipAddress: '192.168.1.102',
        details: 'Viewed payment history for customer CUST0002'
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${rates.length} rates`);
    console.log(`Created ${customers.length} customers`);
    console.log(`Created ${bills.length} bills`);
    console.log(`Created ${payments.length} payments`);
    console.log('Created 4 notifications');
    console.log('Created 3 connection logs');
    console.log('Created 3 activity logs');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

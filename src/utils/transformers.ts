import { 
  Customer, 
  Bill, 
  Payment, 
  User, 
  Notification, 
  ConnectionLog,
  Permission 
} from '../types';
import {
  getCustomerStatusLabel,
  getConnectionStatusLabel,
  getBillingStatusLabel,
  getPaymentStatusLabel,
  getPrimarySecondaryStatusLabel,
  getBillStatusLabel,
  getPaymentProcessStatusLabel,
  getPaymentMethodLabel,
  getUserStatusLabel,
  getUserRoleLabel,
  getNotificationTypeLabel,
  getNotificationPriorityLabel,
  getConnectionActionLabel,
  getPermissionActionLabel
} from './status';

// Transform customer data for API response
export const transformCustomer = (customer: any): any => {
  const customerObj = customer.toObject ? customer.toObject() : customer;
  return {
    ...customerObj,
    status: getCustomerStatusLabel(customerObj.status),
    prStatus: getPrimarySecondaryStatusLabel(customerObj.prStatus),
    scStatus: getPrimarySecondaryStatusLabel(customerObj.scStatus),
    billingStatus: getBillingStatusLabel(customerObj.billingStatus),
    paymentStatus: getPaymentStatusLabel(customerObj.paymentStatus),
    connectionStatus: getConnectionStatusLabel(customerObj.connectionStatus),
  };
};

// Transform bill data for API response
export const transformBill = (bill: any): any => {
  const billObj = bill.toObject ? bill.toObject() : bill;
  return {
    ...billObj,
    status: getBillStatusLabel(billObj.status),
  };
};

// Transform payment data for API response
export const transformPayment = (payment: any): any => {
  const paymentObj = payment.toObject ? payment.toObject() : payment;
  return {
    ...paymentObj,
    paymentMethod: getPaymentMethodLabel(paymentObj.paymentMethod),
    status: getPaymentProcessStatusLabel(paymentObj.status),
  };
};

// Transform user data for API response
export const transformUser = (user: any): any => {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    ...userObj,
    role: getUserRoleLabel(userObj.role),
    isActive: getUserStatusLabel(userObj.isActive),
    permissions: userObj.permissions.map(transformPermission),
  };
};

// Transform permission data for API response
export const transformPermission = (permission: Permission): any => {
  return {
    ...permission,
    action: getPermissionActionLabel(permission.action),
  };
};

// Transform notification data for API response
export const transformNotification = (notification: Notification): any => {
  return {
    ...notification,
    type: getNotificationTypeLabel(notification.type),
    priority: getNotificationPriorityLabel(notification.priority),
  };
};

// Transform connection log data for API response
export const transformConnectionLog = (log: ConnectionLog): any => {
  return {
    ...log,
    action: getConnectionActionLabel(log.action),
  };
};

// Transform rate data for API response
export const transformRate = (rate: any): any => {
  const rateObj = rate.toObject ? rate.toObject() : rate;
  return {
    ...rateObj,
  };
};

// Transform arrays of data
export const transformCustomers = (customers: Customer[]): any[] => {
  return customers.map(transformCustomer);
};

export const transformBills = (bills: Bill[]): any[] => {
  return bills.map(transformBill);
};

export const transformPayments = (payments: Payment[]): any[] => {
  return payments.map(transformPayment);
};

export const transformUsers = (users: User[]): any[] => {
  return users.map(transformUser);
};

export const transformNotifications = (notifications: Notification[]): any[] => {
  return notifications.map(transformNotification);
};

export const transformConnectionLogs = (logs: ConnectionLog[]): any[] => {
  return logs.map(transformConnectionLog);
};

export const transformRates = (rates: any[]): any[] => {
  return rates.map(transformRate);
};

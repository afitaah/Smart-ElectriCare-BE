// Unified Status Constants
export const Status = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
  PAID: 4,
  UNPAID: 5,
  DELETED: 9,
};

// Customer Status Codes
export const CustomerStatus = {
  PENDING: 1,
  ACTIVE: 2,
  SUSPENDED: 3,
};

export const ConnectionStatus = {
  CONNECTED: 1,
  LOST: 2,
  UNDER_WARNING: 3,
};

export const BillingStatus = {
  UNBILLED: 1,
  BILLED: 2,
};

export const PaymentStatus = {
  UNPAID: 1,
  PAID: 2,
};

export const PrimarySecondaryStatus = {
  INACTIVE: 1,
  ACTIVE: 2,
};

// Bill Status Codes
export const BillStatus = {
  UNPAID: 1,
  PAID: 2,
  OVERDUE: 3,
};

// Payment Status Codes
export const PaymentProcessStatus = {
  PENDING: 1,
  COMPLETED: 2,
  FAILED: 3,
};

// Payment Method Codes
export const PaymentMethod = {
  CASH: 1,
  BANK_TRANSFER: 2,
  MOBILE_MONEY: 3,
  CARD: 4,
};

// User Status Codes
export const UserStatus = {
  INACTIVE: 1,
  ACTIVE: 2,
};

// User Role Codes
export const UserRole = {
  VIEWER: 1,
  OPERATOR: 2,
  MANAGER: 3,
  ADMIN: 4,
};

// Notification Type Codes
export const NotificationType = {
  INFO: 1,
  WARNING: 2,
  DANGER: 3,
  SUCCESS: 4,
};

// Notification Priority Codes
export const NotificationPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Connection Log Action Codes
export const ConnectionAction = {
  CONNECTED: 1,
  DISCONNECTED: 2,
  WARNING_ISSUED: 3,
};

// Permission Action Codes
export const PermissionAction = {
  READ: 1,
  WRITE: 2,
  DELETE: 3,
  MANAGE: 4,
};

// Status mapping functions for converting numbers to strings
export const getCustomerStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [CustomerStatus.PENDING]: 'Pending',
    [CustomerStatus.ACTIVE]: 'Active',
    [CustomerStatus.SUSPENDED]: 'Suspended',
  };
  return statusMap[status] || 'Unknown';
};

export const getConnectionStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [ConnectionStatus.CONNECTED]: 'Connected',
    [ConnectionStatus.LOST]: 'Lost',
    [ConnectionStatus.UNDER_WARNING]: 'Under Warning',
  };
  return statusMap[status] || 'Unknown';
};

export const getBillingStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [BillingStatus.UNBILLED]: 'Unbilled',
    [BillingStatus.BILLED]: 'Billed',
  };
  return statusMap[status] || 'Unknown';
};

export const getPaymentStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [PaymentStatus.UNPAID]: 'Unpaid',
    [PaymentStatus.PAID]: 'Paid',
  };
  return statusMap[status] || 'Unknown';
};

export const getPrimarySecondaryStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [PrimarySecondaryStatus.INACTIVE]: 'Inactive',
    [PrimarySecondaryStatus.ACTIVE]: 'Active',
  };
  return statusMap[status] || 'Unknown';
};

export const getBillStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [BillStatus.UNPAID]: 'Unpaid',
    [BillStatus.PAID]: 'Paid',
    [BillStatus.OVERDUE]: 'Overdue',
  };
  return statusMap[status] || 'Unknown';
};

export const getPaymentProcessStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [PaymentProcessStatus.PENDING]: 'Pending',
    [PaymentProcessStatus.COMPLETED]: 'Completed',
    [PaymentProcessStatus.FAILED]: 'Failed',
  };
  return statusMap[status] || 'Unknown';
};

export const getPaymentMethodLabel = (method: number): string => {
  const methodMap: { [key: number]: string } = {
    [PaymentMethod.CASH]: 'Cash',
    [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
    [PaymentMethod.MOBILE_MONEY]: 'Mobile Money',
    [PaymentMethod.CARD]: 'Card',
  };
  return methodMap[method] || 'Unknown';
};

export const getUserStatusLabel = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    [UserStatus.INACTIVE]: 'Inactive',
    [UserStatus.ACTIVE]: 'Active',
  };
  return statusMap[status] || 'Unknown';
};

export const getUserRoleLabel = (role: number): string => {
  const roleMap: { [key: number]: string } = {
    [UserRole.VIEWER]: 'Viewer',
    [UserRole.OPERATOR]: 'Operator',
    [UserRole.MANAGER]: 'Manager',
    [UserRole.ADMIN]: 'Admin',
  };
  return roleMap[role] || 'Unknown';
};

export const getNotificationTypeLabel = (type: number): string => {
  const typeMap: { [key: number]: string } = {
    [NotificationType.INFO]: 'info',
    [NotificationType.WARNING]: 'warning',
    [NotificationType.DANGER]: 'danger',
    [NotificationType.SUCCESS]: 'success',
  };
  return typeMap[type] || 'Unknown';
};

export const getNotificationPriorityLabel = (priority: number): string => {
  const priorityMap: { [key: number]: string } = {
    [NotificationPriority.LOW]: 'low',
    [NotificationPriority.MEDIUM]: 'medium',
    [NotificationPriority.HIGH]: 'high',
  };
  return priorityMap[priority] || 'Unknown';
};

export const getConnectionActionLabel = (action: number): string => {
  const actionMap: { [key: number]: string } = {
    [ConnectionAction.CONNECTED]: 'Connected',
    [ConnectionAction.DISCONNECTED]: 'Disconnected',
    [ConnectionAction.WARNING_ISSUED]: 'Warning Issued',
  };
  return actionMap[action] || 'Unknown';
};

export const getPermissionActionLabel = (action: number): string => {
  const actionMap: { [key: number]: string } = {
    [PermissionAction.READ]: 'read',
    [PermissionAction.WRITE]: 'write',
    [PermissionAction.DELETE]: 'delete',
    [PermissionAction.MANAGE]: 'manage',
  };
  return actionMap[action] || 'Unknown';
};

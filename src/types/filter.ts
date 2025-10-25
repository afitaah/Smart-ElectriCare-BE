// Global Filter System Types

export type FilterType = 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean';

export interface FilterOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  searchFields?: string[]; // Fields to search in for text filters
  mapping?: { [key: string]: any }; // Value mapping for select filters
}

export interface GlobalFilter {
  [key: string]: string | string[] | number | boolean | Date | null | undefined;
}

export interface FilterModule {
  name: string;
  endpoint: string;
  filters: FilterConfig[];
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

// Module-specific filter configurations
export const CUSTOMER_FILTERS: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search customers...',
    searchFields: ['name', 'phone', 'watchId', 'email']
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Suspended', label: 'Suspended' },
      { value: 'Pending', label: 'Pending' }
    ],
    mapping: {
      'Active': 2,
      'Suspended': 3,
      'Pending': 1
    }
  },
  {
    key: 'billingStatus',
    label: 'Billing Status',
    type: 'select',
    options: [
      { value: 'Billed', label: 'Billed' },
      { value: 'Unbilled', label: 'Unbilled' }
    ],
    mapping: {
      'Billed': 2,
      'Unbilled': 1
    }
  },
  {
    key: 'paymentStatus',
    label: 'Payment Status',
    type: 'select',
    options: [
      { value: 'Paid', label: 'Paid' },
      { value: 'Unpaid', label: 'Unpaid' },
      { value: 'Pending', label: 'Pending' }
    ],
    mapping: {
      'Paid': 2,
      'Unpaid': 1,
      'Pending': 1
    }
  },
  {
    key: 'connectionStatus',
    label: 'Connection Status',
    type: 'select',
    options: [
      { value: 'Connected', label: 'Connected' },
      { value: 'Lost', label: 'Lost' },
      { value: 'Disconnected', label: 'Disconnected' },
      { value: 'Under Warning', label: 'Under Warning' }
    ],
    mapping: {
      'Connected': 1,
      'Lost': 2,
      'Disconnected': 2,
      'Under Warning': 3
    }
  }
];

export const BILL_FILTERS: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search bills...',
    searchFields: ['id', 'customer.name', 'customer.phone', 'customer.watchId']
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Paid', label: 'Paid' },
      { value: 'Unpaid', label: 'Unpaid' },
      { value: 'Overdue', label: 'Overdue' }
    ],
    mapping: {
      'Paid': 2,
      'Unpaid': 1,
      'Overdue': 3
    }
  },
  {
    key: 'customerId',
    label: 'Customer',
    type: 'select',
    options: [], // Will be populated dynamically
    placeholder: 'Select customer...'
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'daterange',
    placeholder: 'Select date range...'
  },
  {
    key: 'amountRange',
    label: 'Amount Range',
    type: 'number',
    placeholder: 'Min amount...',
    validation: {
      min: 0
    }
  }
];

export const PAYMENT_FILTERS: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search payments...',
    searchFields: ['id', 'reference', 'customer.name', 'customer.phone']
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Completed', label: 'Completed' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Failed', label: 'Failed' }
    ],
    mapping: {
      'Completed': 2,
      'Pending': 1,
      'Failed': 3
    }
  },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    type: 'select',
    options: [
      { value: 'Cash', label: 'Cash' },
      { value: 'Bank Transfer', label: 'Bank Transfer' },
      { value: 'Mobile Money', label: 'Mobile Money' },
      { value: 'Card', label: 'Card' }
    ],
    mapping: {
      'Cash': 1,
      'Bank Transfer': 2,
      'Mobile Money': 3,
      'Card': 4
    }
  },
  {
    key: 'dateRange',
    label: 'Payment Date',
    type: 'daterange',
    placeholder: 'Select date range...'
  }
];

export const RATE_FILTERS: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search rates...',
    searchFields: ['description', 'rateValue']
  },
  {
    key: 'isActive',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ],
    mapping: {
      'true': true,
      'false': false
    }
  },
  {
    key: 'dateRange',
    label: 'Effective Date',
    type: 'daterange',
    placeholder: 'Select date range...'
  }
];

export const USER_FILTERS: FilterConfig[] = [
  {
    key: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search users...',
    searchFields: ['username', 'email', 'department']
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'Admin', label: 'Admin' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Operator', label: 'Operator' },
      { value: 'Viewer', label: 'Viewer' }
    ],
    mapping: {
      'Admin': 4,
      'Manager': 3,
      'Operator': 2,
      'Viewer': 1
    }
  },
  {
    key: 'isActive',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' }
    ],
    mapping: {
      'true': 2,
      'false': 1
    }
  }
];

// Module configurations
export const FILTER_MODULES: { [key: string]: FilterModule } = {
  customers: {
    name: 'Customers',
    endpoint: '/api/customers',
    filters: CUSTOMER_FILTERS,
    defaultSort: { field: 'createdAt', order: 'desc' }
  },
  bills: {
    name: 'Bills',
    endpoint: '/api/bills',
    filters: BILL_FILTERS,
    defaultSort: { field: 'createdAt', order: 'desc' }
  },
  payments: {
    name: 'Payments',
    endpoint: '/api/payments',
    filters: PAYMENT_FILTERS,
    defaultSort: { field: 'paymentDate', order: 'desc' }
  },
  rates: {
    name: 'Rates',
    endpoint: '/api/rates',
    filters: RATE_FILTERS,
    defaultSort: { field: 'effectiveDate', order: 'desc' }
  },
  users: {
    name: 'Users',
    endpoint: '/api/users',
    filters: USER_FILTERS,
    defaultSort: { field: 'createdAt', order: 'desc' }
  }
};

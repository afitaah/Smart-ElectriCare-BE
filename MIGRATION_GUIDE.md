# MongoDB ObjectId Migration Guide

This guide explains the migration from string-based foreign keys to ObjectId references in the Smart ElectriCare System backend.

## Overview

The system has been refactored to use proper MongoDB ObjectId references instead of string-based foreign keys. This improves:
- Data consistency and integrity
- Query performance with proper indexing
- Support for MongoDB aggregation pipelines with $lookup
- Better relationship management

## Changes Made

### 1. Model Updates

All models now use ObjectId references:

#### Before (String-based):
```typescript
// Bill model
customerId: String
customerName: String
rateId: String
createdBy: String
```

#### After (ObjectId-based):
```typescript
// Bill model
customer_id: mongoose.Types.ObjectId (ref: 'Customer')
rate_id: mongoose.Types.ObjectId (ref: 'Rate')
created_by: mongoose.Types.ObjectId (ref: 'User')
// customerName removed (populated via $lookup)
```

### 2. API Controller Updates

All controllers now use MongoDB aggregation pipelines with $lookup:

```typescript
// Example: Payment aggregation pipeline
const pipeline = [
  {
    $lookup: {
      from: 'customers',
      localField: 'customer_id',
      foreignField: '_id',
      as: 'customer'
    }
  },
  {
    $lookup: {
      from: 'bills',
      localField: 'bill_id',
      foreignField: '_id',
      as: 'bill'
    }
  },
  // ... more lookups
];
```

### 3. Utility Functions

Created `src/utils/aggregation.ts` with reusable aggregation pipelines:
- `getPaymentAggregationPipeline()`
- `getBillAggregationPipeline()`
- `getNotificationAggregationPipeline()`
- `getConnectionLogAggregationPipeline()`
- `getActivityLogAggregationPipeline()`

## Migration Process

### Step 1: Backup Your Database

```bash
mongodump --db smart-electricare --out backup/
```

### Step 2: Run the Migration Script

```bash
# Compile TypeScript
npm run build

# Run migration
node dist/scripts/migrateToObjectId.js
```

### Step 3: Verify Migration

Check that all collections have been updated:

```javascript
// Check Bills collection
db.bills.findOne({}, {customer_id: 1, rate_id: 1, created_by: 1})

// Check Payments collection  
db.payments.findOne({}, {customer_id: 1, bill_id: 1, processed_by: 1})
```

### Step 4: Update Frontend

The frontend will need to be updated to handle the new response structure:

#### Before:
```json
{
  "customerId": "CUST0001",
  "customerName": "John Doe",
  "billId": "BILL0001"
}
```

#### After:
```json
{
  "customer_id": "507f1f77bcf86cd799439011",
  "customer": {
    "id": "CUST0001",
    "name": "John Doe",
    "phone": "+1234567890"
  },
  "bill_id": "507f1f77bcf86cd799439012",
  "bill": {
    "id": "BILL0001",
    "amount": 150.00,
    "dueDate": "2024-01-15"
  }
}
```

## API Response Changes

### Payment API Response

```json
{
  "success": true,
  "message": "Payment fetched successfully",
  "data": {
    "id": "PAY0001",
    "amount": 150.00,
    "paymentDate": "2024-01-10",
    "customer": {
      "id": "CUST0001",
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "bill": {
      "id": "BILL0001",
      "amount": 150.00,
      "dueDate": "2024-01-15"
    },
    "processedBy": {
      "id": "USER0001",
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

### Bill API Response

```json
{
  "success": true,
  "message": "Bill fetched successfully",
  "data": {
    "id": "BILL0001",
    "amount": 150.00,
    "dueDate": "2024-01-15",
    "customer": {
      "id": "CUST0001",
      "name": "John Doe",
      "phone": "+1234567890"
    },
    "rate": {
      "id": "RATE0001",
      "rateValue": 0.15,
      "description": "Standard Rate"
    },
    "createdBy": {
      "id": "USER0001",
      "username": "admin"
    }
  }
}
```

## Field Mapping

| Old Field | New Field | Type | Description |
|-----------|-----------|------|-------------|
| `customerId` | `customer_id` | ObjectId | Reference to Customer |
| `customerName` | *(removed)* | - | Populated via $lookup |
| `billId` | `bill_id` | ObjectId | Reference to Bill |
| `rateId` | `rate_id` | ObjectId | Reference to Rate |
| `userId` | `user_id` | ObjectId | Reference to User |
| `createdBy` | `created_by` | ObjectId | Reference to User |
| `processedBy` | `processed_by` | ObjectId | Reference to User |
| `operatorId` | `operator_id` | ObjectId | Reference to User |

## Benefits

1. **Data Integrity**: ObjectId references ensure referential integrity
2. **Performance**: Proper indexing on ObjectId fields improves query performance
3. **Flexibility**: $lookup allows dynamic population of related data
4. **Consistency**: Unified approach to relationships across all models
5. **Scalability**: Better support for complex queries and aggregations

## Rollback Plan

If rollback is needed:

1. Restore from backup:
```bash
mongorestore backup/
```

2. Revert code changes to previous commit
3. Restart the application

## Testing

After migration, test all endpoints:

```bash
# Test payment endpoints
curl -X GET http://localhost:3000/api/payments
curl -X GET http://localhost:3000/api/payments/PAY0001

# Test bill endpoints  
curl -X GET http://localhost:3000/api/bills
curl -X GET http://localhost:3000/api/bills/BILL0001

# Test customer endpoints
curl -X GET http://localhost:3000/api/customers
curl -X GET http://localhost:3000/api/customers/CUST0001
```

## Support

If you encounter issues during migration:

1. Check the migration logs for specific errors
2. Verify database connectivity
3. Ensure all required collections exist
4. Check for data inconsistencies in the original data

For additional support, contact the backend development team.

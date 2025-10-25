import mongoose from 'mongoose';

/**
 * Common aggregation pipeline stages for MongoDB $lookup operations
 */

// Payment aggregation pipeline with customer, bill, and user lookups
export const getPaymentAggregationPipeline = (matchStage?: any) => {
  const pipeline: any[] = [];
  
  if (matchStage) {
    pipeline.push({ $match: matchStage });
  }
  
  pipeline.push(
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
    {
      $lookup: {
        from: 'users',
        localField: 'processed_by',
        foreignField: '_id',
        as: 'processedBy'
      }
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$bill',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$processedBy',
        preserveNullAndEmptyArrays: true
      }
    }
  );
  
  return pipeline;
};

// Bill aggregation pipeline with customer, rate, and user lookups
export const getBillAggregationPipeline = (matchStage?: any) => {
  const pipeline: any[] = [];
  
  if (matchStage) {
    pipeline.push({ $match: matchStage });
  }
  
  pipeline.push(
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
        from: 'rates',
        localField: 'rate_id',
        foreignField: '_id',
        as: 'rate'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'created_by',
        foreignField: '_id',
        as: 'createdBy'
      }
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$rate',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true
      }
    }
  );
  
  return pipeline;
};

// Notification aggregation pipeline with customer and user lookups
export const getNotificationAggregationPipeline = (matchStage?: any) => {
  const pipeline: any[] = [];
  
  if (matchStage) {
    pipeline.push({ $match: matchStage });
  }
  
  pipeline.push(
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
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    }
  );
  
  return pipeline;
};

// ConnectionLog aggregation pipeline with customer and user lookups
export const getConnectionLogAggregationPipeline = (matchStage?: any) => {
  const pipeline: any[] = [];
  
  if (matchStage) {
    pipeline.push({ $match: matchStage });
  }
  
  pipeline.push(
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
        from: 'users',
        localField: 'operator_id',
        foreignField: '_id',
        as: 'operator'
      }
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$operator',
        preserveNullAndEmptyArrays: true
      }
    }
  );
  
  return pipeline;
};

// ActivityLog aggregation pipeline with user lookup
export const getActivityLogAggregationPipeline = (matchStage?: any) => {
  const pipeline: any[] = [];
  
  if (matchStage) {
    pipeline.push({ $match: matchStage });
  }
  
  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    }
  );
  
  return pipeline;
};

/**
 * Helper function to convert string ID to ObjectId for aggregation
 */
export const convertStringIdToObjectId = async (Model: any, stringId: string) => {
  const doc = await Model.findOne({ id: stringId });
  return doc ? doc._id : null;
};

/**
 * Helper function to add sorting to aggregation pipeline
 */
export const addSorting = (pipeline: any[], sortField: string, sortOrder: 1 | -1 = -1) => {
  pipeline.push({ $sort: { [sortField]: sortOrder } });
  return pipeline;
};

/**
 * Helper function to add pagination to aggregation pipeline
 */
export const addPagination = (pipeline: any[], page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  pipeline.push(
    { $skip: skip },
    { $limit: limit }
  );
  return pipeline;
};

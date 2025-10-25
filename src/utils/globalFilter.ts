import { Request } from 'express';
import { FilterConfig, GlobalFilter, FILTER_MODULES } from '../types/filter';

export interface FilterQuery {
  [key: string]: any;
}

export interface FilterResult {
  query: FilterQuery;
  sort?: { [key: string]: 1 | -1 };
  limit?: number;
  skip?: number;
}

/**
 * Parse query parameters into a structured filter object
 */
export function parseFilterParams(req: Request): GlobalFilter {
  const filters: GlobalFilter = {};
  
  // Get all query parameters
  const queryParams = req.query;
  
  // Parse each parameter
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Handle array values (for multiselect filters)
    if (Array.isArray(value)) {
      filters[key] = value.filter(v => v !== '').map(v => String(v));
    } else if (typeof value === 'string') {
      // Handle comma-separated values
      if (value.includes(',')) {
        filters[key] = value.split(',').filter(v => v !== '');
      } else {
        filters[key] = value;
      }
    } else {
      filters[key] = String(value);
    }
  }
  
  return filters;
}

/**
 * Build MongoDB query from filter configuration and values
 */
export function buildFilterQuery(
  filters: GlobalFilter,
  filterConfigs: FilterConfig[]
): FilterQuery {
  const query: FilterQuery = {};
  
  for (const filterConfig of filterConfigs) {
    const value = filters[filterConfig.key];
    
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    switch (filterConfig.type) {
      case 'text':
        if (filterConfig.searchFields && filterConfig.searchFields.length > 0) {
          const searchConditions = filterConfig.searchFields.map(field => ({
            [field]: { $regex: value, $options: 'i' }
          }));
          query.$or = searchConditions;
        }
        break;
        
      case 'select':
        if (filterConfig.mapping && filterConfig.mapping[value as string] !== undefined) {
          query[filterConfig.key] = filterConfig.mapping[value as string];
        } else {
          query[filterConfig.key] = value;
        }
        break;
        
      case 'multiselect':
        if (Array.isArray(value)) {
          const mappedValues = value.map(v => 
            filterConfig.mapping && filterConfig.mapping[v] !== undefined 
              ? filterConfig.mapping[v] 
              : v
          );
          query[filterConfig.key] = { $in: mappedValues };
        }
        break;
        
      case 'date':
        if (value) {
          const date = new Date(value as string);
          if (!isNaN(date.getTime())) {
            query[filterConfig.key] = {
              $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            };
          }
        }
        break;
        
      case 'daterange':
        if (Array.isArray(value) && value.length === 2) {
          const [startDate, endDate] = value;
          const start = new Date(startDate as string);
          const end = new Date(endDate as string);
          
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            query[filterConfig.key] = {
              $gte: start,
              $lte: end
            };
          }
        }
        break;
        
      case 'number':
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          query[filterConfig.key] = numValue;
        }
        break;
        
      case 'boolean':
        query[filterConfig.key] = value === 'true' || value === true;
        break;
    }
  }
  
  return query;
}

/**
 * Build sort object from query parameters
 */
export function buildSortQuery(
  sortBy?: string,
  sortOrder?: string,
  defaultSort?: { field: string; order: 'asc' | 'desc' }
): { [key: string]: 1 | -1 } {
  const sort: { [key: string]: 1 | -1 } = {};
  
  if (sortBy && sortOrder) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else if (defaultSort) {
    sort[defaultSort.field] = defaultSort.order === 'desc' ? -1 : 1;
  } else {
    // Default sort by creation date descending
    sort['createdAt'] = -1;
  }
  
  return sort;
}

/**
 * Build pagination parameters
 */
export function buildPaginationParams(
  page?: string | number,
  limit?: string | number
): { skip: number; limit: number } {
  const pageNum = page ? Number(String(page)) : 1;
  const limitNum = limit ? Number(String(limit)) : 10;
  
  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum
  };
}

/**
 * Main function to process global filters
 */
export function processGlobalFilters(
  req: Request,
  moduleName: string
): FilterResult {
  const module = FILTER_MODULES[moduleName];
  if (!module) {
    throw new Error(`Unknown module: ${moduleName}`);
  }
  
  // Parse filter parameters
  const filters = parseFilterParams(req);
  
  // Build MongoDB query
  const query = buildFilterQuery(filters, module.filters);
  
  // Build sort query
  const sortBy = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder as string;
  const sort = buildSortQuery(sortBy, sortOrder, module.defaultSort);
  
  // Build pagination
  const page = req.query.page as string | number;
  const limit = req.query.limit as string | number;
  const pagination = buildPaginationParams(page, limit);
  
  return {
    query,
    sort,
    ...pagination
  };
}

/**
 * Validate filter values against configuration
 */
export function validateFilters(
  filters: any, // Accept any type from req.query
  filterConfigs: FilterConfig[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const filterConfig of filterConfigs) {
    const value = filters[filterConfig.key];
    
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    // Check required validation
    if (filterConfig.validation?.required && !value) {
      errors.push(`${filterConfig.label} is required`);
      continue;
    }
    
    // Type-specific validation
    switch (filterConfig.type) {
      case 'select':
        if (filterConfig.options) {
          const validValues = filterConfig.options.map(opt => opt.value);
          if (!validValues.includes(value as string)) {
            errors.push(`Invalid value for ${filterConfig.label}`);
          }
        }
        break;
        
      case 'multiselect':
        if (Array.isArray(value) && filterConfig.options) {
          const validValues = filterConfig.options.map(opt => opt.value);
          const invalidValues = value.filter(v => !validValues.includes(v as string));
          if (invalidValues.length > 0) {
            errors.push(`Invalid values for ${filterConfig.label}: ${invalidValues.join(', ')}`);
          }
        }
        break;
        
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push(`${filterConfig.label} must be a valid number`);
        } else {
          if (filterConfig.validation?.min !== undefined && numValue < filterConfig.validation.min) {
            errors.push(`${filterConfig.label} must be at least ${filterConfig.validation.min}`);
          }
          if (filterConfig.validation?.max !== undefined && numValue > filterConfig.validation.max) {
            errors.push(`${filterConfig.label} must be at most ${filterConfig.validation.max}`);
          }
        }
        break;
        
      case 'date':
      case 'daterange':
        if (Array.isArray(value)) {
          for (const dateStr of value) {
            const date = new Date(dateStr as string);
            if (isNaN(date.getTime())) {
              errors.push(`Invalid date format for ${filterConfig.label}`);
            }
          }
        } else {
          const date = new Date(value as string);
          if (isNaN(date.getTime())) {
            errors.push(`Invalid date format for ${filterConfig.label}`);
          }
        }
        break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get filter configuration for a module
 */
export function getFilterConfig(moduleName: string): FilterConfig[] {
  const module = FILTER_MODULES[moduleName];
  if (!module) {
    throw new Error(`Unknown module: ${moduleName}`);
  }
  return module.filters;
}

/**
 * Get available modules
 */
export function getAvailableModules(): string[] {
  return Object.keys(FILTER_MODULES);
}

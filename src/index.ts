/**
 * IPDrift Client Library
 * 
 * Official JavaScript/TypeScript client for IPDrift IP geolocation API
 * 
 * @packageDocumentation
 */

export { IpDriftClient } from './client';
export type {
  IpLookupResponse,
  HealthResponse,
  IpDriftConfig,
  LookupOptions,
  RateLimitInfo,
  Language,
  Location,
  TimeZone,
  Currency,
  Connection,
  Security,
  ErrorResponse,
} from './types';
export { IpDriftError } from './types';

// Default export for convenience
import { IpDriftClient } from './client';
export default IpDriftClient;

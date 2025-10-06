/**
 * TypeScript type definitions for IPDrift API responses
 */

export interface Language {
  code: string;
  name: string;
  native: string;
}

export interface Location {
  geoname_id?: number;
  capital?: string;
  languages?: Language[];
  country_flag_emoji?: string;
  country_flag_emoji_unicode?: string;
  calling_code?: string;
  is_eu?: boolean;
}

export interface TimeZone {
  id?: string;
  current_time?: string; // ISO 8601 format with timezone
  gmt_offset?: number; // Offset in seconds
  code?: string; // Timezone abbreviation (e.g., EDT)
  is_daylight_saving?: boolean;
}

export interface Currency {
  code?: string;
  name?: string;
  plural?: string;
  symbol?: string;
  symbol_native?: string;
}

export interface Connection {
  asn?: number;
  isp?: string;
  sld?: string; // Second-level domain
  tld?: string; // Top-level domain
  carrier?: string;
  home?: boolean;
  organization_type?: string;
  isic_code?: string; // International Standard Industrial Classification
  naics_code?: string; // North American Industry Classification System
}

export interface Security {
  is_proxy?: boolean;
  proxy_type?: string;
  is_crawler?: boolean;
  crawler_name?: string;
  crawler_type?: string;
  is_tor?: boolean;
  threat_level?: 'low' | 'medium' | 'high';
  threat_types?: string;
  proxy_last_detected?: string;
  proxy_level?: string;
  vpn_service?: string;
  anonymizer_status?: string;
  hosting_facility?: boolean;
}

export interface IpLookupResponse {
  ip: string;
  type: 'ipv4' | 'ipv6';
  continent_code?: string;
  continent_name?: string;
  country_code?: string;
  country_name?: string;
  region_code?: string;
  region_name?: string;
  city?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  msa?: string; // Metropolitan Statistical Area
  dma?: string; // Designated Market Area
  radius?: number; // Accuracy radius
  ip_routing_type?: string;
  connection_type?: string;
  location: Location;
  time_zone: TimeZone;
  currency: Currency;
  connection: Connection;
  security: Security;
}

export interface HealthResponse {
  ok: boolean;
}

export interface ErrorResponse {
  detail: string;
}

export interface IpDriftConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  userAgent?: string;
}

export interface LookupOptions {
  ip?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class IpDriftError extends Error {
  public readonly status?: number;
  public readonly detail?: string;
  public readonly rateLimit?: RateLimitInfo;

  constructor(message: string, status?: number, detail?: string, rateLimit?: RateLimitInfo) {
    super(message);
    this.name = 'IpDriftError';
    this.status = status;
    this.detail = detail;
    this.rateLimit = rateLimit;
  }
}

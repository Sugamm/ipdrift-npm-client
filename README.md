# IPDrift Client

[![npm version](https://badge.fury.io/js/%40ipdrift%2Fclient.svg)](https://badge.fury.io/js/%40ipdrift%2Fclient)
[![Build Status](https://github.com/ipdrift/client-js/workflows/CI/badge.svg)](https://github.com/ipdrift/client-js/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official JavaScript/TypeScript client library for the IPDrift IP geolocation API. Get comprehensive IP address information including geolocation, ISP details, security signals, and country-specific data.

## Features

- 🌍 **Comprehensive IP Data** - Get detailed geolocation, ISP, security, and country information
- 🔒 **TypeScript Support** - Full type definitions for better development experience
- ⚡ **Fast & Reliable** - Built on Axios with proper error handling and retries
- 🛡️ **Security Features** - Proxy, VPN, Tor detection and threat assessment
- 📊 **Rate Limiting** - Built-in rate limit information and handling
- 🎯 **Easy to Use** - Simple, intuitive API design

## Installation

```bash
npm install @ipdrift/client
```

Or with yarn:

```bash
yarn add @ipdrift/client
```

## Quick Start

```typescript
import { IpDriftClient } from '@ipdrift/client';

// Initialize the client
const client = new IpDriftClient({
  apiKey: 'your-api-key-here'
});

// Lookup IP information
const result = await client.lookup({ ip: '8.8.8.8' });
console.log(result.country_name); // "United States"
console.log(result.city); // "Mountain View"
```

## API Reference

### IpDriftClient

#### Constructor

```typescript
new IpDriftClient(config: IpDriftConfig)
```

**Configuration Options:**

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | ✅ | - | Your IPDrift API key |
| `baseUrl` | `string` | ❌ | `https://geo.ipdrift.com` | API base URL |
| `timeout` | `number` | ❌ | `10000` | Request timeout in milliseconds |
| `retries` | `number` | ❌ | `3` | Number of retry attempts |
| `userAgent` | `string` | ❌ | `ipdrift-client-js/1.0.0` | Custom user agent |

#### Methods

##### `lookup(options?: LookupOptions): Promise<IpLookupResponse>`

Look up IP geolocation information.

**Parameters:**
- `options.ip` (optional): IP address to lookup. If not provided, uses the client's IP.

**Returns:** Promise resolving to detailed IP information.

**Example:**
```typescript
// Lookup specific IP
const result = await client.lookup({ ip: '8.8.8.8' });

// Lookup client's IP
const myIp = await client.lookup();
```

##### `health(): Promise<HealthResponse>`

Check if the IPDrift service is healthy and operational.

**Returns:** Promise resolving to health status.

**Example:**
```typescript
const health = await client.health();
console.log(health.ok); // true
```

### Response Types

#### IpLookupResponse

The main response object containing comprehensive IP information:

```typescript
interface IpLookupResponse {
  ip: string;                    // The queried IP address
  type: 'ipv4' | 'ipv6';        // IP version
  continent_code?: string;       // Two-letter continent code
  continent_name?: string;       // Full continent name
  country_code?: string;         // Two-letter country code (ISO 3166-1)
  country_name?: string;         // Full country name
  region_code?: string;          // Region/state code
  region_name?: string;          // Full region/state name
  city?: string;                 // City name
  zip?: string;                  // Postal/ZIP code
  latitude?: number;             // Latitude coordinate
  longitude?: number;            // Longitude coordinate
  location: Location;            // Country-specific information
  time_zone: TimeZone;          // Timezone information
  currency: Currency;           // Currency information
  connection: Connection;       // ISP and network details
  security: Security;           // Security and threat information
}
```

#### Nested Objects

**Location:**
```typescript
interface Location {
  geoname_id?: number;          // GeoNames database ID
  capital?: string;             // Country capital city
  languages?: Language[];       // Spoken languages
  country_flag_emoji?: string;  // Country flag emoji
  country_flag_emoji_unicode?: string; // Unicode for flag emoji
  calling_code?: string;        // International calling code
  is_eu?: boolean;             // Whether country is in EU
}
```

**TimeZone:**
```typescript
interface TimeZone {
  id?: string;                  // IANA timezone identifier
  current_time?: string;        // Current time (ISO 8601)
  gmt_offset?: number;          // Offset from GMT in seconds
  code?: string;                // Timezone abbreviation
  is_daylight_saving?: boolean; // Whether DST is active
}
```

**Currency:**
```typescript
interface Currency {
  code?: string;                // Three-letter currency code (ISO 4217)
  name?: string;                // Currency name
  plural?: string;              // Plural form
  symbol?: string;              // Currency symbol
  symbol_native?: string;       // Native currency symbol
}
```

**Connection:**
```typescript
interface Connection {
  asn?: number;                 // Autonomous System Number
  isp?: string;                 // Internet Service Provider
  sld?: string;                 // Second-level domain
  tld?: string;                 // Top-level domain
  carrier?: string;             // Mobile carrier (if applicable)
  home?: boolean;               // Whether it's a home connection
  organization_type?: string;   // Organization type
}
```

**Security:**
```typescript
interface Security {
  is_proxy?: boolean;           // Whether IP is a proxy
  proxy_type?: string;          // Type of proxy
  is_crawler?: boolean;         // Whether it's a crawler/bot
  crawler_name?: string;        // Name of crawler
  is_tor?: boolean;             // Whether it's a Tor exit node
  threat_level?: 'low' | 'medium' | 'high'; // Threat level
  threat_types?: string;        // Types of threats detected
  hosting_facility?: boolean;   // Whether it's a hosting facility
}
```

## Error Handling

The client throws `IpDriftError` for API errors:

```typescript
import { IpDriftError } from '@ipdrift/client';

try {
  const result = await client.lookup({ ip: 'invalid-ip' });
} catch (error) {
  if (error instanceof IpDriftError) {
    console.log('Status:', error.status);        // HTTP status code
    console.log('Message:', error.message);      // Error message
    console.log('Detail:', error.detail);        // Detailed error info
    console.log('Rate Limit:', error.rateLimit); // Rate limit info (if applicable)
  }
}
```

### Rate Limiting

When rate limited (HTTP 429), the error includes rate limit information:

```typescript
try {
  const result = await client.lookup({ ip: '8.8.8.8' });
} catch (error) {
  if (error instanceof IpDriftError && error.status === 429) {
    console.log('Rate limit exceeded');
    console.log('Limit:', error.rateLimit?.limit);      // 120
    console.log('Remaining:', error.rateLimit?.remaining); // 0
    console.log('Reset at:', new Date(error.rateLimit?.reset * 1000));
  }
}
```

## Examples

### Basic Usage

```typescript
import { IpDriftClient } from '@ipdrift/client';

const client = new IpDriftClient({
  apiKey: 'your-api-key-here'
});

// Get IP information
const info = await client.lookup({ ip: '8.8.8.8' });

console.log(`IP: ${info.ip}`);
console.log(`Country: ${info.country_name} (${info.country_code})`);
console.log(`City: ${info.city}, ${info.region_name}`);
console.log(`ISP: ${info.connection.isp}`);
console.log(`ASN: ${info.connection.asn}`);
console.log(`Coordinates: ${info.latitude}, ${info.longitude}`);
```

### Security Check

```typescript
const info = await client.lookup({ ip: 'suspicious-ip' });

if (info.security.is_proxy) {
  console.log('⚠️ This IP is a proxy');
}

if (info.security.is_tor) {
  console.log('⚠️ This IP is a Tor exit node');
}

if (info.security.threat_level === 'high') {
  console.log('🚨 High threat level detected');
}

if (info.security.hosting_facility) {
  console.log('🏢 This IP is from a hosting facility');
}
```

### Timezone Information

```typescript
const info = await client.lookup({ ip: '8.8.8.8' });

console.log(`Timezone: ${info.time_zone.id}`);
console.log(`Current time: ${info.time_zone.current_time}`);
console.log(`GMT offset: ${info.time_zone.gmt_offset} seconds`);
console.log(`Daylight saving: ${info.time_zone.is_daylight_saving ? 'Yes' : 'No'}`);
```

### Currency Information

```typescript
const info = await client.lookup({ ip: '8.8.8.8' });

console.log(`Currency: ${info.currency.name} (${info.currency.code})`);
console.log(`Symbol: ${info.currency.symbol}`);
console.log(`Plural: ${info.currency.plural}`);
```

### Health Check

```typescript
try {
  const health = await client.health();
  if (health.ok) {
    console.log('✅ IPDrift service is healthy');
  }
} catch (error) {
  console.log('❌ IPDrift service is unavailable');
}
```

### Custom Configuration

```typescript
const client = new IpDriftClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://custom-api.example.com', // Custom API endpoint
  timeout: 15000,                            // 15 second timeout
  retries: 5,                                // 5 retry attempts
  userAgent: 'MyApp/1.0.0'                  // Custom user agent
});
```

## Browser Usage

The client works in both Node.js and browser environments:

```html
<script src="https://unpkg.com/@ipdrift/client@latest/dist/index.umd.js"></script>
<script>
  const client = new IpDriftClient({
    apiKey: 'your-api-key'
  });

  client.lookup({ ip: '8.8.8.8' })
    .then(result => console.log(result))
    .catch(error => console.error(error));
</script>
```

## Development

### Building from Source

```bash
git clone https://github.com/ipdrift/client-js.git
cd client-js
npm install
npm run build
```

### Running Tests

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@ipdrift.com
- 🐛 Issues: [GitHub Issues](https://github.com/ipdrift/client-js/issues)
- 📖 Documentation: [IPDrift API Docs](https://geo.ipdrift.com/docs)

## Changelog

### 1.0.0
- Initial release
- Full TypeScript support
- Comprehensive IP lookup functionality
- Security and threat detection
- Rate limiting support
- Error handling with detailed information

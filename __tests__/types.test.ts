import {
  IpLookupResponse,
  HealthResponse,
  IpDriftConfig,
  IpDriftError,
  Language,
  Location,
  TimeZone,
  Currency,
  Connection,
  Security,
} from '../src/types';

describe('Types', () => {
  describe('IpLookupResponse', () => {
    it('should have correct structure', () => {
      const response: IpLookupResponse = {
        ip: '8.8.8.8',
        type: 'ipv4',
        continent_code: 'NA',
        continent_name: 'North America',
        country_code: 'US',
        country_name: 'United States',
        region_code: 'CA',
        region_name: 'California',
        city: 'Mountain View',
        zip: '94043',
        latitude: 37.4056,
        longitude: -122.0775,
        location: {
          geoname_id: 5375480,
          capital: 'Washington D.C.',
          languages: [{ code: 'en', name: 'English', native: 'English' }],
          country_flag_emoji: '🇺🇸',
          country_flag_emoji_unicode: 'U+1F1FA U+1F1F8',
          calling_code: '1',
          is_eu: false,
        },
        time_zone: {
          id: 'America/Los_Angeles',
          current_time: '2025-09-20T08:36:38.951139-07:00',
          gmt_offset: -25200,
          code: 'PDT',
          is_daylight_saving: true,
        },
        currency: {
          code: 'USD',
          name: 'US Dollar',
          plural: 'US dollars',
          symbol: '$',
          symbol_native: '$',
        },
        connection: {
          asn: 15169,
          isp: 'GOOGLE',
          sld: 'google',
          tld: 'com',
          carrier: 'GOOGLE',
          home: false,
          organization_type: 'hosting',
        },
        security: {
          is_proxy: false,
          is_crawler: false,
          is_tor: false,
          threat_level: 'low',
          hosting_facility: true,
        },
      };

      expect(response.ip).toBe('8.8.8.8');
      expect(response.type).toBe('ipv4');
      expect(response.location).toBeDefined();
      expect(response.time_zone).toBeDefined();
      expect(response.currency).toBeDefined();
      expect(response.connection).toBeDefined();
      expect(response.security).toBeDefined();
    });
  });

  describe('HealthResponse', () => {
    it('should have correct structure', () => {
      const health: HealthResponse = { ok: true };
      expect(health.ok).toBe(true);
    });
  });

  describe('IpDriftConfig', () => {
    it('should accept valid configuration', () => {
      const config: IpDriftConfig = {
        apiKey: 'test-api-key',
        baseUrl: 'https://geo.ipdrift.com',
        timeout: 10000,
        retries: 3,
        userAgent: 'MyApp/1.0',
      };

      expect(config.apiKey).toBe('test-api-key');
      expect(config.baseUrl).toBe('https://geo.ipdrift.com');
      expect(config.timeout).toBe(10000);
      expect(config.retries).toBe(3);
      expect(config.userAgent).toBe('MyApp/1.0');
    });
  });

  describe('IpDriftError', () => {
    it('should create error with message', () => {
      const error = new IpDriftError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('IpDriftError');
      expect(error.status).toBeUndefined();
      expect(error.detail).toBeUndefined();
      expect(error.rateLimit).toBeUndefined();
    });

    it('should create error with status and detail', () => {
      const error = new IpDriftError('Test error', 400, 'Bad request');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.detail).toBe('Bad request');
      expect(error.rateLimit).toBeUndefined();
    });

    it('should create error with rate limit info', () => {
      const rateLimit = { limit: 120, remaining: 0, reset: 1634567890 };
      const error = new IpDriftError('Rate limited', 429, 'Too many requests', rateLimit);
      expect(error.message).toBe('Rate limited');
      expect(error.status).toBe(429);
      expect(error.detail).toBe('Too many requests');
      expect(error.rateLimit).toEqual(rateLimit);
    });
  });

  describe('Nested types', () => {
    it('should have correct Language structure', () => {
      const language: Language = {
        code: 'en',
        name: 'English',
        native: 'English',
      };
      expect(language.code).toBe('en');
      expect(language.name).toBe('English');
      expect(language.native).toBe('English');
    });

    it('should have correct Location structure', () => {
      const location: Location = {
        geoname_id: 5375480,
        capital: 'Washington D.C.',
        languages: [{ code: 'en', name: 'English', native: 'English' }],
        country_flag_emoji: '🇺🇸',
        country_flag_emoji_unicode: 'U+1F1FA U+1F1F8',
        calling_code: '1',
        is_eu: false,
      };
      expect(location.geoname_id).toBe(5375480);
      expect(location.capital).toBe('Washington D.C.');
      expect(location.languages).toHaveLength(1);
      expect(location.is_eu).toBe(false);
    });

    it('should have correct TimeZone structure', () => {
      const timeZone: TimeZone = {
        id: 'America/Los_Angeles',
        current_time: '2025-09-20T08:36:38.951139-07:00',
        gmt_offset: -25200,
        code: 'PDT',
        is_daylight_saving: true,
      };
      expect(timeZone.id).toBe('America/Los_Angeles');
      expect(timeZone.gmt_offset).toBe(-25200);
      expect(timeZone.is_daylight_saving).toBe(true);
    });

    it('should have correct Currency structure', () => {
      const currency: Currency = {
        code: 'USD',
        name: 'US Dollar',
        plural: 'US dollars',
        symbol: '$',
        symbol_native: '$',
      };
      expect(currency.code).toBe('USD');
      expect(currency.name).toBe('US Dollar');
      expect(currency.symbol).toBe('$');
    });

    it('should have correct Connection structure', () => {
      const connection: Connection = {
        asn: 15169,
        isp: 'GOOGLE',
        sld: 'google',
        tld: 'com',
        carrier: 'GOOGLE',
        home: false,
        organization_type: 'hosting',
      };
      expect(connection.asn).toBe(15169);
      expect(connection.isp).toBe('GOOGLE');
      expect(connection.home).toBe(false);
    });

    it('should have correct Security structure', () => {
      const security: Security = {
        is_proxy: false,
        proxy_type: undefined,
        is_crawler: false,
        crawler_name: undefined,
        crawler_type: undefined,
        is_tor: false,
        threat_level: 'low',
        threat_types: undefined,
        proxy_last_detected: undefined,
        proxy_level: undefined,
        vpn_service: undefined,
        anonymizer_status: undefined,
        hosting_facility: true,
      };
      expect(security.is_proxy).toBe(false);
      expect(security.is_tor).toBe(false);
      expect(security.threat_level).toBe('low');
      expect(security.hosting_facility).toBe(true);
    });
  });
});

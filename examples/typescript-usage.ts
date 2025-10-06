import { IpDriftClient, IpDriftError } from 'ipdrift-client';

async function main(): Promise<void> {
  // Initialize the client
  const client = new IpDriftClient({
    apiKey: 'your-api-key-here'
  });

  try {
    // Lookup IP information
    const result = await client.lookup({ ip: '8.8.8.8' });
    
    console.log('=== IP Information ===');
    console.log(`IP: ${result.ip}`);
    console.log(`Type: ${result.type}`);
    console.log(`Country: ${result.country_name} (${result.country_code})`);
    console.log(`Region: ${result.region_name}, ${result.region_code}`);
    console.log(`City: ${result.city}`);
    console.log(`Coordinates: ${result.latitude}, ${result.longitude}`);
    console.log(`ISP: ${result.connection.isp}`);
    console.log(`ASN: ${result.connection.asn}`);
    
    console.log('\n=== Security Information ===');
    console.log(`Is Proxy: ${result.security.is_proxy}`);
    console.log(`Is Tor: ${result.security.is_tor}`);
    console.log(`Threat Level: ${result.security.threat_level}`);
    console.log(`Hosting Facility: ${result.security.hosting_facility}`);
    
    console.log('\n=== Timezone Information ===');
    console.log(`Timezone: ${result.time_zone.id}`);
    console.log(`Current Time: ${result.time_zone.current_time}`);
    console.log(`GMT Offset: ${result.time_zone.gmt_offset} seconds`);
    
    console.log('\n=== Currency Information ===');
    console.log(`Currency: ${result.currency.name} (${result.currency.code})`);
    console.log(`Symbol: ${result.currency.symbol}`);
    
    // Example: Security check
    if (result.security.is_proxy) {
      console.log('\n⚠️ Warning: This IP is a proxy');
    }
    
    if (result.security.threat_level === 'high') {
      console.log('\n🚨 High threat level detected');
    }
    
    // Example: Multiple IP lookups
    const ips = ['1.1.1.1', '208.67.222.222', '8.8.4.4'];
    console.log('\n=== Multiple IP Lookups ===');
    
    for (const ip of ips) {
      try {
        const ipResult = await client.lookup({ ip });
        console.log(`${ip}: ${ipResult.country_name} - ${ipResult.connection.isp}`);
      } catch (error) {
        console.error(`Failed to lookup ${ip}:`, error instanceof IpDriftError ? error.message : error);
      }
    }
    
  } catch (error) {
    if (error instanceof IpDriftError) {
      console.error('IPDrift Error:', error.message);
      console.error('Status:', error.status);
      console.error('Detail:', error.detail);
      
      if (error.rateLimit) {
        console.error('Rate Limit Info:', error.rateLimit);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main().catch(console.error);

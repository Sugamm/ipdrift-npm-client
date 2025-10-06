const { IpDriftClient } = require('@ipdrift/client');

async function main() {
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
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
  }
}

main();

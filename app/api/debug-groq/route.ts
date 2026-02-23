// app/api/test-dns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET() {
  const hosts = ['api.groq.com', 'google.com', 'localhost'];
  const dnsResults = [];
  
  for (const host of hosts) {
    try {
      const addresses = await dns.resolve4(host);
      dnsResults.push({
        host,
        success: true,
        addresses,
        type: 'IPv4'
      });
    } catch (error: any) {
      try {
        const addresses = await dns.resolve6(host);
        dnsResults.push({
          host,
          success: true,
          addresses,
          type: 'IPv6'
        });
      } catch (error6: any) {
        dnsResults.push({
          host,
          success: false,
          error: error.message
        });
      }
    }
  }
  
  return NextResponse.json({
    dnsResults,
    networkInterfaces: await import('os').then(os => os.networkInterfaces())
  });
}
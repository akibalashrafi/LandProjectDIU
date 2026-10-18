import { db } from './database.js';
import { generateSeedData } from './seedData.js';

async function seed() {
  console.log('🌱 Seeding LandSure BD Demo Database...');
  const data = await generateSeedData();
  db.setStore(data);
  console.log(`✅ Seed complete!`);
  console.log(`   - Users: ${data.users.length}`);
  console.log(`   - Land Parcels: ${data.parcels.length}`);
  console.log(`   - Ownership Claims: ${data.ownershipClaims.length}`);
  console.log(`   - Documents: ${data.documents.length}`);
  console.log(`   - Fraud Alerts: ${data.fraudAlerts.length}`);
  console.log(`   - Transactions: ${data.transactions.length}`);
  console.log(`   - Admin Requests: ${data.adminUpdateRequests.length}`);
  console.log(`   - Tamper-Evident Audit Events: ${data.auditEvents.length}`);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

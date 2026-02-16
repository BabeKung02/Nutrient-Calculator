// ═══════════════════════════════════════════════════════════
// FILE: server/generateVapidKeys.js
// สคริปต์สำหรับสร้าง VAPID keys
// 
// วิธีใช้:
// 1. npm install web-push
// 2. node generateVapidKeys.js
// 3. Copy keys ไปใส่ใน .env
// ═══════════════════════════════════════════════════════════

const webpush = require("web-push");

console.log("🔑 Generating VAPID keys...\n");

const vapidKeys = webpush.generateVAPIDKeys();

console.log("✅ VAPID Keys Generated!\n");
console.log("📋 Copy these to your .env file:\n");
console.log("─".repeat(60));
console.log(`VAPID_PUBLIC=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE=${vapidKeys.privateKey}`);
console.log(`CONTACT_EMAIL=your@email.com`);
console.log(`PORT=3000`);
console.log("─".repeat(60));
console.log("\n💡 Create a .env file in your server directory and paste the above");
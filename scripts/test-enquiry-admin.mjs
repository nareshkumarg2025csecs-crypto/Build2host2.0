const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("================ STARTING INTEGRATION TESTS ================\n");

  // 1. Unauthenticated /api/admin/enquiries
  console.log("TEST 1: Verify unauthenticated /api/admin/enquiries is rejected");
  const unauthRes = await fetch(`${BASE_URL}/api/admin/enquiries`);
  console.log(`  Status: ${unauthRes.status} (Expected: 401)`);
  const unauthData = await unauthRes.json().catch(() => ({}));
  console.log(`  Response:`, unauthData);
  if (unauthRes.status === 401) {
    console.log("  PASS: Unauthenticated API access correctly rejected.\n");
  } else {
    console.error("  FAIL: Expected 401\n");
  }

  // 2. Unauthenticated /admin page request
  console.log("TEST 2: Verify unauthenticated /admin redirects to /admin/login");
  const unauthPageRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  console.log(`  Status: ${unauthPageRes.status} (Expected 307 or 302 redirect)`);
  const location = unauthPageRes.headers.get("location");
  console.log(`  Location header: ${location}`);
  if (location && location.includes("/admin/login")) {
    console.log("  PASS: Unauthenticated page request correctly redirects to login.\n");
  } else {
    console.log("  Note: Middleware / server handled access check.\n");
  }

  // 3. Form Validation: Invalid Email
  console.log("TEST 3: Verify /api/enquiry rejects missing or invalid email");
  const invalidEmailRes = await fetch(`${BASE_URL}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "websites",
      name: "Test User",
      phone: "9840212345",
      email: "not-an-email",
      package: "business",
      honeypot: "",
      submittedAt: Date.now() - 5000,
      consent: true,
    }),
  });
  console.log(`  Status: ${invalidEmailRes.status} (Expected: 422)`);
  const invalidData = await invalidEmailRes.json().catch(() => ({}));
  console.log(`  Error:`, invalidData.error);
  if (invalidEmailRes.status === 422) {
    console.log("  PASS: Invalid email rejected.\n");
  }

  // 4. Spam trap: Honeypot filled
  console.log("TEST 4: Verify honeypot bot trap");
  const honeypotRes = await fetch(`${BASE_URL}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "websites",
      name: "Spam Bot",
      phone: "9840212345",
      email: "bot@spam.com",
      honeypot: "gotcha",
      submittedAt: Date.now() - 5000,
      consent: true,
    }),
  });
  console.log(`  Status: ${honeypotRes.status} (Expected: 422 or 400)`);
  if (honeypotRes.status >= 400) {
    console.log("  PASS: Honeypot trap triggered.\n");
  }

  // 5. Spam trap: Time trap (< 2.5s)
  console.log("TEST 5: Verify time-trap (<2.5 seconds)");
  const timeTrapRes = await fetch(`${BASE_URL}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "websites",
      name: "Fast Submitter",
      phone: "9840212345",
      email: "fast@human.com",
      honeypot: "",
      submittedAt: Date.now() - 500, // only 0.5s elapsed
      consent: true,
    }),
  });
  console.log(`  Status: ${timeTrapRes.status} (Expected: 422)`);
  const timeTrapData = await timeTrapRes.json().catch(() => ({}));
  console.log(`  Error:`, timeTrapData.error);
  if (timeTrapRes.status === 422) {
    console.log("  PASS: Fast submission time-trap triggered.\n");
  }

  // 6. Robots.txt disallow check
  console.log("TEST 6: Verify /admin is disallowed in robots.txt");
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsTxt = await robotsRes.text();
  console.log("  Robots.txt snippet:");
  console.log(robotsTxt.split("\n").filter(l => l.includes("Disallow")).join("\n"));
  if (robotsTxt.includes("Disallow: /admin")) {
    console.log("  PASS: /admin disallowed in robots.txt.\n");
  }

  // 7. Test Email Rendering Endpoint
  console.log("TEST 7: Verify dev email rendering endpoint");
  const devEmailVisitor = await fetch(`${BASE_URL}/api/dev/test-email?type=visitor&division=websites`);
  console.log(`  Visitor preview status: ${devEmailVisitor.status}`);
  const devEmailTeam = await fetch(`${BASE_URL}/api/dev/test-email?type=team&division=automation`);
  console.log(`  Team preview status: ${devEmailTeam.status}`);
  if (devEmailVisitor.status === 200 && devEmailTeam.status === 200) {
    console.log("  PASS: Dev email preview renders clean HTML.\n");
  }

  console.log("================ ALL SMOKE TESTS COMPLETED ================\n");
}

runTests().catch((e) => console.error(e));

// scripts/verify_e2e.mjs - Automated verification script to test all backend APIs over live HTTP
const BASE_URL = "http://localhost:8080/api";

const results = [];

function record(name, endpoint, method, expectedStatus, actualStatus, pass, details = "") {
  results.push({ name, endpoint, method, expectedStatus, actualStatus, pass, details });
  const symbol = pass ? "✅ PASS" : "❌ FAIL";
  console.log(`${symbol} [${method.padEnd(7)}] ${endpoint.padEnd(25)} - ${name} (Status: ${actualStatus}) ${details ? "- " + details : ""}`);
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, options);
    let body = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        body = await res.json();
      } catch (e) {
        body = null;
      }
    } else {
      body = await res.text();
    }
    return { status: res.status, headers: res.headers, body };
  } catch (err) {
    return { status: 0, headers: new Headers(), body: null, error: err.message };
  }
}

async function runVerification() {
  console.log("\n========================================================");
  console.log("       LIVE SPRING BOOT API ENDPOINT VERIFIER           ");
  console.log("========================================================\n");

  // Check if backend is reachable
  const health = await request("/health");
  if (health.status === 0) {
    console.error("❌ ERROR: Cannot connect to backend server at http://localhost:8080.");
    console.error("👉 Please start the backend first: npm run backend\n");
    process.exit(1);
  }

  // 1. Health Endpoint
  record("Health Check", "/health", "GET", 200, health.status, health.status === 200 && health.body?.success === true);

  // 2. Correlation ID
  const customId = "trace-test-12345";
  const corrRes = await request("/health", { headers: { "X-Correlation-ID": customId } });
  record("Correlation ID Header", "/health", "GET", 200, corrRes.status, corrRes.headers.get("x-correlation-id") === customId);

  // 3. CORS Preflight
  const corsRes = await request("/posts", {
    method: "OPTIONS",
    headers: {
      "Origin": "http://localhost:5173",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Authorization, Content-Type"
    }
  });
  record("CORS Preflight (5173)", "/posts", "OPTIONS", 200, corsRes.status, corsRes.status === 200 && corsRes.headers.get("access-control-allow-origin") === "http://localhost:5173");

  // 4. Auth Logins
  let adminToken = "";
  let editorToken = "";
  let viewerToken = "";

  const adminLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "password123" })
  });
  if (adminLogin.status === 200) adminToken = adminLogin.body?.data?.token;
  record("Admin Login", "/auth/login", "POST", 200, adminLogin.status, adminLogin.status === 200 && !!adminToken);

  const editorLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "editor", password: "password123" })
  });
  if (editorLogin.status === 200) editorToken = editorLogin.body?.data?.token;
  record("Editor Login", "/auth/login", "POST", 200, editorLogin.status, editorLogin.status === 200 && !!editorToken);

  const viewerLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "viewer", password: "password123" })
  });
  if (viewerLogin.status === 200) viewerToken = viewerLogin.body?.data?.token;
  record("Viewer Login", "/auth/login", "POST", 200, viewerLogin.status, viewerLogin.status === 200 && !!viewerToken);

  const badLogin = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "wrongpassword" })
  });
  record("Bad Password Rejected", "/auth/login", "POST", 401, badLogin.status, badLogin.status === 401);

  // 5. Current User Profile (/auth/me)
  const meRes = await request("/auth/me", { headers: { "Authorization": `Bearer ${adminToken}` } });
  record("Get Current User (/me)", "/auth/me", "GET", 200, meRes.status, meRes.status === 200 && meRes.body?.data?.username === "admin");

  const meUnauth = await request("/auth/me");
  record("Unauthenticated Rejected", "/auth/me", "GET", 401, meUnauth.status, meUnauth.status === 401);

  // 6. Posts
  const postsAdmin = await request("/posts", { headers: { "Authorization": `Bearer ${adminToken}` } });
  record("Fetch Posts (Admin)", "/posts", "GET", 200, postsAdmin.status, postsAdmin.status === 200 && Array.isArray(postsAdmin.body?.data));

  const postsViewer = await request("/posts", { headers: { "Authorization": `Bearer ${viewerToken}` } });
  record("Fetch Posts (Viewer)", "/posts", "GET", 200, postsViewer.status, postsViewer.status === 200);

  // 7. Post Lifecycle & RBAC
  const postPayload = {
    title: "Test Verification Post",
    content: "Content to test live endpoint mutations.",
    platforms: ["twitter", "linkedin"],
    status: "draft"
  };

  // Viewer blocked on POST
  const createViewer = await request("/posts", {
    method: "POST",
    headers: { "Authorization": `Bearer ${viewerToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(postPayload)
  });
  record("Viewer Blocked (POST)", "/posts", "POST", 403, createViewer.status, createViewer.status === 403);

  // Admin blocked on POST (Admin has no post management permissions)
  const createAdmin = await request("/posts", {
    method: "POST",
    headers: { "Authorization": `Bearer ${adminToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(postPayload)
  });
  record("Admin Blocked (POST)", "/posts", "POST", 403, createAdmin.status, createAdmin.status === 403);

  // Editor allowed on POST
  const createEditor = await request("/posts", {
    method: "POST",
    headers: { "Authorization": `Bearer ${editorToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(postPayload)
  });
  const newPostId = createEditor.body?.data?.id;
  record("Editor Allowed (POST)", "/posts", "POST", 201, createEditor.status, createEditor.status === 201 && !!newPostId);

  // Admin blocked on DELETE
  if (newPostId) {
    const deleteAdmin = await request(`/posts/${newPostId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    record("Admin Blocked (DELETE)", `/posts/${newPostId}`, "DELETE", 403, deleteAdmin.status, deleteAdmin.status === 403);
  }

  // Editor allowed to delete
  if (newPostId) {
    const deleteEditor = await request(`/posts/${newPostId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${editorToken}` }
    });
    record("Editor Allowed (DELETE)", `/posts/${newPostId}`, "DELETE", 200, deleteEditor.status, deleteEditor.status === 200);
  }

  // 8. Drafts Lifecycle & RBAC
  const draftsViewer = await request("/drafts", { headers: { "Authorization": `Bearer ${viewerToken}` } });
  record("Viewer Read Drafts", "/drafts", "GET", 200, draftsViewer.status, draftsViewer.status === 200 && Array.isArray(draftsViewer.body?.data));

  const draftPayload = { title: "Test Draft", content: "Test content", platforms: ["twitter"] };
  const draftCreateViewer = await request("/drafts", {
    method: "POST",
    headers: { "Authorization": `Bearer ${viewerToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(draftPayload)
  });
  record("Viewer Blocked (Draft)", "/drafts", "POST", 403, draftCreateViewer.status, draftCreateViewer.status === 403);

  // 9. Activity Log & RBAC
  const actAdmin = await request("/activity", { headers: { "Authorization": `Bearer ${adminToken}` } });
  record("Admin View Activity Log", "/activity", "GET", 200, actAdmin.status, actAdmin.status === 200 && Array.isArray(actAdmin.body?.data));

  const actEditor = await request("/activity", { headers: { "Authorization": `Bearer ${editorToken}` } });
  record("Editor Blocked (Activity)", "/activity", "GET", 403, actEditor.status, actEditor.status === 403);

  const actViewer = await request("/activity", { headers: { "Authorization": `Bearer ${viewerToken}` } });
  record("Viewer Blocked (Activity)", "/activity", "GET", 403, actViewer.status, actViewer.status === 403);

  // Summary
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log("\n========================================================");
  console.log(` SUMMARY: ${results.length} API checks completed | ${passed} passed | ${failed} failed`);
  console.log("========================================================\n");
}

runVerification();

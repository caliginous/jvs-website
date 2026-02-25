/* eslint-disable @typescript-eslint/no-explicit-any */
// JVS Worker Entrypoint - Maintainable, Restored Version
// Matches the look/content of https://2ab5a07f-jvs-website.dan-794.workers.dev/

interface Env {
  DB: any; // D1Database
  MAGAZINE_BUCKET: any; // R2Bucket
  JVS_SECRETS: any; // KVNamespace
}

const worker = {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // API: List Magazines
    if (path === "/api/list-magazines") {
      return handleListMagazines(env);
    }
    // API: Contact Form
    if (path === "/api/contact" && request.method === "POST") {
      return handleContactForm(request, env);
    }
    // API: Venue Hire Form
    if (path === "/api/venue-hire" && request.method === "POST") {
      return handleVenueHireForm(request, env);
    }
    // Serve PDFs from R2
    if (path.startsWith("/pdf/")) {
      return servePDF(path, env);
    }
    // Home Page
    if (path === "/") {
      return renderHomePage();
    }
    // About Page
    if (path === "/about") {
      return renderAboutPage();
    }
    // Articles Listing
    if (path === "/articles") {
      return renderArticlesPage();
    }
    // Single Article
    if (path.startsWith("/articles/")) {
      const slug = path.replace("/articles/", "");
      return renderSingleArticlePage(slug);
    }
    // Events Listing
    if (path === "/events") {
      return renderEventsPage();
    }
    // Recipes Listing
    if (path === "/recipes") {
      return renderRecipesPage();
    }
    // 404 for unknown routes
    return renderNotFound();
  }
};

export default worker;

// --- API Logic ---
async function handleListMagazines(env: Env) {
  try {
    const { results } = await env.DB.prepare("SELECT * FROM magazine_issues ORDER BY date DESC").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch magazines" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleContactForm(request: Request, env: Env) {
  try {
    await request.json();
    // TODO: Integrate with Mailgun
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleVenueHireForm(request: Request, env: Env) {
  try {
    await request.json();
    // TODO: Integrate with Mailgun
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to send request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function servePDF(path: string, env: Env) {
  const filename = path.replace("/pdf/", "");
  const object = await env.MAGAZINE_BUCKET.get(filename);
  if (!object) {
    return new Response("PDF not found", { status: 404 });
  }
  return new Response(object.body, {
    headers: { "Content-Type": "application/pdf" },
  });
}

// --- Rendering Logic ---
function renderHomePage() {
  return renderPage(
    "Jewish, Vegan, Sustainable",
    `
    <header>
      <h1>Jewish, Vegan & Sustainable</h1>
      <p>JVS is the UK Jewish community's non-profit dedicated to promoting food ethics, sustainability, and concern for all living creatures.</p>
      <div class="home-actions">
        <a href="/events" class="btn">View Events</a>
        <a href="/articles" class="btn">Read Articles</a>
      </div>
    </header>
    <section>
      <h2>Upcoming Events</h2>
      <ul>
        <li><strong>Summer social: falafel and drinks</strong> – Wednesday, 27 August 2025 at 6:30 pm, NW11 – £18</li>
        <li><strong>Dan's test event</strong> – Saturday, 30 August 2025 at 5:28 pm, JVS – £5</li>
        <li><strong>Community Gardening Club 27th July</strong> – Sunday, 27 July 2025 at 11:00 am, Jewish Vegan Society, 853 Finchley Road, London, NW11 1LX – Free</li>
      </ul>
    </section>
    <section>
      <h2>Latest Articles</h2>
      <ul>
        <li><a href="/articles/three-weeks-vegan-perspective">The Three Weeks in Judaism: A Vegan Perspective (5785/2025)</a> – 24 July 2025</li>
        <li><a href="/articles/govt-backs-lab-grown-meat">Government backs £12 m hub for lab grown meat and fermentation</a> – 24 July 2025</li>
        <li><a href="/articles/calderdale-council-vegan-food">Calderdale Council (W.Yorks) to serve only vegan food at official events</a> – 24 July 2025</li>
      </ul>
    </section>
    `
  );
}

function renderAboutPage() {
  return renderPage(
    "About JVS",
    `
    <h1>About JVS</h1>
    <p>We are a community dedicated to exploring the intersection of Jewish values, veganism and sustainability. Through events, education, and advocacy, we promote ethical eating, environmental stewardship, and compassionate living in line with Jewish traditions.</p>
    <p>Promoting Jewish values through veganism and sustainability, building community through education and advocacy.</p>
    `
  );
}

function renderArticlesPage() {
  return renderPage(
    "Articles",
    `
    <h1>Articles</h1>
    <ul>
      <li><a href="/articles/three-weeks-vegan-perspective">The Three Weeks in Judaism: A Vegan Perspective (5785/2025)</a> – 24 July 2025</li>
      <li><a href="/articles/govt-backs-lab-grown-meat">Government backs £12 m hub for lab grown meat and fermentation</a> – 24 July 2025</li>
      <li><a href="/articles/calderdale-council-vegan-food">Calderdale Council (W.Yorks) to serve only vegan food at official events</a> – 24 July 2025</li>
    </ul>
    `
  );
}

function renderSingleArticlePage(slug: string) {
  // In a real implementation, fetch from WordPress GraphQL
  const articles: Record<string, { title: string; date: string; content: string }> = {
    "three-weeks-vegan-perspective": {
      title: "The Three Weeks in Judaism: A Vegan Perspective (5785/2025)",
      date: "24 July 2025",
      content: `<p>Dear Reader, In the Jewish calendar, the period we're in now, is known as The Three Weeks. It a time of mourning and reflection. It begins on the 17th Tammuz and ends with Tisha B'Av (9th Av), a day that commemorates the destruction of both Temples in Jerusalem. Traditionally, it is a time of restraint, ...</p>`
    },
    "govt-backs-lab-grown-meat": {
      title: "Government backs £12 m hub for lab grown meat and fermentation",
      date: "24 July 2025",
      content: `<p>A new £12 million investment by the government via EPSRC will back the Cellular Agriculture Manufacturing Hub (CARMA), based at the University of Bath. ...</p>`
    },
    "calderdale-council-vegan-food": {
      title: "Calderdale Council (W.Yorks) to serve only vegan food at official events",
      date: "24 July 2025",
      content: `<p>Calderdale Council in West Yorkshire is planning to serve exclusively vegan catering at meetings and receptions if a new food policy is approved. ...</p>`
    }
  };
  const article = articles[slug];
  if (!article) return renderNotFound();
  return renderPage(
    article.title,
    `<h1>${article.title}</h1><p><em>${article.date}</em></p>${article.content}`
  );
}

function renderEventsPage() {
  return renderPage(
    "Events",
    `
    <h1>Events</h1>
    <ul>
      <li><strong>Summer social: falafel and drinks</strong> – Wednesday, 27 August 2025 at 6:30 pm, NW11 – £18</li>
      <li><strong>Dan's test event</strong> – Saturday, 30 August 2025 at 5:28 pm, JVS – £5</li>
      <li><strong>Community Gardening Club 27th July</strong> – Sunday, 27 July 2025 at 11:00 am, Jewish Vegan Society, 853 Finchley Road, London, NW11 1LX – Free</li>
    </ul>
    `
  );
}

function renderRecipesPage() {
  return renderPage(
    "Recipes",
    `
    <h1>Recipes</h1>
    <ul>
      <li>Vegan Challah</li>
      <li>Falafel</li>
      <li>Vegan Kugel</li>
    </ul>
    `
  );
}

function renderNotFound() {
  return renderPage("Not Found", `<h1>404 - Not Found</h1><p>The page you requested does not exist.</p>`);
}

function renderPage(title: string, content: string) {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; background: #f9f9f9; }
    nav { margin-bottom: 2rem; }
    nav a { margin-right: 1rem; text-decoration: none; color: #007c7c; }
    nav a:hover { text-decoration: underline; }
    .btn { display: inline-block; padding: 0.5em 1em; background: #007c7c; color: #fff; border-radius: 4px; text-decoration: none; margin: 0.5em 0.5em 0.5em 0; }
    .btn:hover { background: #005a5a; }
    header { margin-bottom: 2rem; }
    section { margin-bottom: 2rem; }
    ul { padding-left: 1.2em; }
    li { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/articles">Articles</a>
    <a href="/events">Events</a>
    <a href="/recipes">Recipes</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
  ${content}
</body>
</html>`, {
    headers: { "Content-Type": "text/html" },
  });
} 
export const runtime = "edge";

export async function GET() {
  try {
    const res = await fetch("https://backend.jvs.org.uk/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ __typename }" })
    });
    
    const text = await res.text();
    return new Response(`GraphQL Test: ${res.status} - ${text}`, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    return new Response(`GraphQL Test Error: ${error}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
} 
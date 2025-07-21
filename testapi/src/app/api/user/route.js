let storedUser = null; // In-memory storage (resets on server restart)

export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ message: "Name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Save user data in memory
    storedUser = { name, email };

    return new Response(
      JSON.stringify({ message: "User data received", user: storedUser }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    if (!storedUser) {
      return new Response(
        JSON.stringify({ message: "No user data found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(storedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

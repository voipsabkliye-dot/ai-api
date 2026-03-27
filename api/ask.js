export default async function handler(req, res) {
  // ✅ CORS (important for browser requests)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Method Not Allowed" });
  }

  try {
    const { question } = req.body;

    // ✅ Validate input
    if (!question || question.trim() === "") {
      return res.status(400).json({ answer: "No question provided" });
    }

    // ✅ Call OpenAI
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: question,
      }),
    });

    const data = await response.json();

    // 🔥 LOG for Vercel logs
    console.log("FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    // 🔥 TEMP DEBUG RESPONSE (IMPORTANT)
    return res.status(200).json({
      full: data,
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      answer: "Server error",
    });
  }
}

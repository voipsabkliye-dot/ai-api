export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Method Not Allowed" });
  }

  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ answer: "No question provided" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // ✅ UPDATED MODEL
        input: question,
      }),
    });

    const data = await response.json();

    console.log("FULL DATA:", JSON.stringify(data, null, 2));

    // ✅ CORRECT parsing
    let answer = data.output_text;

    // fallback (just in case)
    if (!answer && data.output) {
      answer = data.output
        .map(o =>
          o.content?.map(c => c.text).join(" ")
        )
        .join(" ");
    }

    return res.status(200).json({
      answer: answer || "Still no response",
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      answer: "Server error",
    });
  }
}

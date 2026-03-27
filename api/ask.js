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
        model: "gpt-4o-mini",
        input: question,
      }),
    });

    const data = await response.json();

    let answer =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No response";

    return res.status(200).json({ answer });

  } catch (error) {
    return res.status(500).json({ answer: "Server error" });
  }
}

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

async function testLlama() {
  const prompt = `
You are a helpful chef.

Create a simple recipe using:
eggs, cheese, tomato

Include:
- Title
- Ingredients
- Steps
`;

  const command = new InvokeModelCommand({
    modelId: "meta.llama3-8b-instruct-v1:0", // ✅ WORKS with on-demand
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_gen_len: 300,   // ✅ correct param
      temperature: 0.7,
      top_p: 0.9,
    }),
  });

  try {
    const response = await client.send(command);

    const decoded = new TextDecoder().decode(response.body);
    const parsed = JSON.parse(decoded);

    console.log("🔥 FULL RESPONSE:\n", parsed);

    // ✅ Extract text safely
    let outputText = null;

    if (parsed.outputs && parsed.outputs[0]?.text) {
      outputText = parsed.outputs[0].text;
    } else if (parsed.generation) {
      outputText = parsed.generation;
    }

    console.log("\n==============================");
    console.log("🧠 GENERATED TEXT:\n");

    if (outputText) {
      console.log(outputText);
    } else {
      console.log("⚠️ No text found in response");
    }

    console.log("==============================\n");

  } catch (err) {
    console.error("❌ ERROR:\n", err);
  }
}

testLlama();
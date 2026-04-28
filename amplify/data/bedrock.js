export function request(ctx) {
  const ingredients = ctx.args.ingredients ?? [];

  const prompt = `
You are a professional chef.

Create a detailed recipe using:
${ingredients.join(", ")}

Include:
- Recipe Title
- Ingredients
- Step-by-step Instructions
`;

  return {
    resourcePath: "/model/meta.llama3-8b-instruct-v1:0/invoke",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        max_gen_len: 500,
        temperature: 0.7,
        top_p: 0.9,
      }),
    },
  };
}

export function response(ctx) {
  const parsed = JSON.parse(ctx.result.body);

  // ✅ outputs format
  if (parsed.outputs && parsed.outputs[0] && parsed.outputs[0].text) {
    return {
      body: parsed.outputs[0].text,
    };
  }

  // ✅ generation format
  if (parsed.generation) {
    return {
      body: parsed.generation,
    };
  }

  // ❌ fallback (string only, no complex ops)
  return {
    body: JSON.stringify(parsed),
  };
}
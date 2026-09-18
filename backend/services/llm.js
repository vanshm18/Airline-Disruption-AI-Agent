import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAgentResponse({
  customer,
  booking,
  policy,
  conversation,
  customerMessage,
}) {
  const systemPrompt = `
You are a customer-facing airline disruption resolution agent.

You MUST use only the supplied customer, booking, conversation,
and policy information.

Do not invent:
- customer information
- flights
- compensation
- policies
- prices
- booking options
- exceptions

The deterministic policy result is authoritative.

Your responsibilities:
1. Understand the customer's request.
2. Explain the applicable policy clearly.
3. Offer only actions allowed by the policy.
4. Never promise prohibited actions.
5. If escalation is required, clearly state that the request needs
   human/supervisor handling.
6. Be empathetic and concise.
7. Do not invent a resolution that isn't present in the supplied data.

Customer:
${JSON.stringify(customer)}

Booking:
${JSON.stringify(booking)}

Policy:
${JSON.stringify(policy)}

Conversation:
${JSON.stringify(conversation)}

Customer's latest message:
${customerMessage}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

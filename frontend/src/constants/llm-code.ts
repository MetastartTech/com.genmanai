const openai = {
  OPENAI_PYTHON: (model: string, system: string, user: string) =>
    ` \`\`\`python
from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
  model="${model}",
  messages=[
    {"role": "system", "content": "${system}"},
    {"role": "user", "content": "${user}"}
  ]
)

print(completion.choices[0].message)`,

  OPENAI_NODE: (model: string, system: string, user: string) =>
    ` \`\`\`javascript
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": "${system}"},
      {"role": "user", "content": "${user}"}
    ],
    model="${model}",
  });

  console.log(completion.choices[0]);
}

main();
`,
};

const anthropic = {
  ANTHROPIC_PYTHON: (model: string, system: string, user: string) =>
    `\`\`\`python
import anthropic

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key="my_api_key",
)
message = client.messages.create(
    model="${model}",
    messages=[
        {"role": "system", "content": "${system}"},
        {"role": "user", "content": "${user}"},
    ]
)
print(message.content)`,
  ANTHROPIC_NODE: (model: string, system: string, user: string) =>
    `\`\`\`javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
  model: "${model}",
  messages: [
    { role: "system", content: "${system}" },
    { role: "user", content: "${user}" },
  ],
});
console.log(msg);
`,
};

const gemini = {
  GEMINI_NODE: (model: string, system: string, user: string) =>
    `\`\`\`javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "${model}"});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: "${system}",
      },
      {
        role: "model",
        parts: "Okay",
      },
    ],
  });

  const msg = "${user}";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();`,
  GEMINI_PYTHON: (model: string, system: string, user: string) =>
    `\`\`\`python
import google.generativeai as genai

genai.configure(api_key=<GOOGLE_API_KEY>)

model = genai.GenerativeModel('${model}')
chat = model.start_chat(history=[
    {
        role: "user",
        parts: "${system}",
    },
    {
        role: "model",
        parts: "Okay",
    },
])

response = chat.send_message("${user}")
print(response.text)
`,
};

export { openai, anthropic, gemini };

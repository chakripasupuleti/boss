import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      questionText, 
      userAnswer, 
      correctAnswer, 
      topic, 
      model,
      variables,
      baseExplanation 
    } = await req.json();

    // Validate inputs to prevent abuse and excessive token consumption
    if (!questionText || typeof questionText !== 'string' || questionText.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Invalid question text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Invalid user answer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!correctAnswer || typeof correctAnswer !== 'string' || correctAnswer.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Invalid correct answer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!topic || typeof topic !== 'string' || topic.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid topic' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!model || typeof model !== 'string' || model.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid model' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (variables && (typeof variables !== 'object' || Array.isArray(variables))) {
      return new Response(
        JSON.stringify({ error: 'Invalid variables format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (baseExplanation && (typeof baseExplanation !== 'string' || baseExplanation.length > 5000)) {
      return new Response(
        JSON.stringify({ error: 'Invalid base explanation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a math tutor. Generate step-by-step solutions in this EXACT format:

Step 1:
$$[mathematical equation or calculation]$$

Step 2: 
$$[mathematical equation or calculation]$$

...continue for all steps...

Final Answer: $[answer]$

CRITICAL RULES:
- NEVER use markdown: no ** (bold), no * (italics), no \`\`\` (code fences)
- Use plain text only for step labels: "Step 1:", "Step 2:", "Final Answer:"
- Use $$ for ALL block mathematical expressions (each on its own line)
- Use $ only for inline variables within text
- Do NOT put $$ on the same line as "Step X:" - always put math on the next line
- Number each step clearly without any asterisks or formatting
- Show ONE calculation per step
- No paragraphs - only step statements and math blocks
- Always end with "Final Answer: $[value]$"
- Keep explanations focused and scannable
- All LaTeX must use proper delimiters: $$ for blocks, $ for inline
- Never mix delimiters: do not use \\( \\) or \\[ \\]`;

    const userPrompt = `Question: ${questionText}

${variables ? `Variable values: ${JSON.stringify(variables)}` : ''}

${baseExplanation ? `Base explanation for reference:\n${baseExplanation}\n` : ''}

Student's answer: ${userAnswer}
Correct answer: ${correctAnswer}

Generate a step-by-step solution following the format specified. If a base explanation is provided, adapt its logic for the current variable values.

${userAnswer !== correctAnswer ? `Also explain why ${userAnswer} is incorrect.` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate explanation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in generate-explanation:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

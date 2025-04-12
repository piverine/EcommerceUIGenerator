'use server';
/**
 * @fileOverview A prompt refinement AI agent.
 *
 * - refinePrompt - A function that handles the prompt refinement process.
 * - RefinePromptInput - The input type for the refinePrompt function.
 * - RefinePromptOutput - The return type for the refinePrompt function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RefinePromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt to refine.'),
});
export type RefinePromptInput = z.infer<typeof RefinePromptInputSchema>;

const RefinePromptOutputSchema = z.object({
  refinedPrompt: z.string().describe('The refined text prompt with suggestions based on common design patterns.'),
});
export type RefinePromptOutput = z.infer<typeof RefinePromptOutputSchema>;

export async function refinePrompt(input: RefinePromptInput): Promise<RefinePromptOutput> {
  return refinePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refinePromptPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The text prompt to refine.'),
    }),
  },
  output: {
    schema: z.object({
      refinedPrompt: z.string().describe('The refined text prompt with suggestions based on common design patterns.'),
    }),
  },
  prompt: `You are an expert UI/UX designer. Your task is to refine a user's text prompt for generating HTML and CSS code for a product display section.

  Consider common design patterns and suggest improvements to the prompt to enhance the generated code's quality, responsiveness, and adherence to modern design principles.

  Original Prompt: {{{prompt}}}

  Refined Prompt:`, // Intentionally left open-ended for the model to complete the refined prompt.
});

const refinePromptFlow = ai.defineFlow<
  typeof RefinePromptInputSchema,
  typeof RefinePromptOutputSchema
>(
  {
    name: 'refinePromptFlow',
    inputSchema: RefinePromptInputSchema,
    outputSchema: RefinePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

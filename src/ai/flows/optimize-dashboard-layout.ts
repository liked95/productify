// OptimizeDashboardLayout
'use server';

/**
 * @fileOverview Suggests an optimal dashboard layout based on user role to maximize productivity.
 *
 * - optimizeDashboardLayout - A function that suggests the dashboard layout.
 * - OptimizeDashboardLayoutInput - The input type for the optimizeDashboardLayout function.
 * - OptimizeDashboardLayoutOutput - The return type for the optimizeDashboardLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeDashboardLayoutInputSchema = z.object({
  userRole: z
    .string()
    .describe(
      'The role of the user, e.g., manager, individual contributor, analyst.'
    ),
  availableWidgets: z
    .array(z.string())
    .describe('A list of available widgets to include in the dashboard.'),
});
export type OptimizeDashboardLayoutInput = z.infer<
  typeof OptimizeDashboardLayoutInputSchema
>;

const OptimizeDashboardLayoutOutputSchema = z.object({
  suggestedLayout: z
    .array(z.string())
    .describe(
      'An ordered list of widget names representing the optimal dashboard layout for the user role.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation for why the layout is optimal for the user role.'
    ),
});
export type OptimizeDashboardLayoutOutput = z.infer<
  typeof OptimizeDashboardLayoutOutputSchema
>;

export async function optimizeDashboardLayout(
  input: OptimizeDashboardLayoutInput
): Promise<OptimizeDashboardLayoutOutput> {
  return optimizeDashboardLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeDashboardLayoutPrompt',
  input: {schema: OptimizeDashboardLayoutInputSchema},
  output: {schema: OptimizeDashboardLayoutOutputSchema},
  prompt: `You are an AI dashboard layout optimizer. Given the user's role and available widgets, you will suggest an optimal dashboard layout to maximize their productivity. 

User Role: {{{userRole}}}
Available Widgets: {{#each availableWidgets}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest an optimal dashboard layout (as an ordered list of widget names) and explain your reasoning for the suggestion.

Output the 'suggestedLayout' as an ordered list of widget names, and the 'reasoning' as a single paragraph explaining why the layout is optimal for the user role. The widgets should be chosen from the list of available widgets.

Ensure every widget is included in the suggested layout.

Optimal Dashboard Layout:`, // Prompt end
});

const optimizeDashboardLayoutFlow = ai.defineFlow(
  {
    name: 'optimizeDashboardLayoutFlow',
    inputSchema: OptimizeDashboardLayoutInputSchema,
    outputSchema: OptimizeDashboardLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

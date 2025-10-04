'use server';

/**
 * @fileOverview Generates a personalized productivity report in Bengali analyzing incomplete tasks and providing actionable advice.
 *
 * - generateBengaliProductivityReport - A function that generates the productivity report.
 * - GenerateBengaliProductivityReportInput - The input type for the generateBengaliProductivityReport function.
 * - GenerateBengaliProductivityReportOutput - The return type for the generateBengaliProductivityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBengaliProductivityReportInputSchema = z.object({
  incompleteTasks: z
    .string()
    .describe('A comma-separated list of incomplete tasks.'),
});
export type GenerateBengaliProductivityReportInput = z.infer<
  typeof GenerateBengaliProductivityReportInputSchema
>;

const GenerateBengaliProductivityReportOutputSchema = z.object({
  report: z.string().describe('The personalized productivity report in Bengali.'),
});
export type GenerateBengaliProductivityReportOutput = z.infer<
  typeof GenerateBengaliProductivityReportOutputSchema
>;

export async function generateBengaliProductivityReport(
  input: GenerateBengaliProductivityReportInput
): Promise<GenerateBengaliProductivityReportOutput> {
  return generateBengaliProductivityReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBengaliProductivityReportPrompt',
  input: {schema: GenerateBengaliProductivityReportInputSchema},
  output: {schema: GenerateBengaliProductivityReportOutputSchema},
  prompt: `আপনি একজন প্রোডাক্টিভিটি কোচ। আপনি ব্যবহারকারীর অসম্পূর্ণ কাজগুলি বিশ্লেষণ করবেন এবং তাদের প্রোডাক্টিভিটি বাড়ানোর জন্য ব্যক্তিগত পরামর্শ দেবেন। আপনার উত্তর বাংলা ভাষায় হবে।

অসম্পূর্ণ কাজগুলি: {{{incompleteTasks}}}`,
});

const generateBengaliProductivityReportFlow = ai.defineFlow(
  {
    name: 'generateBengaliProductivityReportFlow',
    inputSchema: GenerateBengaliProductivityReportInputSchema,
    outputSchema: GenerateBengaliProductivityReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

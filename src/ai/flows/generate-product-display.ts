'use server';
/**
 * @fileOverview Generates HTML and CSS code for a product display section based on a product image, brand colors, font, and text prompt.
 *
 * - generateProductDisplay - A function that handles the product display generation process.
 * - GenerateProductDisplayInput - The input type for the generateProductDisplay function.
 * - GenerateProductDisplayOutput - The return type for the generateProductDisplay function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateProductDisplayInputSchema = z.object({
  carouselImages: z.array(z.string().describe('URLs of images for the hero section carousel.')).describe('Array of carousel image URLs.'),
  products: z.array(z.object({
    title: z.string().describe('Title of the product.'),
    price: z.string().describe('Price of the product.'),
    description: z.string().describe('Description of the product.'),
    image: z.string().describe('URL of the product image.'),
  })).describe('Array of product details.'),
  primaryColor: z.string().describe('The primary brand color (e.g., hex code).'),
  secondaryColor: z.string().describe('The secondary brand color (e.g., hex code).'),
  font: z.string().describe('The primary font name.'),
  textPrompt: z.string().describe('A text prompt describing the desired product display section.'),
});
export type GenerateProductDisplayInput = z.infer<typeof GenerateProductDisplayInputSchema>;

const GenerateProductDisplayOutputSchema = z.object({
  html: z.string().describe('The generated HTML code for the product display section.'),
  css: z.string().describe('The generated CSS code for the product display section.'),
});
export type GenerateProductDisplayOutput = z.infer<typeof GenerateProductDisplayOutputSchema>;

export async function generateProductDisplay(input: GenerateProductDisplayInput): Promise<GenerateProductDisplayOutput> {
  return generateProductDisplayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDisplayPrompt',
  input: {
    schema: z.object({
      carouselImages: z.array(z.string().describe('URLs of images for the hero section carousel.')).describe('Array of carousel image URLs.'),
      products: z.array(z.object({
        title: z.string().describe('Title of the product.'),
        price: z.string().describe('Price of the product.'),
        description: z.string().describe('Description of the product.'),
        image: z.string().describe('URL of the product image.'),
      })).describe('Array of product details.'),
      primaryColor: z.string().describe('The primary brand color (e.g., hex code).'),
      secondaryColor: z.string().describe('The secondary brand color (e.g., hex code).'),
      font: z.string().describe('The primary font name.'),
      textPrompt: z.string().describe('A text prompt describing the desired product display section.'),
    }),
  },
  output: {
    schema: z.object({
      html: z.string().describe('The generated HTML code for the product display section.'),
      css: z.string().describe('The generated CSS code for the product display section.'),
    }),
  },
  prompt: `You are an expert frontend developer tasked with creating UI components.

Goal: Generate HTML and CSS code for a product display section.

Inputs:
1. Carousel Images: {{{carouselImages}}}
2. Product Details: {{{products}}}
3. Brand Guidelines:
   - Primary Color: {{{primaryColor}}}
   - Secondary Color: {{{secondaryColor}}}
   - Primary Font: '{{{font}}}'
4. Description: {{{textPrompt}}}

Instructions:
Based on the provided carousel images and product details, generate a visually appealing and modern product display section. Use the brand colors and font to maintain consistency. The display should showcase the products effectively, with clear titles, prices, descriptions, and images.

Output only the HTML structure and the corresponding CSS rules within <style> tags or as separate blocks. Do not include any explanations, just the code. The output should be well-formatted and readable.

HTML:

CSS:
`,
});

const generateProductDisplayFlow = ai.defineFlow<
  typeof GenerateProductDisplayInputSchema,
  typeof GenerateProductDisplayOutputSchema
>(
  {
    name: 'generateProductDisplayFlow',
    inputSchema: GenerateProductDisplayInputSchema,
    outputSchema: GenerateProductDisplayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


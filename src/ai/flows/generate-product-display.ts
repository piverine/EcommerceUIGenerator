'use server';
/**
 * @fileOverview Generates HTML and CSS code for a product display section based on a product image, brand colors, font, and text prompt.
 *
 * - generateProductDisplay - A function that handles the product display generation process.
 * - GenerateProductDisplayInput - The input type for the GenerateProductDisplay function.
 * - GenerateProductDisplayOutput - The return type for the GenerateProductDisplay function.
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
  javascript: z.string().optional().describe('The generated Javascript code for the product display section'),
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
      javascript: z.string().optional().describe('The generated Javascript code for the product display section'),
    }),
  },
  prompt: `You are an expert frontend developer tasked with creating UI components.

Goal: Generate HTML, CSS, and Javascript code for a visually stunning and modern product display section.

Instructions:
1.  Use modern CSS techniques like Flexbox and Grid.
2.  Incorporate a visually appealing color scheme using the provided primary and secondary brand colors.
3.  Use the provided font for a consistent and professional look.
4.  Incorporate modern UI/UX elements such as:
    *   Subtle animations and transitions to enhance user experience.
    *   Gradients and layered elements to add depth.
    *   A glassmorph effect for a frosted glass appearance (optional).
5.  Ensure the layout is responsive and adapts well to different screen sizes.
6.  Include JavaScript for interactive elements, such as carousel functionality, hover effects, or any other dynamic behavior that enhances the user experience.
7.  Make sure to display carousel images and all product details that were provided

Inputs:
1. Carousel Images: {{{carouselImages}}}
2. Product Details:
{{#each products}}
  - Title: {{{this.title}}}
    Price: {{{this.price}}}
    Description: {{{this.description}}}
    Image: {{{this.image}}}
{{/each}}
3. Brand Guidelines:
   - Primary Color: {{{primaryColor}}}
   - Secondary Color: {{{secondaryColor}}}
   - Primary Font: '{{{font}}}'
4. Description: {{{textPrompt}}}

Output:
Provide the HTML structure, CSS rules (including any animations or gradients), and JavaScript code for the product display section. Ensure the code is well-formatted and readable.

HTML:

CSS:

Javascript:
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

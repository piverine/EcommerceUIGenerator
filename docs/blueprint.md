# **App Name**: CodeCanvas

## Core Features:

- Code Generation: Generates HTML and CSS code for a product display section using a multimodal AI model, based on a product image, brand colors, font, and text prompt.
- Input Capture: Allows users to upload a product image and input brand colors, font, and a descriptive text prompt.
- Code Display: Displays the generated HTML and CSS code in text areas for review.
- Live Preview: Renders a live preview of the generated product display section using an iframe or similar technique.
- Prompt Refinement Tool: Uses AI tool to help user refine the prompt with suggestions based on common design patterns.

## Style Guidelines:

- Primary color: Neutral white or light gray for clean presentation.
- Secondary color: A slightly darker shade of gray for contrast.
- Accent: Teal (#008080) for interactive elements.
- Clean and modern typography for code display and UI elements.
- Clear separation of input form, code display, and live preview areas.
- Simple, clear icons for upload and actions.

## Original User Request:
i want to build this in nextjs: 
Core MVP Goal: Generate a simple, static product display section (HTML/CSS) based on a product image, a text prompt, and basic brand colors/fonts.
Steps & Strategy:
Setup & API Access:
Get API keys for a multimodal model (e.g., Google AI Studio for Gemini Pro Vision). Be mindful of potential costs and usage limits.
Set up a basic development environment. A simple backend (like Flask/Python or Node.js/Express) to handle API calls and a simple frontend (HTML, CSS, basic JS or a lightweight framework like React/Vue) to provide the user interface.
Input Interface (Frontend):
Create a simple web form where a user can:
Upload a product image.
Enter primary and secondary brand colors (e.g., using color pickers or hex code inputs).
Specify a primary font name (e.g., text input).
Write a text prompt describing the desired output (e.g., "Generate a clean product display section for this shoe, using the provided brand colors and font. Include title, price, and description areas.")
Backend Logic & API Call:
When the form is submitted, the backend receives the data.
The product image needs to be processed (likely base64 encoded) to be sent to the multimodal API.
Crucially: Construct the Prompt. This is where the magic (and difficulty) lies. You need to combine the inputs into a single prompt for the model. Example structure:
Context: You are an expert frontend developer tasked with creating UI components.
Goal: Generate HTML and CSS code for a product display section.

Inputs:
1. Product Image: [Include the image data here - model dependent format]
2. Brand Guidelines:
   - Primary Color: #XXXXXX
   - Secondary Color: #YYYYYY
   - Primary Font: 'Font Name'
3. Description: Generate a clean product display section for the item in the image. Use the provided brand colors and font. The section should include placeholders for a product title, price, and a short description. Ensure the layout is simple and modern. Output only the HTML structure and the corresponding CSS rules within <style> tags or as separate blocks. Do not include any explanations, just the code.

Output:
[Model should generate HTML and CSS here]
Use code with caution.
Make the API call to the multimodal model (e.g., Gemini Pro Vision endpoint).
Processing the Output (Backend/Frontend):
Receive the response from the API. This will likely be text containing the generated HTML and CSS.
Parse the response. You might need some basic string manipulation to separate HTML from CSS if the model doesn't format it perfectly.
Send the generated code back to the frontend.
Displaying the Result (Frontend):
Show the raw generated HTML and CSS code in text areas.
Render the result: Use an iframe with srcdoc or carefully use dangerouslySetInnerHTML (in React) or similar techniques to display the generated UI section live on the page. This provides immediate visual feedback.
Key Challenges & Focus Areas for the Hackathon:
Prompt Engineering: This will take the most iteration. How you phrase the request, structure the inputs, and specify the desired output format heavily influences the quality and consistency of the result. Experiment!
API Interaction: Handling image data, making the API calls correctly, and parsing the response reliably.
Output Quality: The generated code might be inconsistent, buggy, non-responsive, or not perfectly aligned with the brand guidelines. Focus on getting something working first, then refine the prompt.
Scope Management: Stick to the static HTML/CSS MVP. Don't get bogged down trying to implement animation, React export, or editing features initially unless you make very rapid progress on the core task.
  
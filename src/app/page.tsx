'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateProductDisplay} from '@/ai/flows/generate-product-display';
import {refinePrompt} from '@/ai/flows/refine-prompt';

export default function Home() {
  const [productImage, setProductImage] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#FFFFFF');
  const [secondaryColor, setSecondaryColor] = useState<string>('#E5E5E5');
  const [font, setFont] = useState<string>('Arial');
  const [textPrompt, setTextPrompt] = useState<string>('Generate a clean product display section');
  const [generatedHTML, setGeneratedHTML] = useState<string>('');
  const [generatedCSS, setGeneratedCSS] = useState<string>('');
  const [livePreview, setLivePreview] = useState<string>('');
  const [refinedPrompt, setRefinedPrompt] = useState<string>('');

  const handleGenerateCode = async () => {
    try {
      const result = await generateProductDisplay({
        productImage: productImage || 'https://picsum.photos/400/300', // default image
        primaryColor,
        secondaryColor,
        font,
        textPrompt,
      });
      setGeneratedHTML(result.html);
      setGeneratedCSS(result.css);
      setLivePreview(`
        <html>
          <head>
            <style>
              body { font-family: ${font}; color: ${primaryColor}; }
              ${result.css}
            </style>
          </head>
          <body>
            ${result.html}
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Code generation failed', error);
    }
  };

  const handleRefinePrompt = async () => {
    try {
      const result = await refinePrompt({prompt: textPrompt});
      setRefinedPrompt(result.refinedPrompt);
    } catch (error) {
      console.error('Prompt refinement failed', error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      {/* Input Section */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter the details for code generation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="productImage">Product Image URL</label>
              <Input
                type="text"
                id="productImage"
                placeholder="Enter image URL"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="primaryColor">Primary Color</label>
              <Input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="secondaryColor">Secondary Color</label>
              <Input
                type="color"
                id="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="font">Font</label>
              <Input
                type="text"
                id="font"
                placeholder="Enter font name"
                value={font}
                onChange={(e) => setFont(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="textPrompt">Text Prompt</label>
              <Textarea
                id="textPrompt"
                placeholder="Enter text prompt"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
              />
            </div>
            <Button onClick={handleGenerateCode}>Generate Code</Button>
            <Button variant="secondary" onClick={handleRefinePrompt}>Refine Prompt</Button>
            {refinedPrompt && <p>Refined Prompt: {refinedPrompt}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Code Display Section */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated HTML</CardTitle>
            <CardDescription>Review the generated HTML code</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea readOnly value={generatedHTML} className="min-h-[200px]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated CSS</CardTitle>
            <CardDescription>Review the generated CSS code</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea readOnly value={generatedCSS} className="min-h-[200px]" />
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Section */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See the generated code in action</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              srcDoc={livePreview}
              title="Live Preview"
              className="w-full h-[400px] border rounded"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

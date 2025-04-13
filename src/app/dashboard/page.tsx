'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateProductDisplay} from '@/ai/flows/generate-product-display';
import {refinePrompt} from '@/ai/flows/refine-prompt';
import {useRouter} from 'next/navigation';
import {Loader2} from 'lucide-react';

export default function Home() {
  const [productImage, setProductImage] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#FFFFFF');
  const [secondaryColor, setSecondaryColor] = useState<string>('#E5E5E5');
  const [font, setFont] = useState<string>('Arial');
  const [textPrompt, setTextPrompt] = useState<string>('Generate a clean product display section');
  const [refinedPrompt, setRefinedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const router = useRouter();

  const handleGenerateCode = async () => {
    setIsLoading(true); // Start loading
    try {
      const result = await generateProductDisplay({
        productImage: productImage || 'https://picsum.photos/400/300', // default image
        primaryColor,
        secondaryColor,
        font,
        textPrompt,
      });

      // Navigate to the results page with the generated code
      router.push(
        `/results?html=${encodeURIComponent(result.html)}&css=${encodeURIComponent(
          result.css
        )}&font=${encodeURIComponent(font)}&primaryColor=${encodeURIComponent(primaryColor)}`
      );
    } catch (error) {
      console.error('Code generation failed', error);
      // Handle error appropriately, maybe show an error message to the user
    } finally {
      setIsLoading(false); // End loading
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
            <Button disabled={isLoading} onClick={handleGenerateCode}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Code'
              )}
            </Button>
            <Button variant="secondary" onClick={handleRefinePrompt}>
              Refine Prompt
            </Button>
            {refinedPrompt && <p>Refined Prompt: {refinedPrompt}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

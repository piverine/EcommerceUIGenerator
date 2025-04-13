'use client';

import {useSearchParams} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const html = searchParams.get('html') || '';
  const css = searchParams.get('css') || '';
  const font = searchParams.get('font') || 'Arial';
  const primaryColor = searchParams.get('primaryColor') || '#000000';
  const javascript = searchParams.get('javascript') || '';

  const livePreview = `
    <html>
      <head>
        <style>
          body { font-family: ${font}; color: ${primaryColor}; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${javascript}
        </script>
      </body>
    </html>
  `;

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      {/* Code Display Section */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated HTML</CardTitle>
            <CardDescription>Review the generated HTML code</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea readOnly value={html} className="min-h-[200px]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated CSS</CardTitle>
            <CardDescription>Review the generated CSS code</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea readOnly value={css} className="min-h-[200px]" />
          </CardContent>
        </Card>

        {javascript && (
          <Card>
            <CardHeader>
              <CardTitle>Generated JavaScript</CardTitle>
              <CardDescription>Review the generated JavaScript code</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea readOnly value={javascript} className="min-h-[200px]" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Live Preview Section */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>See the generated code in action</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              srcDoc={livePreview}
              title="Live Preview"
              className="w-full h-[600px] border rounded"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


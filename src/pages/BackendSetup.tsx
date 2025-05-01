
import React from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BackendSetup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Backend Setup Instructions</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 prose max-w-none">
              <h2>Setting up the Supabase Edge Function for PDF Conversion</h2>
              
              <p>
                You're almost there! To enable the PDF conversion functionality, deploy the Edge Function 
                to your Supabase project. Here's how:
              </p>
              
              <h3>Step 1: Set up your local environment</h3>
              <p>
                First, install the Supabase CLI if you haven't already:
              </p>
              <pre>
                <code>
                  {`npm install -g supabase`}
                </code>
              </pre>
              
              <h3>Step 2: Create the Edge Function directory</h3>
              <pre>
                <code>
                  {`mkdir -p supabase/functions/convert-to-pdf
cd supabase/functions/convert-to-pdf`}
                </code>
              </pre>
              
              <h3>Step 3: Create the Edge Function file</h3>
              <p>
                Create a file named 'index.ts' in the convert-to-pdf directory with the following content:
              </p>
              
              <pre>
                <code>
                  {`// supabase/functions/convert-to-pdf/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFNet } from 'https://esm.sh/pdftron';
import * as multiparty from 'https://esm.sh/multiparty';

serve(async (req) => {
  try {
    // Enable CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
    
    // Handle multipart form data
    const formData = await req.formData();
    const files = [];
    
    // Extract files from form data
    for (const entry of formData.entries()) {
      if (entry[0].startsWith('file-')) {
        const file = entry[1];
        files.push({
          name: file.name,
          type: file.type,
          data: await file.arrayBuffer()
        });
      }
    }
    
    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files uploaded' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          } 
        }
      );
    }
    
    // Initialize PDFTron SDK with license key
    const pdftronLicense = Deno.env.get('PDFTRON_LICENSE_KEY');
    if (pdftronLicense) {
      await PDFNet.initialize(pdftronLicense);
    } else {
      await PDFNet.initialize();
    }
    
    // Create a new PDF document
    const doc = await PDFNet.PDFDoc.create();
    
    // Process each file and add to PDF
    for (const file of files) {
      // Convert based on file type
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        // Handle image conversion
        const image = await PDFNet.Image.createFromMemory(doc, file.data);
        const pageBuilder = await PDFNet.ElementBuilder.create();
        const pageWriter = await PDFNet.ElementWriter.create();
        const page = await doc.pageCreate();
        
        pageWriter.beginOnPage(page);
        pageBuilder.createImageFromMatrix(image, await PDFNet.Matrix2D.create(image.getImageWidth(), 0, 0, image.getImageHeight(), 0, 0));
        pageWriter.end();
        doc.pagePushBack(page);
      } else if (file.type === 'text/plain') {
        // Handle text conversion
        const pageBuilder = await PDFNet.ElementBuilder.create();
        const pageWriter = await PDFNet.ElementWriter.create();
        const page = await doc.pageCreate();
        
        pageWriter.beginOnPage(page);
        const textElement = await pageBuilder.createTextBegin(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_helvetica), 12);
        const textDecoder = new TextDecoder();
        const textContent = textDecoder.decode(file.data);
        textElement.textRun(textContent);
        pageWriter.end();
        doc.pagePushBack(page);
      } else {
        // For other formats like docx, xlsx, etc. use PDFTron's conversion utility
        const convertedDoc = await PDFNet.Convert.toPdf(doc, file.data, file.name);
        await doc.merge(convertedDoc);
      }
    }
    
    // Save the PDF
    const docBuffer = await doc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_linearized);
    
    // Return the PDF as response
    return new Response(docBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=converted-document.pdf',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('PDF conversion error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to convert to PDF', details: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        } 
      }
    );
  }
});`}
                </code>
              </pre>
              
              <h3>Step 4: Deploy the Edge Function</h3>
              <p>
                Now, deploy the function to your Supabase project:
              </p>
              <pre>
                <code>
                  {`supabase functions deploy convert-to-pdf --project-ref weqtpuyuizhoydheyheo`}
                </code>
              </pre>
              
              <h3>Step 5: Set Environment Variables (Optional for PDFTron license)</h3>
              <p>
                If you're using PDFTron with a license key, set it using:
              </p>
              <pre>
                <code>
                  {`supabase secrets set PDFTRON_LICENSE_KEY=your-license-key --project-ref weqtpuyuizhoydheyheo`}
                </code>
              </pre>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Note: The PDFTron SDK requires a license for commercial use. For simpler needs, you may consider using alternative libraries like pdf-lib or jsPDF.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3>Step 6: Test Your Edge Function</h3>
              <p>
                The frontend has been updated to use your Supabase project URL. Test the conversion by uploading files through the application.
              </p>
              
              <h3>Troubleshooting</h3>
              <ul>
                <li>Check the function logs in your Supabase dashboard under Functions > Logs</li>
                <li>Ensure CORS is properly configured (included in the function code above)</li>
                <li>Verify that the file formats you're trying to convert are supported</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => window.history.back()} variant="outline" className="mr-4">
                Go Back
              </Button>
              <a href="https://supabase.com/dashboard/project/weqtpuyuizhoydheyheo/functions" target="_blank" rel="noopener noreferrer">
                <Button className="bg-any2pdf-teal hover:bg-any2pdf-dark">
                  Go to Supabase Functions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BackendSetup;

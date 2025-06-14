import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY = process.env.CAT_API_KEY || '';

export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const subId = formData.get('sub_id');
    if (
      !file ||
      typeof (file as File).arrayBuffer !== 'function' ||
      !('name' in (file as File))
    ) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded or invalid file' }),
        { status: 400 }
      );
    }
    if (!subId || typeof subId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'No sub_id provided' }),
        { status: 400 }
      );
    }

    const fileAsFile = file as File;

    const outgoingFormData = new FormData();
    outgoingFormData.append('file', fileAsFile, fileAsFile.name);
    outgoingFormData.append('sub_id', subId);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: outgoingFormData,
    });

    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = `Upload failed: ${JSON.stringify(errorData)}`;
      } catch {
        errorMessage = `Upload failed`;
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500 }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 }
    );
  }
}

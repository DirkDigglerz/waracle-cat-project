import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY = process.env.CAT_API_KEY || '';

export type UploadResult =
  | { success: true; id: string; url: string }
  | { success: false; error: string };

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const subId = formData.get('sub_id');

    if (
      !file ||
      typeof (file as File).arrayBuffer !== 'function' ||
      !('name' in (file as File))
    ) {
      return respondError('No file uploaded or invalid file', 400);
    }

    if (!subId || typeof subId !== 'string') {
      return respondError('No sub_id provided', 400);
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
      const errorData = await safeJson(response);
      const message = errorData?.message ?? `Upload failed with status ${response.status}`;
      return respondError(message, 500);
    }

    const data = await response.json();
    const result: UploadResult = {
      success: true,
      id: data.id,
      url: data.url ?? '', // you may adjust this if your API returns `image.url`
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return respondError(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

// Helpers

function respondError(error: string, status = 500): Response {
  const result: UploadResult = { success: false, error };
  return new Response(JSON.stringify(result), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function safeJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

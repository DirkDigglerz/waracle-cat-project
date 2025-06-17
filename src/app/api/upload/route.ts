import { UploadResult } from '@/types';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const API_BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY = process.env.CAT_API_KEY || '';

// Zod schemas
const FormDataSchema = z.object({
  file: z.instanceof(File),
  sub_id: z.string().min(1, 'sub_id cannot be empty'),
});

const CatApiErrorSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

const CatApiSuccessSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const formData = await req.formData();
    
    // Parse and validate form data
    const formDataResult = FormDataSchema.safeParse({
      file: formData.get('file'),
      sub_id: formData.get('sub_id'),
    });

    if (!formDataResult.success) {
      const errorMessage = formDataResult.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      return respondError(`Invalid form data: ${errorMessage}`, 400);
    }

    const { file, sub_id } = formDataResult.data;

    const outgoingFormData = new FormData();
    outgoingFormData.append('file', file, file.name);
    outgoingFormData.append('sub_id', sub_id);

    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: outgoingFormData,
    });

    if (!response.ok) {
      const errorData = await safeJson(response, CatApiErrorSchema);
      const message = errorData?.message || errorData?.error || `Upload failed with status ${response.status}`;
      return respondError(message, 500);
    }

    const data = await safeJson(response, CatApiSuccessSchema);
    if (!data) {
      return respondError('Invalid response format from Cat API', 500);
    }

    const result: UploadResult = {
      success: true,
      id: data.id,
      url: data.url ?? '',
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

async function safeJson<T>(
  response: Response, 
  schema: z.ZodSchema<T>
): Promise<T | null> {
  try {
    const json = await response.json();
    const result = schema.safeParse(json);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
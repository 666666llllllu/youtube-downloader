export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): Response {
  if (error instanceof APIError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        code: error.code
      }),
      {
        status: error.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: 'Internal Server Error'
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
} 
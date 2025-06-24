const allowedOrigins = [
    'http://localhost:3000',
    'https://forum-web-seven.vercel.app'
];

export function getCorsHeaders(request: Request): HeadersInit {
    const origin = request.headers.get('origin');
    
    return {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin ?? '') ? origin! : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };
} 
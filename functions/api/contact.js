// Contact form functionality has been replaced with a simple mailto button
// This endpoint is kept for backwards compatibility but is no longer used

export async function onRequestPost() {
    return new Response(JSON.stringify({
        success: true,
        message: 'Contact form has been simplified. Please use the "Connect with Me" button on the contact page.'
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

// Handle CORS preflight requests
export async function onRequestOptions() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

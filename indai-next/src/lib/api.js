export const getApiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
};

export async function fetchWithAuth(endpoint, options = {}) {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    let token = localStorage.getItem('access_token');
    
    // Set headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized (Token might be expired)
    if (response.status === 401 && token) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                // Try to refresh the token
                const refreshRes = await fetch(`${baseUrl}/token/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken })
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('access_token', data.access);
                    // Update refresh token if returned (django-ninja-jwt sometimes rotates them)
                    if (data.refresh) {
                        localStorage.setItem('refresh_token', data.refresh);
                    }
                    
                    // Retry original request
                    headers['Authorization'] = `Bearer ${data.access}`;
                    response = await fetch(url, { ...options, headers });
                    return response;
                }
            } catch (error) {
                console.error("Token refresh failed", error);
            }
        }
        
        // If refresh fails or no refresh token, log out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/'; // Redirect to login
        return response; // Return the 401 response
    }

    return response;
}

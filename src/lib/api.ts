// When deployed, the frontend and backend are on the same origin. 
// If VITE_API_URL isn't set, we fall back to an empty string to use relative paths (e.g. /api/products)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchProducts() {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function fetchProductById(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

export async function createOrder(order: any) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
}

export async function fetchOrders() {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
}

export async function updateOrderStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
}

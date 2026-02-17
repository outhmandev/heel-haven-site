export async function fetchProducts() {
    const response = await fetch('http://localhost:3000/api/products');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function fetchProductById(id: string) {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

export async function createOrder(order: any) {
    const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
}

export async function fetchOrders() {
    const response = await fetch('http://localhost:3000/api/orders');
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
}

export async function updateOrderStatus(id: string, status: string) {
    const response = await fetch(`http://localhost:3000/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
}

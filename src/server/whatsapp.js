const axios = require('axios');

async function sendWhatsApp(phone, name, address, items, orderId) {
    // Ensure phone number starts with country code, Facebook requires standard international format (e.g. 212... for Morocco)
    // If it starts with '0', assume it's a local number and this is specific to your region. You might need to adjust this.
    // For now, we just pass the number but strip any '+' character.
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    let itemsString = items;
    // Format items if it's an array
    if (Array.isArray(items)) {
        itemsString = items.map(item => `${item.quantity || 1}x ${item.name || 'Item'}`).join(', ');
    } else if (typeof items === 'string') {
        try {
            const parsed = JSON.parse(items);
            if (Array.isArray(parsed)) {
                itemsString = parsed.map(item => `${item.quantity || 1}x ${item.name || 'Item'}`).join(', ');
            }
        } catch (e) { /* ignore parse error, use original string */ }
    }

    try {
        await axios.post(
            "https://graph.facebook.com/v22.0/1051793444677747/messages",
            {
                messaging_product: "whatsapp",
                to: cleanPhone,
                type: "text",
                text: {
                    body:
                        `Hello 👋 We Are X Store.

We just want to confirm your order:

Order ID: ${orderId}
Product: ${itemsString}
Name: ${name}
Address: ${address}

Reply YES to confirm.`
                }
            },
            {
                headers: {
                    Authorization: `Bearer EAANOOLubmSoBQw5d5TmMqeItu3tZBGZCVdqDfKMtAZCl6Uu7TrGjHkBPtULi1IXCDOg4UYvsixs93KmoJrkkT4ROsuZBGuWpheFT4JMWeBYnrCoXSXOg9lMd93uUtrN83au6BUGElZCnh4bg4KHskl4KYWnfntjyZBs4Hcuvr9gQS4B3A2F0efy70cVFe22lHVXjfIAgMuoHZC1ilL121ZAzXcz2eiJvf9DrgZAbCP1Y2v9epRmVlxUeiobqnV04OLf5LQyZAlY0IeDGH4m8SkrbFH7nmc`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`[WhatsApp] Sent confirmation request to ${cleanPhone}`);
    } catch (error) {
        console.error('[WhatsApp] Failed to send message:', error?.response?.data || error.message);
    }
}

module.exports = sendWhatsApp;
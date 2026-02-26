module.exports = function (app, pool) {
    app.post('/webhook', async (req, res) => {
        // WhatsApp verification challenge
        if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token']) {
            // For simplicity, we currently accept any token, but you should validate it against a secret
            return res.send(req.query['hub.challenge']);
        }

        const message =
            req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!message) return res.sendStatus(200);

        // Extract phone number from WhatsApp message
        // Usually, WhatsApp numbers in API come with country code but no '+' initially
        let phone = message.from;

        // Remove non-digit characters to standardize phone number for searching
        const cleanPhone = phone.replace(/\D/g, '');

        if (!message.text || !message.text.body) return res.sendStatus(200);

        const text = message.text.body.toLowerCase();

        if (
            text.includes("yes") ||
            text.includes("ok") ||
            text.includes("confirm") ||
            text.includes("sure")
        ) {
            try {
                // Find all pending orders with a phone number matching the incoming WhatsApp number
                // using a LIKE query because the saved phone might have '+', spaces or hyphens.
                const query = `
                    UPDATE orders 
                    SET status = 'confirmed' 
                    WHERE status = 'pending' 
                    AND REPLACE(REPLACE(REPLACE(shipping_phone, '+', ''), '-', ''), ' ', '') LIKE ?
                `;

                // Allow matches where the DB phone number ends with the incoming phone number or vice-versa
                const [result] = await pool.query(query, [`%${cleanPhone}%`]);

                if (result.affectedRows > 0) {
                    console.log(`[Webhook] Confirmed ${result.affectedRows} order(s) for phone: ${phone}`);
                } else {
                    console.log(`[Webhook] Received confirmation from ${phone} but found no matching pending orders.`);
                }
            } catch (error) {
                console.error('[Webhook] Error updating order status:', error);
            }
        }

        res.sendStatus(200);
    });
};
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, phone, address, scanLocation } = JSON.parse(event.body);
        
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        // Використовуємо HTML-теги <b> для жирного шрифту, додаючи місце сканування
        const message = `<b>🌐 Нова заявка на інтернет!</b>\n\n<b>📍 Місце сканування:</b> ${scanLocation || 'Не вказано'}\n<b>👤 Ім'я:</b> ${name}\n<b>📞 Телефон:</b> ${phone}\n<b>🏠 Адреса підключення:</b> ${address}`;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML' // Режим розмітки HTML
            })
        });

        const data = await response.json();

        if (data.ok) {
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        } else {
            return { statusCode: 400, body: JSON.stringify({ success: false, error: data }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

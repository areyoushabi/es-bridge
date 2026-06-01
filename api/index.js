export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('只接受 POST 请求');
    }

    const data = req.body;
    
    // 从 EspoCRM Webhook 中提取信息
    // 假设我们要提取关联账户的名称和邮箱
    const clientName = data.accountName || "新客户";
    const clientEmail = data.accountEmailAddress || "";

    const INVOICE_NINJA_URL = process.env.IN_URL; // 在 Vercel 后台配置
    const INVOICE_NINJA_TOKEN = process.env.IN_TOKEN; // 在 Vercel 后台配置

    try {
        const response = await fetch(`${INVOICE_NINJA_URL}/api/v1/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Token': INVOICE_NINJA_TOKEN,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                name: clientName,
                contacts: [{ email: clientEmail }]
            })
        });

        const result = await response.json();
        return res.status(200).json({ success: true, info: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

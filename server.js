const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// صفحة المتجر الرئيسية مع الاسم الدقيق للملف
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار فحص استجابة ترينديول وتشخيص البيانات
app.get('/api/sync-trendyol', async (req, res) => {
    try {
        const SUPPLIER_ID = '741732';
        const API_KEY = 'ty_live_tekstilla_key_9921';
        const API_SECRET = 'CLQskLixwxTAhiC7msS5';

        const credentials = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

        const response = await fetch(`https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}/products?approved=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'User-Agent': `${SUPPLIER_ID} - SelfIntegration`,
                'Accept': 'application/json'
            }
        });

        const responseText = await response.text();

        res.status(200).json({
            status: response.status,
            ok: response.ok,
            raw_response: responseText.substring(0, 500)
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

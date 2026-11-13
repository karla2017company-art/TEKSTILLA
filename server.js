const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار سحب المنتجات مع ترويسات متصفح حقيقية لتجاوز حماية Cloudflare
app.get('/api/sync-trendyol', async (req, res) => {
    try {
        const SUPPLIER_ID = '741732';
        const API_KEY = 'ty_live_tekstilla_key_9921';
        const API_SECRET = 'CLQskLixwxTAhiC7msS5';

        const credentials = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

        // طلب جلب المنتجات مع ترويسات متصفح كاملة
        const response = await fetch(`https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}/products?approved=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive'
            }
        });

        const responseText = await response.text();

        // محاولة تحويل الاستجابة إلى JSON إذا نجح العبور
        try {
            const data = JSON.parse(responseText);
            if (!response.ok) {
                return res.status(response.status).json({ success: false, error: data });
            }
            const productsList = data.content || data.products || [];
            return res.status(200).json({
                success: true,
                message: 'تم سحب المنتجات من ترينديول بنجاح!',
                productsCount: productsList.length,
                products: productsList
            });
        } catch (e) {
            // لو ما زالت الصفحة HTML تظهر، سنطبيها لنرى تفاصيلها
            return res.status(200).json({
                success: false,
                message: 'ما زالت حماية Cloudflare تحظر الطلب مباشرة',
                raw_html: responseText.substring(0, 300)
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

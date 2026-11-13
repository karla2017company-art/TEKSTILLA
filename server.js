const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار سحب المنتجات باستخدام الـ Token الرسمي المباشر لمتجر TEKSTİLLA
app.get('/api/sync-trendyol', async (req, res) => {
    try {
        const SUPPLIER_ID = '741732';
        const AUTH_TOKEN = 'TVNqUzFDOTJlZm9NVW9LZW9vRVc6Q0xRc2tMaXh3eFRBaGlDN21zUzU=';

        const response = await fetch(`https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}/products?approved=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'User-Agent': `${SUPRLIER_ID} - SelfIntegration`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const responseText = await response.text();

        try {
            const data = JSON.parse(responseText);
            if (!response.ok) {
                return res.status(response.status).json({ success: false, error: data });
            }
            const productsList = data.content || data.products || [];
            return res.status(200).json({
                success: true,
                message: 'تم سحب جميع منتجات TEKSTİLLA من ترينديول بنجاح!',
                productsCount: productsList.length,
                products: productsList
            });
        } catch (e) {
            return res.status(200).json({
                success: false,
                message: 'استجابة غير صالحة من ترينديول',
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

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار سحب المنتجات من ترينديول مع دعم معاملات الاستعلام
app.get('/api/sync-trendyol', async (req, res) => {
    try {
        const SUPPLIER_ID = '741732';
        const API_KEY = 'ty_live_tekstilla_key_9921';
        const API_SECRET = 'CLQskLixwxTAhiC7msS5';

        const credentials = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

        // طلب جلب المنتجات من ترينديول (مرفق معها معاملات لضمان جلب المنتجات الموافق عليها)
        const response = await fetch(`https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}/products?approved=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'User-Agent': `${SUPPLIER_ID} - SelfIntegration`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: 'فشل جلب المنتجات من ترينديول',
                error: data
            });
        }

        // استخراج المنتجات بناءً على هيكلية استجابة ترينديول
        const productsList = data.content || data.products || [];

        res.status(200).json({
            success: true,
            message: 'تم سحب المنتجات من ترينديول بنجاح!',
            productsCount: productsList.length,
            products: productsList
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

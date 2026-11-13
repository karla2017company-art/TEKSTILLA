const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// صفحة المتجر الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tekstilla_kad_n_giyim.html'));
});

// 📌 مسار جلب ومزامنة المنتجات من Trendyol تلقائياً
app.get('/api/sync-trendyol', async (req, res) => {
    try {
        const SUPPLIER_ID = '741732';
        const API_KEY = 'ty_live_tekstilla_key_9921';
        const API_SECRET = 'CLQskLixwxTAhiC7msS5';

        // ترميز بيانات الاعتماد بطريقة Basic Auth الخاصة بـ Trendyol
        const credentials = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

        // طلب جلب المنتجات من واجهة ترينديول للموردين
        const response = await fetch(`https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'User-Agent': `${SUPPLIER_ID} - SelfIntegration`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'فشل الاتصال بمنصة Trendyol');
        }

        res.status(200).json({
            success: true,
            message: 'تم سحب المنتجات من ترينديول بنجاح!',
            productsCount: data.content ? data.content.length : 0,
            products: data.content || []
        });

    } catch (error) {
        console.error('Trendyol Sync Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

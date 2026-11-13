const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// صفحة المتجر الرئيسية (تأكد أن اسم ملف الـ HTML لديك يطابق هذا الاسم تماماً)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار جلب ومزامنة المنتجات من Trendyol مع كشف الأخطاء المفصلة
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

        // إذا رفض ترينديول الطلب، سنطبع السبب بالتفصيل لنعرف المشكلة فوراً
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: 'رفضت منصة Trendyol الطلب، والسبب بالتفصيل:',
                trendyol_error: data
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم سحب المنتجات من ترينديول بنجاح!',
            productsCount: data.content ? data.content.length : 0,
            products: data.content || []
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

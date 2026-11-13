const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار سحب المنتجات مع تجاوز حماية Cloudflare عبر ترويسات متصفح كاملة
app.get('/api/sync-trendyol', async (req, res) => {
    try {
        const SUPPLIER_ID = '741732';
        const AUTH_TOKEN = 'TVNqUzFDOTJlZm9NVW9LZW9vRVc6Q0xRc2tMaXh3eFRBaGlDN21zUzU=';

        // استخدام بروكسي وسيط أو ترويسات خداع للبوتات
        const response = await fetch(`https://api.trendyol.com/sapigw/suppliers/${SUPPLIER_ID}/products?approved=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
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
            // في حال الاستمرار بالحجب، سنستخدم وسيط بديل أو نعرض الرابط المباشر
            return res.status(200).json({
                success: false,
                message: 'ما زالت خوادم Cloudflare تحظر السيرفر السحابي المباشر',
                solution: 'يمكنك استخدام جلب المنتجات عبر لوحة تحكم المتجر بملف CSV أو ربطها عبر Webhook مباشرة.',
                raw_preview: responseText.substring(0, 150)
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

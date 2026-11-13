const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// صفحة المتجر الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'teksti_lla_kad_n_giyim.html'));
});

// 📌 مسار جلب المنتجات المحلية المعروضة على المتجر
app.get('/api/products', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'products.json');
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const products = JSON.parse(rawData);
            res.status(200).json({ success: true, products });
        } else {
            res.status(200).json({ success: true, products: [] });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

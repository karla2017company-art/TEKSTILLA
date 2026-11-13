const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// السماح بقراءة الملفات الثابتة
app.use(express.static(path.join(__dirname)));

// توجيه الصفحة الرئيسية لملف المتجر الأساسي
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tekstilla_kad_n_giyim.html'));
});

app.listen(PORT, () => {
    console.log(`TEKSTİLLA Server is running on port ${PORT}`);
});

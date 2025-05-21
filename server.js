
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Atlas bağlantısı
mongoose.connect('mongodb+srv://tabartstore:Ky7sj3PypFuYb6GP@cluster0.rkw1tzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const Product = mongoose.model('Product', new mongoose.Schema({
  baslik: String,
  aciklama: String,
  fiyat: Number,
  indirimliFiyat: Number,
  kategori: String,
  gorselUrl: String,
  stok: Number,
  marka: String,
  saticiId: String
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  siparisNo: String,
  musteri: String,
  urun: String,
  tutar: Number,
  tarih: String,
  kargoFirmasi: String,
  takipNo: String
}));

const Seller = mongoose.model('Seller', new mongoose.Schema({
  adSoyad: String,
  email: String,
  iban: String,
  vergiNo: String,
  telefon: String,
  girisZamani: Date
}));

app.post('/api/upload', upload.single('gorsel'), (req, res) => {
  const dosyaYolu = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
  res.json({ url: dosyaYolu });
});

app.post('/api/urun-ekle', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json({ mesaj: 'Ürün kaydedildi' });
});

app.post('/api/siparis-ekle', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).json({ mesaj: 'Sipariş kaydedildi' });
});

app.post('/api/profil-guncelle', async (req, res) => {
  const seller = new Seller(req.body);
  await seller.save();
  res.status(201).json({ mesaj: 'Profil kaydedildi' });
});

app.get('/api/urunler', async (req, res) => {
  const urunler = await Product.find();
  res.json(urunler);
});

app.get('/api/siparisler', async (req, res) => {
  const siparisler = await Order.find();
  res.json(siparisler);
});

app.get('/api/profiller', async (req, res) => {
  const profiller = await Seller.find();
  res.json(profiller);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Tabart API sunucusu çalışıyor: http://localhost:${PORT}`);
});

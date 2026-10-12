# AI Screenshot & Visual Organizer

[**🇬🇧 English Description**](#english) | [**🇹🇷 Türkçe Açıklama**](#türkçe)

<a id="english"></a>

## 🇬🇧 English

### About the Project

AI Screenshot & Visual Organizer is a web application that helps you organize your screenshots and images.

You can upload your images, and an AI model will predict their categories. The application then groups them into folders, so you can find your images more easily.

I built this project to learn more about machine learning and how to use an AI model in a real web application.

### Features

- **Bulk Upload:** Upload up to 15 images at once.
- **AI Image Classification:** Use a deep learning model to predict image categories.
- **Category Filtering:** View your images by category.
- **ZIP Download:** Download your organized images in a ZIP file with separate folders.
- **No Login Required:** Use the application without creating an account.
- **Simple Design:** Organize your images with a clean and easy-to-use interface.

### Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **UI & File Tools:** Lucide Icons, JSZip, File-Saver
- **Backend:** Python, FastAPI
- **Machine Learning:** PyTorch, MobileNetV2
- **Other Tools:** SlowAPI for rate limiting

### Machine Learning

I trained a MobileNetV2 model using the *Ecommerce Product Images* dataset from Kaggle.

The model predicts image categories, and the backend maps these predictions to larger groups, such as Shopping & Products, Home & Living, Tech & Electronics, and Work & Stationery.

The model is still a baseline version. It was trained on product images, so it may not work well with every type of screenshot.

The training, data analysis, and model evaluation code are available in a separate repository:

➡️ [AI Screenshot Organizer ML](https://github.com/busraknya/ai-screenshot-organizer-ml)

### Current Limitations

- The model may make incorrect predictions.
- Real-world screenshots can be different from the images in the training dataset.
- OCR and vision-language models may help improve results in future versions.

### Privacy

The application does not require an account or a permanent database.

Uploaded images are processed during the active session. However, this does not mean that the application is automatically secure in every deployment. Data handling also depends on the server and its configuration.

### Installation

#### 1. Backend Setup

Open a terminal and go to the backend folder:

```bash
cd screenshot-organizer-backend
uv venv
source .venv/bin/activate
uv pip install fastapi "uvicorn[standard]" torch torchvision pillow python-multipart pydantic slowapi
```

Place the trained `saved_model.pth` file in the backend root directory.

Start the backend:

```bash
uvicorn main:app --reload
```

#### 2. Frontend Setup

Open another terminal and go to the frontend folder:

```bash
cd screenshot-organizer-frontend
npm install
npm run dev
```

Follow the local URL shown in the terminal to open the application.

---

<a id="türkçe"></a>

## 🇹🇷 Türkçe

### Proje Hakkında

AI Screenshot & Visual Organizer, ekran görüntülerini ve diğer görselleri düzenlemeyi kolaylaştıran bir web uygulamasıdır.

Görsellerini yüklediğinde yapay zeka modeli bunların kategorilerini tahmin eder. Uygulama da görselleri ilgili klasör gruplarına ayırır. Böylece aradığın görselleri bulman kolaylaşır.

Bu projeyi, makine öğrenmesi hakkında daha fazla şey öğrenmek ve eğittiğim bir modeli gerçek bir web uygulamasında kullanmak için geliştirdim.

### Özellikler

- **Toplu Yükleme:** Aynı anda 15 adede kadar görsel yükleyebilirsin.
- **Yapay Zeka ile Sınıflandırma:** Derin öğrenme modeli görsellerin kategorilerini tahmin eder.
- **Kategori Filtreleme:** Görselleri kategorilerine göre görüntüleyebilirsin.
- **ZIP İndirme:** Düzenlenen görselleri ayrı klasörler içeren bir ZIP dosyası olarak indirebilirsin.
- **Üyelik Gerektirmez:** Hesap oluşturmadan kullanabilirsin.
- **Sade Arayüz:** Görsellerini kolayca düzenleyebilirsin.

### Kullanılan Teknolojiler

- **Frontend:** React, TypeScript, Tailwind CSS
- **Arayüz ve Dosya İşlemleri:** Lucide Icons, JSZip, File-Saver
- **Backend:** Python, FastAPI
- **Makine Öğrenmesi:** PyTorch, MobileNetV2
- **Diğer Araçlar:** İstek sınırlandırma için SlowAPI

### Makine Öğrenmesi

MobileNetV2 modelini Kaggle'daki *Ecommerce Product Images* veri setini kullanarak eğittim.

Model, görsellerin kategorilerini tahmin eder. Backend tarafında bu tahminler Shopping & Products, Home & Living, Tech & Electronics ve Work & Stationery gibi daha geniş gruplara eşleştirilir.

Model şu an başlangıç seviyesinde bir sürümdür. Ürün fotoğraflarıyla eğitildiği için her tür ekran görüntüsünde doğru sonuç vermeyebilir.

Modelin eğitimi, veri analizi ve değerlendirme kodlarına ayrı depodan ulaşabilirsin:

➡️ [AI Screenshot Organizer ML](https://github.com/busraknya/ai-screenshot-organizer-ml)

### Mevcut Sınırlılıklar

- Model bazı görselleri yanlış sınıflandırabilir.
- Gerçek hayattaki ekran görüntüleri, eğitim veri setindeki görsellerden farklı olabilir.
- Gelecek sürümlerde OCR ve görsel-dil modelleri kullanılarak sonuçlar iyileştirilebilir.

### Gizlilik

Uygulama üyelik veya kalıcı bir veritabanı gerektirmez.

Yüklenen görseller aktif oturum sırasında işlenir. Ancak bu durum, uygulamanın her sunucu ortamında otomatik olarak tamamen güvenli olduğu anlamına gelmez. Verilerin nasıl işlendiği sunucuya ve yapılandırmasına da bağlıdır.

### Kurulum ve Çalıştırma

#### 1. Backend Kurulumu

Terminali aç ve backend klasörüne git:

```bash
cd screenshot-organizer-backend
uv venv
source .venv/bin/activate
uv pip install fastapi "uvicorn[standard]" torch torchvision pillow python-multipart pydantic slowapi
```

Eğittiğin `saved_model.pth` dosyasını backend ana dizinine yerleştir.

Backend'i başlat:

```bash
uvicorn main:app --reload
```

#### 2. Frontend Kurulumu

Yeni bir terminal aç ve frontend klasörüne git:

```bash
cd screenshot-organizer-frontend
npm install
npm run dev
```

Uygulamayı açmak için terminalde gösterilen yerel adresi kullan.

---

**Geliştirme amacı:** Bu proje, makine öğrenmesi modelini bir web uygulamasına entegre etme, model tahminlerini kullanma ve frontend ile backend arasında bağlantı kurma konularında pratik yapmak amacıyla geliştirilmiştir.
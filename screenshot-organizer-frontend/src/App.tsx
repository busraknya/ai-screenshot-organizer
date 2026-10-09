import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Folder, Trash2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface OrganizedItem {
  id: number;
  filename: string;
  imageUrl: string;
  category: string;
  confidence: number;
  userFolder: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<OrganizedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newItem: OrganizedItem = {
        id: Date.now(),
        filename: response.data.filename,
        imageUrl: previewUrl || '',
        category: response.data.predicted_category,
        confidence: response.data.confidence,
        userFolder: response.data.predicted_category,
      };

      setItems([newItem, ...items]);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError('AI analizi sırasında bir hata oluştu. FastAPI backend çalışıyor mu?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleFolderChange = (id: number, newFolder: string) => {
    setItems(items.map(item => item.id === id ? { ...item, userFolder: newFolder } : item));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 py-4 px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            🧠 AI Screenshot & Visual Organizer
          </h1>
          <span className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100">
            FastAPI + PyTorch + React (TS)
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" /> Görsel / Ekran Görüntüsü Yükle
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <label className="w-full md:w-2/3 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50/50 flex flex-col items-center justify-center">
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
              {previewUrl ? (
                <img src={previewUrl} alt="Önizleme" className="h-32 object-contain rounded-lg shadow-sm" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600">Dosya seçmek için tıklayın veya sürükleyin</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>
                </>
              )}
            </label>

            <div className="w-full md:w-1/3 flex flex-col justify-center gap-3">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 shadow-sm ${
                  !selectedFile || loading
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> AI Analiz Ediyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Yükle ve Analiz Et
                  </>
                )}
              </button>
              {selectedFile && (
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="text-xs text-slate-500 hover:text-red-600 text-center"
                >
                  Seçimi İptal Et
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Folder className="w-6 h-6 text-indigo-600" /> Organize Edilen Görseller ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Henüz bir görsel yüklenmedi. Yukarıdan bir ekran görüntüsü yükleyerek AI organizasyonunu başlatın!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="h-48 bg-slate-100 overflow-hidden relative flex items-center justify-center">
                      <img src={item.imageUrl} alt={item.filename} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        Güven: %{(item.confidence * 100).toFixed(1)}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                          AI: {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mb-4" title={item.filename}>
                        Dosya: {item.filename}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600">Klasör:</span>
                        <select
                          value={item.userFolder}
                          onChange={(e) => handleFolderChange(item.id, e.target.value)}
                          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:outline-none focus:border-indigo-500"
                        >
                          <option value="BABY_PRODUCTS">Baby Products</option>
                          <option value="BEAUTY_HEALTH">Beauty & Health</option>
                          <option value="CLOTHING_ACCESSORIES_JEWELLERY">Clothing & Jewelry</option>
                          <option value="ELECTRONICS">Electronics</option>
                          <option value="GROCERY">Grocery</option>
                          <option value="HOBBY_ARTS_STATIONERY">Hobby & Stationery</option>
                          <option value="HOME_KITCHEN_TOOLS">Home & Kitchen</option>
                          <option value="PET_SUPPLIES">Pet Supplies</option>
                          <option value="SPORTS_OUTDOOR">Sports & Outdoor</option>
                          <option value="Diger / Arsiv">Diğer / Arşiv</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
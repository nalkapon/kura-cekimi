# ⚽ Şampiyonlar Ligi Kura ve Eğlence Merkezi

Bu proje, UEFA Şampiyonlar Ligi formatını baz alarak geliştirilmiş, tamamen şans ve algoritmaya dayalı bir **kura çekimi ve etkinlik simülatörüdür.**

## 🚀 Özellikler

*   **UEFA Kura Simülasyonu:** Güncel takım katsayıları ve torba mantığına göre adil kura çekimi.
*   **Halı Saha Takım Kurucu:** Arkadaş grupları için yıldız (güç) dengeli, otomatik takım dağıtıcı.
*   **Kazı-Kazan:** HTML5 Canvas teknolojisi ile özelleştirilebilir şans kartları.
*   **Vampir Köylü:** Arkadaş grupları için otomatik rol dağıtımı yapan, gece/gündüz döngülü gizemli oyun.
*   **Eğlence Araçları:** Çarkıfelek, zar atma ve daha fazlası.

## 🎨 Tasarım Dili
* Karanlık Mod (Dark Theme)
* Glassmorphism (Şeffaf kartlar)
* Neon Vurgular

## 🛠️ Teknolojiler
* HTML5 / CSS3 (Responsive Design)
* Modern JavaScript (ES6+)
* HTML5 Canvas API

---
*Geliştirici: nalkapon*

## 🚀 Hızlı Yayın (Render)

Aşağıdaki adımlar ile projeyi Render üzerinde kolayca yayınlayabilirsiniz:

1. GitHub hesabınızla https://render.com adresine giriş yapın ve `New` → `Web Service` ile backend için, `Static Site` ile frontend için yeni hizmet oluşturun.
2. Repoyu bağlayın (`nalkapon/kura-cekimi`).
3. `render.yaml` dosyası otomatik olarak hizmetleri oluşturabilir; yoksa manuel olarak aşağıdaki ayarları kullanın:
	- Backend (Web Service): Root = `backend`, Build: `npm install`, Start: `npm start`, Env var `ALLOWED_ORIGIN` = frontend URL
	- Frontend (Static Site): Root = `frontend`, Build: `npm install && npm run build`, Publish directory = `frontend/dist`, Env var `VITE_API_BASE` = backend URL
4. Backend URL hazır olduktan sonra `VITE_API_BASE` ve `ALLOWED_ORIGIN` ortam değişkenlerini Render panelinden ayarlayın.

Bu depoya yaptığım değişiklikleri commit edip GitHub'a pushladım; isterseniz ben Render tarafındaki adımları da sizin adınıza yürütme konusunda rehberlik edebilirim (Render hesabı erişimi gerektirir).

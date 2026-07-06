Şampiyonlar Ligi'nin yeni 36 takımlı "İsviçre Sistemi" için yazacağın algoritmanın çekirdeğini oluşturacak güncel kura kuralları şunlardır. Bunları doğrudan kodunun kısıtlama (logic) kuralları olarak kullanabilirsin:

1. Temel Yapı Kuralları
36 Takım: Lig aşamasında toplam 36 takım bulunur.

4 Torba (Pot): Takımlar, UEFA puanlarına göre her birinde tam 9 takım olacak şekilde 4 torbaya (Pot 1, Pot 2, Pot 3, Pot 4) ayrılır.

2. Rakip Seçimi ve Dağılım Kuralı
8 Maç Şartı: Seçilen her takım tam olarak 8 farklı rakiple eşleşmek zorundadır.

Her Torbadan 2 Rakip: Bir takım; 1., 2., 3. ve 4. torbaların her birinden tam olarak ikişer takımla eşleşir. (Not: Takımın kendisi hangi torbada olursa olsun, kendi torbasından da 2 takım çeker).

3. İç Saha (Home) / Deplasman (Away) Kuralı
4 İç, 4 Dış Saha: Her takımın 8 maçının 4'ü evinde, 4'ü deplasmanda olmalıdır.

Torba Başına Dağılım: Bir takımın her torbadan çektiği 2 rakibin biriyle içeride (Home), diğeriyle deplasmanda (Away) oynaması zorunludur. (Örn: Pot 1'den iki rakip çekildi; biri Home, diğeri Away olmak zorunda).

4. Ülke Koruması (Country Protection) Kuralı
Aynı Ülke Yasağı: Hiçbir takım, kendi ülkesinden (federasyonundan) başka bir takımla eşleşemez. (Örn: İngiltere bayrağına sahip bir takım, rakipleri arasına başka bir İngiliz takımını alamaz).

5. Maksimum Ülke Kotası (Max 2 Kuralı)
Yabancı Ülke Sınırı: Bir takım, başka bir ülkenin liginden en fazla iki takımla eşleşebilir. (Örn: Galatasaray'a Alman liginden Bayern Münih ve Dortmund rakip çıktıysa, 3. bir Alman takımı olan Leipzig Galatasaray'a rakip olarak atanamaz).

💻 Algoritma İçin Kritik "Görünmez" Kural (Simetri)
Kura gerçekte manuel çekilse de, algoritma yazarken sistemin çökmemesi için şu kuralı kodlamayı unutmamalısın:

Çift Yönlü Atama (Symmetry): Eğer algoritma A takımına evinde oynamak üzere B takımını rakip olarak atarsa; B takımının "rakipler listesine" de A takımı deplasmanda oynanacak şekilde anında eklenmelidir. İki takımın rakip listesi senkronize ilerlemelidir.
import { swissSystemDraw } from '../lib/draw';
import { TEAMS_36 } from '../data/teams';

/**
 * Draw API — Tarayıcıda çalışan kura
 * Backend bağımlılığı yok; hepsi pure JavaScript
 */
export const drawAPI = {
  swiss: async () => {
    // Künstliche gecikme — UI'da "yükleniyor" gösterebilmek için
    await new Promise((resolve) => setTimeout(resolve, 500));
    return swissSystemDraw(TEAMS_36);
  },
  getResult: async () => {
    // Eğer daha önceki sonucu saklıyorsanız, localStorage'dan döndürün
    const stored = localStorage.getItem('lastDrawResult');
    if (stored) {
      return JSON.parse(stored);
    }
    throw new Error('Henüz kura çekilmedi');
  },
};

export default drawAPI;

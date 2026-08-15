import { swissSystemDraw } from '../lib/draw';
import { TEAMS_36 } from '../data/teams';
import { TEAMS_UEFA } from '../data/teams_uefa';

/**
 * Draw API — Tarayıcıda çalışan kura
 * Backend bağımlılığı yok; hepsi pure JavaScript
 */
export const drawAPI = {
  swiss: async (competitionSlug: string = 'sampiyonlar-ligi') => {
    // Künstliche gecikme — UI'da "yükleniyor" gösterebilmek için
    await new Promise((resolve) => setTimeout(resolve, 500));
    const teams = competitionSlug === 'uefa-ligi' ? TEAMS_UEFA : TEAMS_36;
    return swissSystemDraw(teams);
  },
  getResult: async (competitionSlug: string = 'sampiyonlar-ligi') => {
    // Eğer daha önceki sonucu saklıyorsanız, localStorage'dan döndürün
    const stored = localStorage.getItem(`lastDrawResult_${competitionSlug}`);
    if (stored) {
      return JSON.parse(stored);
    }
    throw new Error('Henüz kura çekilmedi');
  },
};

export default drawAPI;
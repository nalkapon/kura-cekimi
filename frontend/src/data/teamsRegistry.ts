import { TEAMS_36 } from './teams';
import { TEAMS_UEFA } from './teams_uefa';

// Her lig slug'ını kendi takım listesine eşler.
// Yeni bir lig eklerken: 1) teams_xxx.ts dosyasını oluştur, 2) burada bir satır ekle,
// 3) data/competitions.ts'te ilgili lig için active: true yap.
export const TEAMS_BY_COMPETITION: Record<string, any[]> = {
  'sampiyonlar-ligi': TEAMS_36,
  'uefa-ligi': TEAMS_UEFA,
};

export function getTeamsForCompetition(slug?: string): any[] {
  return (slug && TEAMS_BY_COMPETITION[slug]) || TEAMS_36;
}
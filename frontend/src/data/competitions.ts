export interface CompetitionConfig {
  slug: string;
  name: string;
  shortName: string;
  emoji: string;
  accent: string;
  accentSoft: string;
  border: string;
  description: string;
  active: boolean; // backend hazır olunca true yapılacak
  teamCount: number;
}

export const COMPETITIONS: CompetitionConfig[] = [
  {
    slug: 'sampiyonlar-ligi',
    name: 'UEFA Şampiyonlar Ligi',
    shortName: 'UCL',
    emoji: '🏆',
    accent: '#818cf8',
    accentSoft: 'rgba(129,140,248,0.14)',
    border: 'rgba(129,140,248,0.35)',
    description: "Avrupa'nın en prestijli kulüp turnuvasının 36 takımlık lig fazı kurası.",
    active: true,
    teamCount: 36,
  },
  {
    slug: 'uefa-ligi',
    name: 'UEFA Avrupa Ligi',
    shortName: 'UEL',
    emoji: '🥈',
    accent: '#fb923c',
    accentSoft: 'rgba(251,146,60,0.14)',
    border: 'rgba(251,146,60,0.35)',
    description: 'UEFA Avrupa Ligi lig fazı kurası.',
    active: true,
    teamCount: 36,
  },
  {
    slug: 'konferans-ligi',
    name: 'UEFA Konferans Ligi',
    shortName: 'UECL',
    emoji: '🥉',
    accent: '#34d399',
    accentSoft: 'rgba(52,211,153,0.14)',
    border: 'rgba(52,211,153,0.35)',
    description: 'UEFA Konferans Ligi lig fazı kurası.',
    active: false,
    teamCount: 36,
  },
];

export function getCompetition(slug?: string): CompetitionConfig | undefined {
  return COMPETITIONS.find((c) => c.slug === slug);
}


interface Team {
  id: number;
  name: string;
  country: string;
  pot: number;
  coefficient: number;
  color?: string;
  path?: string;
  qualified: boolean;
}

export const TEAMS_UEFA: Team[] = [
  // 1. Torba
  { id: 1, name: 'Bayer Leverkusen', country: 'DE', pot: 1, coefficient: 105.000, qualified: true },
  { id: 2, name: 'Benfica', country: 'PT', pot: 1, coefficient: 90.000, qualified: false },
  { id: 3, name: 'Juventus', country: 'IT', pot: 1, coefficient: 72.250, qualified: true },
  { id: 4, name: 'Milan', country: 'IT', pot: 1, coefficient: 66.000, qualified: true },
  { id: 5, name: 'AZ', country: 'NL', pot: 1, coefficient: 62.875, qualified: true },
  { id: 6, name: 'Olimpiakos', country: 'GR', pot: 1, coefficient: 62.250, qualified: false },
  { id: 7, name: 'Fenerbahçe', country: 'TR', pot: 1, coefficient: 57.750, qualified: false },
  { id: 8, name: 'Real Sociedad', country: 'ES', pot: 1, coefficient: 57.000, qualified: true },
  { id: 9, name: 'Marseille', country: 'FR', pot: 1, coefficient: 54.000, qualified: true },

  // 2. Torba
  { id: 10, name: 'Ferencváros', country: 'HU', pot: 2, coefficient: 51.250, qualified: false },
  { id: 11, name: 'Viktoria Plzeň', country: 'CZ', pot: 2, coefficient: 50.500, qualified: false },
  { id: 12, name: 'Union SG', country: 'BE', pot: 2, coefficient: 48.000, qualified: false },
  { id: 13, name: 'Red Bull Salzburg', country: 'AT', pot: 2, coefficient: 45.000, qualified: false },
  { id: 14, name: 'Sparta Praha', country: 'CZ', pot: 2, coefficient: 38.250, qualified: false },
  { id: 15, name: 'Rennes', country: 'FR', pot: 2, coefficient: 35.000, qualified: true },
  { id: 16, name: 'Anderlecht', country: 'BE', pot: 2, coefficient: 30.750, qualified: false },
  { id: 17, name: 'Sturm Graz', country: 'AT', pot: 2, coefficient: 28.000, qualified: false },
  { id: 18, name: 'Lech Poznań', country: 'PL', pot: 2, coefficient: 27.250, qualified: false },

  // 3. Torba
  { id: 19, name: 'Crystal Palace', country: 'EN', pot: 3, coefficient: 23.903, qualified: true },
  { id: 20, name: 'Bournemouth', country: 'EN', pot: 3, coefficient: 23.903, qualified: true },
  { id: 21, name: 'Sunderland', country: 'EN', pot: 3, coefficient: 23.903, qualified: true },
  { id: 22, name: 'Celje', country: 'SI', pot: 3, coefficient: 23.000, qualified: false },
  { id: 23, name: 'Jagiellonia Białystok', country: 'PL', pot: 3, coefficient: 22.000, qualified: false },
  { id: 24, name: 'Omonia', country: 'CY', pot: 3, coefficient: 21.250, qualified: false },
  { id: 25, name: 'LASK', country: 'AT', pot: 3, coefficient: 21.000, qualified: false },
  { id: 26, name: 'Celta Vigo', country: 'ES', pot: 3, coefficient: 19.409, qualified: true },
  { id: 27, name: 'Hoffenheim', country: 'DE', pot: 3, coefficient: 18.580, qualified: true },

  // 4. Torba
  { id: 28, name: 'Beşiktaş', country: 'TR', pot: 4, coefficient: 15.500, qualified: false },
  { id: 29, name: 'Torreense', country: 'PT', pot: 4, coefficient: 14.633, qualified: true },
  { id: 30, name: 'NEC', country: 'NL', pot: 4, coefficient: 13.585, qualified: false },
  { id: 31, name: 'Universitatea Craiova', country: 'RO', pot: 4, coefficient: 10.500, qualified: false },
  { id: 32, name: 'OFI', country: 'GR', pot: 4, coefficient: 9.682, qualified: false },
  { id: 33, name: 'Viking', country: 'NO', pot: 4, coefficient: 8.247, qualified: false },
  { id: 34, name: 'Lillestrøm', country: 'NO', pot: 4, coefficient: 8.247, qualified: false },
  { id: 35, name: 'Levski Sofia', country: 'BG', pot: 4, coefficient: 7.000, qualified: false },
  { id: 36, name: 'Sabah', country: 'AZ', pot: 4, coefficient: 6.000, qualified: false },
];
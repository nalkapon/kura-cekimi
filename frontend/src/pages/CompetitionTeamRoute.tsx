import { useParams } from 'react-router-dom';
import { getCompetition } from '../data/competitions';
import DrawPage from './DrawPage';
import ComingSoonPage from './ComingSoonPage';

// Aktif lig için gerçek kura sayfasını, diğerleri için "yakında" ekranını gösterir.
// Backend yeni bir lig için hazır olduğunda data/competitions.ts içinde active: true
// yapmak yeterli — bu dispatcher otomatik olarak DrawPage'e yönlendirir.
export default function CompetitionTeamRoute() {
  const { slug } = useParams();
  const competition = getCompetition(slug);

  if (competition?.active) {
    return <DrawPage />;
  }
  return <ComingSoonPage />;
}
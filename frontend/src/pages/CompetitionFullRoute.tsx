import { useParams } from 'react-router-dom';
import { getCompetition } from '../data/competitions';
import DrawAllPage from './DrawAllPage';
import ComingSoonPage from './ComingSoonPage';

// Aktif lig için gerçek tüm-kura simülasyonunu, diğerleri için "yakında" ekranını gösterir.
export default function CompetitionFullRoute() {
  const { slug } = useParams();
  const competition = getCompetition(slug);

  if (competition?.active) {
    return <DrawAllPage />;
  }
  return <ComingSoonPage />;
}
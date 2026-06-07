import { EmptyState } from '../../components/components.jsx';
import { COLORS } from '../../components/theme.js';
import { User } from 'lucide-react';

export default function ContributorProfilePage() {
  return <EmptyState icon={<User size={44} color={COLORS.textMuted} />} title="Perfil" subtitle="Pantalla en construcción" />;
}

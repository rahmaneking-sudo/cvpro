// Portfolio Templates — Classés par forfait
// tier: 'standard' (Simple), 'premium' (Pack/Devis)

export const portfolioTemplates = [
  // ============================
  // STANDARD — 10 portfolios simples
  // ============================
  {
    id: 'portfolio-clean-white', name: 'Clean White', series: 'premium', tier: 'standard',
    accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5',
    description: 'Portfolio épuré sur fond blanc. Simple et efficace.',
  },
  {
    id: 'portfolio-dark-basic', name: 'Dark Basic', series: 'premium', tier: 'standard',
    accent: '#888888', bg: '#1A1A1A', text: '#E0E0E0', secondary: '#252525',
    description: 'Fond sombre avec style minimaliste. Pour commencer.',
  },
  {
    id: 'portfolio-blue-sky', name: 'Blue Sky', series: 'creative', tier: 'standard',
    accent: '#3B82F6', bg: '#FFFFFF', text: '#1E293B', secondary: '#F1F5F9',
    description: 'Bleu ciel professionnel. Clair et accueillant.',
  },
  {
    id: 'portfolio-green-leaf', name: 'Green Leaf', series: 'creative', tier: 'standard',
    accent: '#16A34A', bg: '#FAFFFE', text: '#1A2E1A', secondary: '#F0FFF4',
    description: 'Vert nature, frais et moderne.',
  },
  {
    id: 'portfolio-simple-dev', name: 'Simple Dev', series: 'tech', tier: 'standard',
    accent: '#64748B', bg: '#F8FAFC', text: '#1E293B', secondary: '#E2E8F0',
    description: 'Portfolio développeur simple et lisible.',
  },
  {
    id: 'portfolio-noir-luxe', name: 'Noir Luxe', series: 'premium', tier: 'standard',
    accent: '#C9A96E', bg: '#0A0A0A', text: '#F5F0EB', secondary: '#141414',
    description: 'Élégance cinématographique sur fond noir.',
  },
  {
    id: 'portfolio-blanc-editorial', name: 'Blanc Éditorial', series: 'premium', tier: 'standard',
    accent: '#1A1A1A', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#F0F0F0',
    description: 'Pureté du blanc avec typographie magazine.',
  },
  {
    id: 'portfolio-gradient-ocean', name: 'Gradient Océan', series: 'creative', tier: 'standard',
    accent: '#00B4D8', bg: '#0B1622', text: '#E8F4F8', secondary: '#122233',
    description: 'Dégradé bleu océan profond. Créatif et moderne.',
  },
  {
    id: 'portfolio-sunset-warm', name: 'Sunset Warm', series: 'creative', tier: 'standard',
    accent: '#FF6B35', bg: '#1A0E08', text: '#FFF0E8', secondary: '#2A1A10',
    description: 'Tons chauds coucher de soleil. Accueillant.',
  },
  {
    id: 'portfolio-dev-terminal', name: 'Dev Terminal', series: 'tech', tier: 'standard',
    accent: '#00D4AA', bg: '#0A0A0A', text: '#E0E0E0', secondary: '#121212',
    description: 'Style terminal pour développeurs. Néon sur noir.',
  },

  // ============================
  // PREMIUM — 10 portfolios exclusifs
  // ============================
  {
    id: 'portfolio-minimal-swiss', name: 'Minimal Swiss', series: 'tech', tier: 'premium',
    accent: '#FF0000', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F8F8',
    description: 'Design suisse minimaliste. Précision typographique.',
  },
  {
    id: 'portfolio-rose-gold', name: 'Rose Gold', series: 'creative', tier: 'premium',
    accent: '#B76E79', bg: '#FFF5F5', text: '#2D1F1F', secondary: '#FCEAE8',
    description: 'Rose doré élégant. Parfait pour les créatifs.',
  },
  {
    id: 'portfolio-concrete', name: 'Concrete', series: 'tech', tier: 'premium',
    accent: '#EF4444', bg: '#18181B', text: '#FAFAFA', secondary: '#27272A',
    description: 'Brutalist design. Bold et impactant.',
  },
  {
    id: 'portfolio-teranga', name: 'Teranga', series: 'african', tier: 'premium',
    accent: '#D4A537', bg: '#1A0F00', text: '#F5F0EB', secondary: '#2A1A06',
    description: 'Inspiré du Sénégal. Or et noir, fierté africaine.',
  },
  {
    id: 'portfolio-baobab', name: 'Baobab', series: 'african', tier: 'premium',
    accent: '#2E8B57', bg: '#0A1A10', text: '#E8F5EE', secondary: '#142A1A',
    description: 'Vert forêt africaine. Nature et modernité.',
  },
  {
    id: 'portfolio-cineaste', name: 'Le Cinéaste', series: 'premium', tier: 'premium', type: 'audiovisual',
    accent: '#E50914', bg: '#000000', text: '#FFFFFF', secondary: '#141414',
    description: 'Format cinéma. Spécialement conçu pour les réalisateurs et l\'audiovisuel.',
  },
  {
    id: 'portfolio-video-maker', name: 'Video Maker', series: 'creative', tier: 'premium', type: 'audiovisual',
    accent: '#00E5FF', bg: '#0D0D12', text: '#F0F0F5', secondary: '#1A1A24',
    description: 'Grille vidéo dynamique. Idéal pour les monteurs et vidéastes.',
  },
  {
    id: 'portfolio-aurora', name: 'Aurora', series: 'creative', tier: 'premium',
    accent: '#A78BFA', bg: '#020617', text: '#E2E8F0', secondary: '#0F172A',
    description: 'Aurore boréale. Effets visuels spectaculaires.',
  },
  {
    id: 'portfolio-diamond', name: 'Diamond', series: 'premium', tier: 'premium',
    accent: '#FFD700', bg: '#050510', text: '#FAFAFA', secondary: '#0D0D20',
    description: 'Diamant & or. Le summum du luxe digital.',
  },
  {
    id: 'portfolio-cyber', name: 'Cyber', series: 'tech', tier: 'premium',
    accent: '#F472B6', bg: '#0A0A14', text: '#E0E0F0', secondary: '#14142A',
    description: 'Cyberpunk néon. Pour les profils tech audacieux.',
  },
  {
    id: 'portfolio-paris-noir', name: 'Paris Noir', series: 'premium', tier: 'premium',
    accent: '#C9A96E', bg: '#000000', text: '#F5F0EB', secondary: '#0A0A0A',
    description: 'Haute couture digitale. Luxe parisien absolu.',
  },
];

export const portfolioSeriesLabels = {
  premium: { fr: 'Premium', en: 'Premium' },
  creative: { fr: 'Créatif', en: 'Creative' },
  tech: { fr: 'Tech', en: 'Tech' },
  african: { fr: 'Africain', en: 'African' },
};

export const portfolioTierLabels = {
  standard: { fr: 'Standard (2 000 F - 1 Portfolio)', shortFr: 'Standard', en: 'Standard', color: '#43A047', tooltip: 'Forfait 2 000 FCFA : Création d\'un portfolio simple.' },
  premium: { fr: 'Pack Premium (5 000 F - Portfolios illimités)', shortFr: 'Premium', en: 'Premium', color: '#C9A96E', tooltip: 'Forfait 5 000 FCFA : Accès illimité aux portfolios vidéos, images illimitées et designs avancés.' },
};

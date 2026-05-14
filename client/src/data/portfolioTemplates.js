// Portfolio Templates — Classés par forfait
// tier: 'free' (Gratuit), 'pro' (Pro), 'business' (Business)

export const portfolioTemplates = [
  // ============================
  // GRATUIT — 5 portfolios simples
  // ============================
  {
    id: 'portfolio-clean-white', name: 'Clean White', series: 'premium', tier: 'free',
    accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5',
    description: 'Portfolio épuré sur fond blanc. Simple et efficace.',
  },
  {
    id: 'portfolio-dark-basic', name: 'Dark Basic', series: 'premium', tier: 'free',
    accent: '#888888', bg: '#1A1A1A', text: '#E0E0E0', secondary: '#252525',
    description: 'Fond sombre avec style minimaliste. Pour commencer.',
  },
  {
    id: 'portfolio-blue-sky', name: 'Blue Sky', series: 'creative', tier: 'free',
    accent: '#3B82F6', bg: '#FFFFFF', text: '#1E293B', secondary: '#F1F5F9',
    description: 'Bleu ciel professionnel. Clair et accueillant.',
  },
  {
    id: 'portfolio-green-leaf', name: 'Green Leaf', series: 'creative', tier: 'free',
    accent: '#16A34A', bg: '#FAFFFE', text: '#1A2E1A', secondary: '#F0FFF4',
    description: 'Vert nature, frais et moderne.',
  },
  {
    id: 'portfolio-simple-dev', name: 'Simple Dev', series: 'tech', tier: 'free',
    accent: '#64748B', bg: '#F8FAFC', text: '#1E293B', secondary: '#E2E8F0',
    description: 'Portfolio développeur simple et lisible.',
  },

  // ============================
  // PRO — 8 portfolios avancés
  // ============================
  {
    id: 'portfolio-noir-luxe', name: 'Noir Luxe', series: 'premium', tier: 'pro',
    accent: '#C9A96E', bg: '#0A0A0A', text: '#F5F0EB', secondary: '#141414',
    description: 'Élégance cinématographique sur fond noir.',
  },
  {
    id: 'portfolio-blanc-editorial', name: 'Blanc Éditorial', series: 'premium', tier: 'pro',
    accent: '#1A1A1A', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#F0F0F0',
    description: 'Pureté du blanc avec typographie magazine.',
  },
  {
    id: 'portfolio-gradient-ocean', name: 'Gradient Océan', series: 'creative', tier: 'pro',
    accent: '#00B4D8', bg: '#0B1622', text: '#E8F4F8', secondary: '#122233',
    description: 'Dégradé bleu océan profond. Créatif et moderne.',
  },
  {
    id: 'portfolio-sunset-warm', name: 'Sunset Warm', series: 'creative', tier: 'pro',
    accent: '#FF6B35', bg: '#1A0E08', text: '#FFF0E8', secondary: '#2A1A10',
    description: 'Tons chauds coucher de soleil. Accueillant.',
  },
  {
    id: 'portfolio-dev-terminal', name: 'Dev Terminal', series: 'tech', tier: 'pro',
    accent: '#00D4AA', bg: '#0A0A0A', text: '#E0E0E0', secondary: '#121212',
    description: 'Style terminal pour développeurs. Néon sur noir.',
  },
  {
    id: 'portfolio-minimal-swiss', name: 'Minimal Swiss', series: 'tech', tier: 'pro',
    accent: '#FF0000', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F8F8',
    description: 'Design suisse minimaliste. Précision typographique.',
  },
  {
    id: 'portfolio-rose-gold', name: 'Rose Gold', series: 'creative', tier: 'pro',
    accent: '#B76E79', bg: '#FFF5F5', text: '#2D1F1F', secondary: '#FCEAE8',
    description: 'Rose doré élégant. Parfait pour les créatifs.',
  },
  {
    id: 'portfolio-concrete', name: 'Concrete', series: 'tech', tier: 'pro',
    accent: '#EF4444', bg: '#18181B', text: '#FAFAFA', secondary: '#27272A',
    description: 'Brutalist design. Bold et impactant.',
  },

  // ============================
  // BUSINESS — 7 portfolios exclusifs
  // ============================
  {
    id: 'portfolio-teranga', name: 'Teranga', series: 'african', tier: 'business',
    accent: '#D4A537', bg: '#1A0F00', text: '#F5F0EB', secondary: '#2A1A06',
    description: 'Inspiré du Sénégal. Or et noir, fierté africaine.',
  },
  {
    id: 'portfolio-baobab', name: 'Baobab', series: 'african', tier: 'business',
    accent: '#2E8B57', bg: '#0A1A10', text: '#E8F5EE', secondary: '#142A1A',
    description: 'Vert forêt africaine. Nature et modernité.',
  },
  {
    id: 'portfolio-aurora', name: 'Aurora', series: 'creative', tier: 'business',
    accent: '#A78BFA', bg: '#020617', text: '#E2E8F0', secondary: '#0F172A',
    description: 'Aurore boréale. Effets visuels spectaculaires.',
  },
  {
    id: 'portfolio-diamond', name: 'Diamond', series: 'premium', tier: 'business',
    accent: '#FFD700', bg: '#050510', text: '#FAFAFA', secondary: '#0D0D20',
    description: 'Diamant & or. Le summum du luxe digital.',
  },
  {
    id: 'portfolio-kigali', name: 'Kigali', series: 'african', tier: 'business',
    accent: '#0891B2', bg: '#0C1017', text: '#E0F7FA', secondary: '#162028',
    description: 'Modernité africaine. Cyan et noir futuriste.',
  },
  {
    id: 'portfolio-cyber', name: 'Cyber', series: 'tech', tier: 'business',
    accent: '#F472B6', bg: '#0A0A14', text: '#E0E0F0', secondary: '#14142A',
    description: 'Cyberpunk néon. Pour les profils tech audacieux.',
  },
  {
    id: 'portfolio-paris-noir', name: 'Paris Noir', series: 'premium', tier: 'business',
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
  free: { fr: 'Gratuit', en: 'Free', color: '#43A047' },
  pro: { fr: 'Pro', en: 'Pro', color: '#C9A96E' },
  business: { fr: 'Business', en: 'Business', color: '#6366F1' },
};

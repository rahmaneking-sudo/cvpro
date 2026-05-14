// CV Templates — Classés par forfait
// tier: 'free' (Gratuit), 'pro' (Pro 4,99€/mois), 'business' (Business 14,99€/mois)

export const templates = [
  // ============================
  // GRATUIT — 8 modèles basiques
  // ============================
  { id: 'midnight-executive', name: 'Midnight Executive', series: 'executive', tier: 'free', accent: '#C9A96E', bg: '#0A0A0A', text: '#F5F0EB', secondary: '#1C1C1E', layout: 'single-column' },
  { id: 'executive-blanc', name: 'Executive Blanc', series: 'executive', tier: 'free', accent: '#2C2C2E', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F0EB', layout: 'single-column' },
  { id: 'neo-minimal', name: 'Neo Minimal', series: 'tech', tier: 'free', accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F8F8', layout: 'single-column' },
  { id: 'cinematic-dark', name: 'Cinematic Dark', series: 'creative', tier: 'free', accent: '#C9A96E', bg: '#0D0D0D', text: '#F5F0EB', secondary: '#1A1A1A', layout: 'single-column' },
  { id: 'savane-luxe', name: 'Savane Luxe', series: 'african', tier: 'free', accent: '#8B4513', bg: '#FFF8F0', text: '#2C1810', secondary: '#F5E6D3', layout: 'single-column' },
  { id: 'clean-slate', name: 'Clean Slate', series: 'executive', tier: 'free', accent: '#555555', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5', layout: 'single-column' },
  { id: 'basic-pro', name: 'Basic Pro', series: 'tech', tier: 'free', accent: '#3B82F6', bg: '#FFFFFF', text: '#1E293B', secondary: '#F1F5F9', layout: 'single-column' },
  { id: 'soft-ivory', name: 'Soft Ivory', series: 'creative', tier: 'free', accent: '#A0826D', bg: '#FAF7F2', text: '#3D3229', secondary: '#F0EBE3', layout: 'single-column' },

  // ============================
  // PRO — 12 modèles avancés
  // ============================
  { id: 'executive-navy', name: 'Executive Navy', series: 'executive', tier: 'pro', accent: '#C9A96E', bg: '#1B2A4A', text: '#F5F0EB', secondary: '#243B6A', layout: 'two-column' },
  { id: 'executive-slate', name: 'Executive Slate', series: 'executive', tier: 'pro', accent: '#E8D5B7', bg: '#2C2C2E', text: '#F5F0EB', secondary: '#3A3A3C', layout: 'two-column' },
  { id: 'editorial-magazine', name: 'Editorial Magazine', series: 'creative', tier: 'pro', accent: '#1A1A1A', bg: '#F5F0EB', text: '#1A1A1A', secondary: '#E8E2DA', layout: 'asymmetric' },
  { id: 'bold-creative', name: 'Bold Creative', series: 'creative', tier: 'pro', accent: '#FF6B35', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#FFF0E8', layout: 'creative' },
  { id: 'minimal-luxe', name: 'Minimal Luxe', series: 'creative', tier: 'pro', accent: '#B8A9C9', bg: '#FAFAFA', text: '#2C2C2E', secondary: '#F0EDF5', layout: 'single-column' },
  { id: 'code-noir', name: 'Code Noir', series: 'tech', tier: 'pro', accent: '#00D4AA', bg: '#0A0A0A', text: '#E0E0E0', secondary: '#141414', layout: 'two-column' },
  { id: 'architectural-grid', name: 'Architectural Grid', series: 'tech', tier: 'pro', accent: '#7B8794', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F0F2F5', layout: 'grid' },
  { id: 'dakar-modern', name: 'Dakar Modern', series: 'african', tier: 'pro', accent: '#2E8B57', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#E8F5EE', layout: 'two-column' },
  { id: 'gradient-flow', name: 'Gradient Flow', series: 'creative', tier: 'pro', accent: '#8B5CF6', bg: '#0F0A1A', text: '#F0EBFF', secondary: '#1A1230', layout: 'two-column' },
  { id: 'concrete-pro', name: 'Concrete Pro', series: 'tech', tier: 'pro', accent: '#EF4444', bg: '#FAFAFA', text: '#18181B', secondary: '#F4F4F5', layout: 'grid' },
  { id: 'warm-earth', name: 'Warm Earth', series: 'african', tier: 'pro', accent: '#B8860B', bg: '#2A1F14', text: '#F5E6D0', secondary: '#3D2E1E', layout: 'two-column' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', series: 'creative', tier: 'pro', accent: '#0EA5E9', bg: '#F0F9FF', text: '#0C4A6E', secondary: '#E0F2FE', layout: 'single-column' },

  // ============================
  // BUSINESS — 10 modèles exclusifs
  // ============================
  { id: 'silicon', name: 'Silicon', series: 'tech', tier: 'business', accent: '#6366F1', bg: '#0F0F23', text: '#E0E0E0', secondary: '#1A1A3E', layout: 'two-column' },
  { id: 'teranga-gold', name: 'Teranga Gold', series: 'african', tier: 'business', accent: '#D4A537', bg: '#1A0F00', text: '#F5F0EB', secondary: '#2A1A06', layout: 'two-column' },
  { id: 'kente-pro', name: 'Kente Pro', series: 'african', tier: 'business', accent: '#FF8C00', bg: '#1A1A1A', text: '#F5F0EB', secondary: '#2A2A2A', layout: 'creative' },
  { id: 'royal-diamond', name: 'Royal Diamond', series: 'executive', tier: 'business', accent: '#C9A96E', bg: '#050510', text: '#F5F0EB', secondary: '#0D0D20', layout: 'asymmetric' },
  { id: 'obsidian-gold', name: 'Obsidian Gold', series: 'executive', tier: 'business', accent: '#FFD700', bg: '#0A0A0A', text: '#FAFAFA', secondary: '#151515', layout: 'two-column' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', series: 'creative', tier: 'business', accent: '#34D399', bg: '#020617', text: '#E2E8F0', secondary: '#0F172A', layout: 'creative' },
  { id: 'cyber-neon', name: 'Cyber Neon', series: 'tech', tier: 'business', accent: '#F472B6', bg: '#0A0A14', text: '#E0E0F0', secondary: '#14142A', layout: 'grid' },
  { id: 'african-royalty', name: 'African Royalty', series: 'african', tier: 'business', accent: '#B8860B', bg: '#0A0505', text: '#FFF8E7', secondary: '#1A0F08', layout: 'asymmetric' },
  { id: 'le-parisien', name: 'Le Parisien', series: 'executive', tier: 'business', accent: '#1A1A1A', bg: '#FFFDF5', text: '#1A1A1A', secondary: '#F5F0E5', layout: 'asymmetric' },
  { id: 'matrix-dev', name: 'Matrix Dev', series: 'tech', tier: 'business', accent: '#22C55E', bg: '#000000', text: '#00FF41', secondary: '#0A0A0A', layout: 'two-column' },
];

export const seriesLabels = {
  executive: { fr: 'Série Executive', en: 'Executive Series' },
  creative: { fr: 'Série Créative', en: 'Creative Series' },
  tech: { fr: 'Série Tech', en: 'Tech Series' },
  african: { fr: 'Série Africaine Premium', en: 'African Premium Series' },
};

export const tierLabels = {
  free: { fr: 'Gratuit', en: 'Free', color: '#43A047' },
  pro: { fr: 'Pro', en: 'Pro', color: '#C9A96E' },
  business: { fr: 'Business', en: 'Business', color: '#6366F1' },
};

export function getTemplate(id) {
  return templates.find(t => t.id === id);
}

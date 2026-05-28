// CV Templates – Classés par forfait
// tier: 'standard' (à l'unité), 'premium' (Pack Pro)

export const templates = [
  // ============================
  // STANDARD – 15 modèles (à l'unité)
  // ============================
  { id: 'executive-blanc', name: 'Executive Blanc', series: 'executive', tier: 'standard', accent: '#2C2C2E', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F9FA', fontTitle: 'Playfair Display', fontBody: 'Source Sans Pro', layout: 'two-column' },
  { id: 'executive-navy', name: 'Executive Navy', series: 'executive', tier: 'standard', accent: '#C9A96E', bg: '#1B2A4A', text: '#FFFFFF', secondary: '#243B6A', fontTitle: 'Libre Baskerville', fontBody: 'Open Sans', layout: 'two-column' },
  { id: 'neo-minimal', name: 'Neo Minimal', series: 'tech', tier: 'standard', accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F8F8', fontTitle: 'Inter', fontBody: 'Inter', layout: 'single-column' },
  { id: 'cinematic-dark', name: 'Cinematic Dark', series: 'creative', tier: 'standard', accent: '#C9A96E', bg: '#0D0D0D', text: '#F5F0EB', secondary: '#1A1A1A', fontTitle: 'Cinzel', fontBody: 'Lato', layout: 'single-column' },
  { id: 'savane-luxe', name: 'Savane Luxe', series: 'african', tier: 'standard', accent: '#8B4513', bg: '#FFF8F0', text: '#2C1810', secondary: '#F5E6D3', fontTitle: 'Cormorant Garamond', fontBody: 'Montserrat', layout: 'two-column' },
  { id: 'clean-slate', name: 'Clean Slate', series: 'executive', tier: 'standard', accent: '#555555', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5', fontTitle: 'Roboto', fontBody: 'Roboto', layout: 'single-column' },
  { id: 'basic-pro', name: 'Basic Pro', series: 'tech', tier: 'standard', accent: '#3B82F6', bg: '#FFFFFF', text: '#1E293B', secondary: '#F1F5F9', fontTitle: 'Poppins', fontBody: 'Inter', layout: 'single-column' },
  { id: 'soft-ivory', name: 'Soft Ivory', series: 'creative', tier: 'standard', accent: '#A0826D', bg: '#FAF7F2', text: '#3D3229', secondary: '#F0EBE3', fontTitle: 'Lora', fontBody: 'Nunito', layout: 'two-column' },
  { id: 'executive-slate', name: 'Executive Slate', series: 'executive', tier: 'standard', accent: '#E8D5B7', bg: '#2C2C2E', text: '#F5F0EB', secondary: '#3A3A3C', fontTitle: 'Merriweather', fontBody: 'Open Sans', layout: 'two-column' },
  { id: 'bold-creative', name: 'Bold Creative', series: 'creative', tier: 'standard', accent: '#FF6B35', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#FFF0E8', fontTitle: 'Bebas Neue', fontBody: 'Montserrat', layout: 'creative' },
  { id: 'minimal-luxe', name: 'Minimal Luxe', series: 'creative', tier: 'standard', accent: '#B8A9C9', bg: '#FAFAFA', text: '#2C2C2E', secondary: '#F0EDF5', fontTitle: 'Playfair Display', fontBody: 'Lato', layout: 'single-column' },
  { id: 'code-noir', name: 'Code Noir', series: 'tech', tier: 'standard', accent: '#00D4AA', bg: '#0A0A0A', text: '#E0E0E0', secondary: '#141414', fontTitle: 'Fira Code', fontBody: 'Inter', layout: 'two-column' },
  { id: 'dakar-modern', name: 'Dakar Modern', series: 'african', tier: 'standard', accent: '#2E8B57', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#E8F5EE', fontTitle: 'Montserrat', fontBody: 'Open Sans', layout: 'two-column' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', series: 'creative', tier: 'standard', accent: '#0EA5E9', bg: '#F0F9FF', text: '#0C4A6E', secondary: '#E0F2FE', fontTitle: 'Raleway', fontBody: 'Lato', layout: 'single-column' },
  { id: 'midnight-executive', name: 'Midnight Executive', series: 'executive', tier: 'standard', accent: '#C9A96E', bg: '#0A0A0A', text: '#F5F0EB', secondary: '#1C1C1E', fontTitle: 'Playfair Display', fontBody: 'Source Sans Pro', layout: 'single-column' },

  // ============================
  // LETTRE DE MOTIVATION (1 modèle)
  // ============================
  { id: 'cover-letter-standard', name: 'Lettre Standard', series: 'executive', tier: 'cover-letter', accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5', fontTitle: 'Arial', fontBody: 'Arial', layout: 'cover-letter' },

  // ============================
  // PREMIUM – 15 modèles exclusifs (Pack Pro)
  // ============================
  { id: 'editorial-magazine', name: 'Editorial Magazine', series: 'creative', tier: 'premium', accent: '#1A1A1A', bg: '#F5F0EB', text: '#1A1A1A', secondary: '#E8E2DA', fontTitle: 'Bodoni Moda', fontBody: 'Inter', layout: 'asymmetric' },
  { id: 'architectural-grid', name: 'Architectural Grid', series: 'tech', tier: 'premium', accent: '#7B8794', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F0F2F5', fontTitle: 'Oswald', fontBody: 'Roboto', layout: 'grid' },
  { id: 'gradient-flow', name: 'Gradient Flow', series: 'creative', tier: 'premium', accent: '#8B5CF6', bg: '#0F0A1A', text: '#F0EBFF', secondary: '#1A1230', fontTitle: 'Syne', fontBody: 'Inter', layout: 'two-column' },
  { id: 'concrete-pro', name: 'Concrete Pro', series: 'tech', tier: 'premium', accent: '#EF4444', bg: '#FAFAFA', text: '#18181B', secondary: '#F4F4F5', fontTitle: 'Space Grotesk', fontBody: 'Inter', layout: 'grid' },
  { id: 'warm-earth', name: 'Warm Earth', series: 'african', tier: 'premium', accent: '#B8860B', bg: '#2A1F14', text: '#F5E6D0', secondary: '#3D2E1E', fontTitle: 'Cormorant Garamond', fontBody: 'Lato', layout: 'two-column' },
  { id: 'silicon', name: 'Silicon', series: 'tech', tier: 'premium', accent: '#6366F1', bg: '#0F0F23', text: '#E0E0E0', secondary: '#1A1A3E', fontTitle: 'Orbitron', fontBody: 'Inter', layout: 'two-column' },
  { id: 'teranga-gold', name: 'Teranga Gold', series: 'african', tier: 'premium', accent: '#D4A537', bg: '#1A0F00', text: '#F5F0EB', secondary: '#2A1A06', fontTitle: 'Playfair Display', fontBody: 'Montserrat', layout: 'two-column' },
  { id: 'kente-pro', name: 'Kente Pro', series: 'african', tier: 'premium', accent: '#FF8C00', bg: '#1A1A1A', text: '#F5F0EB', secondary: '#2A2A2A', fontTitle: 'Josefin Sans', fontBody: 'Inter', layout: 'creative' },
  { id: 'royal-diamond', name: 'Royal Diamond', series: 'executive', tier: 'premium', accent: '#C9A96E', bg: '#050510', text: '#F5F0EB', secondary: '#0D0D20', fontTitle: 'Cinzel', fontBody: 'Lato', layout: 'asymmetric' },
  { id: 'obsidian-gold', name: 'Obsidian Gold', series: 'executive', tier: 'premium', accent: '#FFD700', bg: '#0A0A0A', text: '#FAFAFA', secondary: '#151515', fontTitle: 'Playfair Display', fontBody: 'Source Sans Pro', layout: 'two-column' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', series: 'creative', tier: 'premium', accent: '#34D399', bg: '#020617', text: '#E2E8F0', secondary: '#0F172A', fontTitle: 'Montserrat', fontBody: 'Inter', layout: 'creative' },
  { id: 'cyber-neon', name: 'Cyber Neon', series: 'tech', tier: 'premium', accent: '#F472B6', bg: '#0A0A14', text: '#E0E0F0', secondary: '#14142A', fontTitle: 'Rajdhani', fontBody: 'Space Grotesk', layout: 'grid' },
  { id: 'african-royalty', name: 'African Royalty', series: 'african', tier: 'premium', accent: '#B8860B', bg: '#0A0505', text: '#FFF8E7', secondary: '#1A0F08', fontTitle: 'Abril Fatface', fontBody: 'Lato', layout: 'asymmetric' },
  { id: 'le-parisien', name: 'Le Parisien', series: 'executive', tier: 'premium', accent: '#1A1A1A', bg: '#FFFDF5', text: '#1A1A1A', secondary: '#F5F0E5', fontTitle: 'Didot', fontBody: 'Inter', layout: 'asymmetric' },
  { id: 'matrix-dev', name: 'Matrix Dev', series: 'tech', tier: 'premium', accent: '#22C55E', bg: '#000000', text: '#00FF41', secondary: '#0A0A0A', fontTitle: 'Share Tech Mono', fontBody: 'Fira Code', layout: 'two-column' },

  // ============================
  // MEDIA KIT (3 modèles)
  // ============================
  { id: 'mk-split-modern', name: 'Split Modern', series: 'creative', tier: 'media-kit', accent: '#FFFFFF', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#C9A07E', fontTitle: 'Montserrat', fontBody: 'Open Sans', layout: 'media-kit-split' },
  { id: 'mk-classic-pro', name: 'Classic Pro', series: 'executive', tier: 'media-kit', accent: '#3B82F6', bg: '#FAFAFA', text: '#2C2C2E', secondary: '#FFFFFF', fontTitle: 'Inter', fontBody: 'Inter', layout: 'media-kit-classic' },
  { id: 'mk-dark-creator', name: 'Dark Creator', series: 'tech', tier: 'media-kit', accent: '#8B5CF6', bg: '#0F0F1A', text: '#F8FAFC', secondary: '#1E1E2E', fontTitle: 'Space Grotesk', fontBody: 'Inter', layout: 'media-kit-dark' }
];

export const seriesLabels = {
  executive: { fr: 'Série Executive', en: 'Executive Series' },
  creative: { fr: 'Série Creative', en: 'Creative Series' },
  tech: { fr: 'Série Tech', en: 'Tech Series' },
  african: { fr: 'Série Africaine Premium', en: 'African Premium Series' },
};

export const tierLabels = {
  standard: { fr: 'CV Standard (1 500 F)', shortFr: 'Standard', en: 'Standard', color: '#43A047', tooltip: 'Forfait 1 500 FCFA : Téléchargement unique d\'un design standard.' },
  'cover-letter': { fr: 'Lettre de Motivation (1 500 F)', shortFr: 'Lettre de Motivation', en: 'Cover Letter', color: '#3B82F6', tooltip: 'Forfait 1 500 FCFA : Téléchargement unique d\'une Lettre de motivation.' },
  premium: { fr: 'Pack Premium (5 000 F - CV illimités)', shortFr: 'Premium', en: 'Premium', color: '#C9A96E', tooltip: 'Forfait 5 000 FCFA : Accès illimité à tous les modèles premiums.' },
  'media-kit': { fr: 'Media Kit Pro (2 000 F)', shortFr: 'Media Kit', en: 'Media Kit', color: '#8B5CF6', tooltip: 'Forfait 2 000 FCFA : Téléchargement d\'un Media Kit professionnel pour influenceurs.' },
};

export function getTemplate(id) {
  const template = templates.find(t => t.id === id);
  return template || templates.find(t => t.id === 'executive-blanc');
}

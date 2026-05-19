// CV Templates — Classés par forfait
// tier: 'standard' (À l'unité), 'premium' (Pack Pro)

export const templates = [
  // ============================
  // STANDARD — 15 modèles (À l'unité)
  // ============================
  { id: 'midnight-executive', name: 'Midnight Executive', series: 'executive', tier: 'standard', accent: '#C9A96E', bg: '#0A0A0A', text: '#F5F0EB', secondary: '#1C1C1E', layout: 'single-column' },
  { id: 'executive-blanc', name: 'Executive Blanc', series: 'executive', tier: 'standard', accent: '#2C2C2E', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F0EB', layout: 'single-column' },
  { id: 'neo-minimal', name: 'Neo Minimal', series: 'tech', tier: 'standard', accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F8F8', layout: 'single-column' },
  { id: 'cinematic-dark', name: 'Cinematic Dark', series: 'creative', tier: 'standard', accent: '#C9A96E', bg: '#0D0D0D', text: '#F5F0EB', secondary: '#1A1A1A', layout: 'single-column' },
  { id: 'savane-luxe', name: 'Savane Luxe', series: 'african', tier: 'standard', accent: '#8B4513', bg: '#FFF8F0', text: '#2C1810', secondary: '#F5E6D3', layout: 'single-column' },
  { id: 'clean-slate', name: 'Clean Slate', series: 'executive', tier: 'standard', accent: '#555555', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5', layout: 'single-column' },
  { id: 'basic-pro', name: 'Basic Pro', series: 'tech', tier: 'standard', accent: '#3B82F6', bg: '#FFFFFF', text: '#1E293B', secondary: '#F1F5F9', layout: 'single-column' },
  { id: 'soft-ivory', name: 'Soft Ivory', series: 'creative', tier: 'standard', accent: '#A0826D', bg: '#FAF7F2', text: '#3D3229', secondary: '#F0EBE3', layout: 'single-column' },
  { id: 'executive-navy', name: 'Executive Navy', series: 'executive', tier: 'standard', accent: '#C9A96E', bg: '#1B2A4A', text: '#F5F0EB', secondary: '#243B6A', layout: 'two-column' },
  { id: 'executive-slate', name: 'Executive Slate', series: 'executive', tier: 'standard', accent: '#E8D5B7', bg: '#2C2C2E', text: '#F5F0EB', secondary: '#3A3A3C', layout: 'two-column' },
  { id: 'bold-creative', name: 'Bold Creative', series: 'creative', tier: 'standard', accent: '#FF6B35', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#FFF0E8', layout: 'creative' },
  { id: 'minimal-luxe', name: 'Minimal Luxe', series: 'creative', tier: 'standard', accent: '#B8A9C9', bg: '#FAFAFA', text: '#2C2C2E', secondary: '#F0EDF5', layout: 'single-column' },
  { id: 'code-noir', name: 'Code Noir', series: 'tech', tier: 'standard', accent: '#00D4AA', bg: '#0A0A0A', text: '#E0E0E0', secondary: '#141414', layout: 'two-column' },
  { id: 'dakar-modern', name: 'Dakar Modern', series: 'african', tier: 'standard', accent: '#2E8B57', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#E8F5EE', layout: 'two-column' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', series: 'creative', tier: 'standard', accent: '#0EA5E9', bg: '#F0F9FF', text: '#0C4A6E', secondary: '#E0F2FE', layout: 'single-column' },
  { id: 'cover-letter-classic', name: 'Lettre de Motivation', series: 'executive', tier: 'standard', accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5', layout: 'cover-letter' },

  // ============================
  // PREMIUM — 15 modèles exclusifs (Pack Pro)
  // ============================
  { id: 'editorial-magazine', name: 'Editorial Magazine', series: 'creative', tier: 'premium', accent: '#1A1A1A', bg: '#F5F0EB', text: '#1A1A1A', secondary: '#E8E2DA', layout: 'asymmetric' },
  { id: 'architectural-grid', name: 'Architectural Grid', series: 'tech', tier: 'premium', accent: '#7B8794', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F0F2F5', layout: 'grid' },
  { id: 'gradient-flow', name: 'Gradient Flow', series: 'creative', tier: 'premium', accent: '#8B5CF6', bg: '#0F0A1A', text: '#F0EBFF', secondary: '#1A1230', layout: 'two-column' },
  { id: 'concrete-pro', name: 'Concrete Pro', series: 'tech', tier: 'premium', accent: '#EF4444', bg: '#FAFAFA', text: '#18181B', secondary: '#F4F4F5', layout: 'grid' },
  { id: 'warm-earth', name: 'Warm Earth', series: 'african', tier: 'premium', accent: '#B8860B', bg: '#2A1F14', text: '#F5E6D0', secondary: '#3D2E1E', layout: 'two-column' },
  { id: 'silicon', name: 'Silicon', series: 'tech', tier: 'premium', accent: '#6366F1', bg: '#0F0F23', text: '#E0E0E0', secondary: '#1A1A3E', layout: 'two-column' },
  { id: 'teranga-gold', name: 'Teranga Gold', series: 'african', tier: 'premium', accent: '#D4A537', bg: '#1A0F00', text: '#F5F0EB', secondary: '#2A1A06', layout: 'two-column' },
  { id: 'kente-pro', name: 'Kente Pro', series: 'african', tier: 'premium', accent: '#FF8C00', bg: '#1A1A1A', text: '#F5F0EB', secondary: '#2A2A2A', layout: 'creative' },
  { id: 'royal-diamond', name: 'Royal Diamond', series: 'executive', tier: 'premium', accent: '#C9A96E', bg: '#050510', text: '#F5F0EB', secondary: '#0D0D20', layout: 'asymmetric' },
  { id: 'obsidian-gold', name: 'Obsidian Gold', series: 'executive', tier: 'premium', accent: '#FFD700', bg: '#0A0A0A', text: '#FAFAFA', secondary: '#151515', layout: 'two-column' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', series: 'creative', tier: 'premium', accent: '#34D399', bg: '#020617', text: '#E2E8F0', secondary: '#0F172A', layout: 'creative' },
  { id: 'cyber-neon', name: 'Cyber Neon', series: 'tech', tier: 'premium', accent: '#F472B6', bg: '#0A0A14', text: '#E0E0F0', secondary: '#14142A', layout: 'grid' },
  { id: 'african-royalty', name: 'African Royalty', series: 'african', tier: 'premium', accent: '#B8860B', bg: '#0A0505', text: '#FFF8E7', secondary: '#1A0F08', layout: 'asymmetric' },
  { id: 'le-parisien', name: 'Le Parisien', series: 'executive', tier: 'premium', accent: '#1A1A1A', bg: '#FFFDF5', text: '#1A1A1A', secondary: '#F5F0E5', layout: 'asymmetric' },
  { id: 'matrix-dev', name: 'Matrix Dev', series: 'tech', tier: 'premium', accent: '#22C55E', bg: '#000000', text: '#00FF41', secondary: '#0A0A0A', layout: 'two-column' },
  { id: 'media-kit-influence', name: 'Media Kit Influence', series: 'creative', tier: 'media-kit', accent: '#FF1493', bg: '#1A0B13', text: '#FFFFFF', secondary: '#2D1422', layout: 'media-kit' },
  { id: 'media-kit-creator', name: 'Media Kit Creator', series: 'tech', tier: 'media-kit', accent: '#FFCC00', bg: '#0A0A0A', text: '#FFFFFF', secondary: '#1A1A1A', layout: 'media-kit' },
  { id: 'media-kit-brand', name: 'Media Kit Brand', series: 'executive', tier: 'media-kit', accent: '#000000', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F5F5', layout: 'media-kit' },
];

export const seriesLabels = {
  executive: { fr: 'Série Executive', en: 'Executive Series' },
  creative: { fr: 'Série Créative', en: 'Creative Series' },
  tech: { fr: 'Série Tech', en: 'Tech Series' },
  african: { fr: 'Série Africaine Premium', en: 'African Premium Series' },
};

export const tierLabels = {
  standard: { fr: 'Standard (1 500 F - 1 CV)', shortFr: 'Standard', en: 'Standard', color: '#43A047', tooltip: 'Forfait 1 500 FCFA : Téléchargement unique d\'un design standard.' },
  premium: { fr: 'Pack Premium (5 000 F - CV illimités)', shortFr: 'Premium', en: 'Premium', color: '#C9A96E', tooltip: 'Forfait 5 000 FCFA : Accès illimité à tous les modèles premiums.' },
  'media-kit': { fr: 'Media Kit Pro (2 000 F)', shortFr: 'Media Kit', en: 'Media Kit', color: '#8B5CF6', tooltip: 'Forfait 2 000 FCFA : Téléchargement d\'un Media Kit professionnel pour influenceurs.' },
};

export function getTemplate(id) {
  return templates.find(t => t.id === id);
}

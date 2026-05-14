// CV Templates data shared with frontend for rendering
export const templates = [
  { id: 'midnight-executive', name: 'Midnight Executive', series: 'executive', accent: '#C9A96E', bg: '#0A0A0A', text: '#F5F0EB', secondary: '#1C1C1E', layout: 'single-column' },
  { id: 'executive-blanc', name: 'Executive Blanc', series: 'executive', accent: '#2C2C2E', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F5F0EB', layout: 'single-column' },
  { id: 'executive-navy', name: 'Executive Navy', series: 'executive', accent: '#C9A96E', bg: '#1B2A4A', text: '#F5F0EB', secondary: '#243B6A', layout: 'two-column' },
  { id: 'executive-slate', name: 'Executive Slate', series: 'executive', accent: '#E8D5B7', bg: '#2C2C2E', text: '#F5F0EB', secondary: '#3A3A3C', layout: 'two-column' },
  { id: 'cinematic-dark', name: 'Cinematic Dark', series: 'creative', accent: '#C9A96E', bg: '#0D0D0D', text: '#F5F0EB', secondary: '#1A1A1A', layout: 'single-column' },
  { id: 'editorial-magazine', name: 'Editorial Magazine', series: 'creative', accent: '#1A1A1A', bg: '#F5F0EB', text: '#1A1A1A', secondary: '#E8E2DA', layout: 'asymmetric' },
  { id: 'bold-creative', name: 'Bold Creative', series: 'creative', accent: '#FF6B35', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#FFF0E8', layout: 'creative' },
  { id: 'minimal-luxe', name: 'Minimal Luxe', series: 'creative', accent: '#B8A9C9', bg: '#FAFAFA', text: '#2C2C2E', secondary: '#F0EDF5', layout: 'single-column' },
  { id: 'code-noir', name: 'Code Noir', series: 'tech', accent: '#00D4AA', bg: '#0A0A0A', text: '#E0E0E0', secondary: '#141414', layout: 'two-column' },
  { id: 'architectural-grid', name: 'Architectural Grid', series: 'tech', accent: '#7B8794', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F0F2F5', layout: 'grid' },
  { id: 'neo-minimal', name: 'Neo Minimal', series: 'tech', accent: '#1A1A1A', bg: '#FFFFFF', text: '#1A1A1A', secondary: '#F8F8F8', layout: 'single-column' },
  { id: 'silicon', name: 'Silicon', series: 'tech', accent: '#6366F1', bg: '#0F0F23', text: '#E0E0E0', secondary: '#1A1A3E', layout: 'two-column' },
  { id: 'teranga-gold', name: 'Teranga Gold', series: 'african', accent: '#D4A537', bg: '#1A0F00', text: '#F5F0EB', secondary: '#2A1A06', layout: 'two-column' },
  { id: 'savane-luxe', name: 'Savane Luxe', series: 'african', accent: '#8B4513', bg: '#FFF8F0', text: '#2C1810', secondary: '#F5E6D3', layout: 'single-column' },
  { id: 'dakar-modern', name: 'Dakar Modern', series: 'african', accent: '#2E8B57', bg: '#FAFAFA', text: '#1A1A1A', secondary: '#E8F5EE', layout: 'two-column' },
  { id: 'kente-pro', name: 'Kente Pro', series: 'african', accent: '#FF8C00', bg: '#1A1A1A', text: '#F5F0EB', secondary: '#2A2A2A', layout: 'creative' },
];

export const seriesLabels = {
  executive: { fr: 'Série Executive', en: 'Executive Series' },
  creative: { fr: 'Série Créative', en: 'Creative Series' },
  tech: { fr: 'Série Tech', en: 'Tech Series' },
  african: { fr: 'Série Africaine Premium', en: 'African Premium Series' },
};

export function getTemplate(id) {
  return templates.find(t => t.id === id);
}

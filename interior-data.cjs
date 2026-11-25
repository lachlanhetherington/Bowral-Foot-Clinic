// The filenames are published photographs from the Dr Abbie family site.
const photography = {
  'book-online': 'clinic-reception.webp',
  biomechanics: 'svc-biomechanics.webp',
  'childrens-podiatry': 'svc-childrens.webp',
  'custom-orthotics': 'svc-orthotics.webp',
  'dry-needling': 'svc-dry-needling.webp',
  'foot-mobilisations': 'svc-mobilisation.webp',
  'general-foot-care': 'tx-foot-care.webp',
  'neural-therapy': 'tx-neural.webp',
  'shockwave-therapy': 'svc-shockwave.webp',
  'shockwave-therapy-2': 'nba-teaching.webp',
  'sports-podiatry': 'tx-sports.webp',
  strapping: 'svc-strapping.webp',
  'childrens-foot-problems': 'blog-children.webp',
  'diabetic-foot-care': 'tx-foot-care.webp',
  'foot-ankle-injuries': 'tx-strapping.webp',
  'heel-pain': 'blog-heel-pain.webp',
  'knee-hip-back-pain': 'nba-gait.webp',
  'toenail-problems': 'tx-foot-care.webp'
};

const care = {
  biomechanics: ['custom-orthotics','sports-podiatry','foot-ankle-injuries'],
  'childrens-podiatry': ['childrens-foot-problems','biomechanics','custom-orthotics'],
  'custom-orthotics': ['biomechanics','heel-pain','sports-podiatry'],
  'dry-needling': ['foot-mobilisations','sports-podiatry','heel-pain'],
  'foot-mobilisations': ['biomechanics','foot-ankle-injuries','strapping'],
  'general-foot-care': ['toenail-problems','diabetic-foot-care','heel-pain'],
  'neural-therapy': ['shockwave-therapy-2','biomechanics','dry-needling'],
  'shockwave-therapy': ['heel-pain','biomechanics','sports-podiatry'],
  'shockwave-therapy-2': ['neural-therapy','biomechanics','foot-ankle-injuries'],
  'sports-podiatry': ['biomechanics','foot-ankle-injuries','strapping'],
  strapping: ['foot-ankle-injuries','sports-podiatry','foot-mobilisations'],
  'childrens-foot-problems': ['childrens-podiatry','biomechanics','custom-orthotics'],
  'diabetic-foot-care': ['general-foot-care','toenail-problems','our-team'],
  'foot-ankle-injuries': ['sports-podiatry','strapping','biomechanics'],
  'heel-pain': ['biomechanics','shockwave-therapy','custom-orthotics'],
  'knee-hip-back-pain': ['biomechanics','sports-podiatry','custom-orthotics'],
  'toenail-problems': ['general-foot-care','diabetic-foot-care','our-team']
};

module.exports = {photography, care};

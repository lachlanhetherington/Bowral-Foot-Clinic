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

// Body figures use Bowral photography and the Dr. Abbie Clinics treatment library.
const serviceIllustrations = {
  biomechanics: {
    file: 'edu-biomechanics.webp', width: 560, height: 560, beforeHeading: 3,
    alt: 'Two skeletons compare an uneven pelvis with level alignment.',
    caption: 'An illustration of how a leg length difference can affect standing alignment.',
  },
  'childrens-podiatry': {
    file: 'edu-childrens.webp', width: 560, height: 560,
    alt: 'Side view of a child’s foot with the Achilles tendon and heel growth plate labelled.',
    caption: 'The heel growth plate involved in Sever’s disease, one possible cause of heel pain in active children.',
  },
  'custom-orthotics': {
    file: 'dr.abbieclinicshoot-010-1.jpg', width: 1024, height: 683,
    alt: 'Custom insoles with an orthotic fitting information leaflet.',
    caption: 'An example of custom foot orthotics.',
  },
  'foot-mobilisations': {
    file: 'edu-mobilisation.webp', width: 371, height: 239,
    alt: 'A practitioner supports and gently moves a patient’s foot by hand.',
    caption: 'An example of hands-on foot mobilisation.',
  },
  'dry-needling': {
    file: 'tx-dry-needling.webp', width: 640, height: 400,
    alt: 'A practitioner wearing blue gloves applies a fine needle to a patient’s lower leg.',
    caption: 'Dry needling being applied to the lower leg.',
  },
  'neural-therapy': {
    hero: 'hero-neural.webp', file: 'tx-neural.webp', width: 300, height: 188,
    alt: 'Gloved hands support a foot while a syringe is held near the ankle.',
    caption: 'An example of an injection around the foot and ankle.',
  },
  strapping: {
    file: 'edu-strapping.webp', width: 256, height: 252,
    alt: 'A practitioner applies white sports tape across a foot and ankle.',
    caption: 'An example of supportive foot and ankle strapping.',
  },
  'sports-podiatry': {
    file: 'dr.abbieclinicshoot-113.jpg', width: 1024, height: 684,
    alt: 'A podiatrist kneels to examine the alignment of a standing patient’s leg.',
    caption: 'A standing lower-limb assessment as part of sports podiatry.',
  },
  'general-foot-care': {
    file: 'tx-foot-care.webp', width: 640, height: 400,
    alt: 'A podiatrist supports the toes while working on the sole with a foot-care tool.',
    caption: 'An example of routine podiatry care for the skin on the sole of the foot.',
  },
  'shockwave-therapy': {
    file: 'edu-shockwave.webp', width: 371, height: 244,
    alt: 'A handheld shockwave applicator is placed against the back of a heel.',
    caption: 'A shockwave therapy applicator in contact with the heel.',
  },
  'shockwave-therapy-2': {
    file: 'edu-neural.webp', width: 473, height: 482,
    alt: 'Dr Abbie Najjarine examines a patient’s foot while they stand.',
    caption: 'Dr Abbie Najjarine assessing foot position before treatment.',
  },
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

module.exports = {photography, serviceIllustrations, care};

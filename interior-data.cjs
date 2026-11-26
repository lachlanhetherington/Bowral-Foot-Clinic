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

// Body figures use Bowral and Dr. Abbie Clinics imagery, with external credits where applicable.
const detailIllustrations = {
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
  'childrens-foot-problems': {
    file: 'edu-pigeon.webp', width: 510, height: 340, beforeHeading: 3,
    alt: 'A young child walking barefoot on the beach.',
    caption: 'Watching how a child walks can help a podiatrist assess concerns such as in-toeing.',
  },
  'diabetic-foot-care': {
    hero: 'dsc04893-scaled-1.jpg', file: 'diabetic-foot-exam-cdc.jpg', width: 700, height: 464,
    alt: 'A clinician supports and examines the right foot of a seated patient.',
    caption: 'A clinician examines a patient’s foot during a diabetes assessment.',
    credit: { label: 'Amanda Mills, CDC Public Health Image Library', url: 'https://wwwn.cdc.gov/phil/Details.aspx?pid=13705' },
  },
  'foot-ankle-injuries': {
    file: 'cond-shin-splints.webp', width: 720, height: 720, beforeHeading: 4, diagram: true,
    alt: 'Lower-leg diagram highlighting the inner edge of the tibia in red.',
    caption: 'Medial shin splints can cause pain along the inside edge of the shin.',
    descriptions: {
      Metatarsalgia: 'Metatarsalgia is pain in the ball of the foot. It can have several causes, including repetitive activity or pressure from footwear.',
      'Posterior Tibial Tendon Dysfunction': 'The posterior tibial tendon helps support the arch. When it stops working properly, pain may develop along the inside of the ankle and the arch can gradually flatten.',
    },
  },
  'heel-pain': {
    file: 'cond-heel-pain.webp', width: 720, height: 720, beforeHeading: 3, diagram: true,
    alt: 'Side view of the foot labelling the heel bone, plantar fascia and a small heel spur.',
    caption: 'The plantar fascia attaches to the underside of the heel bone, near where a heel spur can form.',
  },
  'knee-hip-back-pain': {
    file: 'edu-knee.webp', width: 256, height: 252,
    alt: 'An illustration highlights the bones and joint at the knee.',
    caption: 'The knee joint, shown between the thigh and lower leg.',
  },
  'toenail-problems': {
    hero: 'hero-ingrown.webp', file: 'ingrown-toenail-niddk.jpg', width: 1344, height: 1240, diagram: true,
    alt: 'Illustration of an ingrown big toenail with the affected edge marked.',
    caption: 'An ingrown toenail along one edge of the big toe.',
    credit: { label: 'National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health', url: 'https://www.niddk.nih.gov/news/media-library/17603' },
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

module.exports = {photography, detailIllustrations, care};

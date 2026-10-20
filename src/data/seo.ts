// Public facts only, matching the visible site. No private address or ratings.
export const origin = 'https://paulaleech.com';
export const descriptions: Record<string, string> = {
  '/': 'Paula Leech is an AASECT-certified sex therapist, supervisor, and author. Therapy in OR, MA, and NY; clinical supervision and professional training online.',
  '/about': 'Meet Paula Leech, LMFT, an AASECT-certified sex therapist and supervisor. Explore her background, credentials, teaching, and approach to intimacy and connection.',
  '/work-with-paula': 'Sex therapy for individuals and couples with Paula Leech, an AASECT-certified sex therapist. In person in Portland and online in Oregon, Massachusetts, and New York.',
  '/supervision': 'Individual and group sex therapy supervision with Paula Leech, an AASECT-certified supervisor. Online support for clinicians pursuing certification.',
  '/courses': 'Explore Paula Leech’s sex therapy trainings and clinical supervision cohorts, including intuition, Sensate Focus, and sexual attitudes and development.',
  '/press': 'Explore Paula Leech’s podcast interviews, articles, and media appearances on sex therapy, anxiety, intimacy, and relationships.',
  '/contact': 'Contact Paula Leech about sex therapy, clinical supervision, or professional training. Find consultation and scheduling options for working together.',
  '/teaching': 'Paula Leech’s teaching record across a university course, professional institutes, clinical intensives, and public workshops.',
};
export const person = {
  '@type': 'Person', '@id': `${origin}/#paula`,
  name: 'Paula Leech', url: `${origin}/about`,
  jobTitle: 'Sex therapist, clinical supervisor, and author',
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'Licensed Marriage and Family Therapist' },
    { '@type': 'EducationalOccupationalCredential', name: 'AASECT Certified Sex Therapist' },
    { '@type': 'EducationalOccupationalCredential', name: 'AASECT Certified Supervisor of Sex Therapy' },
  ],
  sameAs: ['https://instagram.com/paulaleechtherapy'],
};
export const book = {
  '@type': 'Book', '@id': `${origin}/#book`,
  name: 'Overcoming Anxiety in Sex and Relationships',
  author: { '@id': person['@id'] },
  url: 'https://www.amazon.com/Overcoming-Anxiety-Sex-Relationships-Comprehensive/dp/1032438398',
};
export const services: Record<string, object> = {
  '/work-with-paula': {
    '@type': 'Service', '@id': `${origin}/work-with-paula#service`,
    name: 'Sex therapy for individuals and couples',
    provider: { '@id': person['@id'] }, url: `${origin}/work-with-paula`,
    areaServed: ['Oregon', 'Massachusetts', 'New York'].map(name => ({ '@type': 'State', name })),
  },
  '/supervision': {
    '@type': 'Service', '@id': `${origin}/supervision#service`,
    name: 'Individual and group clinical supervision',
    provider: { '@id': person['@id'] }, url: `${origin}/supervision`,
    areaServed: 'Worldwide',
  },
};

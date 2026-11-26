/**
 * library.js — Curated Reading Library for Psychology SkillTrack
 * Prioritises free open-access textbooks alongside classic foundational books.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});

  const BOOKS = [
    {
      id: 'book-psychology-2e',
      number: 1,
      title: 'Psychology 2e',
      author: 'Rose M. Spielman, William J. Jenkins and Marilyn D. Lovett',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 10],
      isFree: true,
      accessLabel: 'Free Open Textbook (OpenStax)',
      category: 'Core Textbook',
      publisher: 'OpenStax (Rice University)',
      url: 'https://openstax.org/details/books/psychology-2e',
      description:
        'Your primary free, peer-reviewed introductory psychology textbook. Covers history, research methods, biopsychology, memory, lifespan development, personality, social psychology, and psychological disorders in clear beginner-friendly chapters.'
    },
    {
      id: 'book-make-it-stick',
      number: 2,
      title: 'Make It Stick: The Science of Successful Learning',
      author: 'Peter C. Brown, Henry L. Roediger III and Mark A. McDaniel',
      weeks: [4, 10, 12],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Cognitive & Study Science',
      publisher: 'Harvard University Press',
      url: 'https://www.hup.harvard.edu/books/9780674729018',
      description:
        'Translates cognitive psychology research on memory, retrieval practice, spacing, and interleaving into practical study habits you can apply immediately across all 12 weeks.'
    },
    {
      id: 'book-development-lifespan',
      number: 3,
      title: 'Development Through the Lifespan',
      author: 'Laura E. Berk',
      weeks: [5],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Developmental Psychology',
      publisher: 'Pearson',
      url: 'https://www.pearson.com/en-us/subject-catalog/p/development-through-the-lifespan/P200000002835',
      description:
        'A clear, research-grounded exploration of human physical, cognitive, emotional, and social growth from infancy and childhood through adolescence, adulthood, and ageing.'
    },
    {
      id: 'book-neuroscience-bear',
      number: 4,
      title: 'Neuroscience: Exploring the Brain',
      author: 'Mark F. Bear, Barry W. Connors and Michael A. Paradiso',
      weeks: [3],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Biological Psychology',
      publisher: 'Wolters Kluwer / Lippincott Williams & Wilkins',
      url: 'https://shop.lww.com/Neuroscience/p/9781451109542',
      description:
        'Visual and accessible guide to neurons, synaptic transmission, brain anatomy, sensory systems, sleep, and how neural circuits shape human behaviour.'
    },
    {
      id: 'book-social-psychology',
      number: 5,
      title: 'Social Psychology',
      author: 'David Myers and Jean Twenge',
      weeks: [7],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Social Psychology',
      publisher: 'McGraw Hill',
      url: 'https://www.mheducation.com/highered/product/social-psychology-myers-twenge/M9781260397116.html',
      description:
        'Engaging introduction to social thinking, persuasion, conformity, group dynamics, attitudes, cultural influence, and interpersonal relationships.'
    },
    {
      id: 'book-the-person',
      number: 6,
      title: 'The Person: A New Introduction to Personality Psychology',
      author: 'Dan P. McAdams',
      weeks: [6],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Personality & Motivation',
      publisher: 'Wiley',
      url: 'https://www.wiley.com/en-us/The+Person%3A+A+New+Introduction+to+Personality+Psychology%2C+5th+Edition-p-9780470129135',
      description:
        'Examines personality through three complementary lenses: dispositional traits (like the Big Five), motivational goals and values, and personal life narratives.'
    },
    {
      id: 'book-skilled-helper',
      number: 7,
      title: 'The Skilled Helper',
      author: 'Gerard Egan and Robert J. Reese',
      weeks: [8, 9, 11],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Helping & Communication Skills',
      publisher: 'Cengage Learning',
      url: 'https://www.cengage.com/c/the-skilled-helper-a-problem-management-and-opportunity-development-approach-to-helping-11e-egan/9781305865716/',
      description:
        'A practical, structured model for active listening, empathy, non-judgmental attending, ethical boundaries, and collaborative problem-solving in helping professions.'
    },
    {
      id: 'book-on-becoming-a-person',
      number: 8,
      title: 'On Becoming a Person',
      author: 'Carl Rogers',
      weeks: [8, 9, 11, 12],
      isFree: false,
      accessLabel: 'Publisher Edition / Library Copy',
      category: 'Humanistic & Clinical Foundations',
      publisher: 'HarperCollins / Mariner Books',
      url: 'https://www.harpercollins.com/products/on-becoming-a-person-carl-r-rogers',
      description:
        'Carl Rogers’ classic collection on unconditional positive regard, empathetic listening, authenticity, and what fosters genuine human growth in therapeutic relationships.'
    },
    {
      id: 'book-noba-open',
      number: 9,
      title: 'Noba Project: Open Psychology Modules',
      author: 'Diener Education Fund (Ed Biswas-Diener & Robert Biswas-Diener)',
      weeks: [1, 2, 4, 6, 7, 10],
      isFree: true,
      accessLabel: 'Free Open Resource (Noba)',
      category: 'Free Supplement',
      publisher: 'Diener Education Fund',
      url: 'https://nobaproject.com/browse-content',
      description:
        'Free modular chapters written by leading psychologists covering research ethics, statistics basics, attention, emotion, and cultural psychology.'
    },
    {
      id: 'book-apa-careers',
      number: 10,
      title: 'APA Ethical Principles & Career Pathways Guide',
      author: 'American Psychological Association (APA)',
      weeks: [2, 8, 11, 12],
      isFree: true,
      accessLabel: 'Free Open Resource (APA)',
      category: 'Ethics & Career Planning',
      publisher: 'American Psychological Association',
      url: 'https://www.apa.org/ethics/code',
      description:
        'Official open-access ethics principles and career pathway references to help aspiring psychologists understand professional standards, qualifications, and responsibilities.'
    }
  ];

  SkillTrack.Library = {
    BOOKS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOOKS };
  }
})(typeof window !== 'undefined' ? window : globalThis);

/**
 * curriculum.js — Complete 12-Week Beginner Psychology Skill Learning Plan
 * Every module includes all 10 required pedagogical sections and an estimated
 * weekly commitment of 4–6 hours.
 */
(function (global) {
  'use strict';

  const SkillTrack = (global.SkillTrack = global.SkillTrack || {});

  const MODULES = [
    {
      week: 1,
      title: 'Introduction to Psychology',
      pillar: 'Foundations',
      estimatedHours: '4–6 hours',
      summary:
        'Understand what psychology truly is as a scientific discipline, how it evolved from philosophy, its major schools of thought, core branches, and real-world career pathways.',
      objectives: [
        'Define psychology as the scientific study of mind and behaviour, distinguishing science from pop psychology.',
        'Trace key historical milestones from Wundt and James to modern cognitive and biopsychosocial perspectives.',
        'Compare major schools of thought (structuralism, functionalism, psychoanalysis, behaviourism, humanism, cognitive).',
        'Identify major branches of psychology and entry-to-professional career opportunities.'
      ],
      topics: [
        {
          title: 'Meaning and definition of psychology',
          detail: 'Explore how psychology studies overt behaviour and internal mental processes using systematic empirical methods.'
        },
        {
          title: 'History of psychology',
          detail: 'Learn how Wilhelm Wundt established the first experimental lab in 1879 and how William James shaped functionalism.'
        },
        {
          title: 'Major schools of thought',
          detail: 'Compare psychodynamic (Freud), behavioural (Watson, Skinner), humanistic (Rogers, Maslow), and cognitive perspectives.'
        },
        {
          title: 'Branches of psychology',
          detail: 'Survey clinical, counselling, developmental, cognitive, biological, social, forensic, and organisational psychology.'
        },
        {
          title: 'Career opportunities',
          detail: 'Map roles requiring undergraduate training vs. postgraduate clinical, research, or practitioner licensure.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapter 1 and create a 1-page visual timeline of psychology’s history.',
        'Session 2 (1.5 hrs): Make a comparison table of the 6 major schools of thought with one core idea and key figure each.',
        'Session 3 (1.5 hrs): Explore 5 branches of psychology and write down which 2 resonate most with your long-term goals.',
        'Session 4 (1 hr): Complete the career reflection and upload your Week 1 study notes link.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 1: Introduction to Psychology',
        'Noba Project (Free) — History of Psychology module'
      ],
      practicalExercises: [
        'Myth-Busting Exercise: Find 3 common psychology myths online and evaluate each using scientific reasoning.',
        'Perspective Lens: Explain a simple habit (e.g., exam anxiety) from behavioural, cognitive, and humanistic viewpoints.'
      ],
      tasks: [
        { id: 'w1-t1', label: 'Read OpenStax Psychology 2e Chapter 1 (Sections 1.1–1.4)', duration: '75 min' },
        { id: 'w1-t2', label: 'Create a historical timeline of psychology from 1879 to modern approaches', duration: '45 min' },
        { id: 'w1-t3', label: 'Summarise the 6 major schools of thought in your own words', duration: '60 min' },
        { id: 'w1-t4', label: 'Research 3 psychology career paths and note required qualifications', duration: '45 min' },
        { id: 'w1-t5', label: 'Complete the Perspective Lens practical exercise & Week 1 reflection', duration: '45 min' }
      ],
      deliverables: [
        '1-page Psychology Schools & History summary sheet (Google Doc, Notion page, or PDF link).',
        'Short list of 3 psychology subfields of personal interest.'
      ],
      reflectionQuestions: [
        'What surprised you most about how scientific psychology differs from everyday intuition?',
        'Which school of thought or branch of psychology feels most aligned with why you want to become a psychologist?',
        'What foundational skill do you feel excited—or nervous—to build over the next 11 weeks?'
      ]
    },
    {
      week: 2,
      title: 'Research Methods',
      pillar: 'Research Literacy',
      estimatedHours: '4–6 hours',
      summary:
        'Build scientific thinking skills: understand how psychologists formulate testable hypotheses, design experiments and surveys, control variables, and protect participants ethically.',
      objectives: [
        'Explain the steps of the scientific method and why falsifiability matters in psychology.',
        'Identify independent, dependent, and confounding variables in a research study.',
        'Compare experiments, naturalistic observation, surveys, and case studies with their strengths and limits.',
        'Apply core research ethics principles: informed consent, confidentiality, and debriefing.'
      ],
      topics: [
        {
          title: 'Scientific methods',
          detail: 'Understand observation, theory building, operational definitions, replication, and peer review.'
        },
        {
          title: 'Hypotheses and variables',
          detail: 'Practice distinguishing independent variables (manipulated), dependent variables (measured), and extraneous variables.'
        },
        {
          title: 'Experiments and observations',
          detail: 'Learn random assignment, control vs. experimental groups, placebo effects, and naturalistic/structured observation.'
        },
        {
          title: 'Surveys and case studies',
          detail: 'See how questionnaires capture broad trends while in-depth case studies illuminate rare phenomena.'
        },
        {
          title: 'Research ethics',
          detail: 'Study historical lessons (e.g., Belmont principles) and modern Institutional Review Board (IRB) safeguards.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapter 2 on Psychological Research.',
        'Session 2 (1.5 hrs): Design a mock mini-study hypothesis on sleep duration and focus, naming IV, DV, and 2 confounds.',
        'Session 3 (1.5 hrs): Review the APA Ethics Code summary and evaluate 2 ethical dilemmas.',
        'Session 4 (1 hr): Write your Week 2 reflection and submit your mini-study design link.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 2: Psychological Research',
        'APA Ethical Principles of Psychologists and Code of Conduct (Free, Section 8: Research)'
      ],
      practicalExercises: [
        'Study Anatomy Breakdown: Read a short psychology news summary and identify the sample, method, IV/DV, and limitations.',
        'Informed Consent Draft: Write a 6-sentence beginner informed consent paragraph for a hypothetical memory survey.'
      ],
      tasks: [
        { id: 'w2-t1', label: 'Read OpenStax Psychology 2e Chapter 2: Psychological Research', duration: '75 min' },
        { id: 'w2-t2', label: 'Define IV, DV, random assignment, and operational definition with examples', duration: '45 min' },
        { id: 'w2-t3', label: 'Compare experiments, observations, surveys, and case studies in a 4-row matrix', duration: '50 min' },
        { id: 'w2-t4', label: 'Draft a mock mini-study design + sample informed consent paragraph', duration: '60 min' },
        { id: 'w2-t5', label: 'Record Week 2 reflection and save your evidence link', duration: '40 min' }
      ],
      deliverables: [
        'Mock mini-study design outline (hypothesis, variables, method, ethical safeguards).',
        'Comparison matrix of 4 major research methods.'
      ],
      reflectionQuestions: [
        'Why is random assignment essential for claiming cause and effect, whereas surveys only show relationships?',
        'What ethical tension can arise when a researcher needs participants not to know the full hypothesis beforehand?',
        'How will learning research methods change how you read psychology headlines on social media?'
      ]
    },
    {
      week: 3,
      title: 'Biological Psychology',
      pillar: 'Biopsychology',
      estimatedHours: '4–6 hours',
      summary:
        'Explore the biological foundations of thoughts, emotions, and behaviour—from neurons and neurotransmitters to brain lobes, the nervous system, sleep, and stress physiology.',
      objectives: [
        'Identify major brain structures (cortex lobes, limbic system, brainstem) and their core functions.',
        'Explain how neurons communicate via action potentials and neurotransmitters across synapses.',
        'Differentiate the central and peripheral nervous systems, including sympathetic vs. parasympathetic responses.',
        'Connect sleep cycles and chronic stress responses to mental and physical wellbeing.'
      ],
      topics: [
        {
          title: 'Structure of the brain',
          detail: 'Map the frontal, parietal, temporal, and occipital lobes alongside the amygdala, hippocampus, and cerebellum.'
        },
        {
          title: 'Neurons and neurotransmitters',
          detail: 'Learn dendrites, axons, myelin, synaptic transmission, and key messengers like dopamine, serotonin, GABA, and glutamate.'
        },
        {
          title: 'Nervous system',
          detail: 'Trace the CNS (brain & spinal cord) and PNS (somatic and autonomic: fight-or-flight vs. rest-and-digest).'
        },
        {
          title: 'Brain and behaviour',
          detail: 'Examine neuroplasticity, lateralisation, and how brain injury cases revealed structure-function links.'
        },
        {
          title: 'Sleep and stress',
          detail: 'Understand circadian rhythms, REM/NREM sleep stages, cortisol/HPA axis activation, and stress recovery.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapter 3 (Biopsychology) and parts of Chapter 4 (States of Consciousness: Sleep).',
        'Session 2 (1.5 hrs): Draw or label a simple diagram of a neuron and the 4 cerebral lobes.',
        'Session 3 (1.5 hrs): Track your own sleep and stress patterns for 3 days using a brief log.',
        'Session 4 (1 hr): Complete the neurotransmitter matching exercise and Week 3 reflection.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 3: Biopsychology & Chapter 4 (Sleep)',
        'Neuroscience: Exploring the Brain — Bear, Connors & Paradiso (Reference Chapters 1–2)'
      ],
      practicalExercises: [
        'Labelled Neuron & Brain Sketch: Create a clean one-page annotated diagram (hand-drawn photo or digital slide).',
        '3-Day Autonomic Self-Check: Note moments when your sympathetic vs. parasympathetic system felt most active.'
      ],
      tasks: [
        { id: 'w3-t1', label: 'Read OpenStax Psychology 2e Chapter 3 (Biopsychology)', duration: '80 min' },
        { id: 'w3-t2', label: 'Read OpenStax Chapter 4 sections on sleep stages and circadian rhythms', duration: '45 min' },
        { id: 'w3-t3', label: 'Create an annotated diagram of a neuron and the 4 brain lobes', duration: '60 min' },
        { id: 'w3-t4', label: 'Make a flashcard summary of 5 key neurotransmitters and their roles', duration: '45 min' },
        { id: 'w3-t5', label: 'Complete the 3-day sleep/stress observation and Week 3 reflection', duration: '45 min' }
      ],
      deliverables: [
        'Annotated neuron & brain lobe diagram.',
        '5-neurotransmitter reference guide + short sleep/stress log.'
      ],
      reflectionQuestions: [
        'How does understanding the stress response (sympathetic vs. parasympathetic) change how you view anxiety?',
        'Why is avoiding "one brain area does only one thing" important when learning biopsychology?',
        'What one sleep or stress habit could you adjust based on this week’s biology?'
      ]
    },
    {
      week: 4,
      title: 'Cognitive Psychology',
      pillar: 'Cognition & Learning',
      estimatedHours: '4–6 hours',
      summary:
        'Discover how humans perceive, attend, learn, remember, reason, and solve problems—and immediately use cognitive science to make your own studying far more effective.',
      objectives: [
        'Explain encoding, storage, and retrieval across sensory, short-term/working, and long-term memory.',
        'Distinguish classical conditioning, operant conditioning, and observational learning.',
        'Describe selective attention, cognitive load, and why multitasking reduces accuracy.',
        'Recognise common heuristics, cognitive biases, and effective problem-solving strategies.'
      ],
      topics: [
        {
          title: 'Memory',
          detail: 'Explore the Atkinson-Shiffrin model, working memory, forgetting curves, and why retrieval practice beats rereading.'
        },
        {
          title: 'Learning',
          detail: 'Compare Pavlov’s classical conditioning, Skinner’s reinforcement schedules, and Bandura’s social learning.'
        },
        {
          title: 'Attention',
          detail: 'Examine selective attention, inattentional blindness, and managing cognitive load while studying.'
        },
        {
          title: 'Thinking and reasoning',
          detail: 'Contrast algorithms vs. heuristics, confirmation bias, availability bias, and metacognition.'
        },
        {
          title: 'Problem-solving',
          detail: 'Learn functional fixedness, mental sets, insight, and breaking complex problems into subgoals.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapters 6 (Learning) and 8 (Memory).',
        'Session 2 (1.5 hrs): Read Make It Stick Chapters 1–2 (or summary) and test active recall on Weeks 1–3.',
        'Session 3 (1.5 hrs): Complete the Bias Detective and Attention experiment exercises.',
        'Session 4 (1 hr): Design a personal spaced-repetition study routine and write Week 4 reflection.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 6 (Learning), Chapter 7 (Thinking), Chapter 8 (Memory)',
        'Make It Stick — Brown, Roediger & McDaniel (Chapters 1–3)'
      ],
      practicalExercises: [
        'Closed-Book Recall Test: Without looking at notes, write down everything you remember from Weeks 1–3, then check gaps.',
        'Bias Audit: Spot 2 examples of confirmation or availability bias in everyday decision-making.'
      ],
      tasks: [
        { id: 'w4-t1', label: 'Read OpenStax Psychology 2e Chapter 8 (Memory) and key sections of Chapter 6 & 7', duration: '90 min' },
        { id: 'w4-t2', label: 'Study the principles of retrieval practice and spaced repetition from Make It Stick', duration: '60 min' },
        { id: 'w4-t3', label: 'Run a 15-minute closed-book recall test covering Weeks 1–3', duration: '30 min' },
        { id: 'w4-t4', label: 'Map classical vs. operant conditioning with 2 real-life examples each', duration: '45 min' },
        { id: 'w4-t5', label: 'Log your cognitive bias audit and Week 4 reflection', duration: '45 min' }
      ],
      deliverables: [
        'Active recall self-test sheet for Weeks 1–3.',
        'Personal study strategy plan incorporating spacing and retrieval practice.'
      ],
      reflectionQuestions: [
        'Which ineffective study habit (like passive rereading) did cognitive psychology expose for you this week?',
        'How does knowing about cognitive biases foster humility in future psychological work?',
        'What problem-solving barrier (like functional fixedness) have you noticed in your own daily life?'
      ]
    },
    {
      week: 5,
      title: 'Developmental Psychology',
      pillar: 'Lifespan Growth',
      estimatedHours: '4–6 hours',
      summary:
        'Follow human psychological development across the entire lifespan—from infancy and childhood attachment through adolescence, adulthood, and healthy ageing.',
      objectives: [
        'Describe key cognitive, emotional, and social milestones across childhood and adolescence.',
        'Compare major developmental frameworks: Piaget, Vygotsky, Erikson, and Bowlby/Ainsworth attachment.',
        'Understand adulthood transitions, identity, relationships, and cognitive/social changes in ageing.',
        'Evaluate nature-and-nurture interactions across different life stages.'
      ],
      topics: [
        {
          title: 'Childhood development',
          detail: 'Learn attachment styles, language acquisition, theory of mind, and Piaget’s stages of cognitive growth.'
        },
        {
          title: 'Adolescence',
          detail: 'Explore prefrontal cortex maturation, identity exploration (Erikson), peer influence, and autonomy.'
        },
        {
          title: 'Adulthood',
          detail: 'Examine emerging adulthood, intimacy vs. isolation, career and family transitions, and midlife generativity.'
        },
        {
          title: 'Ageing',
          detail: 'Separate normal cognitive ageing (fluid vs. crystallised intelligence) from neurodegenerative illness.'
        },
        {
          title: 'Major developmental theories',
          detail: 'Synthesise Piaget, Vygotsky’s zone of proximal development, Erikson’s 8 stages, and Kohlberg’s moral reasoning.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapter 9 (Lifespan Development).',
        'Session 2 (1.5 hrs): Build a Lifespan Matrix comparing Piaget, Erikson, and Attachment across ages.',
        'Session 3 (1.5 hrs): Analyse a real or fictional case vignette across two developmental stages.',
        'Session 4 (1 hr): Write Week 5 reflection and upload your Lifespan Matrix.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 9: Lifespan Development',
        'Development Through the Lifespan — Laura E. Berk (Overview Chapters 1 & 5)'
      ],
      practicalExercises: [
        'Toy or Activity Evaluation: Pick a children’s game/book and explain which cognitive or social skill it supports.',
        'Vygotsky Scaffolding Plan: Describe how a mentor scaffolds a beginner learning a new skill.'
      ],
      tasks: [
        { id: 'w5-t1', label: 'Read OpenStax Psychology 2e Chapter 9 (Lifespan Development)', duration: '85 min' },
        { id: 'w5-t2', label: 'Create a summary chart of Erikson’s 8 psychosocial stages', duration: '50 min' },
        { id: 'w5-t3', label: 'Compare Piaget’s cognitive stages with Vygotsky’s sociocultural theory', duration: '50 min' },
        { id: 'w5-t4', label: 'Write short notes on attachment styles and healthy ageing myths vs. facts', duration: '45 min' },
        { id: 'w5-t5', label: 'Complete practical scaffolding exercise and Week 5 reflection', duration: '45 min' }
      ],
      deliverables: [
        'Lifespan Theories Comparison Chart (Piaget, Vygotsky, Erikson, Attachment).',
        'Short developmental vignette analysis.'
      ],
      reflectionQuestions: [
        'How does seeing behaviour through a developmental lens foster greater patience and empathy?',
        'Which Erikson stage do you feel you are navigating right now, and why?',
        'Why is it essential for psychologists to study ageing just as carefully as childhood?'
      ]
    },
    {
      week: 6,
      title: 'Personality and Motivation',
      pillar: 'Individual Differences',
      estimatedHours: '4–6 hours',
      summary:
        'Explore what makes each person unique: major personality theories, the Big Five trait framework, intrinsic vs. extrinsic motivation, emotional processes, and individual differences.',
      objectives: [
        'Compare psychodynamic, humanistic, social-cognitive, and trait approaches to personality.',
        'Explain the Big Five (OCEAN) traits and how personality is measured responsibly.',
        'Distinguish intrinsic vs. extrinsic motivation, self-determination theory, and Maslow’s hierarchy.',
        'Describe major theories of emotion and how individual differences shape behaviour.'
      ],
      topics: [
        {
          title: 'Personality theories',
          detail: 'Contrast Freud’s structural model, Rogers/Maslow’s self-actualisation, Bandura’s reciprocal determinism, and trait models.'
        },
        {
          title: 'Big Five personality traits',
          detail: 'Understand Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism as continuous spectra.'
        },
        {
          title: 'Motivation',
          detail: 'Study drive reduction, arousal, intrinsic vs. extrinsic rewards, autonomy, competence, and relatedness.'
        },
        {
          title: 'Emotions',
          detail: 'Review James-Lange, Cannon-Bard, Schachter-Singer two-factor theory, and emotional regulation.'
        },
        {
          title: 'Individual differences',
          detail: 'Appreciate temperament, cultural shaping of personality, and avoiding rigid personality labelling.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapters 10 (Emotion and Motivation) and 11 (Personality).',
        'Session 2 (1.5 hrs): Take a reputable Big Five (IPIP-based) reflection exercise and interpret traits non-judgmentally.',
        'Session 3 (1.5 hrs): Map what fuels your intrinsic motivation for learning psychology.',
        'Session 4 (1 hr): Write Week 6 reflection and upload personality & motivation summary.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 10 (Emotion & Motivation) & Chapter 11 (Personality)',
        'The Person — Dan P. McAdams (Chapter 1 & Trait Overview)'
      ],
      practicalExercises: [
        'OCEAN Reflection Grid: Write one strength and one growth edge for each of the Big Five dimensions—showing traits are neither "good" nor "bad".',
        'Motivation Audit: Identify 3 activities where intrinsic motivation drives you vs. 2 driven by external pressure.'
      ],
      tasks: [
        { id: 'w6-t1', label: 'Read OpenStax Psychology 2e Chapter 10 (Emotion and Motivation)', duration: '70 min' },
        { id: 'w6-t2', label: 'Read OpenStax Psychology 2e Chapter 11 (Personality)', duration: '70 min' },
        { id: 'w6-t3', label: 'Create a study guide on the Big Five (OCEAN) traits and measurement basics', duration: '45 min' },
        { id: 'w6-t4', label: 'Compare 3 theories of emotion using one concrete scenario', duration: '45 min' },
        { id: 'w6-t5', label: 'Complete the Motivation Audit and Week 6 reflection', duration: '45 min' }
      ],
      deliverables: [
        'Big Five (OCEAN) balanced trait guide.',
        'Personal Motivation & Emotion notes.'
      ],
      reflectionQuestions: [
        'Why is viewing personality traits as continuous spectra healthier and more scientific than "personality types"?',
        'What keeps your motivation steady when a complex topic feels challenging?',
        'How do emotions provide useful information while sometimes needing conscious regulation?'
      ]
    },
    {
      week: 7,
      title: 'Social Psychology',
      pillar: 'Social & Cultural Context',
      estimatedHours: '4–6 hours',
      summary:
        'Examine how human thoughts, feelings, and actions are shaped by social situations, group dynamics, attitudes, conformity, obedience, and culture.',
      objectives: [
        'Explain attribution theory and the fundamental attribution error in everyday social judgement.',
        'Analyse classic studies on conformity (Asch), obedience (Milgram), and groupthink.',
        'Describe how attitudes form, shift via cognitive dissonance, and guide behaviour.',
        'Recognise how cultural norms and relationships shape identity, prosociality, and prejudice.'
      ],
      topics: [
        {
          title: 'Social influence',
          detail: 'Explore persuasion routes (central vs. peripheral), compliance techniques, and bystander effects.'
        },
        {
          title: 'Group behaviour',
          detail: 'Understand social facilitation, social loafing, deindividuation, group polarisation, and groupthink.'
        },
        {
          title: 'Attitudes',
          detail: 'Study cognitive dissonance (Festinger) and how behaviour and attitudes mutually influence each other.'
        },
        {
          title: 'Conformity',
          detail: 'Distinguish normative vs. informational social influence and conditions that foster independent dissent.'
        },
        {
          title: 'Culture and human relationships',
          detail: 'Compare individualistic and collectivistic norms, empathy, attraction, and reducing intergroup bias.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapter 12 (Social Psychology).',
        'Session 2 (1.5 hrs): Analyse a real-world group decision or social media trend using social psychology concepts.',
        'Session 3 (1.5 hrs): Practice spotting the fundamental attribution error in daily news or conversation.',
        'Session 4 (1 hr): Write Week 7 reflection and add your social analysis link.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 12: Social Psychology',
        'Social Psychology — David Myers & Jean Twenge (Chapters on Conformity & Culture)'
      ],
      practicalExercises: [
        'Situation vs. Disposition Journal: Notice 2 times you judged someone’s character, and brainstorm 3 situational factors that might explain their behaviour.',
        'Groupthink Prevention Checklist: Write 4 rules a study or work team can use to encourage honest dissent.'
      ],
      tasks: [
        { id: 'w7-t1', label: 'Read OpenStax Psychology 2e Chapter 12 (Social Psychology)', duration: '85 min' },
        { id: 'w7-t2', label: 'Summarise Asch’s conformity and Milgram’s obedience findings + ethical critiques', duration: '50 min' },
        { id: 'w7-t3', label: 'Explain cognitive dissonance and fundamental attribution error with everyday examples', duration: '45 min' },
        { id: 'w7-t4', label: 'Create a 4-rule Groupthink Prevention Checklist', duration: '40 min' },
        { id: 'w7-t5', label: 'Complete the Situation vs. Disposition exercise & Week 7 reflection', duration: '50 min' }
      ],
      deliverables: [
        'Social Influence & Conformity concept brief.',
        'Groupthink Prevention Checklist & Attribution reflection.'
      ],
      reflectionQuestions: [
        'How does understanding situational power increase compassion while keeping personal accountability?',
        'Have you ever experienced cognitive dissonance? How did you resolve the tension?',
        'Why must a psychologist understand cultural context before interpreting someone’s behaviour?'
      ]
    },
    {
      week: 8,
      title: 'Mental Health and Ethics',
      pillar: 'Clinical & Ethical Awareness',
      estimatedHours: '4–6 hours',
      summary:
        'Develop compassionate mental health literacy: learn introductory models of psychological disorders, evidence-based therapies, stigma reduction, and core professional ethics.',
      objectives: [
        'Define mental health as a continuum and distinguish everyday distress from diagnosable disorders.',
        'Gain an introductory overview of anxiety, mood, trauma-related, and other major categories without self-diagnosing.',
        'Compare major evidence-based therapies (CBT, psychodynamic, humanistic, integrative) and biopsychosocial care.',
        'Apply core ethical principles: confidentiality, competence, informed consent, non-maleficence, and cultural respect.'
      ],
      topics: [
        {
          title: 'Mental health literacy',
          detail: 'Understand protective factors, biopsychosocial vulnerability, help-seeking pathways, and crisis signposting.'
        },
        {
          title: 'Psychological disorders at an introductory level',
          detail: 'Review how DSM/ICD frameworks classify distress using criteria of distress, dysfunction, and cultural context.'
        },
        {
          title: 'Psychological therapies',
          detail: 'Compare cognitive behavioural therapy (CBT), person-centred therapy, psychodynamic therapy, and medication.'
        },
        {
          title: 'Professional ethics',
          detail: 'Study APA/BPS ethical pillars: beneficence, non-maleficence, confidentiality limits, and practicing within competence.'
        },
        {
          title: 'Stigma and awareness',
          detail: 'Identify how public stigma and self-stigma block care, and how person-first, respectful language combats stigma.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Read OpenStax Psychology 2e Chapters 15 (Psychological Disorders) and 16 (Therapy and Treatment).',
        'Session 2 (1.5 hrs): Read APA General Ethical Principles (A–E) and summarise each in plain beginner language.',
        'Session 3 (1.5 hrs): Complete a Stigma & Language Audit and compare 3 therapy modalities.',
        'Session 4 (1 hr): Write Week 8 reflection and upload your Ethics & Therapy comparison.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 15 (Disorders) & Chapter 16 (Therapy & Treatment)',
        'APA Ethical Principles (Free) & On Becoming a Person — Carl Rogers (Chapters 2–3)'
      ],
      practicalExercises: [
        'Person-First Language Rewrite: Rewrite 5 stigmatising phrases into respectful, accurate clinical/human language.',
        'Ethical Boundary Scenario: Decide how a trainee should respond when asked for therapy advice by a friend.'
      ],
      tasks: [
        { id: 'w8-t1', label: 'Read OpenStax Psychology 2e Chapters 15 and 16 (selected overview sections)', duration: '95 min' },
        { id: 'w8-t2', label: 'Summarise the 5 APA General Ethical Principles in plain language', duration: '45 min' },
        { id: 'w8-t3', label: 'Compare CBT, person-centred therapy, and psychodynamic therapy in a table', duration: '45 min' },
        { id: 'w8-t4', label: 'Complete the Person-First Language Rewrite exercise', duration: '40 min' },
        { id: 'w8-t5', label: 'Record Week 8 reflection on ethics, boundaries, and stigma', duration: '45 min' }
      ],
      deliverables: [
        'Plain-language Ethical Principles summary.',
        'Evidence-based Therapies comparison table.'
      ],
      reflectionQuestions: [
        'Why is it crucial for beginner psychology learners not to diagnose themselves or friends?',
        'What are the real-world limits of confidentiality, and why do those limits exist?',
        'How can everyday language reduce mental health stigma in your community?'
      ]
    },
    {
      week: 9,
      title: 'Communication and Helping Skills',
      pillar: 'Interpersonal Practice',
      estimatedHours: '4–6 hours',
      summary:
        'Practise the human heart of psychology: active listening, accurate empathy, open-ended communication, non-judgmental presence, and healthy professional boundaries.',
      objectives: [
        'Demonstrate active listening behaviours (attending, paraphrasing, summarising, silence).',
        'Differentiate empathy from sympathy, fixing, or premature advice-giving.',
        'Use open-ended questions and reflective statements to invite deeper expression.',
        'Maintain warm, non-judgmental responses alongside clear personal and professional boundaries.'
      ],
      topics: [
        {
          title: 'Active listening',
          detail: 'Learn Egan’s SOLER attending posture, tracking emotions, paraphrasing content, and tolerating thoughtful silence.'
        },
        {
          title: 'Empathy',
          detail: 'Understand Carl Rogers’ concept of stepping into another’s frame of reference without losing your own grounding.'
        },
        {
          title: 'Communication skills',
          detail: 'Practise open vs. closed questions, minimal encouragers, clarifying, and reflecting feelings accurately.'
        },
        {
          title: 'Non-judgmental responses',
          detail: 'Notice automatic "fixing", moralising, or interrupting habits and replace them with curious acceptance.'
        },
        {
          title: 'Professional boundaries',
          detail: 'Define scope of role, dual relationships, emotional sustainability, and knowing when to refer to professionals.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Study chapters from The Skilled Helper (Egan) and On Becoming a Person (Rogers) on listening and empathy.',
        'Session 2 (1.5 hrs): Practise a 15-minute structured listening exercise with a trusted friend/peer (on an everyday non-crisis topic).',
        'Session 3 (1.5 hrs): Write 10 empathetic reflection stems and convert 5 closed questions into open ones.',
        'Session 4 (1 hr): Write Week 9 reflection and upload your communication practice log.'
      ],
      recommendedReading: [
        'The Skilled Helper — Gerard Egan & Robert J. Reese (Part I: Attending & Listening)',
        'On Becoming a Person — Carl Rogers (Chapter on Characteristics of a Helping Relationship)'
      ],
      practicalExercises: [
        'No-Advice Listening Challenge: Hold a 10-minute conversation where your only goal is to listen, paraphrase, and reflect feelings—without giving advice.',
        'Open Question Makeover: Rewrite 5 "Did you...?" questions into "What was it like when...?" prompts.'
      ],
      tasks: [
        { id: 'w9-t1', label: 'Study active listening & empathy principles from Egan and Rogers', duration: '75 min' },
        { id: 'w9-t2', label: 'Write a reference sheet of 10 empathetic reflection starters', duration: '40 min' },
        { id: 'w9-t3', label: 'Convert 5 closed/advice-heavy responses into non-judgmental open prompts', duration: '45 min' },
        { id: 'w9-t4', label: 'Complete the 10-minute No-Advice Listening Challenge with a peer', duration: '45 min' },
        { id: 'w9-t5', label: 'Document boundary principles and record Week 9 reflection', duration: '45 min' }
      ],
      deliverables: [
        'Helping Skills Phrasebook (10 reflections + 5 open-question rewrites).',
        'Self-evaluation note from the 10-minute listening challenge.'
      ],
      reflectionQuestions: [
        'How hard was it to resist jumping in with advice during the listening exercise?',
        'What is the difference between feeling sorry for someone (sympathy) and understanding their world (empathy)?',
        'Why do clear boundaries protect both the helper and the person being supported?'
      ]
    },
    {
      week: 10,
      title: 'Statistics and Psychological Research',
      pillar: 'Quantitative Literacy',
      estimatedHours: '4–6 hours',
      summary:
        'Demystify psychological data! Learn central tendency (mean, median, mode), spread, reading graphs critically, correlation vs. causation, and dissecting a real psychology research paper.',
      objectives: [
        'Calculate and interpret mean, median, and mode, knowing when outliers skew the mean.',
        'Read bar charts, histograms, and scatterplots accurately without falling for misleading axes.',
        'Explain correlation coefficients (r from -1 to +1) and why correlation never proves causation.',
        'Navigate the IMRaD structure (Introduction, Method, Results, Discussion) of an academic psychology paper.'
      ],
      topics: [
        {
          title: 'Mean, median and mode',
          detail: 'Calculate measures of central tendency and recognise how extreme scores affect averages.'
        },
        {
          title: 'Data interpretation',
          detail: 'Understand range, standard deviation conceptually, sample size, and basic statistical significance (p-value intuition).'
        },
        {
          title: 'Graphs',
          detail: 'Read scatterplots, bar graphs, and distributions—and spot truncated y-axes or cherry-picked baselines.'
        },
        {
          title: 'Correlation',
          detail: 'Interpret positive, negative, and zero correlations alongside third-variable problems.'
        },
        {
          title: 'Understanding research papers',
          detail: 'Learn a step-by-step method to read abstract, research question, sample, key findings, and limitations.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Review OpenStax Psychology 2e Chapter 2 statistical appendix / Noba statistical reasoning module.',
        'Session 2 (1.5 hrs): Work through a small sample dataset (10 study-hour scores) to compute mean, median, mode, and draw a simple plot.',
        'Session 3 (1.5 hrs): Download 1 open-access psychology article (e.g. PLOS ONE or APA open article) and complete a Paper Breakdown Sheet.',
        'Session 4 (1 hr): Write Week 10 reflection and upload your paper breakdown.'
      ],
      recommendedReading: [
        'Psychology 2e (OpenStax, Free) — Chapter 2 (Analyzing Findings & Correlational Research)',
        'Noba Project (Free) — Statistical Thinking & Research Designs'
      ],
      practicalExercises: [
        'Outlier Experiment: Compute mean/median for [2, 3, 4, 4, 5], then change 5 to 50 and observe what shifts.',
        '1-Page Paper Dissection: Summarise an open-access psychology study in 5 plain-English bullet points.'
      ],
      tasks: [
        { id: 'w10-t1', label: 'Review descriptive statistics and correlation sections in OpenStax / Noba', duration: '70 min' },
        { id: 'w10-t2', label: 'Calculate mean, median, and mode on a practice dataset including an outlier', duration: '45 min' },
        { id: 'w10-t3', label: 'Interpret 3 sample scatterplots (positive, negative, zero correlation)', duration: '40 min' },
        { id: 'w10-t4', label: 'Read and dissect 1 open-access psychology journal article (IMRaD)', duration: '80 min' },
        { id: 'w10-t5', label: 'Upload your Paper Breakdown link and write Week 10 reflection', duration: '40 min' }
      ],
      deliverables: [
        '1-page Research Paper Dissection (Question, Sample, Method, Result, Limitation).',
        'Mini descriptive statistics practice worksheet.'
      ],
      reflectionQuestions: [
        'Which part of reading a real psychology research paper felt intimidating at first, and what helped?',
        'Can you think of a real-life headline that confused correlation with causation?',
        'Why is quantitative literacy essential even for counselling or clinical psychologists?'
      ]
    },
    {
      week: 11,
      title: 'Professional Development',
      pillar: 'Career & Identity',
      estimatedHours: '4–6 hours',
      summary:
        'Connect your learning to your future profession: explore accredited psychology qualifications, professional responsibilities, lifelong supervision, and assess your current strengths and gaps.',
      objectives: [
        'Map realistic academic and training pathways toward becoming a licensed or chartered psychologist.',
        'Identify professional responsibilities: continuing education, supervision, cultural humility, and self-care.',
        'Synthesise your emerging research literacy, writing, and interpersonal communication skills.',
        'Complete an honest personal skill assessment to guide your next stage of study.'
      ],
      topics: [
        {
          title: 'Psychology career pathways',
          detail: 'Explore clinical, counselling, educational, health, forensic, neuropsychology, and academic research tracks.'
        },
        {
          title: 'Required qualifications',
          detail: 'Clarify bachelor’s/conversion degrees, postgraduate training (MSc/DClinPsy/PhD/PsyD), supervised hours, and registration.'
        },
        {
          title: 'Professional responsibilities',
          detail: 'Understand clinical supervision, reflective practice, recordkeeping, and burnout prevention.'
        },
        {
          title: 'Research and communication skills',
          detail: 'Review how psychologists communicate evidence clearly to clients, teams, and the public.'
        },
        {
          title: 'Personal skill assessment',
          detail: 'Audit your progress across scientific thinking, empathy, ethics, statistics, and study habits.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Research qualification requirements in your country/region (e.g., APA, BPS, or local psychology board).',
        'Session 2 (1.5 hrs): Review 2 university psychology degree syllabi or career profiles to see how Week 1–10 topics align.',
        'Session 3 (1.5 hrs): Complete a 5-domain Personal Skill Self-Assessment matrix.',
        'Session 4 (1 hr): Write Week 11 reflection and begin outlining Week 12’s topic presentation.'
      ],
      recommendedReading: [
        'APA Career Pathways Guide (Free) — Careers in Psychology',
        'The Skilled Helper — Egan & Reese (Reflective Practice & Professionalism sections)'
      ],
      practicalExercises: [
        'Degree & Pathway Map: Outline the next 2–5 years of formal or preparatory steps realistic for your life.',
        '5-Pillar Self-Rating: Rate yourself 1–5 on Knowledge, Research, Communication, Ethics, and Consistency with concrete evidence.'
      ],
      tasks: [
        { id: 'w11-t1', label: 'Research national/local licensing & degree pathways to become a psychologist', duration: '70 min' },
        { id: 'w11-t2', label: 'List 5 ongoing professional responsibilities beyond earning a degree', duration: '40 min' },
        { id: 'w11-t3', label: 'Complete your 5-pillar Personal Skill Self-Assessment', duration: '60 min' },
        { id: 'w11-t4', label: 'Choose your Week 12 presentation topic and outline 5 key slides/sections', duration: '60 min' },
        { id: 'w11-t5', label: 'Write Week 11 reflection and save your Career & Skill Map', duration: '40 min' }
      ],
      deliverables: [
        'Regional Psychology Qualification & Career Pathway Map.',
        'Personal 5-Pillar Skill Assessment + Week 12 Presentation Outline.'
      ],
      reflectionQuestions: [
        'Which area of psychology feels most authentic to your strengths after 11 weeks of exploration?',
        'What is one realistic qualification milestone you can aim for in the coming year?',
        'How has your understanding of what a psychologist actually does evolved since Week 1?'
      ]
    },
    {
      week: 12,
      title: 'Final Psychology Portfolio',
      pillar: 'Capstone & Synthesis',
      estimatedHours: '4–6 hours',
      summary:
        'Bring your 12-week journey together! Review all 11 previous modules, deliver a beginner psychology presentation, organise your learning evidence, and design your next 3-month growth plan.',
      objectives: [
        'Synthesise core ideas across biological, cognitive, developmental, social, personality, and ethical psychology.',
        'Communicate one psychology topic clearly and accurately in a structured mini-presentation.',
        'Curate an organised portfolio of study artefacts, summaries, and evidence links.',
        'Write a comprehensive capstone reflection and actionable three-month continuation plan.'
      ],
      topics: [
        {
          title: 'Review all 11 previous modules',
          detail: 'Run a comprehensive retrieval review connecting concepts across the 11 foundational pillars.'
        },
        {
          title: 'Complete a psychology topic presentation',
          detail: 'Create an 8–10 slide or written briefing explaining one topic (e.g., Memory & Learning, Empathy, or Stress & Brain) clearly.'
        },
        {
          title: 'Organise learning evidence',
          detail: 'Verify all weekly evidence links, notes, and exercises inside your Evidence Vault or portfolio folder.'
        },
        {
          title: 'Write a final reflection',
          detail: 'Look back at your growth in knowledge, scientific scepticism, empathy, and self-discipline.'
        },
        {
          title: 'Create a three-month continuation plan',
          detail: 'Plan concrete next steps: books to finish, open courses, volunteer listening roles, or formal study applications.'
        }
      ],
      activities: [
        'Session 1 (1.5 hrs): Review your notes and reflection journal from Weeks 1–11.',
        'Session 2 (2 hrs): Build and rehearse your 8–10 slide / 1,000-word Psychology Topic Presentation.',
        'Session 3 (1 hr): Audit your Evidence Vault and export a full backup JSON of your SkillTrack portfolio.',
        'Session 4 (1 hr): Write your Final Capstone Reflection and 3-Month Continuation Plan.'
      ],
      recommendedReading: [
        'Make It Stick — Chapter 8 (Putting It All Together for Lifelong Learning)',
        'On Becoming a Person — Carl Rogers (Closing reflections on personal growth)'
      ],
      practicalExercises: [
        'Teach-Back Presentation: Present your chosen psychology topic aloud (or record a 5-minute walkthrough) using plain, accurate language.',
        '90-Day Roadmap: Schedule 3 concrete weekly milestones for Months 1, 2, and 3 post-programme.'
      ],
      tasks: [
        { id: 'w12-t1', label: 'Review summaries and reflections across Weeks 1–11', duration: '65 min' },
        { id: 'w12-t2', label: 'Complete your Psychology Topic Presentation (slides or structured brief)', duration: '100 min' },
        { id: 'w12-t3', label: 'Organise and verify evidence links across your portfolio', duration: '45 min' },
        { id: 'w12-t4', label: 'Write a 3-month continuation plan with realistic weekly goals', duration: '45 min' },
        { id: 'w12-t5', label: 'Write Final Capstone Reflection and export your SkillTrack portfolio backup', duration: '45 min' }
      ],
      deliverables: [
        'Final Psychology Topic Presentation link.',
        'Organised 12-week Evidence Portfolio & JSON backup.',
        'Written 3-Month Continuation Plan.'
      ],
      reflectionQuestions: [
        'Looking back at Week 1, what transformation in your thinking or habits makes you proudest?',
        'Which psychology skill (research literacy, empathy, biological grounding, or ethics) changed your perspective most?',
        'What is your single most important commitment for the next three months on your path toward becoming a psychologist?'
      ]
    }
  ];

  SkillTrack.Curriculum = {
    MODULES
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MODULES };
  }
})(typeof window !== 'undefined' ? window : globalThis);

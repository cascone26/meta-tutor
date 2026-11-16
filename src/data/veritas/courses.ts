export interface CourseLesson {
  title: string;
  description: string;
  readings: { source: string; path: string; label: string }[];
  questions: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  topics: string[];
  description: string;
  lessons: CourseLesson[];
  prerequisites?: string[];
  recommended?: boolean;
}

export const COURSES: Course[] = [
  {
    id: "five-ways",
    title: "The Five Ways",
    subtitle: "Aquinas's proofs for God's existence",
    difficulty: "beginner",
    duration: "3 days",
    topics: ["aquinas", "philosophy", "apologetics"],
    description: "Walk through each of Aquinas's Five Ways step by step. Learn the argument, understand the objections, and practice explaining them.",
    recommended: true,
    lessons: [
      {
        title: "The First & Second Ways: Motion and Efficient Cause",
        description: "The argument from motion and the argument from efficient causality — why an infinite regress is impossible.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=2&a=3", label: "ST I, q.2, a.3 — Whether God exists" },
        ],
        questions: ["What is the difference between per se and per accidens causal series?", "Why can't the series of movers go to infinity?", "How does Aquinas distinguish the First Way from the Second Way?"],
      },
      {
        title: "The Third & Fourth Ways: Contingency and Degrees",
        description: "Why contingent beings require a necessary being, and why degrees of perfection point to a maximum.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=2&a=3", label: "ST I, q.2, a.3 — The Third and Fourth Ways" },
        ],
        questions: ["What does 'contingent' mean in this context?", "How does the Fourth Way differ from the ontological argument?", "Why must there be a maximum in any genus?"],
      },
      {
        title: "The Fifth Way and Common Objections",
        description: "The argument from design (governance), plus the most common objections to all Five Ways and how to answer them.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=2&a=3", label: "ST I, q.2, a.3 — The Fifth Way" },
        ],
        questions: ["How does the Fifth Way differ from Paley's watchmaker argument?", "What is the 'Who made God?' objection and why does it fail?", "Can the Five Ways prove a personal God, or only a First Cause?"],
      },
    ],
  },
  {
    id: "catholic-101",
    title: "Catholic 101",
    subtitle: "What Catholics actually believe",
    difficulty: "beginner",
    duration: "5 days",
    topics: ["theology", "catechism", "apologetics"],
    description: "A crash course in core Catholic doctrine — the Creed, the sacraments, the moral life, and prayer. Built from the Catechism's own structure.",
    recommended: true,
    lessons: [
      {
        title: "The Creed: What We Believe",
        description: "God the Father, creation, the Fall, and why we need a Redeemer.",
        readings: [
          { source: "ccc", path: "/ccc?part=1", label: "CCC Part 1 — The Profession of Faith" },
        ],
        questions: ["What does it mean to say God created ex nihilo?", "Why is original sin not just a metaphor?", "What is the relationship between faith and reason?"],
      },
      {
        title: "Christ and Redemption",
        description: "The Incarnation, the Paschal Mystery, and why God became man.",
        readings: [
          { source: "ccc", path: "/ccc?part=1", label: "CCC 456-478 — Why the Word became flesh" },
        ],
        questions: ["What is the hypostatic union?", "Why was the Cross necessary?", "What does 'He descended into hell' mean?"],
      },
      {
        title: "The Sacraments",
        description: "The seven sacraments as channels of grace — especially Baptism, Eucharist, and Confession.",
        readings: [
          { source: "ccc", path: "/ccc?part=2", label: "CCC Part 2 — The Sacraments" },
        ],
        questions: ["Why seven sacraments and not more or fewer?", "What is the difference between a sacrament and a symbol?", "What does ex opere operato mean?"],
      },
      {
        title: "The Moral Life",
        description: "The Ten Commandments, the virtues, sin, and conscience.",
        readings: [
          { source: "ccc", path: "/ccc?part=3", label: "CCC Part 3 — Life in Christ" },
        ],
        questions: ["What is natural law?", "What are the four cardinal virtues?", "What is the difference between mortal and venial sin?"],
      },
      {
        title: "Prayer and the Our Father",
        description: "What prayer is, how to pray, and why the Our Father contains everything.",
        readings: [
          { source: "ccc", path: "/ccc?part=4", label: "CCC Part 4 — Christian Prayer" },
        ],
        questions: ["What are the three expressions of prayer?", "Why does Aquinas call the Our Father the most perfect prayer?", "What does 'lead us not into temptation' actually mean?"],
      },
    ],
  },
  {
    id: "real-presence",
    title: "The Real Presence",
    subtitle: "Scripture to Aquinas on the Eucharist",
    difficulty: "beginner",
    duration: "4 days",
    topics: ["theology", "sacraments", "scripture", "aquinas", "apologetics"],
    description: "The full Catholic case for the Real Presence — from the Old Testament types through Christ's own words to Aquinas's metaphysical explanation.",
    recommended: true,
    lessons: [
      {
        title: "Old Testament Types",
        description: "Manna, Melchizedek, the Passover lamb — how the OT prefigures the Eucharist.",
        readings: [
          { source: "bible", path: "/bible?book=Exodus&chapter=16", label: "Exodus 16 — Manna from heaven" },
        ],
        questions: ["How does the manna prefigure the Eucharist?", "Why is Melchizedek's offering of bread and wine significant?", "What is typology and why does it matter?"],
      },
      {
        title: "The Bread of Life Discourse",
        description: "John 6 — the hardest teaching Jesus ever gave, and the disciples who walked away.",
        readings: [
          { source: "bible", path: "/bible?book=John&chapter=6", label: "John 6:22-71 — The Bread of Life" },
        ],
        questions: ["Did Jesus speak metaphorically in John 6? How do we know?", "Why did many disciples leave after this teaching?", "What does the Greek word 'trogo' (gnaw/munch) tell us?"],
      },
      {
        title: "The Last Supper and St. Paul",
        description: "The institution of the Eucharist and Paul's warning about eating unworthily.",
        readings: [
          { source: "bible", path: "/bible?book=Matthew&chapter=26", label: "Matthew 26:26-28 — This is my body" },
        ],
        questions: ["Why does Paul say eating unworthily makes you guilty of the body and blood?", "What do the words of institution mean?", "How do the Synoptic accounts complement John 6?"],
      },
      {
        title: "Aquinas on Transubstantiation",
        description: "The metaphysical explanation — substance vs. accidents, how bread becomes God.",
        readings: [
          { source: "summa", path: "/summa?part=III&q=75&a=1", label: "ST III, q.75 — The change of bread and wine into Christ's body" },
        ],
        questions: ["What is the difference between substance and accidents?", "Why is 'transubstantiation' more precise than 'Real Presence'?", "How do we respond to the objection that this is just Aristotelian philosophy?"],
      },
    ],
  },
  {
    id: "problem-of-evil",
    title: "The Problem of Evil",
    subtitle: "Every angle, every answer",
    difficulty: "beginner",
    duration: "5 days",
    topics: ["apologetics", "philosophy", "theology", "aquinas"],
    description: "The strongest objection to God's existence, answered from every angle — logical, evidential, emotional, and Thomistic.",
    recommended: true,
    lessons: [
      {
        title: "The Logical Problem of Evil",
        description: "Can an all-good, all-powerful God coexist with evil? Aquinas says yes — and here's why.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=2&a=3", label: "ST I, q.2, a.3, obj.1 — The objection from evil" },
        ],
        questions: ["What does it mean to say evil is a privation?", "Why does the free will defense work?", "How does Aquinas answer the objection in q.2, a.3?"],
      },
      {
        title: "Why God Permits Evil",
        description: "The greater-good defense, the nature of providence, and why a world without suffering is actually impossible.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=49&a=2", label: "ST I, q.49, a.2 — Whether the supreme good is the cause of evil" },
        ],
        questions: ["Does God cause evil?", "What is the difference between permitting and willing evil?", "Why is 'the best of all possible worlds' not a Catholic position?"],
      },
      {
        title: "Natural Evil and Animal Suffering",
        description: "Earthquakes, disease, predation — why natural evil is the harder problem and how Aquinas handles it.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=47&a=2", label: "ST I, q.47 — The diversity and inequality of things" },
        ],
        questions: ["Is natural evil punishment for original sin?", "How does the order of the universe require corruption?", "Why did God create predators?"],
      },
      {
        title: "Augustine on Evil",
        description: "The Confessions, the Enchiridion, and On Free Will — Augustine's journey from Manichaeism to the privation theory.",
        readings: [
          { source: "spiritual-reading", path: "/spiritual-reading/confessions", label: "Confessions — Augustine's discovery that evil has no substance" },
        ],
        questions: ["Why did Augustine reject Manichaeism?", "How did Neo-Platonism help Augustine understand evil?", "What is the relationship between Augustine and Aquinas on evil?"],
      },
      {
        title: "The Emotional Problem and Pastoral Response",
        description: "When someone is suffering, arguments aren't enough. The Book of Job, the Cross, and redemptive suffering.",
        readings: [
          { source: "bible", path: "/bible?book=Job&chapter=38", label: "Job 38-42 — God's answer from the whirlwind" },
        ],
        questions: ["What is the difference between the logical and emotional problem of evil?", "How does the Cross answer suffering?", "What is redemptive suffering?"],
      },
    ],
  },
  {
    id: "intro-natural-law",
    title: "Introduction to Natural Law",
    subtitle: "The moral law written on every heart",
    difficulty: "beginner",
    duration: "5 days",
    topics: ["natural-law", "philosophy", "moral-theology", "aquinas"],
    description: "Aquinas's natural law theory from the ground up — what it is, how we know it, and why it matters for every moral question.",
    lessons: [
      {
        title: "What Is Law?",
        description: "Aquinas's definition of law and the four types: eternal, natural, human, and divine.",
        readings: [
          { source: "summa", path: "/summa?part=I-II&q=90&a=4", label: "ST I-II, q.90 — The essence of law" },
        ],
        questions: ["What are the four elements of Aquinas's definition of law?", "How does natural law relate to eternal law?", "Why is divine law necessary if we have natural law?"],
      },
      {
        title: "The First Principles",
        description: "Good is to be done and pursued, evil avoided — and the natural inclinations that specify it.",
        readings: [
          { source: "summa", path: "/summa?part=I-II&q=94&a=2", label: "ST I-II, q.94, a.2 — The precepts of natural law" },
        ],
        questions: ["What are the three natural inclinations?", "Can the natural law be changed or abolished?", "How do we derive specific moral rules from first principles?"],
      },
      {
        title: "Natural Law and Human Rights",
        description: "How natural law grounds human dignity, rights, and justice — against both positivism and relativism.",
        readings: [
          { source: "summa", path: "/summa?part=I-II&q=95&a=2", label: "ST I-II, q.95 — Human law derived from natural law" },
        ],
        questions: ["Why can't rights be grounded in positive law alone?", "What makes an unjust law not really a law?", "How does natural law answer moral relativism?"],
      },
      {
        title: "Natural Law and Bioethics",
        description: "Applying natural law to abortion, euthanasia, contraception, and IVF.",
        readings: [
          { source: "summa", path: "/summa?part=II-II&q=64&a=5", label: "ST II-II, q.64, a.5 — Self-defense and double effect" },
        ],
        questions: ["What is the principle of double effect?", "How does natural law argue against abortion?", "Why does the Church oppose IVF?"],
      },
      {
        title: "Objections and Modern Challenges",
        description: "The Euthyphro dilemma, the is-ought gap, and the 'you can't impose your morality' objection.",
        readings: [
          { source: "summa", path: "/summa?part=I-II&q=94&a=4", label: "ST I-II, q.94, a.4 — Whether the natural law is the same in all" },
        ],
        questions: ["How does Aquinas solve the Euthyphro dilemma?", "Does natural law commit the naturalistic fallacy?", "Why is 'you can't legislate morality' self-refuting?"],
      },
    ],
  },
  {
    id: "apologetics-protestantism",
    title: "Catholic Apologetics vs. Protestantism",
    subtitle: "Sola Scriptura, Sola Fide, and the Church",
    difficulty: "intermediate",
    duration: "7 days",
    topics: ["apologetics", "protestant", "scripture", "theology"],
    description: "The seven biggest Protestant objections to Catholicism, answered from Scripture, the Fathers, and Aquinas.",
    recommended: true,
    lessons: [
      {
        title: "Sola Scriptura",
        description: "The Bible alone? Why this doctrine is self-refuting and historically impossible.",
        readings: [
          { source: "bible", path: "/bible?book=2 Thessalonians&chapter=2", label: "2 Thessalonians 2:15 — Hold to the traditions" },
        ],
        questions: ["Where does the Bible teach Sola Scriptura?", "How was the canon of Scripture determined?", "What did the early Church Fathers say about Scripture and Tradition?"],
      },
      {
        title: "Sola Fide",
        description: "Faith alone? James 2:24 and the Catholic understanding of justification.",
        readings: [
          { source: "bible", path: "/bible?book=James&chapter=2", label: "James 2:14-26 — Faith without works" },
        ],
        questions: ["What does Paul mean by 'works of the law' in Romans?", "How does James 2:24 relate to Romans 3:28?", "What is the Catholic understanding of justification?"],
      },
      {
        title: "The Papacy",
        description: "Peter as the rock — Matthew 16, the early Church, and apostolic succession.",
        readings: [
          { source: "bible", path: "/bible?book=Matthew&chapter=16", label: "Matthew 16:18-19 — Upon this rock" },
        ],
        questions: ["What does 'petra' vs 'petros' actually mean in the Greek?", "Did the early Church Fathers recognize papal primacy?", "What is apostolic succession and why does it matter?"],
      },
      {
        title: "The Saints and Mary",
        description: "Why we pray to saints, what the Marian dogmas actually claim, and the biblical basis for both.",
        readings: [
          { source: "bible", path: "/bible?book=Luke&chapter=1", label: "Luke 1:28-56 — The Magnificat" },
        ],
        questions: ["Is praying to saints the same as worshipping them?", "What is the biblical basis for the Immaculate Conception?", "What does 'full of grace' (kecharitomene) mean?"],
      },
      {
        title: "Confession and Purgatory",
        description: "The power to forgive sins, the purification after death, and the scriptural evidence.",
        readings: [
          { source: "bible", path: "/bible?book=John&chapter=20", label: "John 20:21-23 — Whose sins you forgive" },
        ],
        questions: ["Why can't I just confess directly to God?", "What is the scriptural basis for purgatory?", "What did the early Church practice regarding confession?"],
      },
      {
        title: "The Canon and Authority",
        description: "How we got the Bible, why Protestants have fewer books, and the authority question.",
        readings: [
          { source: "ccc", path: "/ccc?part=1", label: "CCC 120-130 — The canon of Scripture" },
        ],
        questions: ["Who decided which books belong in the Bible?", "Why were the deuterocanonical books removed by Protestants?", "What is the 'canon within the canon' problem?"],
      },
      {
        title: "Putting It All Together",
        description: "The fundamental question: authority. Why every Protestant objection ultimately comes back to one issue.",
        readings: [
          { source: "summa", path: "/summa?part=II-II&q=1&a=10", label: "ST II-II, q.1, a.10 — Whether it belongs to the Magisterium to draw up a symbol of faith" },
        ],
        questions: ["Why is the authority question the most fundamental?", "How do you present the Catholic case charitably?", "What are the strongest Protestant counter-arguments?"],
      },
    ],
  },
  {
    id: "apologetics-atheism",
    title: "Catholic Apologetics vs. Atheism",
    subtitle: "Answering the New Atheists and beyond",
    difficulty: "intermediate",
    duration: "7 days",
    topics: ["apologetics", "philosophy", "aquinas", "modern"],
    description: "The strongest atheist arguments — from Dawkins to Nietzsche — answered with Thomistic philosophy.",
    recommended: true,
    lessons: [
      {
        title: "The New Atheist Playbook",
        description: "What Dawkins, Harris, Hitchens, and Dennett actually argue — and where they go wrong.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=2&a=3", label: "ST I, q.2, a.3 — Whether God exists" },
        ],
        questions: ["What is Dawkins's 'Ultimate Boeing 747' argument?", "Why does 'Who designed the designer?' miss the point?", "How do New Atheists typically misrepresent the Five Ways?"],
      },
      {
        title: "Science vs. Religion?",
        description: "The false conflict thesis, what faith actually means, and why science presupposes metaphysics.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=1&a=1", label: "ST I, q.1, a.1 — Whether sacred doctrine is necessary beyond philosophy" },
        ],
        questions: ["Does faith mean believing without evidence?", "Why can't science prove or disprove God?", "What is scientism and why is it self-refuting?"],
      },
      {
        title: "The Moral Argument",
        description: "Without God, is everything permitted? Objective morality, moral realism, and the atheist's dilemma.",
        readings: [
          { source: "summa", path: "/summa?part=I-II&q=91&a=2", label: "ST I-II, q.91 — Natural law and eternal law" },
        ],
        questions: ["Can atheists be moral?", "Can morality be objective without God?", "How does natural law answer the Euthyphro dilemma?"],
      },
      {
        title: "Suffering, Evil, and the Cross",
        description: "The atheist's strongest card — and why Christianity has the only satisfying answer.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=48&a=1", label: "ST I, q.48 — Evil as privation" },
        ],
        questions: ["How is the problem of evil actually stronger as an argument FOR God?", "Why does atheism make suffering meaningless rather than solving it?", "What is the evidential vs. logical problem of evil?"],
      },
      {
        title: "Consciousness, Reason, and the Argument from Mind",
        description: "Why materialism can't explain consciousness, rationality, or the reliability of our own minds.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=75&a=2", label: "ST I, q.75 — The human soul is not a body" },
        ],
        questions: ["What is the 'argument from reason' (C.S. Lewis)?", "Why can't materialism account for intentionality?", "What is Aquinas's argument that the intellect is immaterial?"],
      },
      {
        title: "The Historical Argument: The Resurrection",
        description: "The minimal facts case for the Resurrection — even using only what secular scholars accept.",
        readings: [
          { source: "bible", path: "/bible?book=1 Corinthians&chapter=15", label: "1 Corinthians 15:1-8 — The earliest creed" },
        ],
        questions: ["What are the 'minimal facts' that virtually all scholars accept?", "Why do alternative theories (hallucination, stolen body) fail?", "Why is 1 Cor 15 dated so early?"],
      },
      {
        title: "The Meaning Question",
        description: "Nietzsche, Camus, and the absurdity of atheist meaning-making. Why only the infinite satisfies.",
        readings: [
          { source: "spiritual-reading", path: "/spiritual-reading/confessions", label: "Confessions — 'Our hearts are restless until they rest in You'" },
        ],
        questions: ["What did Nietzsche mean by 'God is dead'?", "Why is Camus's 'revolt' ultimately incoherent?", "How does Aquinas argue that only God can satisfy the human desire for happiness?"],
      },
    ],
  },
  {
    id: "what-is-man",
    title: "What Is a Human Being?",
    subtitle: "Soul, body, intellect, and will",
    difficulty: "intermediate",
    duration: "5 days",
    topics: ["philosophy", "aquinas", "theology"],
    description: "Aquinas's philosophical anthropology — the soul-body composite, the powers of the soul, free will, and what makes us human.",
    lessons: [
      {
        title: "The Soul-Body Composite",
        description: "Hylomorphism — the soul as the form of the body, against both dualism and materialism.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=75&a=1", label: "ST I, q.75, a.1 — Whether the soul is a body" },
        ],
        questions: ["What is hylomorphism?", "How does Aquinas avoid both Platonic dualism and materialism?", "Why can't the soul be a body?"],
      },
      {
        title: "The Intellect",
        description: "How we know things — abstraction, the agent intellect, and why thinking proves the soul is immaterial.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=79&a=3", label: "ST I, q.79 — The agent intellect" },
        ],
        questions: ["What is abstraction?", "Why does universality prove immateriality?", "What is the difference between the agent and possible intellect?"],
      },
      {
        title: "The Will and Free Choice",
        description: "What the will is, how it relates to the intellect, and why we are genuinely free.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=82&a=1", label: "ST I, q.82 — The will" },
        ],
        questions: ["How does the will relate to the intellect?", "Why does Aquinas say the will is a rational appetite?", "How does Aquinas answer determinism?"],
      },
      {
        title: "The Emotions (Passions)",
        description: "Aquinas's psychology of emotion — the 11 passions and how they relate to virtue.",
        readings: [
          { source: "summa", path: "/summa?part=I-II&q=22&a=1", label: "ST I-II, q.22 — The passions of the soul" },
        ],
        questions: ["What are the 11 passions?", "Are emotions good or bad?", "How do the passions relate to virtue and vice?"],
      },
      {
        title: "The Immortality of the Soul",
        description: "Aquinas's proof that the soul survives death — and what that means for the resurrection of the body.",
        readings: [
          { source: "summa", path: "/summa?part=I&q=75&a=6", label: "ST I, q.75, a.6 — Whether the human soul is incorruptible" },
        ],
        questions: ["Why does Aquinas argue the soul is incorruptible?", "If the soul is immortal, why do we need bodily resurrection?", "How does this differ from Plato's arguments for immortality?"],
      },
    ],
  },
];

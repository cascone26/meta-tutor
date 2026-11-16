export type DoubtType =
  | "cant-feel-anything"
  | "intellectual-doubt"
  | "scandal-in-church"
  | "prayer-is-dry"
  | "science-vs-faith"
  | "problem-of-evil"
  | "why-catholic-specifically"
  | "everyone-seems-hypocritical"
  | "im-a-bad-catholic"
  | "god-feels-silent";

export interface DoubtTrack {
  slug: DoubtType;
  label: string;
  description: string;
  opening: string;
  readings: string[];
  argumentSlugs: string[];
  scripture: string[];
  practice: string;
  saint: { name: string; why: string };
}

export const DOUBT_TRACKS: DoubtTrack[] = [
  {
    slug: "cant-feel-anything",
    label: "I can't feel anything",
    description: "Dryness. Nothing. Praying and getting no response.",
    opening:
      "The absence of feeling is not the absence of faith. It is the normal condition of mature faith. Mother Teresa lived in this state for fifty years while running a mission. John of the Cross described it in advance. Christ on the cross cried 'why have You forsaken Me' — the feeling of abandonment is a place He went first. You are not broken. You are being purified. Do not try to manufacture feelings. Show up.",
    readings: [
      "John of the Cross, Dark Night of the Soul (Book I)",
      "Mother Teresa, Come Be My Light (selected letters)",
      "Therese of Lisieux, Story of a Soul (Chapter 9: the night of nothingness)",
    ],
    argumentSlugs: ["dark-night", "faith-is-will", "hiddenness"],
    scripture: [
      "Mark 9:24 — 'Lord, I believe; help my unbelief.'",
      "Matthew 27:46 — Christ's cry from the cross.",
      "Psalm 22 — the cry of abandonment that opens with 'why have You forsaken me' and ends in praise.",
      "Psalm 88 — the darkest psalm, which does not resolve.",
    ],
    practice:
      "Do the 5-minute silent sit. Say nothing. Ask for nothing. Just show up. The willing is the faith. Then pray the Our Father slowly. If you feel nothing, you prayed it rightly.",
    saint: {
      name: "Mother Teresa of Calcutta",
      why: "Felt God's absence from 1946 until her death in 1997. Served Him anyway. Canonized 2016.",
    },
  },
  {
    slug: "intellectual-doubt",
    label: "I'm not sure it's even true",
    description: "Doubting the whole framework — God, Jesus, the Church.",
    opening:
      "You are not obligated to feel certain. You are invited to examine the case. Christianity is the only major religion that makes itself falsifiable by a historical event: 'If Christ is not risen, our faith is in vain.' Examine the evidence on its merits — the contingency argument, the Resurrection's minimal facts, the fine-tuning of the universe. These are not feelings. They are reasons. Stand on them.",
    readings: [
      "Aquinas, ST I q.2 a.3 (the Five Ways)",
      "Habermas & Licona, The Case for the Resurrection of Jesus",
      "C.S. Lewis, Mere Christianity",
      "Chesterton, The Everlasting Man",
    ],
    argumentSlugs: [
      "contingency",
      "first-mover",
      "resurrection",
      "fine-tuning",
      "moral-argument",
    ],
    scripture: [
      "1 Corinthians 15:14 — 'If Christ is not risen, our faith is vain.'",
      "John 20:24-29 — Thomas and the evidence.",
      "1 Peter 3:15 — 'Be prepared to give a reason for the hope in you.'",
    ],
    practice:
      "Pick one argument. Read it slowly, annotate the objections, find your strongest point of doubt, and write it down. Then look up the response. Faith is trained by examining, not by ignoring.",
    saint: {
      name: "Thomas the Apostle",
      why: "Would not believe until he touched the wounds. Christ let him. The doubter became a missionary to India.",
    },
  },
  {
    slug: "scandal-in-church",
    label: "The Church's scandals disgust me",
    description: "Abuse crisis, bad bishops, hypocrisy in the hierarchy.",
    opening:
      "The scandals are real. They are not exaggerated, and the Church's response has sometimes been a second scandal on top of the first. But the Church's claim is not that her ministers are saints — it is that the office is preserved by Christ despite its ministers. Judas was an apostle. Peter denied Christ three times. The Church is a field containing both wheat and weeds (Matt 13). The weeds do not disprove the field.",
    readings: [
      "Augustine, On the Unity of the Church (against Donatists — sinful ministers are still valid)",
      "John Paul II, Apology of the Church (2000)",
      "Ralph Martin, A Church in Crisis",
    ],
    argumentSlugs: ["church-endurance", "apostolic-succession"],
    scripture: [
      "Matthew 13:24-30 — the wheat and the weeds.",
      "2 Timothy 2:20-21 — a great house has vessels of gold and wood.",
      "John 6:70 — 'Have I not chosen you, the Twelve? And yet one of you is a devil.'",
    ],
    practice:
      "Offer up your anger for the victims. Pray a decade of the Rosary for the Church's purification. Stay. The scandal is an argument for staying — who will fix her if the faithful leave?",
    saint: {
      name: "Catherine of Siena",
      why: "Called the pope back to Rome and told bishops off directly. Faithful and ferocious.",
    },
  },
  {
    slug: "prayer-is-dry",
    label: "Prayer feels like talking to myself",
    description: "Nothing comes back. The words feel empty.",
    opening:
      "You are not talking to yourself. You are talking to Someone who is closer to you than your own breath, but who is not a being in the room. The silence you hear is not absence; it is the mode in which He is present. Aquinas had a revelation that made him stop writing — and most of the Church never gets that. Most of us get silence. That is the normal school.",
    readings: [
      "Teresa of Avila, Interior Castle (Mansion IV — on dry prayer)",
      "Brother Lawrence, The Practice of the Presence of God",
      "Dom Chapman, Spiritual Letters (on mental prayer in dryness)",
    ],
    argumentSlugs: ["faith-is-will", "presence", "hiddenness"],
    scripture: [
      "Psalm 42:1-2 — 'As the deer longs for running streams, so my soul longs for You.'",
      "Matthew 6:6 — 'Pray to your Father who is in secret.'",
      "Romans 8:26 — 'The Spirit intercedes with sighs too deep for words.'",
    ],
    practice:
      "Stop trying to talk. Sit silently for 5 minutes. Do not ask for anything. Do not expect anything. Just be present. That is prayer at its most pure — pure availability. The words will come back when they come.",
    saint: {
      name: "Teresa of Avila",
      why: "Spent 18 years in dry prayer before her conversion. Wrote the classic on interior prayer after the desert ended.",
    },
  },
  {
    slug: "science-vs-faith",
    label: "Science seems to explain it all",
    description: "The natural explanations feel sufficient.",
    opening:
      "Science is excellent at answering 'how' and nearly silent on 'why.' It can describe the mechanism of the stars and cannot tell you whether existence means anything. Faith and science are not competitors; they ask different questions. The Big Bang, evolution, neuroscience — none of them touch the question of why there is something rather than nothing, or whether the laws that govern it point to a mind.",
    readings: [
      "Stephen Barr, Modern Physics and Ancient Faith",
      "Fr. Stanley Jaki, The Savior of Science",
      "Edward Feser, Five Proofs of the Existence of God",
      "John Polkinghorne, Quantum Physics and Theology",
    ],
    argumentSlugs: ["contingency", "fine-tuning", "first-mover"],
    scripture: [
      "Romans 1:20 — 'His invisible attributes... have been clearly perceived in the things that have been made.'",
      "Psalm 19:1 — 'The heavens declare the glory of God.'",
    ],
    practice:
      "Ask the deeper question. For whatever scientific explanation you find compelling, ask: 'And what explains THAT?' Keep going. You will reach the level at which science ends and metaphysics begins.",
    saint: {
      name: "Fr. Georges Lemaître",
      why: "Catholic priest, proposed the Big Bang theory, showed that physics and theology can be done by the same mind.",
    },
  },
  {
    slug: "problem-of-evil",
    label: "If God is good, why is there suffering?",
    description: "The classic objection — and maybe personal pain.",
    opening:
      "The problem of evil is the hardest objection. The Christian answer is not a theoretical formula; it is the Crucifix. God does not merely permit suffering from a distance; He entered it. He was tortured to death. Whatever you are facing, He has faced worse, in flesh. The answer to the problem of evil is not why — it is who. He is with you in it. And He has promised the resurrection on the far side.",
    readings: [
      "C.S. Lewis, The Problem of Pain",
      "C.S. Lewis, A Grief Observed",
      "John Paul II, Salvifici Doloris (on the Christian meaning of suffering)",
      "Peter Kreeft, Making Sense Out of Suffering",
    ],
    argumentSlugs: ["incarnation", "resurrection", "hiddenness"],
    scripture: [
      "Job 38-42 — God answers not with reasons but with presence.",
      "Isaiah 53 — the Suffering Servant.",
      "Romans 8:18 — 'The sufferings of this present time are not worth comparing with the glory that will be revealed.'",
      "Revelation 21:4 — 'He will wipe away every tear.'",
    ],
    practice:
      "Pray before a crucifix. Do not pray for the suffering to end. Pray to be with Him in it. Let the pain you carry be offered — united to His — for someone who needs it more than you.",
    saint: {
      name: "Job",
      why: "Lost everything. Demanded God answer. God did not answer the why — He showed up. Job then worshiped.",
    },
  },
  {
    slug: "why-catholic-specifically",
    label: "Why Catholic specifically?",
    description: "Okay, Christianity — but why not Protestant or Orthodox?",
    opening:
      "If Christianity is true, the question 'which Church' is the next honest question. The Catholic claim is that Christ founded one visible Church, led by Peter and his successors, continuing to today. The test is history. Read the Fathers. Read what the Church of 100 AD, 200 AD, 400 AD actually believed. Newman: 'To be deep in history is to cease to be Protestant.' The Catholic Church is the Church of the Fathers.",
    readings: [
      "Newman, Essay on the Development of Christian Doctrine",
      "Rod Bennett, Four Witnesses (Clement, Ignatius, Justin, Irenaeus)",
      "Scott Hahn, Rome Sweet Home (his conversion story)",
      "Ignatius of Antioch, Complete Letters",
    ],
    argumentSlugs: [
      "early-church-catholic",
      "papacy",
      "apostolic-succession",
      "real-presence",
      "sola-scriptura",
    ],
    scripture: [
      "Matthew 16:18-19 — the keys.",
      "1 Timothy 3:15 — the pillar and bulwark of truth.",
      "John 17:20-21 — 'That they may be one.'",
    ],
    practice:
      "Read Ignatius of Antioch's seven letters in one sitting. They are short. Notice what he assumes about the bishop, the Eucharist, apostolic succession. Ask whether that Church looks more like modern Catholicism or modern Protestantism.",
    saint: {
      name: "John Henry Newman",
      why: "Anglican theologian who studied the Fathers and converted in 1845. Wrote the development-of-doctrine argument. Canonized 2019.",
    },
  },
  {
    slug: "everyone-seems-hypocritical",
    label: "Catholics I know are hypocrites",
    description: "The people in the pews don't match the faith.",
    opening:
      "The standard is Christ, not the people in the pews. If Catholics in your life are hypocrites, the first question is whether you are going to Mass to be with them or to be with Him. The Mass is not a meeting; it is an encounter. The pew-mate is incidental. Also: some of the 'hypocrisy' you perceive is actually struggle. Most Catholics in the pew are fighting battles you don't see. Including you.",
    readings: [
      "Thomas à Kempis, The Imitation of Christ (Book I: on self-knowledge)",
      "Fulton Sheen, Life Is Worth Living",
    ],
    argumentSlugs: ["ecclesiology", "communion-of-saints"],
    scripture: [
      "Matthew 7:3-5 — the beam in your own eye.",
      "Romans 3:23 — all have sinned.",
      "Matthew 13:24-30 — the field has wheat and weeds until the harvest.",
    ],
    practice:
      "Go to Mass this week and look at no one except the altar. Leave when Mass is over without small talk. Let the encounter be with Christ. Decide what to do about the community later.",
    saint: {
      name: "Therese of Lisieux",
      why: "Lived in a convent with women she found irritating. Offered each irritation as love. Became a Doctor of the Church.",
    },
  },
  {
    slug: "im-a-bad-catholic",
    label: "I'm not living it well",
    description: "The gap between the faith and your actual life.",
    opening:
      "You are in good company. Every saint recorded this gap. The solution is not to wait until you are worthy before returning. The solution is to go to Confession this week, and tomorrow, and the week after that. Sanctity is not achieved and then held; it is pursued and repeatedly lost and repeatedly resumed. The Prodigal Son was received at the first step back.",
    readings: [
      "Augustine, Confessions (Book VIII on his conversion)",
      "C.S. Lewis, Mere Christianity (on being 'a very imperfect person')",
      "Fulton Sheen, The Priest Is Not His Own",
    ],
    argumentSlugs: ["faith-is-will"],
    scripture: [
      "Luke 15:11-32 — the Prodigal Son.",
      "Romans 7:15-25 — Paul on his own failure to do what he wills.",
      "1 John 1:9 — 'If we confess our sins, He is faithful and just to forgive.'",
      "Proverbs 24:16 — 'The righteous man falls seven times and rises again.'",
    ],
    practice:
      "Go to Confession this week. Do not wait to be ready. Write down your sins. Say them out loud. Accept absolution. Begin again.",
    saint: {
      name: "Augustine of Hippo",
      why: "Lived with a mistress, fathered a son, resisted conversion for years. After his conversion: the greatest theologian of the Western Church.",
    },
  },
  {
    slug: "god-feels-silent",
    label: "God feels silent when I need Him",
    description: "Asking and receiving no answer.",
    opening:
      "The silence is the test. He is not ignoring you. He is teaching you to trust without the props. Every answered prayer would train you to love the answer; the unanswered ones train you to love the Answerer. This is the harder school, but it is the school of the saints. And sometimes — often — His answer is 'I am here, in the silence.' Sit in the silence with Him, not alone.",
    readings: [
      "John of the Cross, Spiritual Canticle",
      "C.S. Lewis, A Grief Observed",
      "Book of Job (entire, especially chs. 38-42)",
    ],
    argumentSlugs: ["hiddenness", "dark-night", "faith-is-will"],
    scripture: [
      "1 Kings 19:11-13 — God was not in the wind, earthquake, or fire, but in the still small voice.",
      "Psalm 13 — 'How long, O Lord, will you forget me?'",
      "Habakkuk 1:2 — 'How long, O Lord, shall I cry for help?'",
    ],
    practice:
      "Sit silently for 10 minutes. Do not try to hear Him. Just be present. If thoughts come, let them pass. If nothing comes, you have prayed rightly. He heard.",
    saint: {
      name: "Elijah",
      why: "Ran to Horeb in despair, hid in a cave, asked to die. God came — not in the storm, but in silence.",
    },
  },
];

export function trackBySlug(slug: DoubtType): DoubtTrack | undefined {
  return DOUBT_TRACKS.find((t) => t.slug === slug);
}

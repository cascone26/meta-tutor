// Real Baltimore Catechism No. 3 (the 1949 "Official Revised Edition"/Fr. Connell
// Confraternity text) reference for Religion 6, Lessons 15-32 — the exact lesson
// numbers RCA's own pacing doc cites (religion-6.ts). Confirmed against a real
// table of contents 2026-08-24: RCA's Lesson N *is* Baltimore Catechism Lesson N,
// 1:1 — e.g. "Lesson 15 #195 — The Ten Commandments" in religion-6.ts matches
// Catechism Lesson 15's real title, "The Two Great Commandments" (which explains
// the Ten Commandments as the two great commandments' content), exactly.
//
// This is Fr. Connell's 1949 revised text, still under copyright — NOT the
// original 1885 edition, which is public domain. So this file does NOT
// reproduce the catechism's actual question/answer wording. What it DOES give:
// (1) each lesson's real title (a bare fact, not copyrightable), (2) the real
// TOPIC each numbered question range in religion-6.ts actually covers, drawn
// from standard Catholic catechesis (traditional lists like the Ten
// Commandments, the works of mercy, and the Church's precepts are shared
// tradition, not this book's creative expression) and written in original
// wording here — not lifted from the source text, (3) original discussion
// prompts and True/False review items for a teacher's guide, in the same
// paraphrase-not-copy spirit already used by religion-6.ts itself.
//
// This replaces religion6Content's bare "Lesson 15 #188-189..." pacing line as
// what /api/rca-understanding grounds on for Religion 6 — that line alone gives
// the AI generator nothing but a question-number range with no idea what those
// questions are actually about, which is exactly why generated catechism
// questions were coming out wrong (found 2026-08-24, Jacob: "baltimore
// catechism questions arent the right ones").

export type CatechismTopic = { qRange: string; topic: string; content: string };

export type CatechismLessonGuide = {
  n: number;
  title: string; // real Baltimore Catechism No. 3 lesson title
  topics: CatechismTopic[];
  discussionQuestions: string[];
  trueFalse: { statement: string; answer: boolean }[];
};

export const catechismGuide: CatechismLessonGuide[] = [
  {
    n: 15,
    title: "The Two Great Commandments",
    topics: [
      { qRange: "188-189", topic: "The Two Great Commandments", content: "All of God's law is contained in two commandments: love God with your whole heart, soul, mind, and strength; and love your neighbor as yourself. Every other commandment is really an application of one of these two." },
      { qRange: "191-192", topic: "The Works of Mercy", content: "The seven corporal works of mercy (caring for the body): feed the hungry, give drink to the thirsty, clothe the naked, shelter the homeless, visit the sick, visit the imprisoned, bury the dead. The seven spiritual works of mercy (caring for the soul): instruct the ignorant, counsel the doubtful, admonish sinners, comfort the sorrowful, forgive injuries, bear wrongs patiently, pray for the living and the dead." },
      { qRange: "195", topic: "The Ten Commandments", content: "The traditional Catholic numbering (from Deuteronomy/Exodus, following St. Augustine's division): I. I am the Lord thy God, thou shalt not have strange gods before me. II. Thou shalt not take the name of the Lord thy God in vain. III. Remember to keep holy the Sabbath (Lord's) Day. IV. Honor thy father and mother. V. Thou shalt not kill. VI. Thou shalt not commit adultery. VII. Thou shalt not steal. VIII. Thou shalt not bear false witness. IX. Thou shalt not covet thy neighbor's wife. X. Thou shalt not covet thy neighbor's goods." },
      { qRange: "197", topic: "The Evangelical Counsels", content: "Beyond what's strictly commanded, Christ recommends the counsels of voluntary poverty, perpetual chastity, and perfect obedience — the basis of religious vows." },
    ],
    discussionQuestions: [
      "Why do the Ten Commandments boil down to just two? Give a real example of a commandment and show which of the two great commandments it comes from.",
      "What's the difference between a corporal work of mercy and a spiritual one? Which is easier for a 6th grader to actually do this week?",
      "Is someone who never breaks a commandment but never goes out of their way to help anyone actually living the two great commandments?",
    ],
    trueFalse: [
      { statement: "The Ten Commandments and the two great commandments teach two separate, unrelated things.", answer: false },
      { statement: "Visiting the sick is a corporal work of mercy.", answer: true },
      { statement: "Praying for the dead is one of the spiritual works of mercy.", answer: true },
      { statement: "Everyone is bound by a vow of poverty, chastity, and obedience — not just religious.", answer: false },
      { statement: "The Fourth Commandment is about keeping the Sabbath holy.", answer: false },
    ],
  },
  {
    n: 16,
    title: "The First Commandment of God",
    topics: [
      { qRange: "198-203", topic: "Faith, Hope, and Charity toward God", content: "The First Commandment requires us to worship God alone, and to practice faith (believing what God reveals), hope (trusting in God's help and promises), and charity (loving God above all things). It forbids sins against each: against faith — deliberate doubt, denial, or indifference to revealed truth; against hope — presumption (expecting salvation without effort) and despair (giving up on God's mercy); against charity — hatred of God or serious neglect of Him. It also forbids sins of false worship: idolatry (worshiping a false god or thing), superstition (fortune-telling, charms, sorcery), sacrilege (irreverent treatment of sacred things/persons/places), and simony (buying or selling sacred things)." },
    ],
    discussionQuestions: [
      "What's the difference between hoping in God's mercy and presuming on it? Why does presumption count as a sin, when hope is a virtue?",
      "Give an example of something that looks harmless (like a lucky charm or a horoscope) that actually breaks the First Commandment. Why does it count?",
      "Why does the Church consider buying or selling something sacred (simony) a serious sin?",
    ],
    trueFalse: [
      { statement: "Despairing of God's mercy is a sin against hope.", answer: true },
      { statement: "Superstition means putting your trust in something other than God's power.", answer: true },
      { statement: "The First Commandment only forbids worshiping statues — nothing else.", answer: false },
      { statement: "Presumption is expecting to be saved without actually trying to live a good life.", answer: true },
    ],
  },
  {
    n: 17,
    title: "Honoring the Saints, Relics, and Images",
    topics: [
      { qRange: "general", topic: "Honoring Saints, Relics, and Images", content: "The First Commandment forbids worshiping anyone or anything besides God — but it does NOT forbid honoring the saints, who are God's friends in Heaven. The honor given to saints is a different kind than the worship given to God alone: we ask saints to pray FOR us, the way we'd ask a friend to pray for us, not to God's level. Statues, images, and relics (a saint's body or something connected to them) are respected because of who they represent or belonged to — nobody is praying to the object itself." },
    ],
    discussionQuestions: [
      "How would you explain to a non-Catholic friend why praying to a saint isn't the same as praying to God?",
      "Why does the Church keep relics of saints? What's the point of touching or being near something that belonged to a holy person?",
    ],
    trueFalse: [
      { statement: "Catholics believe statues of saints have power of their own.", answer: false },
      { statement: "Asking a saint to pray for you is similar to asking a living friend to pray for you.", answer: true },
      { statement: "The First Commandment forbids all use of religious images and statues.", answer: false },
    ],
  },
  {
    n: 18,
    title: "The Second and Third Commandments of God",
    topics: [
      { qRange: "224-225", topic: "The Second Commandment", content: "Forbids taking God's name in vain: using it disrespectfully, in idle exclamations, in false oaths (swearing to something untrue), or breaking a vow made to God. Requires reverence for God's name and for sacred things generally." },
      { qRange: "234-238", topic: "The Third Commandment", content: "Requires keeping the Lord's Day (Sunday) holy — assisting at Mass, and resting from unnecessary servile (purely physical/laborious) work so there's room for worship, rest, and family. Servile work that's necessary (like caring for the sick) is permitted." },
    ],
    discussionQuestions: [
      "What's the difference between using God's name in prayer and using it as a casual exclamation? Why does one honor Him and the other doesn't?",
      "What does 'keeping the Sabbath holy' actually look like in a normal family's Sunday, beyond just going to Mass?",
    ],
    trueFalse: [
      { statement: "Making a false oath — swearing to something you know isn't true — breaks the Second Commandment.", answer: true },
      { statement: "The Third Commandment forbids ALL work of any kind on Sunday, even caring for a sick family member.", answer: false },
      { statement: "Attending Mass is part of keeping the Third Commandment.", answer: true },
    ],
  },
  {
    n: 19,
    title: "The Fourth, Fifth, and Sixth Commandments of God",
    topics: [
      { qRange: "241-243", topic: "The Fourth Commandment", content: "Requires honoring, loving, and obeying our parents and other lawful superiors (like teachers and just civil authority) in everything that isn't sinful. Also implies duties parents owe their children — care, education, good example." },
      { qRange: "245", topic: "The Fourth Commandment — limits", content: "Obedience to parents/superiors is owed only in what's lawful — nobody has to obey an order to do something sinful." },
      { qRange: "250", topic: "The Fifth Commandment", content: "Forbids unjustly taking or endangering human life — murder, and also serious anger, hatred, fighting, and giving scandal (leading someone else into sin). Also requires reasonable care for one's own life and health." },
      { qRange: "251-256", topic: "The Sixth Commandment", content: "Requires purity in thought, word, and action, and modesty in dress and behavior. Forbids impurity of any kind." },
    ],
    discussionQuestions: [
      "Is it ever right to disobey a parent or teacher? Under what circumstance, and why?",
      "The Fifth Commandment covers more than just 'don't murder someone' — what other things does it actually forbid?",
      "Why does the Church connect purity with modesty? What does modesty actually mean here?",
    ],
    trueFalse: [
      { statement: "Children must obey their parents even if a parent tells them to do something sinful.", answer: false },
      { statement: "Giving someone scandal means leading them into sin by your words or example.", answer: true },
      { statement: "The Fifth Commandment only forbids the physical act of killing someone.", answer: false },
      { statement: "Modesty is part of what the Sixth Commandment asks of us.", answer: true },
    ],
  },
  {
    n: 20,
    title: "The Seventh, Eighth, Ninth, and Tenth Commandments of God",
    topics: [
      { qRange: "260-261", topic: "The Seventh Commandment", content: "Forbids stealing, cheating, and unjustly damaging another's property; requires making restitution (giving back or repaying) when we've taken or damaged what isn't ours." },
      { qRange: "265-266", topic: "The Eighth Commandment", content: "Forbids lying, and also rash judgment (assuming the worst about someone without real evidence), detraction (revealing someone's real faults without a good reason), and calumny (lying about someone to damage their reputation)." },
      { qRange: "273", topic: "The Ninth Commandment", content: "Forbids deliberately entertaining impure thoughts or desires — it pairs with the Sixth Commandment, covering the internal (thought/desire) side of purity." },
      { qRange: "278", topic: "The Tenth Commandment", content: "Forbids envy — deliberately wishing to have what rightfully belongs to someone else." },
    ],
    discussionQuestions: [
      "What's the difference between detraction and calumny? Give an example of each.",
      "Why is restitution (giving back what you took or fixing what you damaged) part of the Seventh Commandment, not just 'don't steal in the first place'?",
      "How is envy (Tenth Commandment) different from just wanting nice things for yourself?",
    ],
    trueFalse: [
      { statement: "Restitution means paying back or fixing what you've unjustly taken or damaged.", answer: true },
      { statement: "Spreading a true but damaging fact about someone for no good reason is called detraction.", answer: true },
      { statement: "The Tenth Commandment forbids simply wanting good things.", answer: false },
      { statement: "Calumny means lying about someone to hurt their reputation.", answer: true },
    ],
  },
  {
    n: 21,
    title: "The Commandments of the Church — First and Second",
    topics: [
      { qRange: "281", topic: "First Commandment of the Church", content: "To assist at Mass on all Sundays and holy days of obligation." },
      { qRange: "283", topic: "Second Commandment of the Church", content: "To fast and abstain on the days appointed by the Church (traditionally Fridays and specific penitential days, per current Church discipline)." },
    ],
    discussionQuestions: [
      "Why does the Church, on top of the Ten Commandments of God, also give its own commandments? What's the point of them?",
      "What's the difference between fasting and abstinence in Church discipline?",
    ],
    trueFalse: [
      { statement: "The Commandments of the Church are the same thing as the Ten Commandments.", answer: false },
      { statement: "Missing Mass on a holy day of obligation without a serious reason goes against the First Commandment of the Church.", answer: true },
    ],
  },
  {
    n: 22,
    title: "The Third, Fourth, Fifth, and Sixth Commandments of the Church",
    topics: [
      { qRange: "general", topic: "Confession, Communion, Support, Marriage laws", content: "Third: confess your sins at least once a year (if in mortal sin). Fourth: receive Holy Communion during the Easter season (the 'Easter duty'). Fifth: contribute to the support of the Church. Sixth: observe the Church's laws regarding marriage (e.g. how and where a Catholic marriage must be celebrated)." },
    ],
    discussionQuestions: [
      "Why does the Church set a MINIMUM (once a year for confession, once during Easter for Communion) rather than just trusting everyone to do it often enough on their own?",
      "Why would the Church have its own laws about how Catholics get married, on top of civil marriage law?",
    ],
    trueFalse: [
      { statement: "Catholics are only required to receive Communion once a year, during the Easter season, at minimum.", answer: true },
      { statement: "Supporting the Church financially is one of the Commandments of the Church.", answer: true },
    ],
  },
  {
    n: 27,
    title: "The Sacrifice of the Mass",
    topics: [
      { qRange: "357", topic: "The Mass as Sacrifice", content: "The Mass is not a new sacrifice — it's the SAME sacrifice Christ offered on Calvary, made present again on the altar in an unbloody way. Same Priest (Christ, acting through the priest) and same Victim (Christ Himself), different manner of offering." },
      { qRange: "360-361", topic: "Parts of the Mass", content: "Broadly: the Liturgy of the Word (readings, homily) and the Liturgy of the Eucharist (Offertory — bread and wine are presented; Consecration — Christ becomes truly present; Communion — the faithful receive Him)." },
      { qRange: "363", topic: "Assisting at Mass devoutly", content: "We should follow the Mass attentively and unite our own prayers and sacrifices to Christ's offering, not just be physically present." },
    ],
    discussionQuestions: [
      "How is the Mass 'the same sacrifice' as Calvary if nobody is actually being crucified again?",
      "Walk through the Mass in order — what happens at the Offertory, Consecration, and Communion?",
      "What does it actually mean to 'assist at Mass' rather than just 'attend' it?",
    ],
    trueFalse: [
      { statement: "The Mass is a completely new and different sacrifice from what happened on Calvary.", answer: false },
      { statement: "The Consecration is the moment bread and wine become the Body and Blood of Christ.", answer: true },
      { statement: "Just being physically present at Mass, without paying attention, fully satisfies what it means to assist at Mass.", answer: false },
    ],
  },
  {
    n: 28,
    title: "Holy Communion",
    topics: [
      { qRange: "366", topic: "The Real Presence and worthy reception", content: "Under the appearance of bread and wine, we receive Christ Himself — Body, Blood, Soul, and Divinity. To receive worthily, a person must be in the state of grace (free of unconfessed mortal sin) and observe the Church's fasting discipline. A worthy Communion increases grace, unites us more closely to Christ, and helps us avoid sin." },
    ],
    discussionQuestions: [
      "What does it mean that Christ is present 'Body, Blood, Soul, and Divinity' — not just symbolically?",
      "Why does someone need to be in the state of grace before receiving Communion? What would receiving unworthily mean?",
    ],
    trueFalse: [
      { statement: "The Eucharist is only a symbol of Christ, not His actual presence.", answer: false },
      { statement: "A person in the state of mortal sin should go to Confession before receiving Communion.", answer: true },
    ],
  },
  {
    n: 29,
    title: "Penance",
    topics: [
      { qRange: "379", topic: "What Penance is", content: "The sacrament by which sins committed after Baptism are forgiven through the priest's absolution." },
      { qRange: "382", topic: "Matter and form", content: "The 'matter' (the penitent's part) is contrition, confession, and satisfaction (doing the penance given). The 'form' (the priest's part) is the words of absolution." },
      { qRange: "384", topic: "What must be confessed", content: "All mortal sins must be confessed in kind (what the sin was) and number (how many times), to the best of one's memory." },
    ],
    discussionQuestions: [
      "What are the three things a penitent has to bring to Confession, and what does the priest add to complete the sacrament?",
      "Why does the Church require confessing sins 'in kind and number' rather than just a general 'I've sinned'?",
    ],
    trueFalse: [
      { statement: "Absolution is given by the penitent, not the priest.", answer: false },
      { statement: "A person must confess mortal sins by both what they were and roughly how many times.", answer: true },
    ],
  },
  {
    n: 30,
    title: "Contrition",
    topics: [
      { qRange: "388", topic: "Perfect vs. imperfect contrition", content: "Contrition is sorrow for sin joined to a real resolve not to sin again. Perfect contrition comes from love of God Himself; imperfect contrition (attrition) comes from a lesser motive, like fear of punishment — still sufficient for a valid confession when paired with the sacrament. Either way, a genuine purpose of amendment (real intent to avoid the sin again) is required." },
    ],
    discussionQuestions: [
      "What's the difference between being sorry because you love God and being sorry because you're afraid of punishment? Does the Church say only one of those 'counts'?",
      "Why is a purpose of amendment (actually intending to change) a necessary part of real contrition, not just feeling bad?",
    ],
    trueFalse: [
      { statement: "Perfect contrition is sorrow motivated purely by love of God.", answer: true },
      { statement: "Being sorry for a sin without any intention to stop doing it counts as true contrition.", answer: false },
      { statement: "Imperfect contrition (attrition) is useless and doesn't count for anything.", answer: false },
    ],
  },
  {
    n: 31,
    title: "Confession",
    topics: [
      { qRange: "general", topic: "Examination of conscience and integrity", content: "Before confessing, a person examines their conscience — honestly recalling their sins since the last confession. Confession must be integral (complete) — all mortal sins remembered, in kind and number. The priest is bound by the seal of confession, meaning he can never reveal anything heard in confession, under any circumstance." },
    ],
    discussionQuestions: [
      "Why does examining your conscience before confession matter — what happens if you skip it?",
      "What is the 'seal of confession,' and why is it absolute, with no exceptions?",
    ],
    trueFalse: [
      { statement: "A priest can break the seal of confession if a serious enough crime was confessed.", answer: false },
      { statement: "Examination of conscience means honestly recalling your sins before going to confession.", answer: true },
    ],
  },
  {
    n: 32,
    title: "How To Make a Good Confession",
    topics: [
      { qRange: "general", topic: "The steps of a good confession", content: "1. Examine your conscience. 2. Feel true sorrow for your sins (contrition). 3. Resolve firmly not to commit them again (purpose of amendment). 4. Confess your sins honestly and completely to the priest. 5. Accept and perform the penance given. An Act of Contrition is prayed as part of the sacrament." },
    ],
    discussionQuestions: [
      "Put the steps of making a good confession in order, in your own words.",
      "What would be missing from a confession where someone lists their sins but has no real sorrow or intention to change?",
    ],
    trueFalse: [
      { statement: "Doing the penance the priest assigns is part of making a good confession.", answer: true },
      { statement: "Listing your sins to the priest, by itself, is the whole of what's required for a good confession.", answer: false },
    ],
  },
];

export function getCatechismLesson(n: number): CatechismLessonGuide | undefined {
  return catechismGuide.find((l) => l.n === n);
}

// religion-6.ts's lesson `n` is the RCA TEACHING WEEK index (1-33) — it is
// NOT the same number as a real Baltimore Catechism lesson. They happen to
// overlap numerically in places (week 15 covers real Catechism Lesson 15)
// purely because the pacing doc introduces catechism lessons roughly
// sequentially — but by week 22 the real catechism lesson being taught is
// 27, not 22 (there's a Gospel-only stretch with no new catechism content in
// between). Looking a guide up by the raw week number silently returns
// nothing (or, worse, the WRONG lesson's guide) for every week after that
// drift starts. This extracts the real catechism lesson number(s) actually
// named in that week's own pacing text ("Baltimore Catechism, Lesson 27",
// "Lesson 27 #357...") instead of assuming week N == catechism lesson N.
export function extractCatechismLessonNumbers(weekText: string): number[] {
  const found = new Set<number>();
  const re = /Lesson\s+(\d{1,2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(weekText))) found.add(parseInt(m[1], 10));
  return [...found].sort((a, b) => a - b);
}

export function getCatechismLessonsForWeekText(weekText: string): CatechismLessonGuide[] {
  return extractCatechismLessonNumbers(weekText)
    .map((n) => getCatechismLesson(n))
    .filter((g): g is CatechismLessonGuide => !!g);
}

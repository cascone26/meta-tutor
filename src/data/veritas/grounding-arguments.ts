export interface GroundingArgument {
  slug: string;
  title: string;
  oneLine: string;
  whyItMatters: string;
  theCase: string[];
  objections: { q: string; a: string }[];
  sources: string[];
  tags: string[];
}

export const GROUNDING_ARGUMENTS: GroundingArgument[] = [
  {
    slug: "contingency",
    title: "The Contingency Argument",
    oneLine:
      "Every contingent thing needs an explanation outside itself — there must be something that exists necessarily. That is what we call God.",
    whyItMatters:
      "This is the argument that doesn't care about feelings, cosmology, or empirical discoveries. It is a pure metaphysical demonstration. If you understand it, you have a foothold that no emotional state can dislodge.",
    theCase: [
      "Every thing you encounter is contingent — it could have failed to exist. The coffee in front of you. The chair. The Earth. You. Nothing in the essence of any of these things requires their existence.",
      "The Principle of Sufficient Reason holds that every existing thing has an explanation for its existence — either in its own nature or in an external cause. A contingent thing, by definition, cannot explain its own existence (since its nature permits non-existence). So every contingent thing has an external cause.",
      "Consider the totality of contingent things. Is the whole set self-explanatory? No — it consists entirely of things that could have failed to exist. So the collection itself is contingent. The collection needs an explanation outside itself.",
      "The explanation cannot be another contingent thing (that would put it inside the collection we already agreed needs explaining). So the explanation must be something that exists by its own nature — something that cannot not exist. This is a necessary being.",
      "This necessary being is simple (no parts, or its parts would require explanation), immaterial (matter is contingent), and the source of being for everything else. This is what classical theism calls God.",
      "Note what this argument does NOT require: no Big Bang, no beginning of the universe, no empirical cosmology. It works even if the universe is eternal. It is about the structure of contingent existence, not the history of the cosmos.",
    ],
    objections: [
      {
        q: "What caused God?",
        a: "Category error. God is defined as the necessary being — the being whose essence is existence. Asking what caused the necessary being is like asking who the bachelor's wife is. The argument arrives at something that by its nature cannot require a cause.",
      },
      {
        q: "Why can't the universe itself be the necessary being?",
        a: "Because the universe is a collection of contingent parts, each of which could not exist. A collection of contingent things is itself contingent. You would have to argue that the universe is a simple, partless, unchanging necessary being — which would make it identical to classical theism's God, just renamed.",
      },
      {
        q: "Why does there need to be an explanation at all? Maybe existence is just a brute fact.",
        a: "If you reject the Principle of Sufficient Reason, you cannot do science. All scientific inference — 'this effect has a cause we can find' — assumes that existence is explicable. You can arbitrarily draw the line at 'but not for the whole universe,' but that is special pleading, not argument.",
      },
      {
        q: "Doesn't quantum mechanics show that things can come from nothing?",
        a: "No. Quantum vacuum fluctuations occur in a quantum field, which is not nothing — it is a structured physical reality with laws. 'Nothing' in philosophy means no things, no laws, no field, no potential. Physics has never described a true nothing, because physics cannot.",
      },
    ],
    sources: [
      "Aquinas, ST I q.2 a.3 (Third Way)",
      "Leibniz, Monadology §§36-38",
      "Edward Feser, Five Proofs of the Existence of God (2017)",
      "Joshua Rasmussen, How Reason Can Lead to God (2019)",
    ],
    tags: ["existence of God", "metaphysics", "reason"],
  },
  {
    slug: "first-mover",
    title: "The First Mover (Aquinas's First Way)",
    oneLine:
      "Nothing actualizes itself. If every actualizer is also being actualized, nothing gets off the ground. There must be an Unactualized Actualizer.",
    whyItMatters:
      "The First Way is not about the beginning of the universe — it is about sustaining existence in this moment. At every instant, something holds you in being. Understanding this moves the question from 'what started things' to 'what is holding things now.'",
    theCase: [
      "Change is the reduction of potency to act. A cold glass of water has the potency to become warm; when the sun warms it, that potency is actualized. The water cannot warm itself; something already actual (the sun) must do it.",
      "Any thing currently changing is having one of its potencies actualized by something else that is actual. That actualizer, if it is itself being actualized in the process, requires another actualizer. And so on.",
      "This regress cannot be infinite — not in time (Aquinas does not assume a beginning), but in the hierarchy of actualizers at this instant. If every member of the chain is borrowing actualization from another borrower, nothing has any actualization to give. The chain must terminate in something that is pure actuality — something with no potentiality being actualized.",
      "Pure act, with no potency, cannot change, cannot fail to exist, cannot be many (multiplicity requires some potency to differentiate), cannot be material. This is God.",
    ],
    objections: [
      {
        q: "Hasn't Newton shown that motion doesn't need a mover — objects in motion stay in motion?",
        a: "Aquinas uses 'motion' in Aristotle's broader sense: any change, any reduction from potency to act. Newton's inertia is about local motion (change of place), which is only one species of change. Aquinas's argument is about any kind of change — including the very existence of things from moment to moment.",
      },
      {
        q: "Isn't this just 'God of the gaps'?",
        a: "No — Aquinas is not appealing to our ignorance. He is arguing from the metaphysical structure of change itself. Even a complete physical explanation of every event would not answer the question: what is sustaining the actuality of the whole chain right now? The argument does not depend on any unexplained phenomenon.",
      },
    ],
    sources: [
      "Aquinas, ST I q.2 a.3 (First Way)",
      "Aristotle, Physics VIII",
      "Edward Feser, Aquinas: A Beginner's Guide (2009)",
    ],
    tags: ["existence of God", "metaphysics", "Aquinas"],
  },
  {
    slug: "resurrection",
    title: "The Historical Case for the Resurrection",
    oneLine:
      "Twelve facts about Jesus — accepted by 90%+ of scholars, including atheists — are best explained by a real Resurrection.",
    whyItMatters:
      "This is the historical hinge. Christianity is falsifiable: if Christ is not risen, our faith is in vain (1 Cor 15:14). But the evidence, examined on normal historical principles, points strongly to a real Resurrection.",
    theCase: [
      "Gary Habermas catalogued over 1,400 scholarly articles on the Resurrection published since 1975. From these, he identified 12 facts accepted by 90%+ of scholars across the spectrum — Christian, atheist, Jewish, liberal, conservative.",
      "The 12 Minimal Facts: (1) Jesus died by crucifixion. (2) He was buried, most likely in a tomb. (3) His death caused the disciples to despair. (4) The tomb was discovered empty shortly afterward. (5) The disciples had experiences they believed were literal appearances of the risen Jesus. (6) These experiences transformed them from cowards into bold proclaimers. (7) The Resurrection was the central message from the earliest moments. (8) The message was proclaimed in Jerusalem. (9) The Church was born there. (10) Sunday became the primary day of Christian worship. (11) James, Jesus's skeptical brother, converted after a reported appearance. (12) Paul, a violent persecutor, converted after a reported appearance.",
      "The naturalistic alternatives — and why each fails: (a) Hallucination: cannot explain the empty tomb, does not occur to groups, and would not have converted Paul or James. (b) Stolen body: the disciples had no motive to die for a lie, and the tomb's empty state was conceded even by hostile sources. (c) Wrong tomb: not plausible in a city where the tomb's location was public. (d) Legend: the earliest creed (1 Cor 15:3-8) dates to within 3-5 years of the crucifixion, before any legendary accretion could develop. (e) Swoon theory: a crucifixion survivor could not convince disciples he had conquered death.",
      "The Resurrection is the only hypothesis that accounts for all twelve facts simultaneously. This is not proof in the mathematical sense, but it is how all historical inference works: the best explanation of the full dataset wins.",
      "Pinchas Lapide, an Orthodox Jewish theologian who did NOT convert to Christianity, concluded: 'I accept the resurrection of Easter Sunday not as an invention of the community of disciples, but as a historical event.' He had no incentive to reach this conclusion. The data compelled him.",
    ],
    objections: [
      {
        q: "Miracles are impossible; therefore any alternative is better than the Resurrection.",
        a: "This begs the question. If theism is even possibly true, miracles are possible. The historical case for the Resurrection is itself evidence for theism. You cannot rule out the hypothesis by asserting the conclusion you are trying to avoid.",
      },
      {
        q: "The gospels were written decades later, so they can't be trusted.",
        a: "The 1 Corinthians 15 creed is dated by scholars to AD 30-35 — within five years of the event. Paul received it from the apostles themselves. This is not decades-later legend; this is contemporary testimony from eyewitnesses.",
      },
      {
        q: "Mass hallucinations happen.",
        a: "No, they do not. Group hallucinations in the clinical literature are extremely rare, require a shared expectation, and don't persist across multiple distinct occasions and contexts. The Resurrection appearances were to different groups, at different times, in different modes — including meals, walks, and physical touch.",
      },
      {
        q: "What about David Hume's argument against miracles?",
        a: "Hume argued that the testimony for a miracle must be weighed against the uniformity of nature. But Hume's principle is question-begging: it assumes nature is uniform in order to conclude that miracles never happen. For the Resurrection, the testimony comes from people who died for it — and the claim is precisely that nature's uniformity was interrupted once by its Author.",
      },
    ],
    sources: [
      "Gary Habermas & Michael Licona, The Case for the Resurrection of Jesus (2004)",
      "N.T. Wright, The Resurrection of the Son of God (2003)",
      "Michael Licona, The Resurrection of Jesus: A New Historiographical Approach (2010)",
      "Pinchas Lapide, The Resurrection of Jesus: A Jewish Perspective (1982)",
    ],
    tags: ["Resurrection", "history", "apologetics", "Jesus"],
  },
  {
    slug: "fine-tuning",
    title: "The Fine-Tuning of the Universe",
    oneLine:
      "Physical constants sit at knife-edge values; the probability of life-permitting values on any naturalistic view is vanishingly small.",
    whyItMatters:
      "Modern physics did not refute God — it gave new evidence for Him. The same equations you respect give numbers that, if you saw them on a slot machine, you would call rigged.",
    theCase: [
      "The cosmological constant is fine-tuned to roughly 1 part in 10^120 for a life-permitting universe. Change it beyond that margin and either the universe recollapses or expands too fast for galaxies to form.",
      "The initial entropy of the universe, per Roger Penrose, sits at 1 part in 10^(10^123). Penrose is not a theist; he simply acknowledges the number.",
      "The ratio of electromagnetic to gravitational force: if gravity were stronger by a factor of 10^40, stars would be too small and short-lived for complex chemistry.",
      "The mass difference between neutron and proton: if it were slightly different, either no hydrogen would exist (no water, no stars) or all protons would decay.",
      "The strong nuclear force: 2% stronger, no hydrogen; 5% weaker, no elements heavier than hydrogen.",
      "These are not cherry-picked. Over 30 independent constants are fine-tuned. The joint probability of life-permitting values is astronomically small.",
      "The response options are: (1) brute luck — but this is not a scientific claim; it is a refusal to explain. (2) The multiverse — but it is unobservable by its own definition, and even a multiverse-generator needs fine-tuning to produce varied sub-universes. (3) Design — a mind that intended these values.",
      "The multiverse is not cheaper than God. It postulates an infinite number of unobservable universes to avoid postulating one mind. Parsimony favors design.",
    ],
    objections: [
      {
        q: "With enough universes, something had to win the lottery. We are just in the winning one.",
        a: "The multiverse hypothesis is unfalsifiable — by construction, other universes cannot be observed. It is an untestable metaphysical commitment, not a scientific alternative. Worse, a universe-generating mechanism would itself require fine-tuning to produce varied outcomes. You have not escaped the problem; you have moved it up a level.",
      },
      {
        q: "Maybe life would adapt to different constants.",
        a: "In most cases, no 'life' is even possible — no stars, no chemistry, no stable matter. It is not that life would look different; it is that the universe would consist of thin hydrogen gas or collapse immediately. The fine-tuning is for any form of complex chemistry, not just carbon-based DNA.",
      },
      {
        q: "We're only here because things worked out — this is selection bias.",
        a: "Selection bias explains why we do not observe a dead universe, but it does not explain why a life-permitting one exists at all. If you win a lottery rigged a trillion times over, saying 'well obviously I'm here to notice it' does not dissolve the need for explanation.",
      },
    ],
    sources: [
      "Robin Collins, 'The Teleological Argument,' in The Blackwell Companion to Natural Theology (2009)",
      "Luke Barnes & Geraint Lewis, A Fortunate Universe (2016)",
      "Roger Penrose, The Emperor's New Mind (1989) — entropy calculation",
    ],
    tags: ["cosmology", "physics", "design", "existence of God"],
  },
  {
    slug: "moral-argument",
    title: "The Moral Argument",
    oneLine:
      "Objective moral truths exist. They cannot be grounded in matter. Therefore something transcendent grounds them.",
    whyItMatters:
      "Even secular people behave as if cruelty is really wrong, not merely unfashionable. That behavior is a clue. The moral sense is a window onto a reality that physics cannot account for.",
    theCase: [
      "Premise 1: If God does not exist, objective moral values do not exist. (On pure naturalism, moral claims reduce to evolved preferences or cultural conventions — they have no authority that transcends the human.)",
      "Premise 2: Objective moral values exist. (The torture of innocents for fun is not merely distasteful — it is really wrong. Almost no one can sincerely deny this under interrogation.)",
      "Conclusion: Therefore God exists.",
      "The second premise is harder to deny than people realize. When a person says 'morality is just evolved preference,' press them: is the Holocaust merely unfashionable? Would it have been good if the Nazis had won and reeducated the world? If they say 'no, it would still have been wrong,' they have conceded objective morality.",
      "C.S. Lewis's argument from Mere Christianity: every human quarrel appeals to a standard the other party is expected to know. 'That's unfair.' 'I was there first.' 'You promised.' These appeals only make sense if there is a standard independent of both parties. Where does that standard come from?",
      "On theism, moral truths are grounded in the nature of God — a maximally good being whose nature is the standard of goodness. This is not arbitrary divine command; it is the ontology of goodness itself.",
    ],
    objections: [
      {
        q: "Evolution explains our moral sense without God.",
        a: "Evolution may explain why we have moral feelings, but not why those feelings track real moral truths. An evolved sense of 'fairness' as a survival strategy is not the same as fairness being really right. If our moral faculties were only shaped by survival value, we would have no reason to trust them as truth-tracking.",
      },
      {
        q: "Isn't this the Euthyphro dilemma? Is something good because God commands it, or does God command it because it's good?",
        a: "Classical theism rejects the dilemma by identifying goodness with God's nature. God does not command arbitrarily (first horn), nor does He consult an external standard (second horn). He IS the standard. The dilemma only bites against a God who is separate from goodness.",
      },
      {
        q: "Atheists are moral without believing in God.",
        a: "Yes, because moral knowledge is available to all humans (Romans 2:14-15). The argument is not that atheists cannot be moral; it is that atheism cannot ground the moral truths they in fact know. They behave better than their worldview permits.",
      },
    ],
    sources: [
      "C.S. Lewis, Mere Christianity, Book I",
      "William Lane Craig, Reasonable Faith, Ch. 4",
      "Paul Copan, Is God a Moral Monster?",
      "Romans 2:14-15",
    ],
    tags: ["ethics", "moral argument", "existence of God"],
  },
  {
    slug: "real-presence",
    title: "The Real Presence of the Eucharist",
    oneLine:
      "From 107 AD onward, the Church has uniformly taught that the Eucharist IS the Body and Blood of Christ — this is not a medieval development.",
    whyItMatters:
      "The Eucharist is the central claim that distinguishes Catholic (and Orthodox) Christianity from most Protestant traditions. The patristic evidence is overwhelming and early.",
    theCase: [
      "John 6:51-58: 'The bread that I shall give is my flesh for the life of the world... Truly, truly, I say to you, unless you eat the flesh of the Son of Man and drink his blood, you have no life in you.' When disciples leave because the teaching is too hard, Jesus does not correct them. He lets them go. This is the only time in the gospels where Jesus allows followers to leave over a misunderstanding without clarifying.",
      "Ignatius of Antioch, c. 107 AD: 'They abstain from the Eucharist and from prayer, because they do not confess that the Eucharist is the flesh of our Savior Jesus Christ' (Smyrnaeans 7). Ignatius is a disciple of John. This is one generation from the apostles.",
      "Justin Martyr, c. 155 AD: 'We call this food Eucharist... not as common bread and common drink do we receive these; but... the food which is blessed by the prayer of His word, and from which our blood and flesh by transmutation are nourished, is the flesh and blood of that Jesus who was made flesh' (First Apology 66).",
      "Irenaeus, c. 180 AD: 'He has declared the cup, a part of creation, to be His own blood... and the bread, a part of creation, He has established as His own body' (Against Heresies IV.17.5).",
      "Cyril of Jerusalem, c. 350 AD: 'Do not, therefore, regard the bread and wine as simply that; for they are, according to the Master's declaration, the Body and Blood of Christ' (Catechetical Lecture 22).",
      "Augustine, c. 410 AD: 'That bread which you see on the altar, having been sanctified by the word of God, is the body of Christ. That chalice... is the blood of Christ' (Sermon 227).",
      "The uniform patristic witness, from Ignatius to Augustine and beyond, is that the Eucharist is literally Christ's Body and Blood. There is no early Father who teaches a merely symbolic view. Symbolic interpretations appear in the 11th century (Berengar of Tours) and are condemned immediately.",
    ],
    objections: [
      {
        q: "But John 6 is obviously metaphorical — 'the words I have spoken to you are spirit and life' (v. 63).",
        a: "In context, 'spirit and life' refers to Christ's teaching as life-giving, not a retraction of literal flesh. He did not say 'I was speaking metaphorically'; He said the disciples who left did not believe. If He meant metaphor, He would have clarified rather than let followers walk away over a misunderstanding.",
      },
      {
        q: "Catholics are committing idolatry by worshiping bread.",
        a: "Catholics do not worship bread. They worship Christ, who has made Himself substantially present under the appearance of bread. If the Real Presence is true, the act is worship of God; if false, it is a mistake but not idolatry (since the intention is toward Christ). Mere misidentification is not idolatry.",
      },
      {
        q: "Transubstantiation is philosophically incoherent — you can't change substance without changing accidents.",
        a: "Only on a philosophy that conflates substance with accidents. Aristotelian metaphysics distinguishes the two precisely: substance is what a thing is; accidents are how it appears. The Eucharistic claim is that substance changes while accidents remain. This is unusual (it happens only here), but not incoherent.",
      },
    ],
    sources: [
      "John 6",
      "Ignatius of Antioch, Letter to the Smyrnaeans 7",
      "Justin Martyr, First Apology 66",
      "Aquinas, ST III qq.73-83",
      "Brant Pitre, Jesus and the Jewish Roots of the Eucharist (2011)",
    ],
    tags: ["Eucharist", "sacraments", "Real Presence", "Church Fathers"],
  },
  {
    slug: "papacy",
    title: "The Papacy in Matthew 16 + Isaiah 22",
    oneLine:
      "Christ's 'keys of the kingdom' language directly invokes Isaiah 22 — a dynastic office with successors, not a one-time grant.",
    whyItMatters:
      "The papacy is not a medieval accretion. It is written into the text of Matthew 16 via a thousand-year-old Old Testament reference.",
    theCase: [
      "Matthew 16:18-19: 'You are Peter, and on this rock I will build My Church... I will give you the keys of the kingdom of heaven, and whatever you bind on earth shall be bound in heaven.'",
      "Isaiah 22:22 (ca. 700 BC): 'And I will place on his shoulder the key of the house of David; he shall open, and none shall shut; and he shall shut, and none shall open.' This is God, through Isaiah, transferring the office of royal steward from Shebna to Eliakim. The key represents the office. When Eliakim died, the office passed to the next steward — it is a succession, built into the Davidic kingdom.",
      "When Jesus — Son of David, heir of the Davidic promise — gives Peter 'the keys of the kingdom,' He is not inventing new terminology. He is invoking the Isaiah 22 office directly. The language would have been unmistakable to a Jewish audience.",
      "The Greek text underscores the point. 'You are Petros (a rock), and on this petra (the rock) I will build My Church.' The grammatical distinction between masculine Petros and feminine petra is a Greek artifact; in Aramaic (the language Jesus spoke), it was 'Kepha... on this Kepha.' The identification is deliberate: Peter himself is the rock.",
      "The early Church understood this. Clement of Rome (c. 96 AD), writing on behalf of the Roman Church, intervenes authoritatively in a dispute in Corinth — an action that only makes sense if Rome held a primacy. Irenaeus (c. 180 AD) names the bishops of Rome from Peter in succession. The papal office is visible from the earliest documentation.",
      "Dynastic objection handled: Peter's successor is not his biological son (as in Davidic succession), but the bishop of Rome, because Peter died in Rome and the office stayed with the see he established.",
    ],
    objections: [
      {
        q: "The 'rock' is Peter's confession of faith, not Peter himself.",
        a: "This reading ignores the Aramaic and the direct address. Jesus says 'YOU are Kepha, and on this Kepha I will build.' He does not switch referents mid-sentence. The Fathers — even Protestant-friendly ones like Augustine — sometimes distinguish Peter and his confession, but they do not deny that Christ founds the Church on Peter.",
      },
      {
        q: "Paul rebukes Peter in Galatians 2 — how can Peter be infallible if he's corrigible?",
        a: "Papal infallibility is narrowly defined: ex cathedra definitions on faith and morals. It does not mean the pope is impeccable, or always right about pastoral strategy. Peter's hypocrisy in Galatians was behavioral, not doctrinal — and Paul's rebuke is itself intra-Church correction, not a denial of Peter's office.",
      },
      {
        q: "Popes have been corrupt — how can that office be from God?",
        a: "The scandal is real, but it does not falsify the office. Judas was an apostle chosen by Christ and betrayed Him. The presence of sinners in an office does not disprove the office's divine origin; it proves that the office is held by humans. The Church's claim is that the chair of Peter is preserved from defining heresy, not that every pope is a saint.",
      },
    ],
    sources: [
      "Matthew 16:13-20",
      "Isaiah 22:15-25",
      "Clement of Rome, Epistle to the Corinthians (c. 96 AD)",
      "Irenaeus, Against Heresies III.3 (c. 180 AD)",
      "Scott Hahn, 'The Keys of the Kingdom' (various lectures)",
      "Steven Ray, Upon This Rock (1999)",
    ],
    tags: ["papacy", "Peter", "ecclesiology", "succession"],
  },
  {
    slug: "apostolic-succession",
    title: "Apostolic Succession",
    oneLine:
      "The faith was passed by laying on of hands, bishop to bishop, from the apostles to the present day — this is a historical, traceable chain.",
    whyItMatters:
      "Without apostolic succession, 'the Church' is an abstraction. With it, the Church is a visible, institutional reality continuous with the one Christ founded.",
    theCase: [
      "The apostles appointed successors. Acts 1: Matthias is chosen to succeed Judas by the casting of lots after prayer — the office continues, the person changes. Acts 6: the seven deacons are appointed by the laying on of hands. 2 Timothy 1:6: Paul reminds Timothy of 'the gift of God that is within you through the laying on of my hands.' The pattern is clear: authority passed through ordination.",
      "Clement of Rome, c. 96 AD: 'Our apostles also knew, through our Lord Jesus Christ, that there would be strife on account of the office of the episcopate. For this reason, therefore, inasmuch as they had obtained a perfect foreknowledge of this, they appointed those ministers already mentioned, and afterwards gave instructions, that when these should fall asleep, other approved men should succeed them in their ministry' (Epistle to the Corinthians 44).",
      "Irenaeus, c. 180 AD, names the succession of Roman bishops: Linus, Anacletus, Clement, Evaristus, Alexander, Sixtus, Telesphorus, Hyginus, Pius, Anicetus, Soter, Eleutherius. He is writing within living memory of some of these men. This is a public, checkable historical record.",
      "The succession chain continues unbroken. Every Catholic and Orthodox bishop today can trace his ordination back through his consecrators to an apostle. This is not mythology; the records exist.",
      "Protestant denominations, by breaking with the institutional Church, severed the succession. This is why Protestant ordinations are generally not recognized as valid in Catholic and Orthodox theology — not out of sectarian spite, but because apostolic succession is a historical fact that can be interrupted.",
    ],
    objections: [
      {
        q: "Where does the Bible say apostolic succession is necessary?",
        a: "The Bible assumes it. The apostles ordained successors (Acts 6, 1 Tim 4:14, 2 Tim 1:6, Titus 1:5). The question 'where is it explicitly commanded' is a sola scriptura framing — but the Bible itself does not teach sola scriptura. The practice of succession is how the early Church understood what Christ established.",
      },
      {
        q: "Corrupt bishops break the chain — it's not real.",
        a: "The validity of ordination does not depend on the personal holiness of the minister, only on the form, matter, and intention. This is called ex opere operato. A sinful bishop can still validly ordain, just as a sinful priest can still validly consecrate the Eucharist.",
      },
    ],
    sources: [
      "1 Clement 42-44",
      "Irenaeus, Against Heresies III.3",
      "2 Timothy 1:6; Titus 1:5",
      "John Henry Newman, Essay on the Development of Christian Doctrine",
    ],
    tags: ["apostolic succession", "ecclesiology", "holy orders"],
  },
  {
    slug: "sola-scriptura",
    title: "The Self-Defeat of Sola Scriptura",
    oneLine:
      "Sola scriptura is not itself taught by Scripture — and Scripture does not tell you which books are Scripture.",
    whyItMatters:
      "If sola scriptura is false, the Reformation's epistemological foundation collapses, and the Catholic three-legged stool (Scripture + Tradition + Magisterium) becomes the only coherent option.",
    theCase: [
      "Problem 1 — Self-reference: Sola scriptura teaches that Scripture alone is the infallible rule of faith. But Scripture nowhere teaches this. 2 Timothy 3:16 says Scripture is 'inspired and useful,' but not that it is the ONLY rule. The principle fails its own test: it is not found in Scripture, yet it claims that only Scripture can bind the conscience. By its own rule, it is unbinding.",
      "Problem 2 — The canon: Which books are Scripture? The table of contents is not itself in Scripture. The canon was discerned by the Church — at Hippo (393), Carthage (397), and ratified again at Trent (1546). A Protestant who accepts the 27-book New Testament is trusting the Catholic Church's judgment on which books belong. Without the Church, there is no New Testament.",
      "Problem 3 — Interpretation: Scripture requires interpretation. With no authoritative interpreter, interpretations multiply. Protestant denominations number in the tens of thousands, each claiming Scripture's support for contradictory positions. 'The Bible says' is never self-evident. Someone must adjudicate.",
      "Problem 4 — Paul's own practice: 2 Thessalonians 2:15: 'So then, brethren, stand firm and hold to the traditions which you were taught by us, either by word of mouth or by letter.' Paul explicitly commands adherence to both written AND oral tradition. Sola scriptura denies what Paul commands.",
      "Problem 5 — Historical anachronism: Sola scriptura could not have been practiced in the early Church because most Christians did not have Bibles, many could not read, and the canon was not settled. How did they live by 'Scripture alone' before anyone knew what Scripture was? They didn't. They lived by apostolic tradition, embodied in the Church, with Scripture as its most authoritative written expression.",
    ],
    objections: [
      {
        q: "2 Timothy 3:16 says Scripture is 'sufficient' — that's sola scriptura.",
        a: "The verse says 'profitable' (Greek: ophelimos), not 'sufficient.' And it says profitable FOR teaching, reproof, correction, training in righteousness — not that it is the only source of doctrinal authority. If profitability implies sole sufficiency, then Paul himself is superfluous (he wrote more than teaching).",
      },
      {
        q: "Traditions are human and fallible; Scripture is divine.",
        a: "Catholics distinguish Sacred Tradition (apostolic, the deposit of faith handed down) from mere traditions (human customs that can be wrong). Jesus criticized 'traditions of men' (Matt 15), but He also commanded His own teaching be handed on (Matt 28). The apostles handed on what they received. That is Sacred Tradition.",
      },
    ],
    sources: [
      "2 Thessalonians 2:15",
      "2 Timothy 3:16 (careful exegesis)",
      "Council of Trent, Session IV",
      "Keith Mathison, The Shape of Sola Scriptura (interestingly, a Protestant attempt to modify the doctrine because the original form fails)",
      "Dave Armstrong, 100 Biblical Arguments Against Sola Scriptura",
    ],
    tags: ["sola scriptura", "Scripture", "Tradition", "Protestant"],
  },
  {
    slug: "dark-night",
    title: "The Dark Night of the Soul",
    oneLine:
      "Spiritual dryness is not the faith failing — it is God removing sensible consolations so that the naked will to trust is what grows.",
    whyItMatters:
      "If you are going through this, you are inside a teaching that the greatest saints documented carefully. You are not malfunctioning. You are being purified.",
    theCase: [
      "John of the Cross distinguished two dark nights: the night of sense (where God removes sensory consolation) and the night of spirit (where He removes spiritual consolation). Both are purgative. Both are normal stages of advanced spiritual life.",
      "The logic: the soul grows by stripping, not by addition. As long as you find consolation in the feeling of God, your love is partly self-love (loving the feeling). When the feeling is removed, what is left? Either you stop pursuing God (proving the feeling was the real object) or you pursue Him anyway (proving the love is real).",
      "This is why God permits — even actively causes — dryness. It is not punishment. It is training. The faith that survives the absence of feeling is stronger than the faith propped up by feeling.",
      "Mother Teresa experienced near-continuous spiritual darkness from 1946 until her death in 1997. She ran the Missionaries of Charity, she served lepers, she said yes to God every day — feeling nothing. Her private letters were only published posthumously. Many atheists seized on them as proof of her unbelief. The Church saw them for what they were: textbook dark night.",
      "Christ Himself cried out from the cross: 'My God, my God, why have You forsaken Me?' If the Son of God experienced the sensation of divine abandonment in His crucial moment, you are in impeccable company when you feel it.",
      "Therese of Lisieux, in her last months, experienced what she called 'the night of nothingness' — she reported that thoughts of heaven filled her with nothing but emptiness, and she felt the temptations of materialist unbelief. She did not leave the faith. She offered the darkness as her final sacrifice.",
      "The remedy: do not try to generate feelings. Continue the practices. Go to Mass. Pray the Rosary even with distraction. Sit silently. The will's fidelity is what matters. The feelings will return — perhaps in this life, perhaps only in glory. Either way, the showing up is the faith.",
    ],
    objections: [
      {
        q: "Isn't this just rationalizing the absence of evidence?",
        a: "No — it is an observed pattern across many saints over centuries, predicted in advance by spiritual masters. The dark night is not a post-hoc rescue; John of the Cross described its stages before ever encountering the soul in question. It is diagnostic, not defensive.",
      },
      {
        q: "Maybe the dryness is just depression or tiredness.",
        a: "It can be, and spiritual directors are trained to distinguish. If it is depression, get help — grace builds on nature, and fixing sleep and therapy matter. But dryness and depression can coexist. The solution is to persist in practice regardless, and to seek competent guidance.",
      },
    ],
    sources: [
      "John of the Cross, Dark Night of the Soul",
      "Mother Teresa, Come Be My Light (letters)",
      "Teresa of Avila, Interior Castle",
      "Therese of Lisieux, Story of a Soul (final months)",
      "Matthew 27:46 — Christ's cry from the cross",
    ],
    tags: ["doubt", "spiritual dryness", "dark night", "consolation"],
  },
  {
    slug: "hiddenness",
    title: "The Hiddenness of God",
    oneLine:
      "If God revealed Himself by force of sensation, faith would end — it would become sight. Hiddenness is not God's absence; it is the space where faith can exist.",
    whyItMatters:
      "The objection 'why does God hide' assumes hiddenness is a problem. In Catholic theology, it is a feature. Understand the why, and the objection dissolves.",
    theCase: [
      "Faith is defined as the assent of the intellect to what is non-evident (Aquinas, ST II-II q.4 a.1). If God were evident, there would be no faith — only knowledge.",
      "Why does God want faith rather than forced knowledge? Because faith is an act of love. It involves the will. A demonstration compels; a revelation invites. Love cannot be compelled. For the human to love freely, the evidence must leave room for the free response.",
      "The Incarnation is the answer to the hiddenness objection. God has not, in fact, remained hidden. He took flesh. He lived thirty-three years in first-century Palestine. He gave the apostles eyewitness testimony, which we have in writing, ratified by their deaths.",
      "After the Resurrection, the Incarnation ended. Christ ascended. He promised to return in glory. In the interim, He is present in the Eucharist, in Scripture, in the Church, and in the soul — but not in a way that forces the senses.",
      "The veiled Real Presence in the Eucharist is the paradigm. God lays Himself on the altar under appearances that the senses cannot penetrate. He is more present than almost anything you experience — and yet the senses report only bread.",
      "The hiddenness is proportionate to the dignity of the response it elicits. A shouted command compels obedience; a whispered invitation invites love. God whispers.",
      "Finally: the hiddenness is NOT total. Miracles continue — documented at Lourdes, Fatima, in the approved cases of countless saints. The Eucharistic miracles. The Shroud of Turin. Incorruptible saints. God leaves fingerprints. He just does not sign the painting in neon.",
    ],
    objections: [
      {
        q: "A loving God would make Himself obvious to everyone.",
        a: "A loving God would make Himself available to everyone who seeks Him. He has. 'Seek and you shall find' (Matt 7:7). The universal availability is satisfied; the universal imposition would be incompatible with human freedom.",
      },
      {
        q: "If Jesus appeared visibly to all, everyone would believe.",
        a: "The demons also see, and tremble, but do not love (James 2:19). Belief without freedom is not the saving act. Also, the apostles saw and many still doubted (Matt 28:17). Visibility does not automatically produce love.",
      },
    ],
    sources: [
      "John Henry Newman, Grammar of Assent",
      "J.L. Schellenberg, The Hiddenness Argument (the atheist side, worth engaging)",
      "Travis Dumsday, 'Divine Hiddenness and the One Sheep' (Religious Studies, 2012)",
      "Blaise Pascal, Pensées §232-234",
    ],
    tags: ["hiddenness", "faith", "freedom", "problem of evil"],
  },
  {
    slug: "faith-is-will",
    title: "Faith Is an Act of the Will",
    oneLine:
      "Faith is not a feeling and not certainty. It is the will choosing to trust the testimony of someone more trustworthy than your feelings.",
    whyItMatters:
      "The wrong definition of faith poisons the whole enterprise. If you think faith is the feeling of certainty, you will conclude you don't have faith the first time you doubt. The right definition makes doubt compatible with deep faith.",
    theCase: [
      "Aquinas, ST II-II q.2 a.1: 'To believe is an act of the intellect assenting to the divine truth by command of the will moved by God through grace.' Three actors: intellect (what it assents to), will (which commands assent), grace (which moves the will).",
      "Notice what is missing from the definition: feeling. Emotion is not mentioned. The felt sense of certainty is a possible consolation, but it is not the substance of faith.",
      "The intellect's assent is based on the testimony of the First Truth — God Himself, who cannot lie. Faith is not credulity; it is trust in a reliable testifier. You trust your friend when he tells you about his trip to Europe, even without evidence. Faith is that trust, scaled up to the testimony of the One who cannot deceive.",
      "The will's role is crucial. You cannot command your feelings, but you can command your will. When you feel no faith, you can still will to trust. That willing is faith. The feeling will follow or not — but the will's fidelity is what you control and what counts.",
      "Mother Teresa's fifty years of dryness were not fifty years without faith. They were fifty years of active, willed trust, with no sensory support. This is heroic faith, not degraded faith.",
      "This is why 'Lord, I believe; help my unbelief' (Mark 9:24) is coherent. The father confesses simultaneous belief (his will trusting) and unbelief (his feelings wavering). Christ accepts the prayer. The mixture is the normal Christian state.",
      "The practical implication: when you feel no faith, do not try to manufacture feelings. Will to trust. Pray as if it were real. Act as if it were real. The feelings are incidental; the willing is the thing.",
    ],
    objections: [
      {
        q: "But isn't faith 'the evidence of things not seen' (Heb 11:1)?",
        a: "The Greek elenchos here means conviction or substantiating, not feeling-of-certainty. Faith provides the internal standing-ground for claims that the senses cannot verify. It is a cognitive-volitional act, not an emotional state.",
      },
      {
        q: "If faith is just will, it's fideism — a leap without reason.",
        a: "No — the will is moved by grace, but the intellect assents because the testimony is trustworthy. Faith has reasons (the motives of credibility: miracles, prophecy, the Resurrection, the Church's endurance), but these reasons make faith REASONABLE, not AUTOMATIC. The will is still required to move from 'it is reasonable' to 'I commit.'",
      },
    ],
    sources: [
      "Aquinas, ST II-II qq.1-7 (on faith)",
      "Hebrews 11:1",
      "Mark 9:24",
      "John Henry Newman, Grammar of Assent",
      "Josef Pieper, Faith, Hope, Love",
    ],
    tags: ["faith", "will", "doubt", "Aquinas"],
  },
  {
    slug: "early-church-catholic",
    title: "The Early Church Was Catholic",
    oneLine:
      "The Church of the Fathers — with bishops, priests, Eucharist, Marian veneration, confession, prayers for the dead, apostolic succession — is the Catholic Church, not any Protestant alternative.",
    whyItMatters:
      "Newman: 'To be deep in history is to cease to be Protestant.' If the earliest Christians, continuous with the apostles, held Catholic beliefs, then Protestantism is the novelty, not Catholicism.",
    theCase: [
      "Bishops, priests, deacons — three-fold hierarchy: Clearly present by the time of Ignatius of Antioch (c. 107 AD). Ignatius repeatedly commands obedience to the bishop and warns against Eucharists not celebrated by one. The three-fold order is assumed, not argued for — which means it predates his writing.",
      "The Eucharist as Christ's Body and Blood: From Ignatius (107 AD) onward, uniform patristic witness. See the Real Presence entry.",
      "Baptismal regeneration: Acts 2:38, John 3:5, and every Father who discusses baptism. The idea that baptism is merely symbolic is a 16th-century innovation.",
      "Confession to a priest: James 5:16 ('confess your sins to one another'), John 20:22-23 ('whose sins you forgive are forgiven'), Didache 4:14 (c. 70 AD: 'In the assembly you shall confess your transgressions'), Tertullian (De Paenitentia), Origen, Cyprian — all presuppose sacramental confession.",
      "Prayers for the dead: 2 Maccabees 12:44-45 explicitly commands it. Inscriptions in the Roman catacombs (2nd century) request prayers for the deceased. This practice makes no sense on a Protestant eschatology, where death immediately decides heaven/hell with no intermediate purification.",
      "Marian veneration: By the 3rd century ('Sub Tuum Praesidium' prayer, c. 250 AD) Christians were asking Mary for intercession. The Council of Ephesus (431) defines her as Theotokos (God-bearer). This is organic development from Luke 1:42-48 ('all generations shall call me blessed'), not a medieval accretion.",
      "The Papal office: Clement of Rome (c. 96 AD) intervening authoritatively in Corinth; Irenaeus naming Roman succession (c. 180); the Council of Sardica (343) appealing to Rome as court of final appeal — all centuries before the Reformation.",
      "Saints and relics: Martyrdom of Polycarp (c. 155) describes Christians gathering his bones 'more precious than jewels.' Martyr cults are visible from the second century, never condemned by any Father, explicitly defended by Augustine and Jerome.",
      "Every distinctive Catholic doctrine — every one that Protestants reject — is present in the Church before any sola scriptura or sola fide teaching appears. Protestantism is the innovation.",
    ],
    objections: [
      {
        q: "The early Church was corrupted by Constantine's conversion in 313.",
        a: "This claim requires showing that pre-313 and post-313 Christianity are substantively different. The evidence shows remarkable continuity. Eucharist, bishops, Marian prayer, confession, Eucharistic sacrifice — all are documented before Constantine. Constantine ended the persecutions; he did not invent the Church's theology.",
      },
      {
        q: "There's no pope mentioned in the New Testament.",
        a: "Peter's primacy is all over the NT — first in every apostolic list, only one ever called 'the Rock' by Christ, the one given the keys, the one who preaches at Pentecost, the one Paul goes to meet in Jerusalem first. The title 'pope' is later; the office is not.",
      },
    ],
    sources: [
      "John Henry Newman, Essay on the Development of Christian Doctrine",
      "The Didache (c. 70 AD)",
      "Ignatius of Antioch, collected letters",
      "Rod Bennett, Four Witnesses",
      "Steve Ray, Crossing the Tiber",
    ],
    tags: ["early Church", "Fathers", "Catholic distinctives"],
  },
  {
    slug: "marian",
    title: "Marian Doctrine and Practice",
    oneLine:
      "Mary's role flows from Christ's: as the New Eve, Ark of the Covenant, and Mother of the Son, she holds a unique place that Scripture itself foregrounds.",
    whyItMatters:
      "The Marian doctrines are the fastest way to see that Catholic theology is integrated, not accidental. Reject Mary and you pull threads that unravel Christology itself.",
    theCase: [
      "Theotokos (God-bearer): defined at Ephesus (431) against Nestorius. If Jesus is God and Mary is His mother, she is the Mother of God. Deny this and you split Christ into two persons — the heresy of Nestorianism. Marian dogma is Christological protection.",
      "Mary as the New Eve: Irenaeus (c. 180 AD) draws the explicit parallel. Eve's disobedience at the tree brought death; Mary's obedience at the Annunciation brought life. Paul makes the same move with Adam/Christ in Romans 5. The Eve/Mary parallel is not medieval — it is second-century.",
      "Mary as Ark of the Covenant: John's vision in Revelation 11:19-12:1 opens the temple, shows the Ark, then immediately pivots to 'a woman clothed with the sun.' The chapter break is modern. The Ark and the woman are identified. The OT Ark carried the Word (tablets), bread (manna), and priestly rod — Mary carried the Word made flesh, Bread of Life, High Priest. Typology is deliberate.",
      "Perpetual Virginity: taught by every Father who addresses the question — Athanasius, Augustine, Jerome, Ambrose. The 'brothers of the Lord' in Matt 13:55 refers to extended kin (cousins), as Hebrew/Aramaic had no distinct word for cousin. Even Luther and Calvin held to Mary's perpetual virginity — it was never controversial until modern times.",
      "Immaculate Conception: Mary preserved from original sin at her conception. Implied in Gabriel's greeting: 'Hail, full of grace' (Luke 1:28 — kecharitomene, a perfect passive participle meaning 'completely and permanently graced'). The dogma is defined in 1854 by Pius IX, but the theology is in Scripture and present in Fathers like John Damascene.",
      "Assumption: Mary assumed body and soul into heaven at the end of her earthly life. Defined in 1950 but testified by a strong tradition. No city has claimed her tomb (compare to the apostles, whose tombs are all claimed). Early liturgical feast (Dormition) dates to the 4th century.",
      "Intercession: Mary prays for us. If the righteous in heaven pray for us (Rev 5:8 shows the elders offering the prayers of the saints to God), Mary — being in heaven and being the mother of Christ — prays all the more. Asking for her intercession is not worship; it is asking a friend to pray for you, scaled up to a friend who happens to be in God's presence and is the mother of our Lord.",
    ],
    objections: [
      {
        q: "Catholics worship Mary.",
        a: "False. Catholic theology is precise: latria (worship) is given to God alone; dulia (veneration) to the saints; hyperdulia (highest veneration) to Mary because of her unique role. Mary is not worshiped. She is venerated and asked to pray for us.",
      },
      {
        q: "Mary is not mentioned much in the New Testament.",
        a: "Actually she is — the Magnificat (one of the longest songs in Luke), her presence at Cana (initiating the first miracle), at the foot of the cross (where Christ entrusts her to John), and in the upper room at Pentecost. The NT does not give her sole focus — Christ does — but her role is explicit and consistent.",
      },
      {
        q: "Only God should be prayed to.",
        a: "Prayer in Catholic usage includes asking for intercession, not only adoration. In Shakespeare, 'I pray thee' just means 'I ask.' When I ask Mary to pray for me, I am not worshiping her; I am asking her to pray to God for me — exactly as I would ask a living friend to pray for me.",
      },
    ],
    sources: [
      "Luke 1 (Annunciation and Magnificat)",
      "Revelation 11:19-12:1",
      "Council of Ephesus (431)",
      "Pius IX, Ineffabilis Deus (1854 — Immaculate Conception)",
      "Pius XII, Munificentissimus Deus (1950 — Assumption)",
      "Scott Hahn, Hail, Holy Queen",
    ],
    tags: ["Mary", "Marian dogmas", "ecclesiology"],
  },
  {
    slug: "incarnation",
    title: "The Incarnation",
    oneLine:
      "God became man so that man might become God — this is the hinge of Christian theology.",
    whyItMatters:
      "The Incarnation is the answer to every form of 'why doesn't God do something about X.' He did. He came.",
    theCase: [
      "The claim: in Jesus Christ, God took on human nature fully while remaining fully divine. Not half-and-half; not a hybrid; not a god-in-disguise. Fully God and fully man, one Person, two natures.",
      "The Council of Chalcedon (451) defined this precisely against Nestorianism (two persons) and Monophysitism (one nature). The formula: 'one Person in two natures, without confusion, without change, without division, without separation.'",
      "Why the Incarnation? Athanasius: 'He became man that we might be made God.' Not by merger into divinity, but by participation (2 Peter 1:4). The goal of redemption is not merely forgiveness but divinization — theosis.",
      "The Incarnation is the precondition for everything else: the atonement (a victim fully human, fully divine), the Real Presence (God remains under material appearances because He became matter in the first place), Mariology (the woman who bore God), sacraments (material things as channels of grace because God has sanctified matter by assuming it).",
      "If you reject the Incarnation, you do not get a simpler Christianity. You get no Christianity. Everything in the faith hangs on this axis.",
      "The historical hook: within a generation of Christ's death, Christians were hymning Him as God (Philippians 2:6-11, an early hymn embedded in Paul). This is not late legendary development. It is the earliest form of the faith.",
    ],
    objections: [
      {
        q: "It's incoherent for one being to be fully God and fully man.",
        a: "It is strange, but not incoherent. It would be incoherent if 'God' and 'man' were exclusive kinds at the same level — but they are not. God is Pure Being; human is a mode of creaturely existence. The two can coexist in one Person without contradiction, as the Church formally defined.",
      },
      {
        q: "Other religions have divine-human figures; Christianity is just borrowing.",
        a: "Comparative mythology parallels are usually exaggerated. No pre-Christian myth has: an actual historical figure, named in contemporary non-Christian records, crucified under a named Roman governor, with a witnessed empty tomb. The categorial difference is 'Christ is historical' — the others are not.",
      },
    ],
    sources: [
      "John 1:1-14",
      "Philippians 2:6-11",
      "Council of Chalcedon (451)",
      "Athanasius, On the Incarnation",
      "Aquinas, ST III qq.1-59",
    ],
    tags: ["Christology", "Incarnation", "Trinity"],
  },
  {
    slug: "prophecy",
    title: "Prophecy and Fulfillment",
    oneLine:
      "Dozens of specific Old Testament prophecies about the Messiah are fulfilled in Jesus — a pattern that is not easily explained away.",
    whyItMatters:
      "Prophecy is evidence. It is not proof, but it is a cumulative case that the Bible points beyond itself to a consistent divine author.",
    theCase: [
      "Micah 5:2 (c. 700 BC) — the Messiah is born in Bethlehem. Fulfilled: Matthew 2, Luke 2.",
      "Isaiah 7:14 (c. 700 BC) — a virgin shall conceive. Fulfilled: Matthew 1:23.",
      "Isaiah 9:6-7 (c. 700 BC) — a child is born, Prince of Peace, of the throne of David. Fulfilled: Jesus, Davidic descent.",
      "Isaiah 53 (c. 700 BC) — the Suffering Servant pierced for transgressions, silent before accusers, assigned a grave with the wicked but with a rich man in His death. Every detail fits Jesus's passion and burial with Joseph of Arimathea. Pre-Christian Jewish exegesis (Qumran, targumim) identified this passage as Messianic.",
      "Psalm 22 (c. 1000 BC) — 'They pierced my hands and my feet... They divide my garments among them, and for my clothing they cast lots.' Written before crucifixion was invented as a mode of execution. Describes it in detail.",
      "Daniel 9:24-27 (c. 600 BC) — '69 weeks' from the decree to rebuild Jerusalem to the coming of the Anointed One, then He will be cut off. Calculation (scholarly) lands in the early first century. The Messiah's appearance and rejection was chronologically predicted.",
      "Zechariah 9:9 (c. 500 BC) — the King enters Jerusalem on a donkey. Fulfilled: Palm Sunday.",
      "Zechariah 11:12-13 (c. 500 BC) — the Shepherd's price is thirty pieces of silver, thrown to the potter in the temple. Fulfilled: Matthew 27:3-10.",
      "Psalm 16:10 (c. 1000 BC) — 'You will not let your Holy One see corruption.' Fulfilled: the empty tomb; Peter cites this at Pentecost (Acts 2:27).",
      "Over 300 specific prophecies are traditionally catalogued. Peter Stoner calculated the probability of just 8 being fulfilled in one person by chance as 1 in 10^17. Even with generous skeptical discount of the list, the pattern is striking.",
      "Importantly, the OT manuscripts were fixed and copied well before Christ (Dead Sea Scrolls, 200 BC, confirm the prophetic books as they stand). The prophecies could not have been backdated to match the fulfillment.",
    ],
    objections: [
      {
        q: "Christians cherry-pick verses to match Jesus's life in hindsight.",
        a: "Some prophetic claims are post-hoc, but the major ones — Bethlehem, Davidic descent, suffering servant, Daniel's weeks — are specific, predictive, and were identified as Messianic by pre-Christian Jews. The Messianic expectation was vivid in the first century; it is not a Christian projection.",
      },
      {
        q: "Jesus engineered the fulfillment of prophecies He knew.",
        a: "He cannot have engineered being born in Bethlehem, being from David's line, being betrayed for thirty silver pieces, or the Roman soldiers casting lots for His garments. Many fulfillments are about events outside His control.",
      },
    ],
    sources: [
      "Isaiah 53; Psalm 22; Micah 5:2; Daniel 9:24-27",
      "Dead Sea Scrolls (Isaiah, pre-Christian manuscript)",
      "Peter Stoner, Science Speaks (1958)",
      "Alfred Edersheim, The Life and Times of Jesus the Messiah",
    ],
    tags: ["prophecy", "Scripture", "Messiah"],
  },
  {
    slug: "church-endurance",
    title: "The Endurance of the Church",
    oneLine:
      "Every empire and ideology that declared the Church dead has itself died; the Church is still here.",
    whyItMatters:
      "Gamaliel's test (Acts 5) has been run for 2,000 years. The results are in.",
    theCase: [
      "The Roman Empire persecuted Christians for three centuries. Rome fell. The Church still celebrates Mass in Rome.",
      "Arianism, a 4th-century heresy, captured most bishops at one point. Arianism is gone. The Nicene Creed is prayed daily.",
      "Islam conquered the historical heartlands of Christianity in the 7th-8th centuries. The Church endured in the rest of the world, and even within Islamic-ruled lands.",
      "The Protestant Reformation shattered Western Christianity in the 16th century. Five centuries later, Catholicism is the world's largest coherent religious body, with 1.4 billion adherents. Protestant denominations number in the tens of thousands and continue to fragment.",
      "The Enlightenment declared the Church a superstition. Voltaire predicted its extinction within a century. Voltaire's house later became a Bible distribution center.",
      "Marxism actively persecuted the Church in the 20th century — Russia, China, Eastern Europe, Mexico, Spain, Cambodia. Mass graves of priests and religious. The Church endured underground. The USSR is gone. John Paul II outlived it.",
      "Modern secularism, the New Atheists, bureaucratic atheism — the latest wave. Attendance dips, doom is pronounced, conversions slow. The Church persists, adapts, repents of her failures, and baptizes her millions.",
      "This is not to say the Church will never contract or that every age is a victory. It is to say: the empirical pattern is unique among human institutions. No other body from the 1st century still coherently exists, still adds members, still transmits the same confession.",
      "The durability itself is data. It is not proof of truth — but it is a massive Bayesian update in favor of the claim 'the gates of Hades shall not prevail.'",
    ],
    objections: [
      {
        q: "Other religions are old too — Buddhism, Hinduism, Judaism.",
        a: "True, but none make the Catholic claim. Buddhism is a philosophy of liberation; Hinduism is a fluid cluster of traditions; Judaism is a continuing people. Only the Catholic Church claims to be the one true Church founded by God incarnate, guaranteed against final defeat. The relevant comparison is whether that specific claim has been falsified. It hasn't.",
      },
      {
        q: "The Church has contracted in Europe.",
        a: "Europe is one continent. The Church is global. Africa is booming. Latin America, while declining in nominal Catholicism, has passionate renewal movements. The Church's geographic center has moved south; it has not disappeared.",
      },
    ],
    sources: [
      "Acts 5:38-39 (Gamaliel)",
      "Matthew 16:18",
      "G.K. Chesterton, The Everlasting Man",
      "Diarmaid MacCulloch, Christianity: The First Three Thousand Years",
      "Rodney Stark, The Triumph of Christianity",
    ],
    tags: ["Church history", "endurance", "providence"],
  },
  {
    slug: "ecclesiology",
    title: "The Church Is Visible and Necessary",
    oneLine:
      "Christ founded a visible Church, not an invisible idea — and being a Christian means being in her.",
    whyItMatters:
      "'Spiritual but not religious' cannot be Christian. The faith comes through a community with structure, sacraments, and teachers — because that is what Christ set up.",
    theCase: [
      "Christ founded a visible community. He chose Twelve. He gave them authority to teach, to forgive sins, to confect the Eucharist. He told them to teach all nations (Matt 28:19-20) and promised to be with them until the end of the age. This is a visible, identifiable institution, not a diffuse idea.",
      "Paul calls the Church 'the pillar and bulwark of truth' (1 Tim 3:15), 'the body of Christ' (Eph 1:23), 'the household of God' (Eph 2:19). These are not metaphors for a scattered set of individual believers; they are terms for a visible body with structure.",
      "Outside the Church, no salvation — but properly understood. This is the doctrine Extra Ecclesiam nulla salus. It does not mean every non-Catholic is damned (Vatican II clarified the grace that reaches those through no fault of their own outside the visible Church). It means that whatever salvation anyone receives flows through the Church, because Christ established the Church as the instrument of His grace.",
      "The sacraments are the tangible action of the Church. They are where grace is reliably delivered. Baptism makes you a member; the Eucharist feeds you; Confession restores you when you fall; Confirmation strengthens you; Matrimony sanctifies the union; Holy Orders provides the ministry; Anointing seals you for death. Remove the Church, remove the sacraments, and you have only your own interior resources.",
      "The Church is where the deposit of faith is protected. A lone Christian, armed only with the Bible and the Holy Spirit, is subject to every fashionable error. The Church — with her teachers, her councils, her Magisterium — holds what has been received against the drift of every age.",
    ],
    objections: [
      {
        q: "Paul says Christians are saved by faith, not by church membership.",
        a: "Paul's context in Romans and Galatians is faith vs. works of the Mosaic Law — not faith vs. Church membership. Paul himself spent his life planting churches, appointing bishops, and writing letters about how the Church should function. He did not treat ecclesiology as optional.",
      },
      {
        q: "I can read the Bible and pray on my own.",
        a: "Both of those activities are made possible by the Church. The Bible exists because the Church canonized it. Prayer is enriched by the Church's liturgy, her saints, her spiritual tradition. You are not starting from zero; you are living off the capital of a 2,000-year community.",
      },
    ],
    sources: [
      "1 Timothy 3:15",
      "Matthew 16:18",
      "Cyprian, On the Unity of the Church",
      "Vatican II, Lumen Gentium",
      "CCC 846-848 (on 'outside the Church, no salvation')",
    ],
    tags: ["ecclesiology", "Church", "salvation"],
  },
  {
    slug: "communion-of-saints",
    title: "The Communion of Saints",
    oneLine:
      "The faithful dead are alive in Christ and pray for us; asking their intercession is asking friends in God's presence to pray for you.",
    whyItMatters:
      "You are never alone in the Christian life. A vast network of witnesses — apostles, martyrs, doctors, ordinary saints, your own departed faithful loved ones — is with you.",
    theCase: [
      "The saints are alive. 'God is not the God of the dead but of the living' (Matt 22:32). Physical death does not end their existence. They are conscious, active, in God's presence.",
      "They pray. Revelation 5:8: the elders and living creatures in heaven offer 'the prayers of the saints' to God as incense. Revelation 6:10: the martyrs under the altar cry out to God. The saints in heaven have not stopped praying.",
      "They pray for us. If the righteous man on earth can pray for others (James 5:16), a fortiori the righteous in heaven can pray for others. Their prayer is more effective, not less.",
      "We can ask them. Asking a saint to pray for you is the same act as asking a living friend to pray for you — just extended across the veil. It is not necromancy (communication with the dead apart from God); it is communion with those alive in God.",
      "This is not idolatry. We do not worship the saints. Dulia (veneration) and latria (worship) are carefully distinguished. We honor them as Paul honored Timothy. We ask their prayers as we ask our mother's prayers.",
      "Practical effect: when you are weak, call on a saint. They are sisters and brothers. They know the road. They are rooting for you and praying for you without ceasing.",
    ],
    objections: [
      {
        q: "1 Timothy 2:5: 'There is one mediator between God and men, the man Christ Jesus.'",
        a: "Christ is the sole mediator of salvation. The saints' prayers are subordinate intercession, made efficacious through Christ. If you asking a friend to pray for you doesn't violate Christ's unique mediation, neither does asking a saint. The text is about salvific mediation, not intercessory prayer.",
      },
      {
        q: "We shouldn't contact the dead.",
        a: "The prohibition is against necromancy — trying to summon spirits or extract secret knowledge. Asking a saint to pray for you is neither. You are not summoning them; they are already with God. You are not seeking hidden knowledge; you are asking for prayer.",
      },
    ],
    sources: [
      "Revelation 5:8, 6:10",
      "Matthew 22:32",
      "Hebrews 12:1 ('great cloud of witnesses')",
      "CCC 946-962",
    ],
    tags: ["saints", "intercession", "communion of saints"],
  },
  {
    slug: "presence",
    title: "The Sacramental Worldview",
    oneLine:
      "God is not elsewhere. He is as available in this moment, in ordinary matter, as He is in the chapel.",
    whyItMatters:
      "The feeling of distance from God is often the feeling of looking in the wrong place. He is not far. He is in the Eucharist, the next person, the next breath, the next task.",
    theCase: [
      "The Incarnation means matter can carry God. If bread can be His Body and water can baptize, then every material thing in the creation He made is capable of being a vehicle of grace. This is the sacramental imagination.",
      "'In Him we live and move and have our being' (Acts 17:28). God is not a being among beings, far away in the sky. He is the ground of your current existence, holding you in being at this instant.",
      "Brother Lawrence, a 17th-century Carmelite lay brother, worked in the monastery kitchen. He wrote: 'The time of business does not with me differ from the time of prayer... I possess God in as great tranquility as if I were upon my knees at the blessed sacrament.' His practice of the presence of God transformed the kitchen into a cell.",
      "The Little Way of Therese of Lisieux: you do not need to do great things; you need to do small things with great love, offering each to God. This is theology on the level of dish-washing.",
      "Ignatius of Loyola's 'Finding God in all things': the Spiritual Exercises train you to see God's action in every ordinary event. The guide is not seeing God in the extraordinary; it is learning to see Him where He already is.",
      "Practical implications: do not escape your daily life to find God. Enter it. The next hour of work, the next meal, the next conversation — these are not obstacles to the spiritual life; they are its primary matter.",
    ],
    objections: [
      {
        q: "Isn't this just pantheism?",
        a: "No. Pantheism says God IS everything. Catholic theology says God is in everything, holding everything in being, while remaining distinct from what He creates. The technical term is panentheism — though even that is inadequate; classical theism's 'God as Ipsum Esse Subsistens' (Subsistent Being Itself) is more precise.",
      },
      {
        q: "If God is everywhere, why go to church?",
        a: "God is present everywhere by sustaining power, but the Eucharist is His substantial presence — a different mode. 'Everywhere in some way' is not the same as 'here in His Body and Blood.' Both are true.",
      },
    ],
    sources: [
      "Brother Lawrence, The Practice of the Presence of God",
      "Ignatius of Loyola, Spiritual Exercises",
      "Therese of Lisieux, Story of a Soul",
      "Acts 17:28",
    ],
    tags: ["presence", "sacramental worldview", "daily life"],
  },
];

export function argumentBySlug(slug: string): GroundingArgument | undefined {
  return GROUNDING_ARGUMENTS.find((a) => a.slug === slug);
}

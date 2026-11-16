// =============================================================================
// TYPOLOGY INDEX — Old Testament Types and New Testament Fulfillments
// =============================================================================
// Catholic typological theology: every major OT type and its NT antitype.
// Sources: Church Fathers, Aquinas (ST, Catena Aurea), CCC, Dei Verbum 15-16.
// =============================================================================

export interface Typology {
  id: string;
  otType: string;
  ntAntitype: string;
  category: TypologyCategory;
  otPassages: string[];
  ntPassages: string[];
  patristicSupport: PatristicCitation[];
  aquinasReferences: string[];
  cccReferences: number[];
  explanation: string;
  apologeticUse: string;
}

export interface PatristicCitation {
  father: string;
  work: string;
  quote?: string;
}

export type TypologyCategory =
  | "christological"
  | "marian"
  | "sacramental"
  | "ecclesiological"
  | "eschatological"
  | "moral";

export const TYPOLOGIES: Typology[] = [
  // =========================================================================
  // CHRISTOLOGICAL TYPES
  // =========================================================================
  {
    id: "adam-christ",
    otType: "Adam (First Man)",
    ntAntitype: "Christ (New Adam)",
    category: "christological",
    otPassages: ["Genesis 1:26-28", "Genesis 2:7", "Genesis 2:21-22", "Genesis 3:17-19"],
    ntPassages: [
      "Romans 5:12-21",
      "1 Corinthians 15:21-22",
      "1 Corinthians 15:45-49",
      "Philippians 2:6-8",
    ],
    patristicSupport: [
      {
        father: "St. Irenaeus",
        work: "Against Heresies III.21.10-22.4",
        quote:
          "He has therefore, in His work of recapitulation, summed up all things, both waging war against our enemy, and crushing him who had at the beginning led us away captives in Adam.",
      },
      {
        father: "St. Paul (Apostle)",
        work: "Romans 5:14",
        quote: "Adam, who is a type of the one who was to come.",
      },
      {
        father: "Tertullian",
        work: "De Carne Christi 17",
        quote:
          "God recovered His own image and likeness, of which He had been robbed by the devil. For it was while Eve was yet a virgin, that the ensnaring word had crept into her ear which was to build the edifice of death. Into a virgin's soul, in like manner, must be introduced that Word of God which was to raise the fabric of life.",
      },
      {
        father: "St. Athanasius",
        work: "On the Incarnation 10",
      },
    ],
    aquinasReferences: [
      "ST III, q.31, a.1 — Christ as new head of humanity",
      "ST I-II, q.81, a.1 — original sin transmitted from Adam",
      "ST III, q.49, a.1 — Christ's passion as remedy for Adam's sin",
      "In Rom. cap. 5, lect. 3-5 — detailed commentary on Adam-Christ parallel",
    ],
    cccReferences: [359, 388, 402, 411, 504, 539],
    explanation:
      "Adam is the first man, head of the old creation, through whom sin and death entered the world. Christ is the New Adam, head of the new creation, through whom grace and life are restored. Where Adam disobeyed at a tree (the Tree of Knowledge), Christ obeyed on a tree (the Cross). Where Adam's sin brought condemnation to all, Christ's obedience brings justification to all. Adam was formed from the earth; Christ descends from heaven. Adam's sleep produced Eve from his side; Christ's death on the Cross produced the Church from His pierced side (blood and water = Eucharist and Baptism). The parallel is explicitly drawn by St. Paul in Romans 5 and 1 Corinthians 15, making it the most foundational typology in Christian theology.",
    apologeticUse:
      "Demonstrates the inner coherence of salvation history — God does not simply cancel sin but reverses it from within. Useful against the claim that the OT and NT are unrelated. Shows that Christianity is not an arbitrary religion but the fulfillment of a cosmic drama. Against Pelagianism: shows that humanity truly fell in Adam and truly needed a new head in Christ. Against Protestantism: the Adam-Christ typology implies corporate solidarity — we are saved not merely as individuals but as members of Christ's body, supporting the Catholic understanding of the Church.",
  },
  {
    id: "abel-christ",
    otType: "Abel (Innocent Victim)",
    ntAntitype: "Christ (Innocent Lamb)",
    category: "christological",
    otPassages: ["Genesis 4:1-12", "Genesis 4:10"],
    ntPassages: ["Hebrews 12:24", "Matthew 23:35", "1 John 3:12", "Revelation 5:6"],
    patristicSupport: [
      {
        father: "St. Augustine",
        work: "City of God XV.7",
        quote:
          "Abel, the younger brother, is killed by the elder brother; Christ, the Head of the younger people, is killed by the elder people of the Jews.",
      },
      {
        father: "St. Cyprian",
        work: "Treatise XII, Book II, 29",
      },
      {
        father: "St. Ambrose",
        work: "De Cain et Abel II.4.15",
      },
    ],
    aquinasReferences: [
      "ST II-II, q.94, a.2 — Abel as first martyr",
      "Catena Aurea on Matthew 23:35",
      "In Heb. cap. 12, lect. 4 — Abel's blood cries for vengeance, Christ's blood cries for mercy",
    ],
    cccReferences: [401, 769],
    explanation:
      "Abel offered a pleasing sacrifice to God and was murdered by his jealous brother Cain. Christ offered the perfect sacrifice of Himself and was murdered by His own people. Abel's blood cried out from the ground for justice (Gen 4:10); Christ's blood 'speaks more graciously than the blood of Abel' (Heb 12:24), crying out not for vengeance but for mercy and forgiveness. Abel was a shepherd who offered the firstlings of his flock — Christ is the Good Shepherd who offers Himself as the Lamb of God.",
    apologeticUse:
      "Shows that innocent suffering has redemptive meaning from the very beginning of Scripture. Useful against the objection that a God who allows innocent suffering is cruel — God did not merely allow it but entered into it Himself and transformed it. The contrast between Abel's blood (justice) and Christ's blood (mercy) beautifully illustrates the difference between the Old and New Covenants.",
  },
  {
    id: "melchizedek-christ",
    otType: "Melchizedek (Priest-King)",
    ntAntitype: "Christ (Eternal High Priest)",
    category: "christological",
    otPassages: ["Genesis 14:18-20", "Psalm 110:4"],
    ntPassages: ["Hebrews 5:5-10", "Hebrews 6:20-7:28"],
    patristicSupport: [
      {
        father: "St. Clement of Alexandria",
        work: "Stromata IV.25",
      },
      {
        father: "St. Cyprian",
        work: "Epistle 63.4",
        quote:
          "For who is more a priest of the most high God than our Lord Jesus Christ, who offered a sacrifice to God the Father, and offered that very same thing which Melchizedek had offered, that is, bread and wine, to wit, His body and blood?",
      },
      {
        father: "St. Jerome",
        work: "Epistle 73 (to Evangelus)",
      },
      {
        father: "St. Augustine",
        work: "City of God XVI.22",
      },
    ],
    aquinasReferences: [
      "ST III, q.22, a.1-6 — Christ as Priest",
      "ST III, q.73, a.5-6 — Eucharistic species of bread and wine prefigured",
      "In Heb. cap. 7, lect. 1-4 — detailed commentary on Melchizedek as type of Christ",
    ],
    cccReferences: [1333, 1544],
    explanation:
      "Melchizedek appears suddenly in Genesis 14 as king of Salem (Jerusalem) and priest of God Most High, offering bread and wine to Abraham and receiving tithes from him. He has no recorded genealogy, no beginning or end of life (Heb 7:3). Christ is declared 'a priest forever according to the order of Melchizedek' (Ps 110:4, Heb 5:6). Like Melchizedek, Christ is both King and Priest — a combination impossible under the Mosaic law, where priests came from Levi and kings from Judah. Like Melchizedek, Christ offers bread and wine (the Eucharist). Like Melchizedek, Christ's priesthood is eternal and superior to the Levitical priesthood.",
    apologeticUse:
      "One of the strongest Eucharistic types in the OT. Melchizedek's offering of bread and wine prefigures the Mass. The fact that Abraham (ancestor of Levi) paid tithes to Melchizedek proves Melchizedek's priesthood is superior to Levi's — and Christ's priesthood, being 'according to the order of Melchizedek,' supersedes the OT priesthood entirely. Against Protestant denial of a ministerial priesthood: Christ instituted a new order of priesthood (Melchizedekian, not Levitical), and this priesthood continues in the Church through Holy Orders.",
  },
  {
    id: "isaac-sacrifice-crucifixion",
    otType: "Binding of Isaac (Akedah)",
    ntAntitype: "Crucifixion of Christ",
    category: "christological",
    otPassages: ["Genesis 22:1-19"],
    ntPassages: [
      "John 3:16",
      "Romans 8:32",
      "Hebrews 11:17-19",
      "Galatians 3:13-14",
      "John 19:17",
    ],
    patristicSupport: [
      {
        father: "St. Irenaeus",
        work: "Against Heresies IV.5.4",
      },
      {
        father: "Origen",
        work: "Homily on Genesis 8",
        quote:
          "Isaac himself carrying the wood for his own sacrifice is a figure of Christ who carried His own cross.",
      },
      {
        father: "Tertullian",
        work: "Against Marcion III.18",
      },
      {
        father: "St. Augustine",
        work: "City of God XVI.32",
        quote:
          "As Isaac carried the wood on which he was to be offered up, so Christ carried His own cross.",
      },
      {
        father: "St. Ephrem the Syrian",
        work: "Commentary on Genesis 20.3",
      },
    ],
    aquinasReferences: [
      "ST II-II, q.174, a.6 ad 2 — the Akedah as prophetic sign",
      "ST III, q.46, a.4 — fitting that Christ die on a cross (wood)",
      "Catena Aurea on John 19:17 — Isaac carrying wood = Christ carrying cross",
    ],
    cccReferences: [145, 2572],
    explanation:
      "Abraham is told to sacrifice his only beloved son Isaac on Mount Moriah. Isaac carries the wood for his own sacrifice up the mountain (Gen 22:6). Abraham tells Isaac 'God will provide himself the lamb' (Gen 22:8). A ram is caught in a thicket and substituted for Isaac. Christ, the only beloved Son of the Father (John 3:16), carries His own cross (John 19:17) up to Calvary (traditionally identified with or adjacent to Moriah). God the Father offers His Son as the Lamb (John 1:29). But unlike Isaac, there is no substitute — Christ IS the substitute for all humanity. 'He who did not spare His own Son but gave him up for us all' (Rom 8:32) deliberately echoes Genesis 22.",
    apologeticUse:
      "Demonstrates that God's plan of salvation through sacrifice was foreshadowed millennia before Calvary. The parallel between Abraham offering Isaac and the Father offering His Son is one of the most emotionally powerful typologies. Against Muslims who deny the crucifixion: the entire trajectory of Scripture, from Genesis 22 onward, points to a God who saves through sacrifice. Against Protestants who deny the sacrificial nature of the Mass: if the crucifixion was a sacrifice, and the Mass re-presents that sacrifice (Heb 7:24-25, 13:10), then Christian worship has always been sacrificial.",
  },
  {
    id: "joseph-christ",
    otType: "Joseph (Suffering Servant Exalted)",
    ntAntitype: "Christ",
    category: "christological",
    otPassages: [
      "Genesis 37-50",
      "Genesis 37:3-4",
      "Genesis 37:28",
      "Genesis 39:20",
      "Genesis 41:41-44",
      "Genesis 45:4-8",
      "Genesis 50:20",
    ],
    ntPassages: [
      "Acts 7:9-16",
      "Philippians 2:5-11",
      "Matthew 26:15",
      "John 1:11",
      "Acts 2:23-24",
    ],
    patristicSupport: [
      {
        father: "St. Ambrose",
        work: "De Joseph Patriarcha",
        quote: "In Joseph is prefigured the Lord our Savior.",
      },
      {
        father: "St. Ephrem the Syrian",
        work: "Commentary on Genesis 34",
      },
      {
        father: "St. Chromatius of Aquileia",
        work: "Tractatus in Matthaeum 1.5",
      },
    ],
    aquinasReferences: [
      "ST III, q.46, a.1 ad 3 — suffering preceding exaltation",
      "Catena Aurea on Matthew 1",
    ],
    cccReferences: [312],
    explanation:
      "Joseph was beloved by his father, envied by his brothers, sold for silver (20 pieces), falsely accused, imprisoned with two men (one saved, one condemned), raised to second-in-command of all Egypt, and ultimately saved his brothers who had betrayed him. Christ was beloved by the Father, envied by the Jewish leaders, sold for silver (30 pieces), falsely accused, crucified between two thieves (one saved, one condemned), raised to the right hand of God, and ultimately saves those who condemned Him. Joseph's words 'you meant it for evil, but God meant it for good, to save many people alive' (Gen 50:20) perfectly encapsulate God's providential reversal of the Crucifixion. St. Stephen explicitly identifies this typology in Acts 7.",
    apologeticUse:
      "One of the most detailed and multi-layered OT types, with dozens of precise parallels. Excellent for showing inquirers and skeptics how the OT narrative structure points to Christ at a level of detail that cannot be coincidental. Also useful for theodicy: God brings good from evil, the suffering servant is exalted, and betrayal becomes the instrument of salvation.",
  },
  {
    id: "moses-christ",
    otType: "Moses (Lawgiver and Deliverer)",
    ntAntitype: "Christ (New Moses)",
    category: "christological",
    otPassages: [
      "Exodus 2-14",
      "Deuteronomy 18:15-19",
      "Exodus 34:29-35",
      "Exodus 24:3-8",
      "Numbers 12:3",
    ],
    ntPassages: [
      "Matthew 5:1 (Sermon on the Mount as new Sinai)",
      "Acts 3:22-23",
      "Acts 7:37",
      "John 1:17",
      "2 Corinthians 3:7-18",
      "Hebrews 3:1-6",
      "Matthew 2:13-15 (flight to Egypt)",
      "Matthew 17:1-8 (Transfiguration with Moses)",
    ],
    patristicSupport: [
      {
        father: "St. Justin Martyr",
        work: "Dialogue with Trypho 91",
      },
      {
        father: "Eusebius of Caesarea",
        work: "Demonstratio Evangelica III.2",
        quote:
          "Moses was the first to predict that a prophet like himself would be raised up by God.",
      },
      {
        father: "St. Gregory of Nyssa",
        work: "Life of Moses",
      },
      {
        father: "St. Cyril of Alexandria",
        work: "Glaphyra on Exodus",
      },
    ],
    aquinasReferences: [
      "ST I-II, q.98, a.1 — the Old Law given through Moses",
      "ST I-II, q.107, a.1-4 — the New Law compared to the Old Law",
      "ST III, q.42, a.4 — Christ's teaching compared to Moses",
      "In Matt. cap. 5 — Sermon on the Mount as New Sinai",
    ],
    cccReferences: [62, 72, 2574, 2577],
    explanation:
      "Moses delivers Israel from slavery in Egypt through the Red Sea. Christ delivers humanity from slavery to sin through Baptism. Moses goes up Mount Sinai and gives the Law; Christ goes up a mountain and gives the Sermon on the Mount (the New Law). Moses fasts 40 days on the mountain; Christ fasts 40 days in the desert. Moses mediates the Old Covenant with the blood of animals (Ex 24:8); Christ mediates the New Covenant with His own blood. Pharaoh orders the killing of Hebrew boys; Herod orders the killing of boys in Bethlehem. Moses comes out of Egypt; Jesus is called out of Egypt (Hosea 11:1 / Matt 2:15). Moses's face shone with reflected glory; Christ's face shone with His own glory at the Transfiguration. Deuteronomy 18:15 explicitly promises 'a prophet like me' — Peter identifies Jesus as this prophet in Acts 3:22.",
    apologeticUse:
      "Critical for Jewish-Christian dialogue. Shows that Jesus fulfills the Mosaic covenant rather than abolishing it. Matthew's Gospel is structured around five great discourses (paralleling the five books of Moses), presenting Jesus as the New Moses. Against Protestantism: if Christ is the New Moses giving a New Law, then Christianity is not lawless — the Sermon on the Mount contains commands (beatitudes as new law), which supports the Catholic understanding of faith working through love (Gal 5:6).",
  },
  {
    id: "bronze-serpent-crucifix",
    otType: "Bronze Serpent on a Pole",
    ntAntitype: "Christ on the Cross",
    category: "christological",
    otPassages: ["Numbers 21:4-9"],
    ntPassages: ["John 3:14-15", "2 Corinthians 5:21", "Galatians 3:13"],
    patristicSupport: [
      {
        father: "St. Justin Martyr",
        work: "Dialogue with Trypho 94",
        quote:
          "The sign by which Moses, by lifting up the brazen serpent on a pole, saved those bitten by serpents, was a type of the cross.",
      },
      {
        father: "St. Augustine",
        work: "Tractates on John 12.11",
        quote:
          "As the serpent is lifted up, so must the Son of Man be lifted up. The serpent on the pole is the death of Christ on the cross — the Lord took the likeness of sinful flesh to condemn sin in the flesh.",
      },
      {
        father: "St. Ambrose",
        work: "De Spiritu Sancto I.3",
      },
    ],
    aquinasReferences: [
      "ST III, q.46, a.4 — fittingness of death on a cross",
      "In Joan. cap. 3, lect. 3 — detailed commentary on the bronze serpent as type of crucifixion",
    ],
    cccReferences: [2130],
    explanation:
      "When the Israelites were bitten by poisonous serpents in the wilderness, God told Moses to make a bronze serpent and lift it up on a pole — anyone who looked at it would be healed (Num 21:4-9). Jesus Himself explicitly identifies this as a type of His crucifixion: 'As Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up, that whoever believes in him may have eternal life' (John 3:14-15). The serpent represents sin (Gen 3); by taking on the likeness of the thing that kills us, Christ destroys its power. 'He made him to be sin who knew no sin, so that in him we might become the righteousness of God' (2 Cor 5:21).",
    apologeticUse:
      "Christ Himself draws this typological connection, making it one of the most authoritative types in Scripture. Defends the use of crucifixes and images (against iconoclasts): just as looking at the bronze serpent brought healing, gazing upon the crucifix brings spiritual healing. Also defends the crucifix specifically (corpus on cross) versus a bare cross — the serpent was on the pole, not absent from it. Against Protestants who reject crucifixes: Jesus compared Himself to the serpent on the pole, not the empty pole.",
  },
  {
    id: "passover-lamb-eucharist",
    otType: "Passover Lamb",
    ntAntitype: "Christ as Paschal Lamb / Eucharist",
    category: "sacramental",
    otPassages: ["Exodus 12:1-14", "Exodus 12:21-28", "Exodus 12:43-49"],
    ntPassages: [
      "John 1:29",
      "1 Corinthians 5:7",
      "John 19:36 (no bone broken)",
      "1 Peter 1:18-19",
      "Revelation 5:6-14",
      "John 6:53-58",
      "Mark 14:22-24",
      "Luke 22:15-20",
    ],
    patristicSupport: [
      {
        father: "St. Justin Martyr",
        work: "Dialogue with Trypho 40",
        quote:
          "The mystery, then, of the lamb which God enjoined to be sacrificed as the Passover, was a type of Christ.",
      },
      {
        father: "St. Melito of Sardis",
        work: "Peri Pascha (On the Pascha) 1-105",
        quote:
          "Understand, therefore, beloved, how it is new and old, eternal and temporary, perishable and imperishable, mortal and immortal, this mystery of the Pascha.",
      },
      {
        father: "St. Cyril of Alexandria",
        work: "Glaphyra on Exodus",
      },
      {
        father: "Origen",
        work: "Contra Celsum VIII.22",
      },
    ],
    aquinasReferences: [
      "ST III, q.73, a.5-6 — Eucharist prefigured in the Passover",
      "ST III, q.46, a.9 — Christ's death at Passover was fitting",
      "ST III, q.75, a.1 — body and blood truly present under species of bread and wine",
      "In Joan. cap. 6, lect. 6-7 — commentary on 'my flesh is true food'",
    ],
    cccReferences: [608, 613, 1334, 1339, 1340],
    explanation:
      "In the first Passover, each family selected an unblemished male lamb, slaughtered it at twilight, applied its blood to the doorposts (so the angel of death would pass over), and then ate the lamb entirely (Ex 12:8-10). Christ is 'the Lamb of God who takes away the sin of the world' (John 1:29). He was crucified during Passover. Like the Passover lamb, none of His bones were broken (John 19:36, cf. Ex 12:46). The critical point for Catholic theology: the Passover was not complete when the lamb was slaughtered — it had to be EATEN. The sacrifice required consumption. So too with Christ: His sacrifice on the Cross is made present and consumed in the Eucharist. 'Unless you eat the flesh of the Son of Man and drink his blood, you have no life in you' (John 6:53). The Last Supper was a Passover meal in which Jesus replaced the lamb with Himself.",
    apologeticUse:
      "The single most important Eucharistic typology. Against Protestants who deny the Real Presence: the Passover lamb had to be eaten — sacrifice required consumption. If Jesus is the new Passover Lamb (1 Cor 5:7), then we must eat Him (John 6:53). This is not metaphorical — the Israelites did not metaphorically eat the lamb. They consumed it physically. Against the 'memorial only' view: even the Jewish Passover was not merely a mental recollection — it was a real liturgical re-presentation that made each generation present to the original event (Ex 13:8, 'It is because of what the LORD did for me when I came out of Egypt'). How much more the Christian Eucharist.",
  },
  {
    id: "manna-eucharist",
    otType: "Manna from Heaven",
    ntAntitype: "Eucharist (Bread from Heaven)",
    category: "sacramental",
    otPassages: ["Exodus 16:1-36", "Psalm 78:24-25", "Wisdom 16:20-21"],
    ntPassages: [
      "John 6:31-35",
      "John 6:48-58",
      "1 Corinthians 10:1-4",
      "Revelation 2:17",
    ],
    patristicSupport: [
      {
        father: "St. Cyril of Jerusalem",
        work: "Catechetical Lectures XXII (Mystagogical IV).5",
        quote:
          "In the Old Testament there was the bread of the Presence; but now there is the Bread of Life. There was the manna; but now there is something far better.",
      },
      {
        father: "St. Ambrose",
        work: "De Sacramentis IV.5",
        quote:
          "The manna was a wonder. God rained it down from heaven. But consider which is greater — manna from heaven or the Body of Christ. The Body of Christ is the Creator of heaven.",
      },
      {
        father: "St. Augustine",
        work: "Tractates on John 26.12",
      },
    ],
    aquinasReferences: [
      "ST III, q.73, a.6 — manna as figure of the Eucharist",
      "In Joan. cap. 6, lect. 4-7 — 'Your fathers ate the manna in the wilderness, and they died'",
      "ST III, q.79, a.2 — Eucharist gives eternal life, unlike manna",
    ],
    cccReferences: [1094, 1334],
    explanation:
      "God fed Israel with manna — bread from heaven — during the 40 years in the wilderness (Ex 16). Manna appeared daily, was gathered each morning, and sustained physical life. Jesus explicitly draws the typological connection in John 6: 'Your fathers ate the manna in the wilderness, and they died. This is the bread which comes down from heaven, that a man may eat of it and not die. I am the living bread which came down from heaven; if any one eats of this bread, he will live for ever; and the bread which I shall give for the life of the world is my flesh' (John 6:49-51). The manna sustained the body temporarily; the Eucharist sustains the soul eternally. The manna was a created gift; the Eucharist is the uncreated Gift — God Himself.",
    apologeticUse:
      "Jesus Himself draws this comparison to argue for the Real Presence. He says the Eucharist is GREATER than manna — but manna was real bread, physically consumed. If the Eucharist is merely symbolic, it is LESS than manna, not greater. The comparison only works if the Eucharist is truly Christ's flesh. The crowd understood Him literally and left (John 6:66); He did not call them back to correct a 'misunderstanding.' Against 'spiritual food' reinterpretation: manna was literal food that literally sustained Israel; the comparison demands that the Eucharist is literal food that literally sustains the soul.",
  },
  {
    id: "bread-of-presence-eucharist",
    otType: "Bread of the Presence (Showbread)",
    ntAntitype: "Eucharist",
    category: "sacramental",
    otPassages: [
      "Exodus 25:30",
      "Leviticus 24:5-9",
      "1 Samuel 21:1-6",
      "1 Chronicles 9:32",
    ],
    ntPassages: ["Matthew 12:3-4", "Hebrews 9:2"],
    patristicSupport: [
      {
        father: "St. Ephrem the Syrian",
        work: "Hymns on Unleavened Bread 6",
      },
      {
        father: "St. Cyril of Jerusalem",
        work: "Catechetical Lectures XXII.5",
      },
    ],
    aquinasReferences: [
      "ST III, q.73, a.6 — showbread as figure of Eucharist",
      "ST I-II, q.102, a.4 ad 6 — showbread signifies Christ present among us",
    ],
    cccReferences: [1334],
    explanation:
      "Twelve loaves of bread were placed in the Tabernacle/Temple 'before the face of God' (panim = face/presence) perpetually (Lev 24:5-9). This bread was 'most holy' and could only be eaten by the priests. It signified God's continuous presence with His people and the twelve tribes of Israel. In the Eucharist, Christ — the Bread of Life — is perpetually present in every tabernacle in every Catholic church throughout the world. The showbread was holy because of its proximity to God's presence; the Eucharist IS God's presence.",
    apologeticUse:
      "Supports Eucharistic adoration and the practice of reserving the Blessed Sacrament in the tabernacle. The very name 'tabernacle' for the Eucharistic repository comes from this OT parallel. Against Protestants who reject Eucharistic reservation: God Himself commanded that bread be perpetually present in His dwelling. How much more should the true Bread of Life be perpetually present in His Church.",
  },
  {
    id: "noah-ark-church",
    otType: "Noah's Ark",
    ntAntitype: "The Church",
    category: "ecclesiological",
    otPassages: ["Genesis 6:13-9:17"],
    ntPassages: ["1 Peter 3:20-21", "Matthew 24:37-39", "2 Peter 2:5"],
    patristicSupport: [
      {
        father: "St. Cyprian",
        work: "De Unitate Ecclesiae 6",
        quote:
          "If anyone outside the Ark of Noah was able to escape, then he who is outside the Church may also escape.",
      },
      {
        father: "St. Augustine",
        work: "City of God XV.26",
        quote:
          "No one is saved outside the Ark, which signifies the Church.",
      },
      {
        father: "St. Jerome",
        work: "Dialogue Against the Luciferians 22",
      },
      {
        father: "Origen",
        work: "Homily on Genesis 2",
      },
    ],
    aquinasReferences: [
      "ST III, q.73, a.3 — the Church as ark of salvation",
      "In I Pet. cap. 3 — commentary on the ark-baptism connection",
    ],
    cccReferences: [845, 1094, 1219],
    explanation:
      "As Noah's Ark was the sole means of salvation from the Flood, the Church is the sole means of salvation from sin. The Ark was made of wood (the Cross); it had one door (Christ: 'I am the door,' John 10:9); it carried all peoples and kinds (the universality of the Church). The Ark floated on the waters that destroyed — the Church emerges from the baptismal waters that drown sin. The dove bringing the olive branch to Noah (Gen 8:11) prefigures the Holy Spirit at Baptism. Just as only those inside the Ark were saved, 'outside the Church there is no salvation' (extra ecclesiam nulla salus) — a doctrine taught by the Fathers, clarified by the Magisterium.",
    apologeticUse:
      "Foundational for the doctrine that the Church is necessary for salvation. 1 Peter 3:20-21 explicitly connects the Ark to Baptism: 'in the days of Noah... eight persons were saved through water. Baptism, which corresponds to this, now saves you.' Against the claim that organized religion is unnecessary: God did not simply save Noah individually — He saved him through a visible, structured vessel. Against Protestantism: there is one Ark, not 40,000 arks. The multiplicity of denominations contradicts the typology of one Ark/one Church.",
  },
  {
    id: "flood-baptism",
    otType: "The Flood",
    ntAntitype: "Baptism",
    category: "sacramental",
    otPassages: ["Genesis 6:5-9:17"],
    ntPassages: ["1 Peter 3:20-21", "Romans 6:3-4", "Colossians 2:12"],
    patristicSupport: [
      {
        father: "Tertullian",
        work: "De Baptismo 8",
        quote:
          "After the waters of the deluge, by which the old iniquity was purged — after the baptism, so to say, of the world — a dove was the herald which announced to the earth the assuagement of celestial wrath.",
      },
      {
        father: "St. Basil the Great",
        work: "On the Holy Spirit 15.35",
      },
    ],
    aquinasReferences: [
      "ST III, q.66, a.2 — water as matter of baptism prefigured in the Flood",
      "ST III, q.39, a.3 — Christ's baptism as archetype",
    ],
    cccReferences: [1094, 1219],
    explanation:
      "The Flood destroyed the old sinful world and brought about a new creation. In Baptism, the old self is drowned in the waters and a new creation emerges. The eight persons saved through water (1 Pet 3:20) symbolize the eighth day — the day of Resurrection, the day of new creation. Peter explicitly states: 'Baptism, which corresponds to this, now saves you — not as a removal of dirt from the body but as an appeal to God for a good conscience, through the resurrection of Jesus Christ' (1 Pet 3:21).",
    apologeticUse:
      "Peter says baptism 'now saves you' — this is one of the clearest proof texts for baptismal regeneration against the Baptist/evangelical view that baptism is merely symbolic. The Flood was not a 'symbol' of destruction — it really destroyed. So baptism is not a 'symbol' of salvation — it really saves. Against the 'believer's baptism only' position: Noah's family included children, who were saved through the waters without personal profession of faith.",
  },
  {
    id: "red-sea-baptism",
    otType: "Crossing of the Red Sea",
    ntAntitype: "Baptism",
    category: "sacramental",
    otPassages: ["Exodus 14:10-31", "Exodus 15:1-21"],
    ntPassages: ["1 Corinthians 10:1-2", "Romans 6:3-4"],
    patristicSupport: [
      {
        father: "St. Basil the Great",
        work: "On the Holy Spirit 14.31",
        quote:
          "The people were baptized in Moses in the cloud and in the sea. These events were types for you. Moses was the figure of the baptizer, the sea of the water, the cloud of the Spirit.",
      },
      {
        father: "St. Ambrose",
        work: "De Sacramentis I.6.20",
      },
      {
        father: "Origen",
        work: "Homily on Exodus 5",
      },
    ],
    aquinasReferences: [
      "ST III, q.66, a.2 — Red Sea crossing as baptismal figure",
      "In 1 Cor. cap. 10, lect. 1 — commentary on 'baptized into Moses'",
    ],
    cccReferences: [1221],
    explanation:
      "Paul explicitly states: 'Our fathers were all under the cloud, and all passed through the sea, and all were baptized into Moses in the cloud and in the sea' (1 Cor 10:1-2). Israel passed through the waters of the Red Sea from slavery in Egypt to freedom in the wilderness, heading toward the Promised Land. In Baptism, the Christian passes through the waters from slavery to sin into freedom in Christ, heading toward heaven. The Egyptian army (representing sin and the devil) is drowned in the waters. Moses raised his staff over the sea — the sign of the cross made over the baptismal waters. The pillar of cloud and fire represents the Holy Spirit.",
    apologeticUse:
      "Paul himself calls the Red Sea crossing a 'baptism,' establishing that sacramental typology is not a Catholic invention but an apostolic hermeneutic. If the Red Sea crossing really freed Israel from Egypt, then Baptism really frees from sin. Against the 'ordinance not sacrament' view: Paul treats the Red Sea as a real deliverance, not a symbolic one.",
  },
  {
    id: "ark-of-covenant-mary",
    otType: "Ark of the Covenant",
    ntAntitype: "Mary (New Ark)",
    category: "marian",
    otPassages: [
      "Exodus 25:10-22",
      "2 Samuel 6:2-16",
      "1 Chronicles 15:25-28",
      "Exodus 40:34-35",
    ],
    ntPassages: ["Luke 1:35", "Luke 1:39-56", "Revelation 11:19-12:1"],
    patristicSupport: [
      {
        father: "St. Athanasius",
        work: "Homily on the Meeting of the Lord",
        quote:
          "O noble Virgin, truly you are greater than any other greatness. For who is your equal in greatness, O dwelling place of God the Word? To whom among all creatures shall I compare you, O Virgin? You are greater than them all. O Ark of the New Covenant.",
      },
      {
        father: "St. Ephrem the Syrian",
        work: "Hymn 49.7",
      },
      {
        father: "St. Gregory Thaumaturgus",
        work: "Homily on the Annunciation",
      },
      {
        father: "St. Ambrose",
        work: "Epistle 42.6",
      },
    ],
    aquinasReferences: [
      "ST III, q.27, a.1 — Mary's sanctification as fitting for one who would carry God",
      "Catena Aurea on Luke 1:39-56 — patristic commentary connecting Mary to the Ark",
    ],
    cccReferences: [2676],
    explanation:
      "The Ark of the Covenant contained the stone tablets (the Word of God), a jar of manna (bread from heaven), and Aaron's rod (sign of priesthood). Mary carried in her womb Jesus Christ — the Word made flesh, the true Bread from heaven, the eternal High Priest. The Ark was overshadowed by the glory cloud (shekinah) (Ex 40:34-35); Mary was 'overshadowed' by the Holy Spirit (Luke 1:35) — the same Greek word (episkiazo) is used in the Septuagint and in Luke. David leaped before the Ark (2 Sam 6:14-16); John the Baptist leaped in Elizabeth's womb before Mary (Luke 1:41-44). David asked 'How can the Ark of the Lord come to me?' (2 Sam 6:9); Elizabeth asked 'Why is this granted to me, that the mother of my Lord should come to me?' (Luke 1:43). The Ark stayed at the house of Obed-edom for three months (2 Sam 6:11); Mary stayed with Elizabeth for three months (Luke 1:56). In Revelation 11:19, the Ark of the Covenant appears in heaven — and immediately in 12:1, a 'woman clothed with the sun' appears, who is Mary.",
    apologeticUse:
      "One of the most powerful Marian typologies, drawn directly from Luke's literary structure (Luke deliberately parallels Mary's visitation with the Ark's journey to Jerusalem). Against Protestants who say Catholics 'worship' Mary: the Ark was venerated, not worshiped — and the Ark was holy because of what it carried. Mary is venerated, not worshiped — and she is holy because of Who she carried. Against the objection that Marian devotion is unbiblical: Luke explicitly portrays Mary as the New Ark in his Gospel. The Revelation 11:19-12:1 transition (Ark → Woman) is the biblical basis for many Marian doctrines.",
  },
  {
    id: "eve-mary",
    otType: "Eve (Mother of All Living)",
    ntAntitype: "Mary (New Eve, Mother of All Living in Grace)",
    category: "marian",
    otPassages: ["Genesis 2:21-23", "Genesis 3:1-6", "Genesis 3:15", "Genesis 3:20"],
    ntPassages: [
      "Luke 1:28-38",
      "John 2:1-5",
      "John 19:26-27",
      "Revelation 12:1-17",
      "Galatians 4:4",
    ],
    patristicSupport: [
      {
        father: "St. Justin Martyr",
        work: "Dialogue with Trypho 100",
        quote:
          "Christ became man by the Virgin, in order that the disobedience which proceeded from the serpent might receive its destruction in the same manner in which it derived its origin. For Eve, who was a virgin and undefiled, having conceived the word of the serpent, brought forth disobedience and death. But the Virgin Mary received faith and joy, when the angel Gabriel announced the good tidings to her.",
      },
      {
        father: "St. Irenaeus",
        work: "Against Heresies III.22.4",
        quote:
          "The knot of Eve's disobedience was loosed by the obedience of Mary. For what the virgin Eve had bound fast through unbelief, this did the virgin Mary set free through faith.",
      },
      {
        father: "Tertullian",
        work: "De Carne Christi 17",
        quote:
          "As Eve had believed the serpent, so Mary believed the angel. The delinquency which the one occasioned by believing, the other by believing effaced.",
      },
      {
        father: "St. Ephrem the Syrian",
        work: "Hymns on the Nativity 1.16",
      },
    ],
    aquinasReferences: [
      "ST III, q.27, a.4 — Mary's sanctification in the womb",
      "ST III, q.30, a.1 — the Annunciation as reversal of the Fall",
    ],
    cccReferences: [411, 494, 726, 2618, 2853],
    explanation:
      "The Eve-Mary parallel is the oldest and most universal Marian typology in Christian tradition, attested from the mid-2nd century onward. Eve was a virgin who disobeyed God by listening to a fallen angel (the serpent), bringing death. Mary was a virgin who obeyed God by listening to a good angel (Gabriel), bringing Life. Eve said 'I will' to the serpent; Mary said 'fiat' (let it be done) to God. Eve was 'mother of all living' in the natural order (Gen 3:20); Mary is mother of all living in the supernatural order (John 19:26-27, 'Behold your mother'). Eve was formed from Adam's side; the Church (Mary's spiritual motherhood extends through the Church) was formed from Christ's side. As sin entered through a woman, salvation entered through a woman. The 'recapitulation' theology of Irenaeus: God reverses each element of the Fall point by point.",
    apologeticUse:
      "This typology was universally held by the 2nd-century Fathers — before any Council defined Marian dogma. It is evidence of the earliest Christian understanding of Mary's role in salvation. Against the objection that Marian theology is a late development: Justin, Irenaeus, and Tertullian all teach the Eve-Mary parallel within 100-150 years of the apostles. Against the minimalist view of Mary: if Christ is the New Adam, there must be a New Eve — and every Father identifies her as Mary. The parallel also supports the Immaculate Conception: if Mary reverses Eve point by point, and Eve was created without sin, then Mary too must have been preserved from sin.",
  },
  {
    id: "queen-mother-mary",
    otType: "Queen Mother (Gebirah) of Davidic Kingdom",
    ntAntitype: "Mary as Queen Mother of Christ's Kingdom",
    category: "marian",
    otPassages: [
      "1 Kings 2:19-20 (Bathsheba as Queen Mother of Solomon)",
      "1 Kings 15:13",
      "2 Kings 10:13",
      "Jeremiah 13:18",
      "Jeremiah 29:2",
    ],
    ntPassages: [
      "Luke 1:32-33 (Jesus inherits David's throne)",
      "Revelation 12:1 (woman crowned with stars)",
      "John 2:1-5 (Mary's intercessory role at Cana)",
    ],
    patristicSupport: [
      {
        father: "St. Ephrem the Syrian",
        work: "Hymns for the Feast of the Nativity 4.150",
      },
      {
        father: "St. Andrew of Crete",
        work: "Homily IV on the Nativity of Mary",
      },
    ],
    aquinasReferences: [
      "ST III, q.27-30 — Mary's role in relation to Christ the King",
    ],
    cccReferences: [966],
    explanation:
      "In the Davidic kingdom, the queen was not the king's wife (kings had many wives) but the king's MOTHER — the Gebirah (Great Lady). The Queen Mother had a throne at the king's right hand (1 Kings 2:19), wore a crown, served as advocate/intercessor (Bathsheba interceded with Solomon for Adonijah), and had real authority. Every Davidic king from Solomon onward had his mother listed as Queen Mother in the official record. Jesus is the heir of David's throne (Luke 1:32-33). Therefore Mary, His mother, is the Queen Mother of His kingdom. At Cana, Mary intercedes with her Son ('They have no wine') and He responds — exactly the pattern of the Gebirah interceding with the king.",
    apologeticUse:
      "This is one of the most powerful biblical arguments for Mary as Queen and intercessor. It is not based on Catholic tradition but on the explicit structure of the Davidic monarchy, which Protestants accept as historical. Against the objection that calling Mary 'Queen of Heaven' is pagan: it is not borrowed from Jeremiah's pagan queen of heaven — it comes from the Davidic institution of the Gebirah. Against the objection that Mary's intercession undermines Christ's sole mediation: the Queen Mother did not replace the King — she interceded WITH and THROUGH the king's authority. Mary's intercession is always 'Do whatever He tells you' (John 2:5).",
  },
  {
    id: "jonah-resurrection",
    otType: "Jonah (Three Days in the Fish)",
    ntAntitype: "Christ (Three Days in the Tomb)",
    category: "christological",
    otPassages: ["Jonah 1:17-2:10", "Jonah 3:1-10"],
    ntPassages: ["Matthew 12:39-41", "Luke 11:29-32"],
    patristicSupport: [
      {
        father: "St. Irenaeus",
        work: "Against Heresies V.5.2",
      },
      {
        father: "St. Jerome",
        work: "Commentary on Jonah",
        quote:
          "As Jonah spent three days and three nights in the belly of the whale, so Christ spent three days and three nights in the heart of the earth.",
      },
      {
        father: "St. Augustine",
        work: "Epistle 102",
      },
    ],
    aquinasReferences: [
      "ST III, q.51, a.4 — Christ in the tomb for three days, prefigured by Jonah",
      "In Matt. cap. 12 — commentary on the sign of Jonah",
    ],
    cccReferences: [627, 994],
    explanation:
      "Jesus Himself identifies this typology: 'For as Jonah was three days and three nights in the belly of the whale, so will the Son of Man be three days and three nights in the heart of the earth' (Matt 12:40). Jonah was 'dead' in the belly of the sea creature and was 'vomited out' alive — a symbol of death and resurrection. Jonah's preaching brought repentance to the Gentile city of Nineveh — Christ's Resurrection brings salvation to all the Gentile nations. Jesus says 'something greater than Jonah is here' (Matt 12:41).",
    apologeticUse:
      "Christ Himself establishes this typology, making it incontestable. Useful for demonstrating that Jesus understood His death and resurrection as the fulfillment of OT patterns. Against the swoon theory or other Resurrection denials: Jesus predicted a literal three-day death and resurrection using the Jonah type. Against those who claim Jesus never predicted His death: the sign of Jonah passages show otherwise.",
  },
  {
    id: "elijah-john-baptist",
    otType: "Elijah the Prophet",
    ntAntitype: "John the Baptist",
    category: "christological",
    otPassages: [
      "1 Kings 17-19",
      "2 Kings 1:8",
      "Malachi 4:5-6",
      "Sirach/Ecclesiasticus 48:1-11",
    ],
    ntPassages: [
      "Matthew 3:4",
      "Matthew 11:13-14",
      "Matthew 17:10-13",
      "Luke 1:17",
      "Mark 9:11-13",
    ],
    patristicSupport: [
      {
        father: "Origen",
        work: "Commentary on John VI.7",
      },
      {
        father: "St. John Chrysostom",
        work: "Homily on Matthew 37.2",
      },
    ],
    aquinasReferences: [
      "ST III, q.38, a.1 — John the Baptist as precursor, in the spirit of Elijah",
      "In Matt. cap. 11, lect. 2 — 'if you are willing to accept it, he is Elijah'",
    ],
    cccReferences: [523, 718, 719],
    explanation:
      "Malachi prophesied that God would send 'Elijah the prophet before the great and terrible day of the Lord' (Mal 4:5). Jesus explicitly identifies John the Baptist as the fulfillment of this prophecy: 'If you are willing to accept it, he is Elijah who is to come' (Matt 11:14). John dressed like Elijah — wearing a garment of camel's hair with a leather belt (Matt 3:4, cf. 2 Kings 1:8). Both lived in the wilderness. Both confronted wicked kings (Elijah vs. Ahab; John vs. Herod). Both were persecuted by wicked queens (Jezebel; Herodias). The angel Gabriel tells Zechariah that John will go before the Lord 'in the spirit and power of Elijah' (Luke 1:17).",
    apologeticUse:
      "Shows that Christ's mission was announced in advance through prophetic types. John the Baptist came 'in the spirit and power of Elijah' — not literally Elijah (John denies being Elijah in John 1:21), but the typological fulfillment. This is key for understanding how Catholic typology works: the fulfillment is greater than the type, not a reincarnation of it.",
  },
  {
    id: "david-kingdom-church",
    otType: "Davidic Kingdom",
    ntAntitype: "The Church (Kingdom of God)",
    category: "ecclesiological",
    otPassages: [
      "2 Samuel 7:12-16",
      "1 Chronicles 17:11-14",
      "Psalm 89:3-4, 29, 36-37",
      "Isaiah 9:6-7",
    ],
    ntPassages: [
      "Luke 1:32-33",
      "Matthew 16:18-19",
      "Isaiah 22:22 / Revelation 3:7",
      "Acts 15:15-17",
    ],
    patristicSupport: [
      {
        father: "St. Augustine",
        work: "City of God XVII.8",
      },
      {
        father: "Eusebius of Caesarea",
        work: "Demonstratio Evangelica VII",
      },
    ],
    aquinasReferences: [
      "ST III, q.31, a.2 — Christ born from David's line",
      "ST II-II, q.1, a.10 — the Church as Christ's kingdom",
      "In Matt. cap. 16 — keys of the kingdom",
    ],
    cccReferences: [559, 709, 786],
    explanation:
      "God promised David an everlasting kingdom (2 Sam 7:12-16). Jesus inherits David's throne (Luke 1:32-33). The Davidic kingdom had a prime minister (al bayit — 'over the house') who held the keys of the kingdom (Isaiah 22:22). Jesus gives Peter the keys of the kingdom (Matt 16:19), making Peter the prime minister of Christ's kingdom — the Pope. The Davidic kingdom had twelve officers over the twelve tribes; Jesus appoints twelve apostles. The Davidic kingdom was a visible, hierarchical institution — the Church is a visible, hierarchical institution. The kingdom was promised to last forever; the Church will last until the end of time (Matt 16:18, 'the gates of hell shall not prevail').",
    apologeticUse:
      "The connection between Isaiah 22:22 (key of the house of David given to Eliakim) and Matthew 16:19 (keys of the kingdom given to Peter) is one of the strongest biblical arguments for the papacy. The office of al bayit was a real office with succession — when one holder died or was removed, another took his place. This supports apostolic succession and the papacy as a continuing office. Against the invisible church theory: the Davidic kingdom was visible and institutional, and Jesus's kingdom fulfills David's kingdom.",
  },
  {
    id: "temple-church",
    otType: "The Temple",
    ntAntitype: "Christ's Body / The Church",
    category: "ecclesiological",
    otPassages: [
      "1 Kings 6-8",
      "2 Chronicles 2-7",
      "Ezekiel 40-48",
      "Exodus 25-31 (Tabernacle)",
    ],
    ntPassages: [
      "John 2:19-21",
      "1 Corinthians 3:16-17",
      "1 Corinthians 6:19",
      "Ephesians 2:19-22",
      "1 Peter 2:4-5",
      "Revelation 21:22",
    ],
    patristicSupport: [
      {
        father: "Origen",
        work: "Commentary on John X.39",
      },
      {
        father: "St. Augustine",
        work: "De Civitate Dei XVIII.48",
      },
    ],
    aquinasReferences: [
      "ST III, q.22, a.1 — Christ as High Priest of the new Temple",
      "ST I-II, q.102, a.4 — the OT ceremonial law and Temple as figures",
      "In Joan. cap. 2, lect. 3 — 'Destroy this temple and in three days I will raise it up'",
    ],
    cccReferences: [756, 797, 809],
    explanation:
      "The Temple was the dwelling place of God's presence on earth, the place of sacrifice, and the center of Israel's worship. Jesus identifies His own body as the true Temple (John 2:19-21). After the Resurrection, the Church becomes the Temple — both corporately ('you are God's temple,' 1 Cor 3:16) and individually ('your body is a temple of the Holy Spirit,' 1 Cor 6:19). The Temple had a Holy of Holies where God dwelt behind the veil; at Christ's death, the veil was torn (Matt 27:51), signaling that access to God is now open through Christ. Ezekiel's vision of a restored Temple (Ez 40-48) with living water flowing from it (Ez 47) is fulfilled in the Church and ultimately in the New Jerusalem, where there is no Temple 'because the Lord God Almighty and the Lamb are its temple' (Rev 21:22).",
    apologeticUse:
      "Shows the continuity between OT worship and Catholic worship. The Temple had priests, sacrifices, incense, liturgy, sacred vessels, and a hierarchical structure — so does the Catholic Church. Against Protestantism: if you strip away priesthood, sacrifice, liturgy, and sacred space, you have removed everything the Temple foreshadowed. The bare-walls approach of many Protestant churches does not correspond to the Biblical pattern of worship.",
  },
  {
    id: "priesthood-aaron-christ",
    otType: "Aaronic/Levitical Priesthood",
    ntAntitype: "Priesthood of Christ (and the Ministerial Priesthood)",
    category: "ecclesiological",
    otPassages: [
      "Exodus 28-29",
      "Leviticus 8-10",
      "Numbers 16-18",
      "Psalm 110:4",
    ],
    ntPassages: [
      "Hebrews 4:14-5:10",
      "Hebrews 7-10",
      "1 Peter 2:9",
      "Revelation 1:6",
      "Revelation 5:10",
    ],
    patristicSupport: [
      {
        father: "St. Clement of Rome",
        work: "First Epistle to the Corinthians 40-44",
        quote:
          "The high priest has his proper ministrations, the priests have their proper place assigned to them, the Levites have their proper duties. The layman is bound by the ordinances for the laity.",
      },
      {
        father: "St. Ignatius of Antioch",
        work: "Epistle to the Philadelphians 4",
      },
    ],
    aquinasReferences: [
      "ST III, q.22, a.1-6 — Christ as Priest",
      "ST III, q.63, a.3 — the sacramental character of Holy Orders",
      "In Heb. cap. 7-10 — detailed commentary on Christ's priesthood superseding Aaron's",
      "Supplement q.34-40 — on the sacrament of Orders",
    ],
    cccReferences: [1539, 1544, 1547, 1548, 1591],
    explanation:
      "Aaron and his descendants were consecrated as priests to offer sacrifice, intercede for the people, and teach the Law. Christ is the eternal High Priest (Heb 4:14) whose one sacrifice supersedes all Levitical sacrifices. However, Christ's priesthood is not Levitical but Melchizedekian (Heb 7:11). The Levitical priests were many because death prevented them from continuing; Christ lives forever (Heb 7:23-24). The Levitical priests offered animal blood; Christ offers His own blood (Heb 9:12). The Levitical priests entered an earthly sanctuary; Christ enters the heavenly sanctuary (Heb 9:24). Yet Christ extends His priesthood through ordained ministers (the ministerial priesthood) who act in persona Christi — 'Do this in remembrance of me' (Luke 22:19) is a priestly command.",
    apologeticUse:
      "Hebrews does not abolish priesthood — it elevates it. Against the Protestant claim that all Christians are priests in the same way: even in the OT, all Israel was 'a kingdom of priests' (Ex 19:6), yet there was still a ministerial priesthood. The universal priesthood and the ministerial priesthood are not mutually exclusive. 1 Peter 2:9 and Revelation 1:6 (royal priesthood of all believers) echo Exodus 19:6, but Exodus 19:6 coexisted with the Aaronic priesthood. Clement of Rome (c. AD 96) already distinguishes between clergy and laity.",
  },
  {
    id: "joshua-jesus",
    otType: "Joshua (Conquest of Promised Land)",
    ntAntitype: "Jesus (Conquest of Heaven)",
    category: "christological",
    otPassages: ["Joshua 1-24", "Joshua 3:14-17", "Joshua 6:1-27"],
    ntPassages: ["Hebrews 4:8-9", "Acts 7:45", "Colossians 2:15"],
    patristicSupport: [
      {
        father: "Origen",
        work: "Homily on Joshua 1",
        quote:
          "My Lord Jesus is the true Joshua who leads us across the Jordan of death into the true Promised Land.",
      },
      {
        father: "St. Justin Martyr",
        work: "Dialogue with Trypho 113",
      },
    ],
    aquinasReferences: [
      "ST I-II, q.103, a.3 — OT ceremonies as figures of NT realities",
    ],
    cccReferences: [],
    explanation:
      "Joshua and Jesus are the same name in Hebrew (Yehoshua = 'God saves'). Joshua led Israel through the Jordan River into the Promised Land after Moses (the Law) could not bring them in. Jesus leads the new Israel through the waters of Baptism into the heavenly Promised Land after the Law proved insufficient to save. Hebrews 4:8 makes this connection explicit: 'If Joshua had given them rest, God would not have spoken later about another day.' The Promised Land was only a shadow of the true rest — heaven.",
    apologeticUse:
      "The name identity (Joshua = Jesus) shows divine planning across centuries. The fact that Moses (the Law) could not enter the Promised Land but Joshua (Jesus) could is theologically significant: the Law cannot save, but Jesus can (Rom 8:3). Against sola fide: Joshua's conquest required active cooperation — the Israelites had to march, fight, and obey. Grace + cooperation, not grace alone.",
  },
  {
    id: "david-christ",
    otType: "David (Shepherd-King, Anointed One)",
    ntAntitype: "Christ (Son of David, Eternal King)",
    category: "christological",
    otPassages: [
      "1 Samuel 16:1-13",
      "1 Samuel 17",
      "2 Samuel 5:1-5",
      "2 Samuel 7:12-16",
      "Psalm 89",
    ],
    ntPassages: [
      "Matthew 1:1",
      "Matthew 21:9",
      "Luke 1:32-33",
      "Romans 1:3",
      "Revelation 5:5",
      "Revelation 22:16",
    ],
    patristicSupport: [
      {
        father: "St. Augustine",
        work: "Enarrationes in Psalmos 88",
      },
      {
        father: "Eusebius of Caesarea",
        work: "Demonstratio Evangelica VII",
      },
    ],
    aquinasReferences: [
      "ST III, q.31, a.2 — Christ born of David's lineage",
      "In Matt. cap. 1 — genealogy showing Christ as Son of David",
    ],
    cccReferences: [437, 439, 559],
    explanation:
      "David was a shepherd anointed king, the youngest and least expected son, who defeated the giant Goliath and established Jerusalem as the holy city. Christ, the 'Son of David' (Matt 1:1), is the Good Shepherd anointed by the Spirit, born in humble circumstances, who defeats Satan (the cosmic Goliath) and establishes the New Jerusalem. David was anointed (mashiach/christos) three times — at Hebron over Judah, then over all Israel; Christ is anointed Prophet, Priest, and King. David's kingdom was promised to last forever (2 Sam 7:16); Christ's kingdom has no end (Luke 1:33).",
    apologeticUse:
      "The 'Son of David' title is the most common messianic designation in the Gospels. It connects Jesus to the entire arc of OT covenant theology. Against the claim that Jesus never claimed to be the Messiah: accepting the title 'Son of David' IS claiming to be the Messiah.",
  },
  {
    id: "solomon-christ",
    otType: "Solomon (Wisdom and Temple Builder)",
    ntAntitype: "Christ (Wisdom Incarnate, Builder of the True Temple)",
    category: "christological",
    otPassages: [
      "1 Kings 3:5-14",
      "1 Kings 4:29-34",
      "1 Kings 6-8",
      "1 Kings 10:1-13",
    ],
    ntPassages: [
      "Matthew 12:42",
      "1 Corinthians 1:30",
      "Colossians 2:3",
      "John 2:19-21",
    ],
    patristicSupport: [
      {
        father: "Origen",
        work: "Commentary on the Song of Songs, Prologue",
      },
    ],
    aquinasReferences: [
      "ST III, q.7, a.7-8 — Christ possessing the fullness of wisdom",
    ],
    cccReferences: [590],
    explanation:
      "Solomon was renowned for his wisdom and built the Temple of God. Jesus says 'something greater than Solomon is here' (Matt 12:42). Christ is 'the wisdom of God' (1 Cor 1:24, 30), in whom 'are hidden all the treasures of wisdom and knowledge' (Col 2:3). Solomon built a Temple of stone; Christ builds a Temple of living stones (1 Pet 2:5) — His Church. The Queen of Sheba came from the ends of the earth to hear Solomon's wisdom; all nations come to Christ. Solomon's reign was the golden age of Israel's kingdom but ultimately fell through sin; Christ's kingdom is eternal and unfailing.",
    apologeticUse:
      "Jesus's 'greater than Solomon' claim is an implicit claim to divinity — Solomon was the greatest king of Israel, and Jesus claims to surpass him. Useful for showing Christ's self-understanding.",
  },
  {
    id: "elisha-christ",
    otType: "Elisha the Prophet",
    ntAntitype: "Christ",
    category: "christological",
    otPassages: [
      "2 Kings 2:9-14",
      "2 Kings 4:1-7 (oil)",
      "2 Kings 4:18-37 (raises dead child)",
      "2 Kings 4:42-44 (feeds 100 with 20 loaves)",
      "2 Kings 5:1-14 (heals Naaman's leprosy)",
      "2 Kings 6:17 (opens servant's eyes)",
    ],
    ntPassages: [
      "Luke 4:27",
      "John 6:1-14 (feeds 5000)",
      "Luke 7:11-17 (raises widow's son)",
      "Matthew 8:1-4 (heals leper)",
    ],
    patristicSupport: [
      {
        father: "St. Ephrem the Syrian",
        work: "Commentary on 2 Kings",
      },
      {
        father: "St. Ambrose",
        work: "De Spiritu Sancto I.14",
      },
    ],
    aquinasReferences: [
      "ST III, q.44, a.1-4 — Christ's miracles and their OT antecedents",
    ],
    cccReferences: [],
    explanation:
      "Elisha received a double portion of Elijah's spirit and performed twice as many miracles. His miracles foreshadow Christ's: Elisha fed 100 with 20 loaves (2 Kings 4:42-44); Jesus fed 5000 with five loaves. Elisha raised the Shunammite's son (2 Kings 4:18-37); Jesus raised multiple dead. Elisha healed Naaman the Syrian leper by having him wash in the Jordan (2 Kings 5) — a baptismal foreshadowing; Jesus healed lepers and instituted Baptism. Jesus Himself cites Elisha healing the Gentile Naaman as a type of His own mission to the Gentiles (Luke 4:27).",
    apologeticUse:
      "Shows that Christ's miracles are not random displays of power but deliberate fulfillments of OT patterns. The multiplication of loaves is Eucharistic foreshadowing. Naaman's healing by washing in water is baptismal foreshadowing.",
  },
  {
    id: "suffering-servant-christ",
    otType: "Suffering Servant of Isaiah",
    ntAntitype: "Christ's Passion",
    category: "christological",
    otPassages: [
      "Isaiah 42:1-9",
      "Isaiah 49:1-7",
      "Isaiah 50:4-9",
      "Isaiah 52:13-53:12",
    ],
    ntPassages: [
      "Matthew 8:17",
      "Matthew 12:18-21",
      "Acts 8:32-35",
      "1 Peter 2:22-25",
      "Philippians 2:7-8",
      "Mark 10:45",
    ],
    patristicSupport: [
      {
        father: "St. Clement of Rome",
        work: "First Epistle to the Corinthians 16",
      },
      {
        father: "St. Justin Martyr",
        work: "First Apology 50-51",
      },
      {
        father: "Origen",
        work: "Contra Celsum I.55",
      },
    ],
    aquinasReferences: [
      "ST III, q.46, a.1-12 — Christ's suffering",
      "ST III, q.47, a.1-6 — the efficient cause of Christ's passion",
      "ST III, q.48, a.1-6 — the effects of Christ's passion",
      "Super Isaiam cap. 52-53 — Aquinas's commentary on the Suffering Servant",
    ],
    cccReferences: [601, 608, 615, 623],
    explanation:
      "The four Suffering Servant Songs in Isaiah describe a mysterious figure who is chosen by God, rejected by men, pierced for our transgressions, bears our iniquities, is led like a lamb to slaughter, is silent before his accusers, is numbered with transgressors, makes intercession for sinners, and is ultimately exalted. This is the most detailed prophetic portrayal of Christ's Passion in the OT, written ~700 years before the crucifixion. The Ethiopian eunuch in Acts 8:32-35 reads Isaiah 53 and Philip 'beginning with this scripture told him the good news about Jesus.'",
    apologeticUse:
      "Isaiah 53 is perhaps the single most powerful apologetic text for Christ's identity. The level of detail — pierced, silent, numbered with transgressors, buried with the rich, interceding for sinners — is so precise that some Jewish interpreters have tried to apply it to Israel collectively, but the grammar (the Servant suffers FOR the people, who are distinguished from him) and early Jewish tradition (Targum Jonathan, though altered) support an individual Messianic reading.",
  },
  {
    id: "scapegoat-christ",
    otType: "Scapegoat (Yom Kippur)",
    ntAntitype: "Christ Bearing the Sins of the World",
    category: "christological",
    otPassages: ["Leviticus 16:1-34", "Leviticus 16:20-22"],
    ntPassages: [
      "Hebrews 9:11-14",
      "Hebrews 9:24-28",
      "Hebrews 13:11-13",
      "John 1:29",
      "2 Corinthians 5:21",
      "1 Peter 2:24",
    ],
    patristicSupport: [
      {
        father: "Epistle of Barnabas",
        work: "7.6-11",
      },
      {
        father: "Tertullian",
        work: "Against Marcion III.7",
      },
      {
        father: "St. Cyril of Alexandria",
        work: "De Adoratione in Spiritu et Veritate X",
      },
    ],
    aquinasReferences: [
      "ST I-II, q.102, a.3 ad 8 — the scapegoat ceremony as prefiguring Christ",
      "ST III, q.48, a.4 — Christ's passion as satisfaction for sin",
      "ST III, q.49, a.3 — Christ's sacrifice of redemption",
    ],
    cccReferences: [433, 608],
    explanation:
      "On the Day of Atonement (Yom Kippur), the high priest symbolically transferred the sins of Israel onto a goat (the scapegoat/azazel), which was then driven into the wilderness (Lev 16:20-22). A second goat was slaughtered as a sin offering. Christ fulfills BOTH goats: He is the sacrifice whose blood is offered to God (the slaughtered goat), and He bears the sins of the world away (the scapegoat). 'He himself bore our sins in his body on the tree' (1 Pet 2:24). Christ was led outside the city gates (Heb 13:12), just as the scapegoat was driven outside the camp.",
    apologeticUse:
      "Shows the substitutionary and sacrificial nature of Christ's death — deeply rooted in OT liturgy. Against the moral-example-only theory of the Atonement: the scapegoat ceremony is clearly substitutionary, and Christ fulfills it. Against Protestant rejection of the Mass as sacrifice: the Day of Atonement was both a sacrifice (goat slaughtered) and an act of bearing away sin (scapegoat). The Mass re-presents the sacrifice of the cross, and absolution in Confession applies the bearing-away of sin.",
  },
  {
    id: "rock-water-christ",
    otType: "Rock Struck in the Wilderness (Water)",
    ntAntitype: "Christ (Living Water)",
    category: "sacramental",
    otPassages: ["Exodus 17:1-7", "Numbers 20:1-13"],
    ntPassages: [
      "1 Corinthians 10:4",
      "John 7:37-39",
      "John 19:34",
      "John 4:10-14",
    ],
    patristicSupport: [
      {
        father: "St. Augustine",
        work: "Tractates on John 26.12",
        quote: "The rock was Christ in sign; the true Christ is in the Word and in the Flesh.",
      },
      {
        father: "Tertullian",
        work: "De Baptismo 9",
      },
    ],
    aquinasReferences: [
      "ST III, q.66, a.2 — water from the rock as baptismal figure",
      "In 1 Cor. cap. 10, lect. 1 — 'the rock was Christ'",
    ],
    cccReferences: [694, 1094],
    explanation:
      "When Israel thirsted in the wilderness, God told Moses to strike a rock, and water flowed out (Ex 17:6). Paul explicitly states: 'They drank from the supernatural Rock which followed them, and the Rock was Christ' (1 Cor 10:4). When Christ was struck (crucified), water and blood flowed from His pierced side (John 19:34), giving life to the world. The water represents Baptism and the Holy Spirit; the blood represents the Eucharist. Christ invites: 'If any one thirst, let him come to me and drink' (John 7:37).",
    apologeticUse:
      "Paul's identification of the rock with Christ is one of the clearest examples of apostolic typological exegesis. The water and blood from Christ's side (John 19:34) have been universally understood as symbols of Baptism and Eucharist since the earliest Fathers.",
  },
  {
    id: "jacob-ladder-christ",
    otType: "Jacob's Ladder",
    ntAntitype: "Christ (Bridge Between Heaven and Earth)",
    category: "christological",
    otPassages: ["Genesis 28:10-22"],
    ntPassages: ["John 1:51"],
    patristicSupport: [
      {
        father: "St. John Chrysostom",
        work: "Homily on John 21.2",
      },
    ],
    aquinasReferences: [
      "In Joan. cap. 1, lect. 15 — Christ as the true ladder between heaven and earth",
    ],
    cccReferences: [],
    explanation:
      "Jacob saw a ladder (or stairway) reaching from earth to heaven with angels ascending and descending (Gen 28:12). Jesus tells Nathanael: 'You will see heaven opened, and the angels of God ascending and descending upon the Son of Man' (John 1:51). Christ is the ladder — the bridge between God and man, the one Mediator (1 Tim 2:5). The Incarnation is the joining of heaven and earth. The angels ascend and descend on HIM, not on a separate ladder.",
    apologeticUse:
      "Shows Christ as the unique mediator between God and humanity. The ladder typology also supports the Incarnation: God does not remain distant but provides a way of access.",
  },
  {
    id: "ruth-church",
    otType: "Ruth (Gentile Bride of Boaz)",
    ntAntitype: "The Church (Gentile Bride of Christ)",
    category: "ecclesiological",
    otPassages: ["Ruth 1-4"],
    ntPassages: [
      "Ephesians 5:25-32",
      "Romans 11:17-24",
      "Galatians 3:28",
    ],
    patristicSupport: [
      {
        father: "St. Ambrose",
        work: "Expositio Evangelii Lucae III.30",
      },
    ],
    aquinasReferences: [],
    cccReferences: [],
    explanation:
      "Ruth was a Moabite woman — a Gentile — who left her own people and clung to Naomi (Israel), saying 'Your people shall be my people, and your God my God' (Ruth 1:16). She married Boaz (the kinsman-redeemer, go'el) and became an ancestor of David and therefore of Christ (Matt 1:5). The Church is the Gentile bride who leaves behind the world and clings to Christ, the kinsman-redeemer who pays the price to redeem her. Boaz spread his cloak over Ruth (Ruth 3:9) — a sign of marriage and protection; Christ covers the Church with His grace.",
    apologeticUse:
      "Shows that God's plan always included the Gentiles. Ruth, a Gentile, is in the direct lineage of Christ. Against the claim that Christianity is a corruption of Judaism: the inclusion of Gentiles was built into the plan from the beginning.",
  },
  {
    id: "esther-mary",
    otType: "Esther (Queen who intercedes for her people)",
    ntAntitype: "Mary (Queen who intercedes for the Church)",
    category: "marian",
    otPassages: ["Esther 4:13-16", "Esther 5:1-8", "Esther 7:1-6", "Esther 8:3-6"],
    ntPassages: ["John 2:1-5", "Revelation 12:1"],
    patristicSupport: [
      {
        father: "St. Germanus of Constantinople",
        work: "Homily on the Dormition",
      },
    ],
    aquinasReferences: [],
    cccReferences: [],
    explanation:
      "Esther was a queen who risked her life to intercede with the King for the salvation of her people. She approached the king's throne uninvited, trusting in his favor, and her intercession saved the entire Jewish nation from destruction. Mary is the Queen Mother who intercedes with Christ the King for the salvation of her spiritual children. At Cana, Mary intercedes ('They have no wine') and Jesus responds. Esther's intercession reversed the decree of death; Mary's intercession, united to Christ's saving work, obtains graces for those in need.",
    apologeticUse:
      "Shows the biblical precedent for queenly intercession. Esther did not replace the king — she interceded with him. Mary does not replace Christ — she intercedes with Him. This answers the objection that Marian intercession undermines Christ's unique mediation.",
  },
  {
    id: "creation-new-creation",
    otType: "Creation (Seven Days)",
    ntAntitype: "New Creation (Redemption)",
    category: "eschatological",
    otPassages: ["Genesis 1:1-2:3"],
    ntPassages: [
      "John 1:1-5 ('In the beginning')",
      "2 Corinthians 5:17",
      "Galatians 6:15",
      "Revelation 21:1-5",
      "John 20:1 (first day of the week)",
      "Colossians 1:15-20",
    ],
    patristicSupport: [
      {
        father: "St. Irenaeus",
        work: "Against Heresies V.33",
      },
      {
        father: "St. Basil the Great",
        work: "Hexaemeron",
      },
    ],
    aquinasReferences: [
      "ST I, q.73, a.1 — the seventh day as rest, pointing to eternal rest",
    ],
    cccReferences: [280, 349, 2174],
    explanation:
      "John's Gospel opens with 'In the beginning' — deliberately echoing Genesis 1:1. Jesus rises on the first day of the week — the eighth day, the day of new creation. God's first creative words were 'Let there be light' (Gen 1:3); Christ is 'the light of the world' (John 8:12). In creation, the Spirit hovered over the waters (Gen 1:2); in the new creation, the Spirit descends at Baptism. The old creation culminated in the Sabbath (seventh day rest); the new creation begins on Sunday (eighth day, beyond the cycle of the old creation). Revelation ends with 'a new heaven and a new earth' (Rev 21:1).",
    apologeticUse:
      "Shows the cosmic scope of redemption — it is not merely individual salvation but the renewal of all creation. Against the Gnostic/dualist view that matter is evil: God created the material world good, and He will renew it, not discard it. Supports the Catholic understanding of Sunday worship replacing Saturday Sabbath.",
  },
  {
    id: "daniel-stone-church",
    otType: "The Stone Cut Without Hands (Daniel 2)",
    ntAntitype: "Christ's Kingdom (The Church)",
    category: "ecclesiological",
    otPassages: ["Daniel 2:31-45"],
    ntPassages: [
      "Luke 20:18",
      "Acts 4:11",
      "1 Peter 2:4-8",
      "Matthew 21:42-44",
    ],
    patristicSupport: [
      {
        father: "St. Irenaeus",
        work: "Against Heresies III.21.7",
      },
      {
        father: "St. Hippolytus",
        work: "Commentary on Daniel II.13",
      },
    ],
    aquinasReferences: [
      "ST III, q.34, a.3 — the supernatural origin of Christ (cut without hands = virgin birth)",
    ],
    cccReferences: [],
    explanation:
      "In Nebuchadnezzar's dream, a stone 'cut without hands' strikes the statue representing world empires and becomes a mountain filling the whole earth (Dan 2:34-35, 44-45). The stone represents Christ (born of a virgin — 'cut without hands,' i.e., without human agency) and His kingdom (the Church), which destroys all worldly kingdoms and fills the earth. The stone becomes a mountain — the kingdom starts small (mustard seed, Matt 13:31) and grows to fill the world.",
    apologeticUse:
      "Daniel 2 prophesies that God's kingdom will be established during the Roman Empire (the fourth kingdom) — exactly when Christ came. The kingdom is described as visible, growing, and enduring — not invisible or merely spiritual. Supports the Catholic understanding of the Church as a visible, universal institution destined to fill the earth.",
  },
  {
    id: "covenant-circumcision-baptism",
    otType: "Circumcision (Sign of the Old Covenant)",
    ntAntitype: "Baptism (Sign of the New Covenant)",
    category: "sacramental",
    otPassages: ["Genesis 17:9-14", "Leviticus 12:3"],
    ntPassages: ["Colossians 2:11-12", "Galatians 3:27-29", "Acts 2:38-39"],
    patristicSupport: [
      {
        father: "St. Augustine",
        work: "De Baptismo IV.24",
      },
      {
        father: "St. John Chrysostom",
        work: "Homily on Colossians 6",
      },
    ],
    aquinasReferences: [
      "ST III, q.70, a.1 — circumcision as prefiguring baptism",
      "ST III, q.70, a.4 — circumcision conferred grace as a sign of faith in Christ to come",
    ],
    cccReferences: [527, 1150],
    explanation:
      "Circumcision was the sign of entry into the Old Covenant, performed on eight-day-old infants (Gen 17:12). Paul explicitly connects it to Baptism: 'In him you were also circumcised with a circumcision made without hands... having been buried with him in baptism' (Col 2:11-12). Both are signs of covenant membership. Both were administered to infants (circumcision on the 8th day, which is why baptism is associated with the 8th day — the day of new creation). Both involve a cutting away (circumcision of flesh / death to sin).",
    apologeticUse:
      "One of the strongest arguments for infant baptism. If circumcision (the OT initiation rite) was given to infants, and baptism replaces circumcision (Col 2:11-12), then baptism should also be given to infants. Peter says the promise is 'for you and for your children' (Acts 2:39). Against Baptists who demand a profession of faith before baptism: infants were circumcised without a profession of faith, yet they were genuine members of the covenant.",
  },
  {
    id: "day-atonement-calvary",
    otType: "Day of Atonement (Yom Kippur) Liturgy",
    ntAntitype: "Christ's Sacrifice on Calvary",
    category: "christological",
    otPassages: ["Leviticus 16:1-34", "Leviticus 23:27-32"],
    ntPassages: [
      "Hebrews 9:1-28",
      "Hebrews 10:1-18",
      "Romans 3:25",
      "1 John 2:2",
    ],
    patristicSupport: [
      {
        father: "St. John Chrysostom",
        work: "Homily on Hebrews 17.2",
      },
      {
        father: "Origen",
        work: "Homily on Leviticus 9",
      },
    ],
    aquinasReferences: [
      "ST III, q.22, a.3-4 — Christ as both priest and victim",
      "ST III, q.48, a.3 — Christ's death as sacrifice",
      "In Heb. cap. 9, lect. 4-5 — the Day of Atonement fulfilled in Christ",
    ],
    cccReferences: [433, 613, 614],
    explanation:
      "On the Day of Atonement, the High Priest — the only person who could enter the Holy of Holies, and only on this one day — entered through the veil carrying the blood of the sacrifice to sprinkle on the mercy seat (the gold lid of the Ark). Hebrews 9 systematically shows that Christ is both the High Priest who enters the true Holy of Holies (heaven) and the sacrifice whose blood is offered. The tearing of the Temple veil at Christ's death (Matt 27:51) signifies that access to God's presence is now permanently opened through Christ's sacrifice. Christ entered 'once for all into the Holy Place, taking not the blood of goats and calves but his own blood, thus securing an eternal redemption' (Heb 9:12).",
    apologeticUse:
      "Shows the sacrificial and priestly nature of Christ's work — He does not merely teach or give moral example; He offers sacrifice as a priest. Against the 'finished at the cross' argument against the Mass: Hebrews shows that Christ's priestly work includes not only the offering on the cross (the sacrifice) but also the presentation of His blood in the heavenly sanctuary (Heb 9:24) — an ongoing intercession. The Mass participates in this ongoing priestly action.",
  },
  {
    id: "tabernacle-incarnation",
    otType: "The Tabernacle (Mishkan — God's Dwelling)",
    ntAntitype: "The Incarnation (God Dwells Among Us)",
    category: "christological",
    otPassages: [
      "Exodus 25-31",
      "Exodus 35-40",
      "Exodus 40:34-38",
    ],
    ntPassages: [
      "John 1:14 ('The Word became flesh and dwelt/tabernacled among us')",
      "Colossians 2:9",
      "Revelation 21:3",
    ],
    patristicSupport: [
      {
        father: "Origen",
        work: "Homilies on Exodus 9",
      },
      {
        father: "St. Gregory of Nyssa",
        work: "Life of Moses II",
      },
    ],
    aquinasReferences: [
      "ST III, q.2, a.1-12 — the Incarnation as God dwelling in human nature",
      "In Joan. cap. 1, lect. 8 — 'tabernacled among us'",
    ],
    cccReferences: [697, 2594],
    explanation:
      "The Greek word in John 1:14 is eskenosen — literally 'pitched his tent' or 'tabernacled.' Just as God's presence (shekinah glory) filled the Tabernacle in the wilderness (Ex 40:34), so the fullness of deity dwells bodily in Christ (Col 2:9). The Tabernacle was portable — God journeyed with His people; in the Incarnation, God walks among us. The Tabernacle was where sacrifice was offered and God's will was sought; Christ is where sacrifice is made (the Cross) and God's will is revealed (the Gospels).",
    apologeticUse:
      "John deliberately uses 'tabernacled' language to connect the Incarnation to the OT Tabernacle. This shows that the Incarnation is not a foreign concept imposed on Judaism but its ultimate fulfillment. Also supports the Catholic practice of using a tabernacle for Eucharistic reservation — Christ continues to 'tabernacle' among us in the Blessed Sacrament.",
  },
  {
    id: "twelve-tribes-twelve-apostles",
    otType: "Twelve Tribes of Israel",
    ntAntitype: "Twelve Apostles",
    category: "ecclesiological",
    otPassages: [
      "Genesis 49:1-28",
      "Exodus 28:21",
      "Numbers 1:1-46",
    ],
    ntPassages: [
      "Matthew 10:1-4",
      "Matthew 19:28",
      "Luke 22:30",
      "Revelation 21:12-14",
    ],
    patristicSupport: [
      {
        father: "St. Irenaeus",
        work: "Against Heresies III.12.5",
      },
    ],
    aquinasReferences: [
      "ST III, q.72, a.6 ad 1 — twelve apostles correspond to twelve tribes",
    ],
    cccReferences: [765],
    explanation:
      "The twelve tribes of Israel form the structure of the Old Covenant people of God. Jesus deliberately chose twelve apostles to form the foundation of the New Covenant people of God (the Church). He explicitly makes the connection: 'You who have followed me will also sit on twelve thrones, judging the twelve tribes of Israel' (Matt 19:28). In the New Jerusalem, the twelve gates bear the names of the twelve tribes, and the twelve foundations bear the names of the twelve apostles (Rev 21:12-14). When Judas fell, the apostles replaced him (Acts 1:15-26) to maintain the number twelve — the office continues.",
    apologeticUse:
      "Supports apostolic succession: the twelve are an office, not merely twelve individuals. When Judas fell, he was replaced — the number had to be maintained. This pattern of succession continues through the bishops. Against the invisible church theory: the twelve tribes were visible and counted; the twelve apostles were visible and chosen publicly.",
  },
  {
    id: "high-priest-garments-christ",
    otType: "High Priest's Vestments",
    ntAntitype: "Christ's Priestly Dignity / Liturgical Vestments",
    category: "ecclesiological",
    otPassages: ["Exodus 28:1-43", "Exodus 39:1-31"],
    ntPassages: [
      "Revelation 1:13 (Christ in priestly garments)",
      "Hebrews 4:14-16",
    ],
    patristicSupport: [
      {
        father: "St. Jerome",
        work: "Epistle 64 (to Fabiola)",
      },
      {
        father: "St. Bede",
        work: "De Tabernaculo",
      },
    ],
    aquinasReferences: [
      "ST I-II, q.102, a.5 ad 6-10 — priestly vestments as signs",
    ],
    cccReferences: [],
    explanation:
      "The High Priest's elaborate vestments (ephod, breastplate with twelve stones, robe, turban, sash) were not arbitrary — each element symbolized his role as mediator. The twelve stones on the breastplate bore the names of the twelve tribes, meaning the priest carried all Israel on his heart before God. The gold plate on the turban read 'Holy to the LORD.' Christ is the eternal High Priest who carries all humanity before the Father. The liturgical vestments worn by Catholic priests echo these OT vestments, signifying that the ordained minister acts in persona Christi.",
    apologeticUse:
      "Defends the Catholic practice of liturgical vestments against Protestant simplicity. God Himself commanded elaborate priestly vestments (Ex 28). The priest does not dress up for show but wears garments that signify his sacred office. Stripping away vestments is stripping away the typological connection to the OT priesthood.",
  },
  {
    id: "garden-eden-garden-gethsemane-tomb",
    otType: "Garden of Eden (Sin Begins)",
    ntAntitype: "Garden of Gethsemane / Garden Tomb (Redemption Accomplished)",
    category: "christological",
    otPassages: ["Genesis 2:8-17", "Genesis 3:1-24"],
    ntPassages: [
      "John 18:1 (garden of Gethsemane)",
      "John 19:41 (garden tomb)",
      "John 20:15 (Mary Magdalene mistakes Jesus for the gardener)",
    ],
    patristicSupport: [
      {
        father: "St. Cyril of Jerusalem",
        work: "Catechetical Lectures XIV.11",
      },
      {
        father: "St. Ambrose",
        work: "De Virginibus II.6",
      },
    ],
    aquinasReferences: [
      "ST III, q.46, a.6 ad 3 — the fittingness that redemption occur in a garden",
    ],
    cccReferences: [],
    explanation:
      "Sin began in a garden (Eden); the act of redemption began in a garden (Gethsemane) and was completed in a garden (the garden tomb). In Eden, Adam hid from God; in Gethsemane, Jesus sought the Father. In Eden, Adam's will diverged from God's ('I will eat'); in Gethsemane, Jesus' will submitted ('Not my will but yours'). Mary Magdalene mistakes the risen Jesus for 'the gardener' (John 20:15) — and in a sense He IS the gardener: the New Adam restoring the garden that the old Adam ruined. The tree of death (knowledge of good and evil) is reversed by the tree of life (the Cross).",
    apologeticUse:
      "Shows the literary and theological unity of Scripture from Genesis to the Gospels. The garden motif is a deliberate inclusion by John (who alone mentions the gardens). Supports the Catholic understanding that redemption involves the restoration (not destruction) of creation.",
  },
  {
    id: "israel-firstborn-jesus-firstborn",
    otType: "Israel as God's Firstborn Son",
    ntAntitype: "Jesus as the True Firstborn Son of God",
    category: "christological",
    otPassages: ["Exodus 4:22-23", "Hosea 11:1"],
    ntPassages: [
      "Matthew 2:15",
      "Colossians 1:15",
      "Hebrews 1:6",
      "Romans 8:29",
    ],
    patristicSupport: [
      {
        father: "Origen",
        work: "Contra Celsum I.38",
      },
    ],
    aquinasReferences: [
      "In Matt. cap. 2 — 'Out of Egypt I called my son'",
    ],
    cccReferences: [530],
    explanation:
      "God called Israel 'my firstborn son' (Ex 4:22) and called Israel out of Egypt (Hosea 11:1). Matthew applies Hosea 11:1 to Jesus: 'Out of Egypt I have called my son' (Matt 2:15). Jesus IS Israel — He is the faithful Son where Israel was unfaithful. He goes into Egypt and comes out, recapitulating Israel's journey. He is tested in the wilderness for 40 days (as Israel was tested for 40 years). He gives the Law on a mountain (Sermon on the Mount, as Moses received the Law on Sinai). He passes through the waters (baptism, as Israel passed through the Red Sea).",
    apologeticUse:
      "This pattern — Jesus recapitulating Israel's history — is key for understanding Matthew's Gospel and for Jewish apologetics. Jesus does not merely fulfill individual prophecies; He fulfills Israel's entire vocation as God's faithful Son.",
  },
  {
    id: "wine-cana-eucharist",
    otType: "Wine at the Wedding / Messianic Banquet",
    ntAntitype: "Wine of the Eucharist / Wedding Feast of the Lamb",
    category: "sacramental",
    otPassages: [
      "Isaiah 25:6-8 (messianic banquet with wine)",
      "Joel 3:18",
      "Amos 9:13-14",
      "Song of Solomon 1:2-4",
    ],
    ntPassages: [
      "John 2:1-11 (Cana)",
      "Matthew 26:27-29",
      "Revelation 19:7-9",
    ],
    patristicSupport: [
      {
        father: "St. Cyril of Alexandria",
        work: "Commentary on John, Book II",
      },
    ],
    aquinasReferences: [
      "In Joan. cap. 2, lect. 1-2 — the wedding at Cana as Eucharistic sign",
      "ST III, q.74, a.1 — wine as matter of the Eucharist",
    ],
    cccReferences: [1335],
    explanation:
      "The prophets foretold that the Messianic age would be marked by abundant wine (Isaiah 25:6, Joel 3:18, Amos 9:13). At Cana, Jesus transforms water into wine — and not just any wine, but the best wine. This is the first sign in John's Gospel, signaling that the Messianic age has arrived. The six stone jars used for Jewish purification rituals (John 2:6) represent the old covenant; the new wine represents the new covenant. At the Last Supper, Jesus transforms wine into His Blood. The wedding feast imagery runs through to Revelation 19: the marriage supper of the Lamb.",
    apologeticUse:
      "Cana is a Eucharistic sign: Jesus transforms one substance into another (water → wine), foreshadowing transubstantiation (wine → Blood). The fact that the miracle involves a WEDDING connects to the nuptial theology of the Eucharist — the Mass is the wedding feast of Christ and His Church.",
  },
];

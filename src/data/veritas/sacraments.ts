export interface Sacrament {
  name: string;
  matter: string;
  form: string;
  minister: string;
  effects: string[];
  scriptualBasis: string[];
  aquinasRef: string;
  cccRef: string;
  institution: string;
  commonObjections: { objection: string; response: string }[];
}

export const SACRAMENTS: Sacrament[] = [
  {
    name: "Baptism",
    matter: "Water (natural water, poured on the head or by immersion)",
    form: "\"I baptize you in the name of the Father, and of the Son, and of the Holy Spirit.\"",
    minister: "Ordinary: bishop, priest, or deacon. In emergency, any person with the right intention.",
    effects: [
      "Forgiveness of all sins (original and actual) and all punishment due to sin",
      "Infusion of sanctifying grace",
      "Incorporation into the Body of Christ (the Church)",
      "Reception of theological virtues and gifts of the Holy Spirit",
      "Indelible spiritual character (cannot be repeated)",
      "Adoption as a child of God",
    ],
    scriptualBasis: [
      "Matthew 28:19 — \"Go and make disciples, baptizing them in the name of the Father and of the Son and of the Holy Spirit\"",
      "John 3:5 — \"Unless one is born of water and the Spirit, he cannot enter the kingdom of God\"",
      "Acts 2:38 — \"Repent and be baptized for the forgiveness of your sins\"",
      "Romans 6:3-4 — \"We were buried with him by baptism into death\"",
      "1 Peter 3:21 — \"Baptism now saves you\"",
      "Acts 22:16 — \"Be baptized and wash away your sins\"",
    ],
    aquinasRef: "ST III, q.66-71",
    cccRef: "CCC 1213-1284",
    institution: "Christ commanded baptism in Matthew 28:19 and declared its necessity in John 3:5. His own baptism in the Jordan sanctified the waters.",
    commonObjections: [
      { objection: "Baptism is merely symbolic.", response: "1 Peter 3:21 says 'baptism now saves you.' Acts 2:38 links it to forgiveness. Acts 22:16 says it washes away sins. Paul warns of judgment for unworthily receiving communion (implying baptism effects real change). Every Church Father taught baptismal regeneration without exception." },
      { objection: "Infant baptism is unbiblical.", response: "Entire households were baptized (Acts 16:15, 16:33, 18:8; 1 Cor 1:16). OT infants received circumcision on the eighth day. The Didache, Hippolytus (c. 215), Origen, and Cyprian attest infant baptism as apostolic practice." },
    ],
  },
  {
    name: "Confirmation",
    matter: "Sacred chrism (olive oil with balsam, consecrated by the bishop) anointed on the forehead",
    form: "\"Be sealed with the Gift of the Holy Spirit.\"",
    minister: "Ordinary: the bishop. A priest may confirm with delegation (Latin rite). In Eastern rites, the priest confirms at baptism.",
    effects: [
      "Full outpouring of the Holy Spirit as at Pentecost",
      "Increase and deepening of baptismal grace",
      "Firmer incorporation into Christ and the Church",
      "Strengthening of the gifts of the Holy Spirit",
      "Special strength to witness to and defend the faith",
      "Indelible spiritual character (cannot be repeated)",
    ],
    scriptualBasis: [
      "Acts 8:14-17 — Peter and John laid hands on baptized Samaritans, who received the Holy Spirit",
      "Acts 19:5-6 — Paul laid hands and the Holy Spirit came",
      "2 Corinthians 1:21-22 — \"He has sealed us and given us the Spirit\"",
      "Hebrews 6:2 — \"laying on of hands\" as foundational teaching",
      "Isaiah 11:2 — the seven gifts of the Spirit",
    ],
    aquinasRef: "ST III, q.72",
    cccRef: "CCC 1285-1321",
    institution: "Christ promised the Spirit (John 14:16-17, Acts 1:8), fulfilled at Pentecost. The apostles transmitted it through laying on of hands (Acts 8, 19).",
    commonObjections: [
      { objection: "Confirmation is not in the Bible.", response: "Acts 8:14-17 and 19:5-6 describe a post-baptismal laying on of hands conferring the Spirit, distinct from baptism. Hebrews 6:2 lists it as foundational. The early Church universally practiced chrismation." },
      { objection: "All Christians receive the Spirit at baptism — no separate sacrament needed.", response: "The Spirit is given in baptism, but Confirmation is a fuller outpouring — as the apostles received the Spirit from Christ (John 20:22) and again at Pentecost (Acts 2). The Samaritans in Acts 8 were baptized but had not received the Spirit until the apostles came." },
    ],
  },
  {
    name: "Eucharist",
    matter: "Wheat bread and grape wine",
    form: "\"This is my Body... This is the chalice of my Blood...\" (Words of Institution)",
    minister: "Only a validly ordained priest or bishop.",
    effects: [
      "Bread and wine become the true Body, Blood, Soul, and Divinity of Christ (transubstantiation)",
      "Intimate union with Christ (John 6:56)",
      "Increase of sanctifying grace",
      "Forgiveness of venial sins",
      "Preservation from future mortal sin",
      "Strengthening of charity and Church unity",
      "Pledge of future glory and bodily resurrection",
    ],
    scriptualBasis: [
      "John 6:51-58 — \"My flesh is true food and my blood is true drink\"",
      "Matthew 26:26-28 — \"This is my body... This is my blood\"",
      "Luke 22:19-20 — \"Do this in remembrance of me\"",
      "1 Corinthians 11:23-29 — Warning against unworthy reception",
      "1 Corinthians 10:16 — \"Is it not a participation in the body of Christ?\"",
    ],
    aquinasRef: "ST III, q.73-83",
    cccRef: "CCC 1322-1419",
    institution: "Christ instituted the Eucharist at the Last Supper (Matt 26, Mark 14, Luke 22, 1 Cor 11) and prepared the disciples in John 6.",
    commonObjections: [
      { objection: "\"This is my body\" is metaphorical, like \"I am the vine.\"", response: "In John 6, Jesus used 'trogon' (gnaw/munch) — the most physical eating word. His listeners understood literally and left. He did not correct them. Paul says you can be 'guilty of profaning the body and blood' (1 Cor 11:27) — you cannot profane a symbol. Every Church Father affirmed the Real Presence." },
      { objection: "Transubstantiation is a medieval Aristotelian invention.", response: "The Real Presence was believed long before Aristotle was rediscovered. Ignatius (c. 110), Justin Martyr (c. 155), Irenaeus (c. 180), Cyril, Ambrose, Augustine all affirm it. The word explains the how; the belief is apostolic." },
    ],
  },
  {
    name: "Confession (Penance / Reconciliation)",
    matter: "The acts of the penitent: contrition, confession of sins, satisfaction (penance)",
    form: "\"I absolve you from your sins, in the name of the Father, and of the Son, and of the Holy Spirit.\"",
    minister: "Only a validly ordained priest or bishop with faculties.",
    effects: [
      "Reconciliation with God — restoration of sanctifying grace",
      "Forgiveness of sins confessed with contrition",
      "Reconciliation with the Church",
      "Remission of eternal punishment due to mortal sin",
      "Remission of at least part of temporal punishment",
      "Peace and serenity of conscience",
      "Spiritual strength for the Christian struggle",
    ],
    scriptualBasis: [
      "John 20:21-23 — \"If you forgive the sins of any, they are forgiven; if you retain the sins of any, they are retained\"",
      "Matthew 18:18 — \"Whatever you bind on earth shall be bound in heaven\"",
      "James 5:16 — \"Confess your sins to one another\"",
      "2 Corinthians 5:18-20 — \"God gave us the ministry of reconciliation\"",
    ],
    aquinasRef: "ST III, q.84-90",
    cccRef: "CCC 1422-1498",
    institution: "Christ breathed on the Apostles and said 'Receive the Holy Spirit. If you forgive the sins of any, they are forgiven' (John 20:21-23).",
    commonObjections: [
      { objection: "Only God can forgive sins. Why confess to a priest?", response: "Correct — and God chose to exercise that power through human ministers. John 20:23 is explicit. To retain sins, they must know what the sins are — hence confession. God consistently works through human instruments." },
      { objection: "Confession was invented in the Middle Ages.", response: "The Didache (c. 70-100) commands it. Irenaeus, Origen, Cyprian, Basil all attest to it. The form evolved (public to private, via Irish monasteries), but the reality goes back to John 20:23." },
    ],
  },
  {
    name: "Anointing of the Sick",
    matter: "Oil of the sick (olive oil blessed by the bishop) anointed on forehead and hands",
    form: "\"Through this holy anointing may the Lord in his love and mercy help you with the grace of the Holy Spirit. May the Lord who frees you from sin save you and raise you up.\"",
    minister: "Only a priest or bishop.",
    effects: [
      "Union of the sick person with Christ's Passion",
      "Strengthening, peace, and courage in suffering",
      "Forgiveness of sins (if unable to receive Confession)",
      "Restoration of health, if conducive to salvation",
      "Preparation for passing into eternal life",
    ],
    scriptualBasis: [
      "James 5:14-15 — \"Call for the elders... let them pray over him, anointing him with oil... the Lord will raise him up... if he has committed sins, he will be forgiven\"",
      "Mark 6:13 — \"They anointed with oil many who were sick and healed them\"",
      "Mark 16:18 — \"They will lay hands on the sick, and they will recover\"",
    ],
    aquinasRef: "ST Supp., q.29-33",
    cccRef: "CCC 1499-1532",
    institution: "Instituted by Christ during His healing ministry; apostolic practice recorded in James 5:14-15 and Mark 6:13.",
    commonObjections: [
      { objection: "James 5 is just prayer for healing, not a sacrament.", response: "James describes a specific ritual: calling elders/priests, anointing with oil, prayer in the Lord's name, with effects of healing and forgiveness. A structured rite by ordained ministers with material elements and spiritual effects is precisely what a sacrament is." },
      { objection: "Miraculous gifts ceased with the apostles.", response: "Cessationism has no biblical basis and was unknown in the early Church. Origen, Chrysostom, and Caesarius of Arles attest to continued anointing of the sick." },
    ],
  },
  {
    name: "Holy Orders",
    matter: "The laying on of hands by the bishop",
    form: "The consecratory prayer proper to each degree (bishop, priest, deacon)",
    minister: "Only a bishop can ordain.",
    effects: [
      "Indelible spiritual character (cannot be repeated for the same degree)",
      "Configuration to Christ as Head, Shepherd, and Priest",
      "Power to act in persona Christi in Eucharist and absolution",
      "Grace proper to each degree",
      "Incorporation into apostolic ministry by succession",
    ],
    scriptualBasis: [
      "Luke 22:19 — \"Do this in remembrance of me\" (institution of priesthood)",
      "Acts 6:6 — Apostles laid hands on the seven deacons",
      "Acts 14:23 — Paul appointed elders in every church",
      "1 Timothy 4:14 — \"The gift given you by the laying on of hands\"",
      "2 Timothy 1:6 — \"Fan into flame the gift of God through the laying on of my hands\"",
      "Titus 1:5 — \"Appoint elders in every town\"",
      "Hebrews 5:1-6 — Christ as High Priest after Melchizedek",
    ],
    aquinasRef: "ST Supp., q.34-40",
    cccRef: "CCC 1536-1600",
    institution: "Christ instituted the priesthood at the Last Supper (Luke 22:19), gave power to forgive sins (John 20:23), and commanded teaching and governing (Matt 28:18-20). The three degrees are attested from Clement of Rome (c. 96), Ignatius (c. 110), and the Didache.",
    commonObjections: [
      { objection: "The NT knows no priesthood — all Christians are priests (1 Peter 2:9).", response: "The common and ministerial priesthoods are complementary. Israel had both (Exodus 19:6 + Levitical priesthood). The NT distinguishes them. Apostles ordained successors (Acts 14:23, Titus 1:5, 2 Tim 1:6) and passed on the power to offer the Eucharist and forgive sins." },
      { objection: "Women should be ordained.", response: "The Church has no authority to ordain women (Ordinatio Sacerdotalis, 1994). Christ chose twelve male apostles not from convention (He broke conventions) but by deliberate choice. The priest acts in persona Christi — the bridegroom. This is sacramental signification, not about capability. The greatest Catholic saint is a woman: the Blessed Virgin Mary." },
    ],
  },
  {
    name: "Matrimony",
    matter: "The mutual consent of the spouses (they are ministers to each other)",
    form: "The exchange of vows expressing consent",
    minister: "The spouses themselves. The priest or deacon is the Church's official witness.",
    effects: [
      "An indissoluble bond established by God",
      "Grace to love with Christ's love for the Church",
      "Sanctification and mutual growth in holiness",
      "Grace to fulfill married life and be open to children",
      "The family becomes a 'domestic church'",
    ],
    scriptualBasis: [
      "Genesis 2:24 — \"They shall become one flesh\"",
      "Matthew 19:4-6 — \"What God has joined together, let no man separate\"",
      "Ephesians 5:25-32 — Marriage as image of Christ and Church",
      "John 2:1-11 — Christ's first miracle at the wedding at Cana",
      "1 Corinthians 7:10-11 — \"The wife should not separate from her husband\"",
    ],
    aquinasRef: "ST Supp., q.41-68",
    cccRef: "CCC 1601-1666",
    institution: "God instituted marriage at creation (Gen 2:24). Christ elevated it to a sacrament and restored its indissolubility (Matt 19:4-6). His first miracle was at a wedding (John 2).",
    commonObjections: [
      { objection: "The Church should allow divorce and remarriage.", response: "Christ's teaching is clear: 'What God has joined, let no man separate' (Matt 19:6). The Church cannot dissolve a valid, consummated sacramental marriage. Annulments don't dissolve marriages — they declare that a valid marriage never existed due to a defect in consent or form." },
      { objection: "The teaching against same-sex marriage is discriminatory.", response: "Marriage is a natural institution rooted in male-female complementarity and ordered to procreation. This is based on natural law, Scripture (Gen 2:24, Matt 19:4-6), and the sacramental meaning of marriage imaging Christ and the Church (Eph 5:25-32). The Church affirms every person's dignity regardless of orientation while maintaining marriage is by nature a man-woman union." },
    ],
  },
];

// =============================================================================
// PROPHECY FULFILLMENT DATABASE
// =============================================================================
// Every major messianic prophecy with OT source, NT fulfillment, and
// apologetic significance. Sources: CCC, Aquinas, Church Fathers.
// =============================================================================

export interface Prophecy {
  id: string;
  title: string;
  category: ProphecyCategory;
  otSource: {
    reference: string;
    text: string;
    context: string;
  };
  ntFulfillment: {
    reference: string;
    text: string;
  };
  aquinasReferences: string[];
  apologeticSignificance: string;
}

export type ProphecyCategory =
  | "birth-origins"
  | "nature-identity"
  | "ministry"
  | "passion-death"
  | "resurrection-exaltation"
  | "covenant-kingdom"
  | "second-coming";

export const prophecyDatabase: Prophecy[] = [
  // =========================================================================
  // BIRTH AND ORIGINS
  // =========================================================================
  {
    id: "protoevangelium",
    title: "The Protoevangelium — First Gospel",
    category: "birth-origins",
    otSource: {
      reference: "Genesis 3:15",
      text: "I will put enmity between you and the woman, and between your seed and her seed; he shall bruise your head, and you shall bruise his heel.",
      context:
        "God's curse upon the serpent immediately after the Fall. The first promise of redemption in all of Scripture. The phrase 'her seed' is unique — seed is normally attributed to the father, not the mother, hinting at the virgin birth. The 'woman' is Eve immediately but Mary ultimately. The seed of the woman will crush the serpent's head (a mortal wound) while the serpent will only bruise his heel (a non-fatal wound, i.e., the Passion).",
    },
    ntFulfillment: {
      reference: "Galatians 4:4; Romans 16:20; Revelation 12:1-17; Luke 1:28-38",
      text: "'When the fullness of time had come, God sent forth his Son, born of woman' (Gal 4:4). 'The God of peace will soon crush Satan under your feet' (Rom 16:20). The woman clothed with the sun whose offspring the dragon pursues (Rev 12).",
    },
    aquinasReferences: [
      "ST III, q.1, a.4 — the fittingness of the Incarnation for conquering the devil",
      "ST I, q.119, a.1 ad 5 — the seed of the woman",
      "In Gen. cap. 3 — the protoevangelium as first promise",
    ],
    apologeticSignificance:
      "The very first verse after the Fall contains the promise of redemption — God does not wait. The phrase 'her seed' (unusual since seed is patrilineal) hints at the virgin birth. The 'woman' at enmity with the serpent is the foundation of the Immaculate Conception: total enmity with Satan means no moment of being under his dominion (sin). This is why Mary is called 'the New Eve' from the 2nd century onward. Revelation 12 picks up this Genesis 3:15 imagery directly.",
  },
  {
    id: "scepter-judah",
    title: "The Scepter from Judah",
    category: "birth-origins",
    otSource: {
      reference: "Genesis 49:10",
      text: "The scepter shall not depart from Judah, nor the ruler's staff from between his feet, until Shiloh comes; and to him shall be the obedience of the peoples.",
      context:
        "Jacob's deathbed blessing of his twelve sons. Judah receives the promise of kingship. 'Shiloh' is understood as a messianic title meaning 'he whose it is' or 'the one sent.' The scepter (governmental authority) will remain with Judah until the Messiah comes.",
    },
    ntFulfillment: {
      reference: "Matthew 1:2-3; Luke 3:33; Hebrews 7:14; Revelation 5:5",
      text: "'Our Lord descended from Judah' (Heb 7:14). 'The Lion of the tribe of Judah, the Root of David, has conquered' (Rev 5:5). Jesus's genealogy traces through Judah in both Matthew and Luke.",
    },
    aquinasReferences: [
      "ST III, q.31, a.2 — Christ's descent from Judah",
      "In Heb. cap. 7 — Christ from Judah, not Levi",
    ],
    apologeticSignificance:
      "Historical argument: the scepter departed from Judah in AD 6 when Archelaus was deposed and Judea became a Roman province under a Roman governor. Jewish self-governance ended. If the Messiah had not yet come by that point, the prophecy would have failed. The Talmud records the rabbis' alarm: 'Woe to us, for the scepter has departed from Judah and the Messiah has not come!' (Sanhedrin 97b). But He had come — Jesus was born c. 4-6 BC, just before the scepter departed.",
  },
  {
    id: "star-jacob",
    title: "A Star from Jacob",
    category: "birth-origins",
    otSource: {
      reference: "Numbers 24:17",
      text: "A star shall come forth out of Jacob, and a scepter shall rise out of Israel; it shall crush the forehead of Moab, and break down all the sons of Sheth.",
      context:
        "Balaam's oracle — spoken by a pagan prophet hired to curse Israel. Instead, the Spirit compels him to bless Israel and prophesy the Messiah. The 'star' became a major messianic symbol; Bar Kokhba ('Son of the Star') took his name from this verse in the 2nd-century revolt.",
    },
    ntFulfillment: {
      reference: "Matthew 2:1-12; Revelation 22:16; 2 Peter 1:19",
      text: "The star that guided the Magi to Bethlehem (Matt 2:2, 7, 9-10). 'I am the root and the offspring of David, the bright morning star' (Rev 22:16).",
    },
    aquinasReferences: [
      "ST III, q.36, a.5 — the star that appeared at Christ's birth",
      "In Matt. cap. 2 — the Magi and the star",
    ],
    apologeticSignificance:
      "A pagan prophet prophesies the Jewish Messiah — God's plan transcends Israel even in the OT. The Magi (Gentile astrologers) follow a star to find the Jewish king — Gentile inclusion from the start. Bar Kokhba's failed revolt (AD 132-135, endorsed by Rabbi Akiva as Messiah) shows what happens when the wrong 'star' is followed.",
  },
  {
    id: "prophet-like-moses",
    title: "A Prophet Like Moses",
    category: "nature-identity",
    otSource: {
      reference: "Deuteronomy 18:15-19",
      text: "The LORD your God will raise up for you a prophet like me from among you, from your brethren — him you shall heed... I will put my words in his mouth, and he shall speak to them all that I command him.",
      context:
        "Moses, the greatest OT prophet, mediator of the covenant, and lawgiver, promises that God will raise up another prophet like himself. Jewish tradition understood this as a messianic prophecy (see John 6:14, 'This is indeed the prophet who is to come into the world').",
    },
    ntFulfillment: {
      reference: "Acts 3:22-23; Acts 7:37; John 1:21, 25, 45; John 6:14",
      text: "Peter explicitly applies this to Jesus: 'Moses said, The Lord God will raise up for you a prophet from your brethren as he raised me up' (Acts 3:22). Stephen identifies Jesus as this prophet (Acts 7:37).",
    },
    aquinasReferences: [
      "ST III, q.31, a.1 — Christ as the new Moses",
      "In Joan. cap. 6, lect. 3 — 'This is indeed the prophet'",
    ],
    apologeticSignificance:
      "The apostles themselves applied Deut 18:15 to Jesus. The prophet 'like Moses' must be: (1) from among the Israelites (Jesus was Jewish), (2) a mediator of a covenant (Jesus mediated the New Covenant), (3) a deliverer from slavery (Jesus delivers from sin), (4) a lawgiver (Sermon on the Mount), (5) greater than all subsequent prophets (Deut 34:10). Muslims claim Muhammad fulfills this, but Muhammad was not from among the 'brethren' of Israel (he was Ishmaelite, not Israelite), and Deut 18:15 specifies 'from among you.' The Samaritan tradition also expected this prophet (the Taheb), showing widespread pre-Christian expectation.",
  },
  {
    id: "virgin-birth",
    title: "The Virgin Birth",
    category: "birth-origins",
    otSource: {
      reference: "Isaiah 7:14",
      text: "Therefore the Lord himself will give you a sign: Behold, the virgin (almah) shall conceive and bear a son, and shall call his name Immanuel.",
      context:
        "Isaiah speaks to King Ahaz during the Syro-Ephraimite crisis (c. 735 BC). The Hebrew word 'almah' means 'young woman of marriageable age' (with a connotation of virginity). The Septuagint (translated by Jews c. 250 BC, before any Christian influence) translates it as 'parthenos' — which unambiguously means 'virgin.' The name 'Immanuel' means 'God with us.'",
    },
    ntFulfillment: {
      reference: "Matthew 1:22-23; Luke 1:26-35",
      text: "'All this took place to fulfill what the Lord had spoken by the prophet: Behold, a virgin shall conceive and bear a son, and his name shall be called Emmanuel, which means God with us' (Matt 1:22-23). The angel Gabriel announces to the Virgin Mary: 'The Holy Spirit will come upon you, and the power of the Most High will overshadow you' (Luke 1:35).",
    },
    aquinasReferences: [
      "ST III, q.28, a.1 — the virgin birth",
      "ST III, q.29, a.1 — Mary a true virgin before, during, and after birth",
      "Super Isaiam cap. 7 — Aquinas's commentary on Isaiah 7:14",
    ],
    apologeticSignificance:
      "The almah/parthenos debate is central. Jewish apologists claim 'almah' means merely 'young woman.' Response: (1) The Septuagint, translated by Jews pre-Christianity, chose 'parthenos' (virgin), showing that Jewish translators understood the messianic sense. (2) If Isaiah only meant 'a young woman will have a baby,' that is not a 'sign' — young women have babies all the time. A sign from God must be extraordinary. (3) Every other OT use of 'almah' refers to a woman who is in fact a virgin (Gen 24:43, Ex 2:8, Ps 68:25, Song 1:3, 6:8). (4) The name 'Immanuel' — God with us — implies the child IS God, which requires a supernatural birth.",
  },
  {
    id: "bethlehem-birth",
    title: "Born in Bethlehem",
    category: "birth-origins",
    otSource: {
      reference: "Micah 5:2",
      text: "But you, O Bethlehem Ephrathah, who are little to be among the clans of Judah, from you shall come forth for me one who is to be ruler in Israel, whose origin is from of old, from ancient days.",
      context:
        "Micah, writing c. 735-700 BC, identifies tiny Bethlehem as the birthplace of the Messiah. The phrase 'whose origin is from of old, from ancient days' (Hebrew: mimei olam, 'from days of eternity') implies pre-existence and divinity.",
    },
    ntFulfillment: {
      reference: "Matthew 2:1-6; Luke 2:4-7; John 7:42",
      text: "Jesus is born in Bethlehem (Luke 2:4-7). The chief priests and scribes cite Micah 5:2 when Herod asks where the Messiah is to be born (Matt 2:5-6). Even Jesus's opponents know the Messiah must come from Bethlehem (John 7:42).",
    },
    aquinasReferences: [
      "ST III, q.35, a.7 — the fittingness of Bethlehem as Christ's birthplace",
      "In Matt. cap. 2 — the prophecy of Bethlehem",
    ],
    apologeticSignificance:
      "Jesus's family lived in Nazareth, yet He was born in Bethlehem due to the Roman census (Luke 2:1-4) — a secular event fulfilling a 700-year-old prophecy. No one could manipulate their birthplace. The Jewish leaders themselves confirmed Bethlehem as the prophesied location (Matt 2:5-6), yet refused to follow through when Jesus came from there. 'From ancient days' implies the Messiah's pre-existence — the ruler born in Bethlehem has an eternal origin.",
  },
  {
    id: "called-out-egypt",
    title: "Called Out of Egypt",
    category: "birth-origins",
    otSource: {
      reference: "Hosea 11:1",
      text: "When Israel was a child, I loved him, and out of Egypt I called my son.",
      context:
        "Hosea's primary reference is to the Exodus — God calling the nation of Israel (His 'son') out of Egypt. But Matthew sees a deeper typological fulfillment in Christ.",
    },
    ntFulfillment: {
      reference: "Matthew 2:13-15",
      text: "Joseph takes Mary and Jesus to Egypt to escape Herod. After Herod's death, they return: 'This was to fulfill what the Lord had spoken by the prophet, Out of Egypt I called my son' (Matt 2:15).",
    },
    aquinasReferences: [
      "In Matt. cap. 2 — Christ recapitulates Israel's journey",
    ],
    apologeticSignificance:
      "This illustrates typological (not merely predictive) prophecy. Hosea 11:1 primarily refers to the Exodus, but Jesus recapitulates Israel's history — He IS the true Israel. This is not proof-texting but a deep hermeneutical principle: the OT narratives are patterns that reach their fullest expression in Christ. Against the skeptic who says Matthew misquotes Hosea: Matthew is doing typology, not prediction-fulfillment in the simplistic sense.",
  },
  // =========================================================================
  // NATURE AND IDENTITY
  // =========================================================================
  {
    id: "son-of-god-psalm2",
    title: "The Son of God — Psalm 2",
    category: "nature-identity",
    otSource: {
      reference: "Psalm 2:1-12",
      text: "The LORD said to me, 'You are my Son, today I have begotten you. Ask of me, and I will make the nations your heritage, and the ends of the earth your possession.' ... Kiss the Son, lest he be angry.",
      context:
        "A royal psalm originally for the coronation of Davidic kings, but its language transcends any earthly king. 'You are my Son' implies a unique divine sonship. 'The nations your heritage' implies universal dominion. 'Kiss the Son' implies worship.",
    },
    ntFulfillment: {
      reference: "Acts 13:33; Hebrews 1:5; Hebrews 5:5; Matthew 3:17; Matthew 17:5",
      text: "At Jesus's baptism: 'This is my beloved Son' (Matt 3:17). Paul applies Psalm 2:7 to Christ's resurrection: 'You are my Son, today I have begotten you' (Acts 13:33). Hebrews applies it to Christ's superiority over angels (Heb 1:5).",
    },
    aquinasReferences: [
      "ST III, q.24, a.1-2 — Christ's predestination as Son of God",
      "In Psalmos, Psalm 2 — Aquinas's full commentary",
    ],
    apologeticSignificance:
      "Psalm 2 establishes the Messiah as God's Son in a unique, ontological sense — not merely an adoptive title. The universal dominion ('nations as heritage, ends of the earth') excludes any merely human king. The command to 'kiss the Son' (worship/reverence) is appropriate only for God. Against Unitarians and JWs: the NT applies 'You are my Son' to Christ in contexts of divine authority.",
  },
  {
    id: "eternal-priest-psalm110",
    title: "Eternal Priest-King — Psalm 110",
    category: "nature-identity",
    otSource: {
      reference: "Psalm 110:1-4",
      text: "The LORD says to my lord: 'Sit at my right hand, till I make your enemies your footstool.' ... The LORD has sworn and will not change his mind, 'You are a priest for ever after the order of Melchizedek.'",
      context:
        "The most quoted OT psalm in the NT. David calls the Messiah 'my lord' — the Messiah is David's son yet David's lord. He is both king ('sit at my right hand') and priest ('priest forever after the order of Melchizedek'). Under the Mosaic law, these offices were strictly separated (kings from Judah, priests from Levi).",
    },
    ntFulfillment: {
      reference:
        "Matthew 22:41-46; Acts 2:34-35; Hebrews 1:13; 5:5-6; 7:1-28; 1 Corinthians 15:25",
      text: "Jesus uses this psalm to challenge the Pharisees: 'If David calls him Lord, how is he his son?' (Matt 22:45). Peter cites it at Pentecost (Acts 2:34). Hebrews builds its entire Christology of priesthood on Psalm 110:4.",
    },
    aquinasReferences: [
      "ST III, q.22, a.1-6 — Christ as priest according to the order of Melchizedek",
      "In Heb. cap. 5-7 — extensive commentary on Psalm 110:4",
      "In Psalmos, Psalm 110 — full commentary",
    ],
    apologeticSignificance:
      "Jesus's argument in Matt 22:41-46 is devastating: if the Messiah is merely David's human son, David would not call him 'lord.' But David does — therefore the Messiah transcends David and is David's Lord. This implies divinity. Psalm 110 is also the foundation for Christ's eternal priesthood (not Levitical but Melchizedekian), which supports the ministerial priesthood of the Catholic Church as a participation in Christ's eternal priesthood. The Pharisees had no answer to Jesus's challenge (Matt 22:46).",
  },
  {
    id: "divine-child-isaiah9",
    title: "The Divine Child — Mighty God, Everlasting Father",
    category: "nature-identity",
    otSource: {
      reference: "Isaiah 9:6-7",
      text: "For to us a child is born, to us a son is given; and the government shall be upon his shoulder, and his name shall be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. Of the increase of his government and of peace there will be no end, upon the throne of David.",
      context:
        "Isaiah, writing c. 700 BC, describes a child born who is called 'Mighty God' (El Gibbor) and 'Everlasting Father' (Abi-Ad). These are divine titles, not titles for a human being. He sits on David's throne forever — an eternal kingdom.",
    },
    ntFulfillment: {
      reference: "Luke 1:32-33; Luke 2:11; John 1:1-14; Philippians 2:6-11",
      text: "'He will be great, and will be called the Son of the Most High; and the Lord God will give to him the throne of his father David, and he will reign over the house of Jacob for ever; and of his kingdom there will be no end' (Luke 1:32-33).",
    },
    aquinasReferences: [
      "ST III, q.16, a.1-12 — the divine names applied to Christ",
      "Super Isaiam cap. 9 — commentary on the divine child",
    ],
    apologeticSignificance:
      "Isaiah 9:6 is one of the clearest OT declarations of the Messiah's divinity. The child is called 'Mighty God' (El Gibbor) — the same title used for God Himself in Isaiah 10:21. Against JWs and Arians: this is not 'a mighty god' but 'Mighty God' — the same God of Israel. Against Judaism: if the Messiah is merely human, how can he be called 'Everlasting Father' and 'Mighty God'? The eternal kingdom ('no end') has not been established by any merely human king.",
  },
  {
    id: "branch-jesse",
    title: "The Branch from Jesse's Root",
    category: "nature-identity",
    otSource: {
      reference: "Isaiah 11:1-10",
      text: "There shall come forth a shoot from the stump of Jesse, and a branch shall grow out of his roots. And the Spirit of the LORD shall rest upon him, the spirit of wisdom and understanding, the spirit of counsel and might, the spirit of knowledge and the fear of the LORD.",
      context:
        "Jesse is David's father. A 'stump' implies the Davidic dynasty has been cut down (fulfilled when Babylon destroyed the monarchy in 586 BC). From the stump, a branch grows — the Messiah, born from David's line even after the monarchy ended. The sevenfold Spirit (v.2) is the foundation for the seven gifts of the Holy Spirit.",
    },
    ntFulfillment: {
      reference: "Matthew 1:6; Romans 15:12; Acts 13:22-23; Revelation 5:5; Revelation 22:16",
      text: "Jesus is 'the root and offspring of David' (Rev 22:16). Paul quotes Isaiah 11:10: 'The root of Jesse shall come, he who rises to rule the Gentiles; in him shall the Gentiles hope' (Rom 15:12).",
    },
    aquinasReferences: [
      "ST I-II, q.68, a.4 — the seven gifts of the Holy Spirit from Isaiah 11:2",
      "Super Isaiam cap. 11 — the branch and the seven spirits",
    ],
    apologeticSignificance:
      "The 'stump' detail is significant — the Messiah comes when the Davidic dynasty appears dead, not at its height. This matches Jesus's birth: the Davidic line had no political power, yet Jesus emerged from it. The seven gifts of the Spirit (wisdom, understanding, counsel, fortitude, knowledge, piety, fear of the Lord) come from Isaiah 11:2 and are confirmed by the Church as gifts received in Confirmation.",
  },
  {
    id: "righteous-branch-jeremiah",
    title: "The Righteous Branch — The LORD Our Righteousness",
    category: "nature-identity",
    otSource: {
      reference: "Jeremiah 23:5-6",
      text: "Behold, the days are coming, says the LORD, when I will raise up for David a righteous Branch, and he shall reign as king and deal wisely, and shall execute justice and righteousness in the land. In his days Judah will be saved, and Israel will dwell securely. And this is the name by which he will be called: 'The LORD is our righteousness' (YHWH Tsidkenu).",
      context:
        "Jeremiah, writing c. 600 BC during the collapse of the Davidic monarchy, prophesies a future righteous king from David's line. The extraordinary claim: this king will be called YHWH Tsidkenu — bearing the divine name YHWH.",
    },
    ntFulfillment: {
      reference: "1 Corinthians 1:30; Romans 3:21-26; 2 Corinthians 5:21",
      text: "Christ 'became to us wisdom from God, righteousness and sanctification and redemption' (1 Cor 1:30). 'God made him who had no sin to be sin for us, so that in him we might become the righteousness of God' (2 Cor 5:21).",
    },
    aquinasReferences: [
      "ST III, q.31, a.2 — Christ as the branch of David",
    ],
    apologeticSignificance:
      "The Messiah bears the divine name YHWH — this is a direct claim to divinity embedded in the OT. Against the Arian claim that Christ is a creature: Jeremiah says the Davidic king IS called 'the LORD our righteousness.' Against the liberal claim that divinity was a later development: the divinity of the Messiah is prophesied in the OT itself.",
  },
  // =========================================================================
  // PSALMS — PASSION PROPHECIES
  // =========================================================================
  {
    id: "psalm16-resurrection",
    title: "Body Will Not See Corruption — Psalm 16",
    category: "resurrection-exaltation",
    otSource: {
      reference: "Psalm 16:8-11",
      text: "You will not abandon my soul to Sheol, or let your Holy One see corruption. You will show me the path of life; in your presence there is fullness of joy.",
      context:
        "David speaks of one whose body will not decay in the grave. David himself died and his tomb remained in Jerusalem (Acts 2:29), so the psalm transcends David and points to another.",
    },
    ntFulfillment: {
      reference: "Acts 2:25-32; Acts 13:35-37",
      text: "Peter's Pentecost sermon: 'David... both died and was buried, and his tomb is with us to this day... He foresaw and spoke of the resurrection of the Christ, that he was not abandoned to Hades, nor did his flesh see corruption' (Acts 2:29-31). Paul makes the same argument in Acts 13:36-37.",
    },
    aquinasReferences: [
      "ST III, q.51, a.3 — Christ's body did not see corruption",
      "In Psalmos, Psalm 16",
    ],
    apologeticSignificance:
      "Peter's argument is logically tight: David died and decayed (we can visit his tomb), so Psalm 16 cannot refer to David himself — it must refer to David's descendant, the Messiah, whose body would not decay because He would be raised from the dead. This is one of the earliest Christian arguments for the Resurrection, presented by Peter at Pentecost to thousands of Jews who could verify that David's tomb was indeed still present.",
  },
  {
    id: "psalm22-crucifixion",
    title: "The Crucifixion Psalm — Psalm 22",
    category: "passion-death",
    otSource: {
      reference: "Psalm 22:1-31",
      text: "'My God, my God, why have you forsaken me?' (v.1). 'All who see me mock me; they hurl insults, shaking their heads: He trusts in the LORD; let the LORD rescue him' (vv.7-8). 'They have pierced my hands and my feet' (v.16). 'They divide my garments among them, and for my clothing they cast lots' (v.18). 'All the ends of the earth shall remember and turn to the LORD' (v.27).",
      context:
        "Written by David c. 1000 BC, approximately 800 years before crucifixion was invented by the Persians/Romans. Crucifixion was unknown in Israel. Yet the psalm describes piercing of hands and feet, the exact method of execution that would be used on Jesus. The psalm also describes mockery, gambling for clothes, and extreme thirst — all fulfilled at Calvary.",
    },
    ntFulfillment: {
      reference:
        "Matthew 27:35-46; Mark 15:24-34; Luke 23:34-35; John 19:23-24, 28; John 20:25",
      text: "Jesus cries 'My God, my God, why have you forsaken me?' from the cross (Matt 27:46). The soldiers divide His garments and cast lots (John 19:23-24). The crowd mocks Him: 'He trusts in God; let God deliver him' (Matt 27:43). His hands and feet are pierced by nails (John 20:25).",
    },
    aquinasReferences: [
      "ST III, q.46, a.5-6 — the sufferings described in Psalm 22",
      "ST III, q.47, a.2 — Christ's cry from the cross",
      "In Psalmos, Psalm 22 — detailed commentary",
    ],
    apologeticSignificance:
      "Psalm 22 is the single most detailed prophecy of the crucifixion, written centuries before crucifixion existed as a form of execution. Key details: (1) pierced hands and feet — crucifixion (v.16), (2) garments divided, lots cast — fulfilled exactly (John 19:23-24), (3) mocked with the specific words used at Calvary (vv.7-8 → Matt 27:43), (4) bones out of joint (v.14) — dislocated by suspension, (5) 'I can count all my bones' (v.17) — stretched on the cross, (6) extreme thirst (v.15) — 'I thirst' (John 19:28). The psalm also ends in triumph (vv.22-31), not despair — matching the Resurrection. The Hebrew 'ka'ari' ('like a lion' or 'they pierced' — textual variants exist) in v.16 is debated, but the Septuagint (pre-Christian Jewish translation) reads 'oryxan' = 'they pierced.'",
  },
  {
    id: "psalm45-divine-king",
    title: "The Divine King and His Bride — Psalm 45",
    category: "nature-identity",
    otSource: {
      reference: "Psalm 45:1-17",
      text: "'Your throne, O God, is for ever and ever. The scepter of your kingdom is a scepter of righteousness' (v.6). 'At your right hand stands the queen in gold of Ophir' (v.9).",
      context:
        "A royal wedding psalm that addresses the king as 'God' (Elohim). The queen at his right hand becomes the basis for Mary's queenship.",
    },
    ntFulfillment: {
      reference: "Hebrews 1:8-9; Ephesians 5:25-32; Revelation 19:7-8",
      text: "Hebrews applies Psalm 45:6-7 directly to Christ: 'Of the Son he says, Your throne, O God, is for ever and ever' (Heb 1:8). The Church is the bride (Eph 5:25-32, Rev 19:7).",
    },
    aquinasReferences: [
      "ST I, q.31, a.4 — the Son addressed as God",
      "In Heb. cap. 1, lect. 5 — 'Your throne, O God'",
      "In Psalmos, Psalm 45",
    ],
    apologeticSignificance:
      "Hebrews 1:8 is devastating for Arian Christology: the Father Himself addresses the Son as 'God.' JW translations attempt 'God is your throne' or 'your throne is God's throne,' but these are grammatically forced. The queen at the king's right hand supports Mary as Queen Mother. The nuptial imagery supports the Catholic understanding of the Eucharist as the wedding feast.",
  },
  {
    id: "psalm69-suffering",
    title: "Suffering for God's House — Psalm 69",
    category: "passion-death",
    otSource: {
      reference: "Psalm 69:1-36",
      text: "'Zeal for your house has consumed me' (v.9). 'They gave me poison (gall) for food, and for my thirst they gave me vinegar to drink' (v.21). 'I am become a stranger to my brethren, an alien to my mother's sons' (v.8).",
      context:
        "A psalm of suffering and rejection. The sufferer is zealous for God's house, rejected by his own people, and given vinegar to drink.",
    },
    ntFulfillment: {
      reference: "John 2:17; John 15:25; John 19:28-30; Matthew 27:34, 48; Romans 15:3",
      text: "Jesus cleanses the Temple and the disciples remember: 'Zeal for your house will consume me' (John 2:17, citing Ps 69:9). On the cross, Jesus is given vinegar (John 19:29, fulfilling Ps 69:21).",
    },
    aquinasReferences: [
      "ST III, q.46, a.5 — details of Christ's passion",
      "In Psalmos, Psalm 69",
    ],
    apologeticSignificance:
      "The detail of vinegar given during suffering is remarkably specific. John explicitly notes that Jesus said 'I thirst' to fulfill Scripture (John 19:28) — referring to Psalm 69:21. This is a detail no one could have stage-managed.",
  },
  {
    id: "psalm72-universal-king",
    title: "The Universal King — Psalm 72",
    category: "nature-identity",
    otSource: {
      reference: "Psalm 72:1-20",
      text: "'May he have dominion from sea to sea, and from the River to the ends of the earth' (v.8). 'May all kings fall down before him, all nations serve him' (v.11). 'May his name endure for ever, his fame continue as long as the sun' (v.17).",
      context:
        "Written for Solomon's reign but describing a king whose dominion is universal, eternal, and beyond any earthly monarch. All nations worship him; his name endures forever.",
    },
    ntFulfillment: {
      reference: "Matthew 2:1-12; Philippians 2:9-11; Revelation 11:15",
      text: "The Magi (representing all nations) fall down before the infant Jesus (Matt 2:11). 'At the name of Jesus every knee should bow' (Phil 2:10). 'The kingdom of the world has become the kingdom of our Lord and of his Christ' (Rev 11:15).",
    },
    aquinasReferences: [
      "In Psalmos, Psalm 72",
    ],
    apologeticSignificance:
      "No earthly king, including Solomon, has achieved universal and eternal dominion. The psalm can only be fulfilled by a divine king. The Magi's visit fulfills the 'all kings shall fall down before him' — and the ongoing spread of Christianity fulfills 'all nations serve him.'",
  },
  {
    id: "psalm118-rejected-stone",
    title: "The Rejected Stone — Psalm 118",
    category: "passion-death",
    otSource: {
      reference: "Psalm 118:22-23",
      text: "The stone which the builders rejected has become the cornerstone. This is the LORD's doing; it is marvelous in our eyes.",
      context:
        "A processional psalm for the Temple. The image of a rejected stone becoming the most important stone in the building.",
    },
    ntFulfillment: {
      reference: "Matthew 21:42; Mark 12:10-11; Luke 20:17; Acts 4:11; 1 Peter 2:4-7; Ephesians 2:20",
      text: "Jesus applies this to Himself after the parable of the wicked tenants (Matt 21:42). Peter preaches: 'This is the stone which was rejected by you builders, but which has become the cornerstone' (Acts 4:11).",
    },
    aquinasReferences: [
      "ST III, q.46, a.3 — Christ rejected by His own",
      "In Matt. cap. 21 — the rejected stone",
    ],
    apologeticSignificance:
      "Jesus claims to be the cornerstone — the foundational stone of God's building (the Church). His rejection by the Jewish leaders fulfills the prophecy. The image implies the Church is built on Christ (and on Peter as the visible foundation, Eph 2:20). Against Protestantism: the cornerstone is the foundation of a BUILDING — a visible, structured institution, not an invisible collection of individuals.",
  },
  // =========================================================================
  // SERVANT SONGS AND PASSION
  // =========================================================================
  {
    id: "isaiah42-servant",
    title: "First Servant Song — Gentle Servant",
    category: "ministry",
    otSource: {
      reference: "Isaiah 42:1-9",
      text: "'Behold my servant, whom I uphold, my chosen, in whom my soul delights; I have put my Spirit upon him, he will bring forth justice to the nations. He will not cry or lift up his voice, or make it heard in the street; a bruised reed he will not break, and a dimly burning wick he will not quench.' (vv.1-3).",
      context:
        "The first of four Servant Songs in Isaiah (42, 49, 50, 52-53). The servant is gentle, Spirit-filled, and brings justice to the nations — not by force but by meekness.",
    },
    ntFulfillment: {
      reference: "Matthew 3:16-17; Matthew 12:15-21",
      text: "Matthew explicitly quotes Isaiah 42:1-4 and applies it to Jesus's gentle ministry of healing (Matt 12:17-21). At Jesus's baptism: 'This is my beloved Son, in whom I am well pleased' (Matt 3:17) echoes Isaiah 42:1.",
    },
    aquinasReferences: [
      "ST III, q.42, a.1-4 — Christ's manner of teaching and ministry",
      "Super Isaiam cap. 42",
    ],
    apologeticSignificance:
      "The Messiah's gentleness is prophesied — against the expectation of a military conqueror. Jesus fulfills the Servant Songs precisely because He does NOT overthrow Rome by force. The early Jewish expectation of a warrior-Messiah was based on other prophecies (which will be fulfilled at the Second Coming); the Suffering Servant prophecies are fulfilled at the First Coming.",
  },
  {
    id: "isaiah49-servant",
    title: "Second Servant Song — Light to the Nations",
    category: "ministry",
    otSource: {
      reference: "Isaiah 49:1-7",
      text: "'The LORD called me from the womb... He said to me, You are my servant, Israel, in whom I will be glorified... I will give you as a light to the nations, that my salvation may reach to the end of the earth' (vv.1, 3, 6).",
      context:
        "The Servant is called 'Israel' (v.3) yet distinguished from Israel (v.5: 'to bring Jacob back to him'). He is a light to all nations — his mission is universal.",
    },
    ntFulfillment: {
      reference: "Luke 2:32; Acts 13:47; Acts 26:23",
      text: "Simeon calls Jesus 'a light for revelation to the Gentiles' (Luke 2:32). Paul and Barnabas quote Isaiah 49:6 to justify their mission to the Gentiles (Acts 13:47).",
    },
    aquinasReferences: [
      "Super Isaiam cap. 49",
    ],
    apologeticSignificance:
      "The Servant is both identified with Israel (v.3) and distinct from Israel (v.5) — Jesus is the true Israel, the faithful remnant of one, who accomplishes what the nation could not. The universal mission ('light to the nations, salvation to the ends of the earth') cannot apply to the nation of Israel, which was not a light to all nations in the same sense.",
  },
  {
    id: "isaiah50-servant",
    title: "Third Servant Song — The Obedient Sufferer",
    category: "passion-death",
    otSource: {
      reference: "Isaiah 50:4-9",
      text: "'I gave my back to the smiters, and my cheeks to those who pulled out the beard; I hid not my face from shame and spitting' (v.6).",
      context:
        "The Servant willingly submits to abuse — beaten, beard pulled, spat upon. He trusts that God will vindicate him.",
    },
    ntFulfillment: {
      reference: "Matthew 26:67; Matthew 27:30; Mark 14:65; Mark 15:19",
      text: "'They spat in his face, and struck him; and some slapped him' (Matt 26:67). 'They spat upon him, and took the reed and struck him on the head' (Matt 27:30).",
    },
    aquinasReferences: [
      "ST III, q.46, a.5 — the specific sufferings of Christ's passion",
      "Super Isaiam cap. 50",
    ],
    apologeticSignificance:
      "The details — spitting, striking, pulling the beard — match the Gospel passion narratives precisely. Written 700 years before the events. The voluntary nature of the suffering ('I gave my back') matches Jesus's statement: 'No one takes my life from me; I lay it down of my own accord' (John 10:18).",
  },
  {
    id: "isaiah53-suffering-servant",
    title: "Fourth Servant Song — The Suffering Servant",
    category: "passion-death",
    otSource: {
      reference: "Isaiah 52:13-53:12",
      text: "'He was despised and rejected by men; a man of sorrows, and acquainted with grief' (53:3). 'He was wounded for our transgressions, he was bruised for our iniquities; upon him was the chastisement that made us whole, and with his stripes we are healed' (53:5). 'Like a lamb that is led to the slaughter, and like a sheep that before its shearers is dumb, so he opened not his mouth' (53:7). 'He was cut off out of the land of the living, stricken for the transgression of my people' (53:8). 'They made his grave with the wicked and with a rich man in his death' (53:9). 'He bore the sin of many, and made intercession for the transgressors' (53:12).",
      context:
        "The most detailed and profound messianic prophecy in the OT. Written c. 700 BC. Describes a figure who: (1) is despised and rejected, (2) suffers vicariously for the sins of others, (3) is silent before his accusers, (4) is killed, (5) is buried with the rich, (6) is ultimately vindicated and exalted. The fourth Servant Song is the theological heart of the OT.",
    },
    ntFulfillment: {
      reference:
        "Acts 8:32-35; 1 Peter 2:22-25; Matthew 8:17; Mark 15:27-28; Luke 23:32-34; John 1:29; Romans 4:25; Philippians 2:7-8",
      text: "The Ethiopian eunuch reads Isaiah 53 and Philip explains it as referring to Jesus (Acts 8:32-35). Jesus is silent before Pilate (Matt 27:14, fulfilling 53:7). Buried in a rich man's tomb (Joseph of Arimathea, Matt 27:57-60, fulfilling 53:9). Numbered with transgressors (crucified between two thieves, Mark 15:27-28, fulfilling 53:12). Intercedes for sinners: 'Father, forgive them' (Luke 23:34, fulfilling 53:12).",
    },
    aquinasReferences: [
      "ST III, q.46, a.1-12 — the passion of Christ",
      "ST III, q.48, a.1-6 — the effects of Christ's passion (satisfaction, merit, sacrifice, redemption, efficient cause)",
      "Super Isaiam cap. 52-53 — Aquinas's full commentary on the Suffering Servant",
    ],
    apologeticSignificance:
      "Isaiah 53 is the single most important apologetic text in the entire OT. Point-by-point fulfillment: despised/rejected (Matt 27:22-23), silent before accusers (Matt 27:12-14), wounds heal us (1 Pet 2:24), lamb to slaughter (John 1:29), grave with the wicked AND the rich (crucified with criminals, buried in rich man's tomb — both in one event), intercession for transgressors (Luke 23:34). Jewish responses: (1) the Servant is Israel collectively — but the text distinguishes the Servant from 'my people' (53:8), and Israel is never described as sinless or silent under suffering. (2) Rabbi interpretation shifted after Christianity arose; the pre-Christian Targum Jonathan on Isaiah applied 52:13 to the Messiah. (3) The Dead Sea Scrolls confirm the pre-Christian text matches our manuscripts.",
  },
  // =========================================================================
  // MORE SPECIFIC PROPHECIES
  // =========================================================================
  {
    id: "new-covenant-jeremiah",
    title: "The New Covenant",
    category: "covenant-kingdom",
    otSource: {
      reference: "Jeremiah 31:31-34",
      text: "'Behold, the days are coming, says the LORD, when I will make a new covenant with the house of Israel and the house of Judah, not like the covenant which I made with their fathers when I took them by the hand to bring them out of the land of Egypt, my covenant which they broke... I will put my law within them, and I will write it upon their hearts; and I will be their God, and they shall be my people... I will forgive their iniquity, and I will remember their sin no more.'",
      context:
        "Jeremiah, writing c. 600 BC during the Babylonian crisis, prophesies a NEW covenant distinct from the Mosaic covenant. This new covenant will be interior (written on the heart), universal ('they shall all know me'), and will involve forgiveness of sins.",
    },
    ntFulfillment: {
      reference: "Luke 22:20; 1 Corinthians 11:25; Hebrews 8:6-13; Hebrews 9:15; 2 Corinthians 3:3-6",
      text: "Jesus at the Last Supper: 'This cup is the new covenant in my blood' (Luke 22:20, 1 Cor 11:25). Hebrews 8:8-12 quotes Jeremiah 31:31-34 in full and declares: 'In speaking of a new covenant he treats the first as obsolete' (Heb 8:13).",
    },
    aquinasReferences: [
      "ST I-II, q.106-108 — the New Law",
      "ST III, q.61, a.4 — the New Covenant and the sacraments",
      "In Heb. cap. 8, lect. 2-3 — commentary on Jeremiah 31 in Hebrews",
    ],
    apologeticSignificance:
      "This prophecy is devastating for the position that the Mosaic covenant is still in force. God Himself says He will make a NEW covenant 'not like' the old one. Jesus explicitly claims to inaugurate this new covenant at the Last Supper. The new covenant is: (1) interior — grace, not merely external law, (2) universal — 'all shall know me,' not just Israel, (3) forgiving — 'I will remember their sin no more' — pointing to the sacrament of Reconciliation. Against Judaism: the prophet Jeremiah himself says the Mosaic covenant will be superseded.",
  },
  {
    id: "good-shepherd-ezekiel",
    title: "God Himself as the Good Shepherd",
    category: "nature-identity",
    otSource: {
      reference: "Ezekiel 34:11-16, 23-24",
      text: "'For thus says the Lord GOD: Behold, I, I myself will search for my sheep, and will seek them out... I will rescue them... I will feed them... And I will set up over them one shepherd, my servant David, and he shall feed them' (vv.11-12, 23).",
      context:
        "God declares that because Israel's human shepherds (leaders) have failed, HE HIMSELF will come to shepherd His people — and He will do this through 'my servant David' (a future Davidic king). God shepherding personally AND through a Davidic king implies the Davidic Messiah IS God.",
    },
    ntFulfillment: {
      reference: "John 10:11-18; Matthew 18:12-14; Luke 15:3-7; 1 Peter 2:25; Hebrews 13:20",
      text: "'I am the good shepherd. The good shepherd lays down his life for the sheep' (John 10:11). Jesus is 'the great shepherd of the sheep' (Heb 13:20). By claiming to be the Good Shepherd, Jesus claims to be the God of Ezekiel 34.",
    },
    aquinasReferences: [
      "ST III, q.8, a.1 — Christ as head of the Church",
      "In Joan. cap. 10, lect. 3 — the Good Shepherd discourse",
    ],
    apologeticSignificance:
      "Ezekiel 34 says GOD will be the shepherd. Jesus says HE is the Good Shepherd. Therefore Jesus claims to be God. This is one of the clearest implicit divinity claims in the Gospels, often missed because people do not know the OT background. Against the claim that Jesus never claimed to be God: His Jewish audience would have recognized the Ezekiel 34 allusion immediately.",
  },
  {
    id: "daniel7-son-of-man",
    title: "The Son of Man Coming on the Clouds — Daniel 7",
    category: "nature-identity",
    otSource: {
      reference: "Daniel 7:13-14",
      text: "'I saw in the night visions, and behold, with the clouds of heaven there came one like a son of man, and he came to the Ancient of Days and was presented before him. And to him was given dominion and glory and kingdom, that all peoples, nations, and languages should serve him; his dominion is an everlasting dominion, which shall not pass away, and his kingdom one that shall not be destroyed.'",
      context:
        "Written c. 550 BC. A divine figure ('one like a son of man') approaches God ('Ancient of Days') and receives universal, everlasting dominion. 'Coming on the clouds' is a divine attribute in the OT — God rides the clouds (Ps 68:4, 104:3, Is 19:1). The 'son of man' figure has both human ('son of man') and divine (cloud-riding, everlasting dominion, universal worship) characteristics.",
    },
    ntFulfillment: {
      reference: "Matthew 26:63-66; Mark 14:61-64; Acts 7:56; Revelation 1:7, 13-16; Matthew 24:30",
      text: "Jesus's most common self-designation is 'Son of Man.' At His trial: 'You will see the Son of Man seated at the right hand of Power, and coming on the clouds of heaven' (Matt 26:64). The high priest tears his robes and charges blasphemy — because Jesus has applied Daniel 7:13 to Himself, claiming to be the divine figure who receives universal worship.",
    },
    aquinasReferences: [
      "ST III, q.58, a.2 — Christ's sitting at the right hand",
      "ST III, q.59, a.1-2 — Christ's judiciary power (from Dan 7:14)",
      "In Matt. cap. 26 — the trial and Daniel 7:13",
    ],
    apologeticSignificance:
      "Daniel 7:13-14 is the key to understanding Jesus's 'Son of Man' title. It is NOT a humble self-designation — it is a claim to be the divine figure who receives universal dominion. The high priest understood this immediately: when Jesus said 'You will see the Son of Man coming on the clouds,' the high priest charged blasphemy. He was not reacting to the phrase 'son of man' generically but to the claim to be Daniel's divine Son of Man. Against JWs who claim Jesus is Michael the archangel: the Son of Man receives worship from all peoples and nations — worship due only to God.",
  },
  {
    id: "daniel9-seventy-weeks",
    title: "The Seventy Weeks — Timing of the Messiah",
    category: "covenant-kingdom",
    otSource: {
      reference: "Daniel 9:24-27",
      text: "'Seventy weeks of years are decreed concerning your people and your holy city, to finish the transgression, to put an end to sin, and to atone for iniquity, to bring in everlasting righteousness, to seal both vision and prophet, and to anoint a most holy place. Know therefore and understand that from the going forth of the word to restore and build Jerusalem to the coming of an anointed one, a prince, there shall be seven weeks. Then for sixty-two weeks it shall be built again... And after the sixty-two weeks, an anointed one shall be cut off, and shall have nothing.'",
      context:
        "The 'seventy weeks' (literally 'seventy sevens,' i.e., 490 years) provide a chronological framework for the Messiah's coming. The decree to rebuild Jerusalem was issued by Artaxerxes I in 457 BC (Ezra 7) or 444 BC (Nehemiah 2). 69 weeks (483 years) from this decree reaches the time of Jesus's public ministry. The Messiah will be 'cut off' (killed) and then the city and sanctuary will be destroyed — the Temple was destroyed in AD 70.",
    },
    ntFulfillment: {
      reference: "Luke 3:1 (timing of Jesus's ministry); Luke 19:41-44 (prediction of Jerusalem's destruction); Mark 13:2",
      text: "Jesus begins His public ministry c. AD 27-30, within the timeframe of the 69th week. He is 'cut off' (crucified) c. AD 30-33. Jerusalem and the Temple are destroyed in AD 70, exactly as Daniel predicted would follow the Messiah's death.",
    },
    aquinasReferences: [
      "ST III, q.46, a.9 — the timing of Christ's passion",
      "In Dan. cap. 9 — commentary on the seventy weeks (attributed, possibly by a student)",
    ],
    apologeticSignificance:
      "Daniel 9 provides a TIMELINE for the Messiah. The Messiah must come and be 'cut off' BEFORE the destruction of the Temple in AD 70. Since the Temple was destroyed in AD 70, the Messiah must have come before that date. This eliminates all post-70 AD messianic candidates. The calculation: 69 'weeks' = 483 years. From the decree to rebuild Jerusalem (c. 457 BC or 444 BC) + 483 years = c. AD 26-39 — precisely the time of Jesus's ministry and crucifixion. Against modern Judaism: if the Messiah has not come before AD 70, Daniel's prophecy has failed — but Jews believe Daniel is divinely inspired.",
  },
  {
    id: "zechariah-entry-jerusalem",
    title: "The King Enters Jerusalem on a Donkey",
    category: "ministry",
    otSource: {
      reference: "Zechariah 9:9",
      text: "Rejoice greatly, O daughter of Zion! Shout aloud, O daughter of Jerusalem! Lo, your king comes to you; triumphant and victorious is he, humble and riding on a donkey, on a colt the foal of a donkey.",
      context:
        "A king who is simultaneously triumphant and humble — a paradox. Kings ride horses in war; donkeys signify peace. The Messiah comes as a peaceful king.",
    },
    ntFulfillment: {
      reference: "Matthew 21:1-11; Mark 11:1-10; Luke 19:28-40; John 12:12-16",
      text: "Jesus deliberately arranges to enter Jerusalem on a donkey. Matthew explicitly notes: 'This took place to fulfill what was spoken by the prophet' (Matt 21:4). The crowds shout 'Hosanna to the Son of David!' — recognizing the messianic entry.",
    },
    aquinasReferences: [
      "ST III, q.36, a.4 — Christ's entry into Jerusalem",
      "In Matt. cap. 21 — the triumphal entry",
    ],
    apologeticSignificance:
      "Jesus deliberately fulfills this prophecy — He sends disciples to find a donkey (Matt 21:2). The skeptic might say Jesus manufactured the fulfillment, but this only proves He understood Himself as the Messiah. More importantly, the crowd's response shows they recognized the messianic significance. The detail of a 'colt, the foal of a donkey' is precisely fulfilled.",
  },
  {
    id: "zechariah-thirty-pieces",
    title: "Betrayed for Thirty Pieces of Silver",
    category: "passion-death",
    otSource: {
      reference: "Zechariah 11:12-13",
      text: "'Then I said to them, If it seems right to you, give me my wages; but if not, keep them. And they weighed out as my wages thirty shekels of silver. Then the LORD said to me, Cast it to the potter — the lordly price at which I was valued by them. So I took the thirty shekels of silver and cast them into the house of the LORD, to the potter.'",
      context:
        "Zechariah describes a shepherd-figure rejected by the flock, valued at the insulting price of thirty silver shekels (the price of a slave, Ex 21:32). The silver is thrown into the Temple and goes to a potter.",
    },
    ntFulfillment: {
      reference: "Matthew 26:14-16; Matthew 27:3-10",
      text: "Judas agrees to betray Jesus for 'thirty pieces of silver' (Matt 26:15). After the betrayal, Judas returns the silver to the Temple (Matt 27:5), and the priests use it to buy the potter's field (Matt 27:7). Matthew explicitly cites this as fulfillment of prophecy (Matt 27:9-10).",
    },
    aquinasReferences: [
      "ST III, q.46, a.5 ad 2 — the thirty pieces of silver",
      "In Matt. cap. 27 — Judas's betrayal and the potter's field",
    ],
    apologeticSignificance:
      "Three details fulfilled: (1) the exact price — 30 pieces of silver, (2) the money thrown into the Temple, (3) the money going to a potter (the potter's field purchased for burial). Judas could not have known or controlled these details. The convergence of three specific elements in one event is strong evidence of prophetic fulfillment.",
  },
  {
    id: "zechariah-pierced",
    title: "They Shall Look on Him Whom They Have Pierced",
    category: "passion-death",
    otSource: {
      reference: "Zechariah 12:10",
      text: "And I will pour out on the house of David and the inhabitants of Jerusalem a spirit of compassion and supplication, so that, when they look on me whom they have pierced, they shall mourn for him, as one mourns for an only child.",
      context:
        "God (speaking in the first person: 'me') says He will be pierced. The shift from 'me' to 'him' is mysterious — God is pierced, and they mourn for 'him' as for an only son. This implies a divine figure who is pierced.",
    },
    ntFulfillment: {
      reference: "John 19:34-37; Revelation 1:7",
      text: "John explicitly cites Zechariah 12:10 when the soldier pierces Jesus's side: 'They shall look on him whom they have pierced' (John 19:37). Revelation 1:7: 'Every eye will see him, every one who pierced him.'",
    },
    aquinasReferences: [
      "ST III, q.46, a.5 — the piercing of Christ's side",
      "In Joan. cap. 19, lect. 5 — Zechariah 12:10 fulfilled",
    ],
    apologeticSignificance:
      "God says 'they will look on ME whom they have pierced.' God is pierced — and they mourn for 'him' as an only son. The first person 'me' implies divine identity; the third person 'him' and the mourning for an 'only son' imply a human death. This is one of the clearest OT hints of the Incarnation: God takes flesh and is pierced. Zechariah could not have known about crucifixion or lance-piercing.",
  },
  {
    id: "zechariah-shepherd-struck",
    title: "Strike the Shepherd, Scatter the Sheep",
    category: "passion-death",
    otSource: {
      reference: "Zechariah 13:7",
      text: "'Awake, O sword, against my shepherd, against the man who stands next to me,' says the LORD of hosts. 'Strike the shepherd, that the sheep may be scattered.'",
      context:
        "God calls the shepherd 'the man who stands next to me' (amiti — 'my associate, my equal'). When the shepherd is struck, the flock scatters.",
    },
    ntFulfillment: {
      reference: "Matthew 26:31; Mark 14:27",
      text: "Jesus quotes this prophecy on the way to Gethsemane: 'You will all fall away because of me this night; for it is written, I will strike the shepherd, and the sheep of the flock will be scattered' (Matt 26:31).",
    },
    aquinasReferences: [
      "ST III, q.46, a.6 — the scattering of the disciples",
      "In Matt. cap. 26 — Zechariah 13:7 at Gethsemane",
    ],
    apologeticSignificance:
      "The shepherd is called God's 'associate' or 'equal' (amiti) — the Hebrew implies a peer of God. When this shepherd is struck, the flock scatters — exactly what happened when Jesus was arrested and the disciples fled (Matt 26:56). Jesus identifies Himself as this shepherd-equal-of-God.",
  },
  {
    id: "malachi-messenger",
    title: "The Messenger Who Prepares the Way",
    category: "ministry",
    otSource: {
      reference: "Malachi 3:1",
      text: "'Behold, I send my messenger to prepare the way before me, and the Lord whom you seek will suddenly come to his temple; the messenger of the covenant in whom you delight, behold, he is coming, says the LORD of hosts.'",
      context:
        "God says: (1) I will send a messenger to prepare the way before ME, (2) then the Lord (Adon) will suddenly come to HIS temple. If the messenger prepares the way before God, and then the Lord comes to the temple — the Lord who comes IS God. Two figures: a forerunner and the Lord Himself.",
    },
    ntFulfillment: {
      reference: "Matthew 11:10; Mark 1:2; Luke 7:27",
      text: "Jesus applies Malachi 3:1 to John the Baptist as the forerunner and to Himself as the Lord who comes: 'This is he of whom it is written, Behold, I send my messenger before thy face, who shall prepare thy way before thee' (Matt 11:10).",
    },
    aquinasReferences: [
      "ST III, q.38, a.1 — John the Baptist as forerunner",
      "In Matt. cap. 11, lect. 2 — Malachi 3:1 applied to John and Jesus",
    ],
    apologeticSignificance:
      "Malachi says the messenger prepares the way before GOD ('before me'). Jesus says John prepares the way before HIM. Therefore Jesus identifies Himself as the God of Malachi 3:1. This is an implicit divinity claim embedded in Jesus's identification of John the Baptist.",
  },
  {
    id: "malachi-elijah-return",
    title: "The Return of Elijah Before the Day of the Lord",
    category: "ministry",
    otSource: {
      reference: "Malachi 4:5-6",
      text: "'Behold, I will send you Elijah the prophet before the great and terrible day of the LORD comes. And he will turn the hearts of fathers to their children and the hearts of children to their fathers, lest I come and smite the land with a curse.'",
      context:
        "The final prophecy of the OT. The last word of the prophets is the promise of Elijah returning before the Messiah.",
    },
    ntFulfillment: {
      reference: "Matthew 11:14; Matthew 17:10-13; Luke 1:17",
      text: "Jesus says of John the Baptist: 'If you are willing to accept it, he is Elijah who is to come' (Matt 11:14). The angel Gabriel tells Zechariah that John will go before the Lord 'in the spirit and power of Elijah, to turn the hearts of the fathers to the children' (Luke 1:17, directly citing Malachi 4:6).",
    },
    aquinasReferences: [
      "ST III, q.38, a.1-2 — John the Baptist in the spirit of Elijah",
    ],
    apologeticSignificance:
      "The OT ends with the expectation of Elijah. The NT opens with John the Baptist, whom Jesus identifies as the fulfillment of that expectation. The bridge between the Testaments is Malachi 4 → Matthew 3. Against the claim that the OT and NT are disconnected: the very last promise of the OT is fulfilled in the very first events of the NT.",
  },
  {
    id: "daniel2-kingdom",
    title: "The Everlasting Kingdom — Daniel 2",
    category: "covenant-kingdom",
    otSource: {
      reference: "Daniel 2:44",
      text: "'And in the days of those kings the God of heaven will set up a kingdom which shall never be destroyed, nor shall its sovereignty be left to another people. It shall break in pieces all these kingdoms and bring them to an end, and it shall stand for ever.'",
      context:
        "Nebuchadnezzar's dream of a statue with four kingdoms (Babylon, Persia, Greece, Rome). During the fourth kingdom (Rome), God establishes an eternal kingdom. The stone 'cut without hands' (supernatural origin) becomes a mountain filling the earth.",
    },
    ntFulfillment: {
      reference: "Luke 1:33; Mark 1:15; Matthew 13:31-33; Colossians 1:13",
      text: "Jesus's kingdom is established during the Roman Empire. 'The kingdom of God is at hand' (Mark 1:15). The kingdom grows like a mustard seed and like leaven — from small beginnings to filling the whole earth (Matt 13:31-33). 'Of his kingdom there will be no end' (Luke 1:33).",
    },
    aquinasReferences: [
      "ST III, q.34, a.3 — the supernatural origin of Christ's kingdom",
    ],
    apologeticSignificance:
      "Daniel prophesied that God's kingdom would be established during the Roman Empire — exactly when Christ came. The kingdom is described as (1) eternal, (2) growing to fill the earth, (3) indestructible. This matches the Catholic Church: 2000 years, all continents, survived every persecution. No other institution from the Roman period still exists. Against Protestantism: the kingdom cannot be invisible — it fills the earth visibly, like a mountain.",
  },
  {
    id: "hosea-resurrection",
    title: "Raised on the Third Day — Hosea 6",
    category: "resurrection-exaltation",
    otSource: {
      reference: "Hosea 6:2",
      text: "After two days he will revive us; on the third day he will raise us up, that we may live before him.",
      context:
        "While Hosea's primary context is Israel's restoration, the early Church saw a type of Christ's resurrection on the third day.",
    },
    ntFulfillment: {
      reference: "1 Corinthians 15:4; Luke 24:46",
      text: "Paul says Christ 'was raised on the third day in accordance with the scriptures' (1 Cor 15:4). Jesus says: 'Thus it is written, that the Christ should suffer and on the third day rise from the dead' (Luke 24:46).",
    },
    aquinasReferences: [
      "ST III, q.53, a.2 — the third day as the fitting time for the Resurrection",
    ],
    apologeticSignificance:
      "When Jesus and Paul say the Resurrection happened 'according to the scriptures,' they refer to passages like Hosea 6:2 and Jonah 1:17. The 'third day' motif runs throughout Scripture: Isaac was 'returned' to Abraham on the third day (Gen 22:4), Joseph freed his brothers on the third day (Gen 42:18), the Temple would be raised in three days (John 2:19).",
  },
  {
    id: "isaiah61-anointed",
    title: "The Spirit of the Lord Is Upon Me — Isaiah 61",
    category: "ministry",
    otSource: {
      reference: "Isaiah 61:1-3",
      text: "'The Spirit of the Lord GOD is upon me, because the LORD has anointed me to bring good tidings to the afflicted; he has sent me to bind up the brokenhearted, to proclaim liberty to the captives, and the opening of the prison to those who are bound; to proclaim the year of the LORD's favor.'",
      context:
        "A prophetic figure anointed with the Spirit for a mission of liberation, healing, and jubilee.",
    },
    ntFulfillment: {
      reference: "Luke 4:16-21",
      text: "Jesus reads Isaiah 61:1-2 in the synagogue at Nazareth and declares: 'Today this scripture has been fulfilled in your hearing' (Luke 4:21). This is Jesus's public declaration of His messianic identity and mission.",
    },
    aquinasReferences: [
      "ST III, q.40, a.1 — Christ's manner of life and ministry",
      "In Luc. cap. 4 — the Nazareth synagogue event",
    ],
    apologeticSignificance:
      "Jesus explicitly claims to fulfill this prophecy — His most direct public claim to be the Messiah. He stops reading mid-sentence: Isaiah 61:2 says 'the year of the LORD's favor AND the day of vengeance of our God.' Jesus reads the first half but not the second — because the day of vengeance is for the Second Coming, not the First. This shows Jesus's sophisticated understanding of how prophecy works: partial fulfillment at the First Coming, complete fulfillment at the Second.",
  },
  {
    id: "ezekiel37-resurrection",
    title: "The Valley of Dry Bones — Resurrection",
    category: "resurrection-exaltation",
    otSource: {
      reference: "Ezekiel 37:1-14",
      text: "'Thus says the Lord GOD to these bones: Behold, I will cause breath to enter you, and you shall live. And I will lay sinews upon you, and will cause flesh to come upon you, and cover you with skin, and put breath in you, and you shall live; and you shall know that I am the LORD.'",
      context:
        "Ezekiel's primary reference is to the restoration of Israel after exile (v.11: 'these bones are the whole house of Israel'). But the imagery of physical resurrection became the basis for Jewish and Christian hope in bodily resurrection.",
    },
    ntFulfillment: {
      reference: "John 5:25-29; Romans 8:11; 1 Corinthians 15:35-57; Revelation 20:11-13",
      text: "Jesus promises bodily resurrection: 'The hour is coming when all who are in the tombs will hear his voice and come forth' (John 5:28-29). Paul: 'He who raised Christ Jesus from the dead will give life to your mortal bodies' (Rom 8:11).",
    },
    aquinasReferences: [
      "ST Supplement, q.75-86 — the resurrection of the body",
    ],
    apologeticSignificance:
      "Against the Sadducees (who denied resurrection) and modern materialists: the OT itself teaches bodily resurrection (Ezekiel 37, Isaiah 26:19, Daniel 12:2, Job 19:25-27). Christianity did not invent this hope — it fulfilled it in Christ's Resurrection. The bodily nature of the vision (sinews, flesh, skin) supports the Catholic insistence on bodily (not merely spiritual) resurrection.",
  },
  {
    id: "isaiah-suffering-nations",
    title: "Salvation Reaching to the Ends of the Earth",
    category: "covenant-kingdom",
    otSource: {
      reference: "Isaiah 45:22-23",
      text: "'Turn to me and be saved, all the ends of the earth! For I am God, and there is no other. By myself I have sworn, from my mouth has gone forth in righteousness a word that shall not return: To me every knee shall bow, every tongue shall swear.'",
      context:
        "God declares that every knee will bow to Him — universal worship from all nations.",
    },
    ntFulfillment: {
      reference: "Philippians 2:10-11",
      text: "Paul applies Isaiah 45:23 to Jesus: 'At the name of Jesus every knee should bow, in heaven and on earth and under the earth, and every tongue confess that Jesus Christ is Lord, to the glory of God the Father' (Phil 2:10-11).",
    },
    aquinasReferences: [
      "ST III, q.59, a.1-6 — Christ's universal judgment and dominion",
    ],
    apologeticSignificance:
      "Isaiah 45:23 is GOD speaking of HIMSELF — 'every knee shall bow to ME.' Paul applies this to Jesus in Philippians 2:10-11. Therefore Paul identifies Jesus with the God of Isaiah 45. This is one of the most powerful NT divinity proofs, often overlooked. Against Unitarians and JWs: Paul takes a text where Yahweh says 'every knee shall bow to ME' and says every knee shall bow 'at the name of JESUS.' The identification is unmistakable.",
  },
];

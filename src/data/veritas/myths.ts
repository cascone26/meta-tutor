export interface Myth {
  myth: string;
  category: "history" | "doctrine" | "bible" | "practice" | "science";
  correction: string;
  keySources: string[];
}

export const MYTHS: Myth[] = [
  {
    myth: "The Dark Ages were caused by Christianity destroying classical learning",
    category: "history",
    correction: "The term 'Dark Ages' is rejected by modern historians. The period after Rome's fall was one of immense cultural and intellectual activity, largely driven by the Catholic Church. Benedictine monks preserved classical manuscripts through painstaking copying. Irish monasteries saved Greek and Latin texts that would otherwise have been lost. Cathedral schools developed into the first universities. Charlemagne's court, advised by Alcuin of York, launched the Carolingian Renaissance. Without the monasteries, virtually nothing of classical antiquity would have survived.",
    keySources: [
      "Thomas E. Woods, How the Catholic Church Built Western Civilization",
      "Thomas Cahill, How the Irish Saved Civilization",
      "Christopher Dawson, The Making of Europe",
      "Rodney Stark, The Victory of Reason",
    ],
  },
  {
    myth: "Catholics added books to the Bible",
    category: "bible",
    correction: "The deuterocanonical books (Tobit, Judith, Wisdom, Sirach, Baruch, 1 & 2 Maccabees, and additions to Daniel and Esther) were part of the Septuagint, the Greek Old Testament used by Jesus, the Apostles, and the early Church. The New Testament quotes the Septuagint over 300 times. These books were in every Christian Bible for 1,500 years — in the canon lists of Hippo (393), Carthage (397, 419), and Florence (1442). Martin Luther removed them in the 16th century. Catholics did not add books; Protestants removed them.",
    keySources: [
      "Gary Michuta, Why Catholic Bibles Are Bigger",
      "Council of Hippo (393 AD), Canon 36",
      "Council of Carthage (397 AD), Canon 24",
      "Pope Damasus I, Decree of the Council of Rome (382 AD)",
    ],
  },
  {
    myth: "Constantine invented Christianity at the Council of Nicaea",
    category: "history",
    correction: "Constantine convened Nicaea in 325 AD but did not dictate its outcome. The council addressed Arianism and affirmed what Christians had believed for three centuries. Pre-Nicene evidence for Christ's divinity is overwhelming: Ignatius of Antioch (c. 110 AD) called Christ 'our God,' Pliny the Younger reported Christians singing hymns to Christ 'as to a god' (c. 112 AD), and the pre-Pauline creed in Philippians 2:6-11 (c. 30s AD) attributes divine status to Christ. Nicaea defined what was already believed against a recent innovation. The Bible's canon was never discussed at Nicaea.",
    keySources: [
      "Henry Chadwick, The Early Church",
      "Larry Hurtado, Lord Jesus Christ: Devotion to Jesus in Earliest Christianity",
      "J.N.D. Kelly, Early Christian Doctrines",
      "Ignatius of Antioch, Letter to the Ephesians (c. 110 AD)",
    ],
  },
  {
    myth: "The Pope is the Antichrist",
    category: "doctrine",
    correction: "This claim originated with Martin Luther and has no historical or theological basis. The early Church universally recognized Rome's primacy. Clement of Rome (c. 96 AD) intervened authoritatively in Corinth while the Apostle John was still alive. Ignatius of Antioch (c. 110 AD) called the Roman church the one that 'presides in love.' Irenaeus (c. 180 AD) said every church must agree with Rome 'on account of its preeminent authority.' The biblical basis includes Matthew 16:18-19, Luke 22:32, and John 21:15-17.",
    keySources: [
      "Clement of Rome, First Epistle to the Corinthians (c. 96 AD)",
      "Irenaeus, Against Heresies III.3.2 (c. 180 AD)",
      "Adrian Fortescue, The Early Papacy",
      "Stephen Ray, Upon This Rock",
    ],
  },
  {
    myth: "Indulgences meant buying salvation or buying forgiveness of sins",
    category: "doctrine",
    correction: "An indulgence is the remission of temporal punishment due to sin whose guilt has already been forgiven in Confession. It has nothing to do with buying forgiveness. The abuse by Johann Tetzel was condemned by the Church itself. The Council of Trent (1563) reformed the system and prohibited any financial exchange for indulgences. The theology is grounded in the communion of saints and has biblical roots in Colossians 1:24, 2 Corinthians 5:10, and 1 Corinthians 3:15.",
    keySources: [
      "Council of Trent, Decree on Indulgences (1563)",
      "Catechism of the Catholic Church, 1471-1479",
      "Ludwig Ott, Fundamentals of Catholic Dogma",
      "Nikolaus Paulus, Geschichte des Ablasses im Mittelalter",
    ],
  },
  {
    myth: "The Crusades were unprovoked Christian imperialism against peaceful Muslims",
    category: "history",
    correction: "The First Crusade (1095) responded to over 400 years of Islamic military conquest of formerly Christian lands. By the 11th century, Islam had conquered the entire Middle East, North Africa, Spain, and parts of France and Italy — all territories Christian for centuries. The immediate trigger was the Seljuk Turks' conquest of Anatolia and attacks on Christian pilgrims. Emperor Alexios I begged Pope Urban II for help. There were abuses — the sack of Constantinople in 1204 was condemned by Pope Innocent III — but the overall context was defensive.",
    keySources: [
      "Rodney Stark, God's Battalions: The Case for the Crusades",
      "Thomas Madden, The New Concise History of the Crusades",
      "Jonathan Riley-Smith, The Crusades: A Short History",
      "Thomas Madden, 'The Real History of the Crusades,' Crisis Magazine",
    ],
  },
  {
    myth: "The Inquisition killed millions of people",
    category: "history",
    correction: "Modern scholarship has dramatically revised the death toll. The Spanish Inquisition, over 350 years (1478-1834), executed approximately 3,000-5,000 people. Secular courts executed far more for far less. The Inquisition actually introduced legal innovations ahead of their time: right to legal counsel, presumption of innocence, prohibition of secret accusations, and limits on torture. Henry Charles Lea, a Protestant historian critical of the Church, admitted the Inquisition was more just than contemporary secular courts.",
    keySources: [
      "Henry Kamen, The Spanish Inquisition: A Historical Revision",
      "Edward Peters, Inquisition",
      "BBC documentary: The Myth of the Spanish Inquisition",
      "Agostino Borromeo, research presented at 2004 Vatican symposium",
    ],
  },
  {
    myth: "The Galileo affair proves the Church is anti-science",
    category: "science",
    correction: "The Galileo affair was a complex disciplinary dispute, not a science vs. religion conflict. Copernicus (a Catholic canon) proposed heliocentrism decades earlier with Church approval. Several Jesuits supported Galileo. The problem was Galileo couldn't yet prove heliocentrism (stellar parallax wasn't observed until 1838) and insisted on teaching it as fact while publicly mocking Pope Urban VIII. His sentence was house arrest in a villa where he continued working. The Church has produced more scientific contributions than any other institution in history.",
    keySources: [
      "Thomas E. Woods, How the Catholic Church Built Western Civilization, Ch. 5",
      "Jerome Langford, Galileo, Science, and the Church",
      "Mariano Artigas and William Shea, Galileo Observed",
      "Ronald Numbers, ed., Galileo Goes to Jail and Other Myths",
    ],
  },
  {
    myth: "Priestly celibacy causes sexual abuse",
    category: "practice",
    correction: "No evidence links celibacy to abuse. The John Jay Report found no causal connection. Protestant ministers and public school teachers have comparable or higher abuse rates. The U.S. DOE's 2004 report found approximately 10% of students experience sexual misconduct by a school employee. The vast majority of abusers are married men. Celibacy has biblical roots (1 Cor 7:7-8; Matt 19:12). The crisis was caused by sin, poor formation, and institutional failures — not celibacy.",
    keySources: [
      "John Jay College, The Nature and Scope of Sexual Abuse of Minors by Catholic Priests, 1950-2002",
      "Philip Jenkins, Pedophiles and Priests",
      "U.S. Department of Education, Educator Sexual Misconduct (2004)",
      "Charol Shakeshaft, Educator Sexual Misconduct: A Synthesis of Existing Literature",
    ],
  },
  {
    myth: "Peter was never in Rome",
    category: "history",
    correction: "The evidence is overwhelming and virtually uncontested by serious historians. Archaeological evidence includes the excavation beneath St. Peter's Basilica (1939-1950). Literary evidence: Clement of Rome (c. 96 AD) placed Peter's martyrdom in Rome, Ignatius of Antioch (c. 110 AD) addressed the Roman church as founded by Peter and Paul, Irenaeus (c. 180 AD) listed Peter as first bishop of Rome. No other city has claimed Peter's tomb. Even Protestant historians like Oscar Cullmann and Adolf von Harnack accepted this as fact.",
    keySources: [
      "Oscar Cullmann, Peter: Disciple, Apostle, Martyr",
      "Margherita Guarducci, The Tomb of St. Peter",
      "Daniel William O'Connor, Peter in Rome",
      "Clement of Rome, First Epistle to the Corinthians, Ch. 5",
    ],
  },
  {
    myth: "The early Church was essentially Protestant",
    category: "history",
    correction: "The earliest Church Fathers are unmistakably Catholic. The Didache (c. 70-100 AD) describes the Eucharist as sacrifice, requires confession before communion, and describes hierarchy. Ignatius of Antioch (c. 110 AD) insisted on the Real Presence and episcopacy. Justin Martyr (c. 150 AD) described the Mass virtually identically to today's Catholic liturgy. Irenaeus (c. 180 AD) taught apostolic succession and the authority of Rome. Not a single Father taught sola scriptura or sola fide. The early Church had bishops, priests, deacons, Eucharistic sacrifice, baptismal regeneration, confession, Marian devotion, and prayers for the dead.",
    keySources: [
      "The Didache (c. 70-100 AD)",
      "Ignatius of Antioch, Letters (c. 110 AD)",
      "Justin Martyr, First Apology, Ch. 65-67 (c. 155 AD)",
      "Rod Bennett, Four Witnesses: The Early Church in Her Own Words",
    ],
  },
  {
    myth: "Mary worship is borrowed pagan goddess worship",
    category: "doctrine",
    correction: "Catholics do not worship Mary — worship (latria) is given to God alone. Marian devotion (hyperdulia) is veneration, not worship. This arose directly from Scripture: 'full of grace' (Luke 1:28), 'blessed among women' (Luke 1:42), 'mother of my Lord' (Luke 1:43), 'all generations will call me blessed' (Luke 1:48). Early evidence predates pagan contact: the Sub Tuum Praesidium (c. 250 AD) and the catacomb of Priscilla frescoes (c. 150-200 AD). Early Christians died refusing to worship pagan gods — they would not have secretly adopted pagan practices.",
    keySources: [
      "Luigi Gambero, Mary and the Fathers of the Church",
      "Hilda Graef, Mary: A History of Doctrine and Devotion",
      "Sub Tuum Praesidium (Rylands Papyrus 470, c. 250 AD)",
      "Catacomb of Priscilla frescoes (c. 150-200 AD)",
    ],
  },
  {
    myth: "Purgatory was invented in the Middle Ages",
    category: "doctrine",
    correction: "Prayer for the dead — presupposing post-mortem purification — is attested from the earliest centuries. 2 Maccabees 12:46 (c. 124 BC) explicitly describes prayer and sacrifice for the dead. The catacombs (2nd-3rd century) bear inscriptions asking prayers for souls. Tertullian (c. 211 AD), Clement of Alexandria, Origen, Cyprian, and Augustine all teach post-mortem purification. Jesus refers to paying 'the last penny' (Matt 5:26) and sin 'not forgiven in this age or the age to come' (Matt 12:32). Paul speaks of being saved 'through fire' (1 Cor 3:15). The word was formalized later; the doctrine is ancient.",
    keySources: [
      "2 Maccabees 12:39-46",
      "Tertullian, De Monogamia 10 (c. 211 AD)",
      "Augustine, City of God XXI.26; Enchiridion 69",
      "Joseph Ratzinger, Eschatology: Death and Eternal Life",
    ],
  },
  {
    myth: "Confession is a medieval invention for priestly control",
    category: "doctrine",
    correction: "Confessing sins to a priest is rooted in Scripture (John 20:23) and attested from the earliest centuries. The Didache (c. 70-100 AD): 'In the church you shall confess your transgressions.' Irenaeus (c. 180 AD) describes confession upon return to the Church. Origen (c. 240 AD) lists confession to a priest among means of forgiveness. Cyprian (c. 251 AD) requires confession before reconciliation. The form evolved (public to private, largely through Irish monastic influence), but the sacramental reality goes back to the Apostles.",
    keySources: [
      "John 20:21-23; James 5:16; Matthew 18:18",
      "The Didache 4:14 (c. 70-100 AD)",
      "Origen, Homilies on Leviticus 2.4 (c. 240 AD)",
      "Bernhard Poschmann, Penance and the Anointing of the Sick",
    ],
  },
  {
    myth: "Catholics re-crucify Christ at Mass",
    category: "doctrine",
    correction: "The Mass does not repeat Calvary. It re-presents (makes present again) the one sacrifice in an unbloody manner. Trent explicitly taught the Mass is not a new sacrifice but a memorial and application of the Cross. Hebrews 7:27 says Christ offered Himself 'once for all.' The Greek anamnesis (Luke 22:19) means not psychological remembrance but liturgical making-present — the same word used for the Passover, which made each generation present at the Exodus. The Mass and Calvary are the same sacrifice — one Priest, one Victim — in different modes.",
    keySources: [
      "Council of Trent, Session 22",
      "Catechism of the Catholic Church, 1362-1372",
      "Joseph Ratzinger, The Spirit of the Liturgy",
      "Max Thurian, The Eucharistic Memorial",
    ],
  },
  {
    myth: "Transubstantiation was invented at the Fourth Lateran Council (1215)",
    category: "doctrine",
    correction: "Lateran IV used the term to define what was believed since the Apostles. Paul warns of not 'discerning the body' (1 Cor 11:29). Ignatius of Antioch (c. 110 AD): heretics 'do not confess that the Eucharist is the flesh of our Savior.' Justin Martyr (c. 150 AD): the elements 'are not common bread and drink' but 'the flesh and blood of Jesus.' Irenaeus, Cyril of Jerusalem, and Ambrose all affirm the Real Presence. The word was formalized to articulate the ancient belief, not to create a new one.",
    keySources: [
      "Ignatius of Antioch, Letter to the Smyrnaeans 7 (c. 110 AD)",
      "Justin Martyr, First Apology 66 (c. 155 AD)",
      "Cyril of Jerusalem, Mystagogical Catecheses 4 (c. 350 AD)",
      "Jaroslav Pelikan, The Christian Tradition, Vol. 1 and 3",
    ],
  },
  {
    myth: "The Church changed its teaching on slavery",
    category: "history",
    correction: "The Church's teaching on human dignity has been consistent. What changed were applications as conditions evolved. Paul III condemned enslaving indigenous peoples in Sublimis Deus (1537). Gregory XVI condemned the slave trade in In Supremo Apostolatus (1839). Before these, Gregory of Nyssa (4th century) condemned slavery, Patrick of Ireland opposed the slave trade, canon law prohibited enslaving Christians, and the Mercedarians (1218) ransomed slaves. The development is unchanging principles applied to changing circumstances.",
    keySources: [
      "Joel S. Panzer, The Popes and Slavery",
      "Paul III, Sublimis Deus (1537)",
      "Gregory XVI, In Supremo Apostolatus (1839)",
      "John T. Noonan Jr., A Church That Can and Cannot Change",
    ],
  },
  {
    myth: "Religion causes most wars",
    category: "history",
    correction: "The Encyclopedia of Wars (2004) catalogued 1,763 wars and found fewer than 7% had a religious primary cause. Excluding Islam, 3%. The deadliest conflicts — WWI, WWII, Mongol conquests, and the mass killings under Stalin, Mao, and Pol Pot — were secular. The atheistic regimes of the 20th century killed 100-150 million people — far more than all religious conflicts in history combined.",
    keySources: [
      "Charles Phillips and Alan Axelrod, Encyclopedia of Wars (2004)",
      "Rodney Stark, For the Glory of God, Ch. 4",
      "Stephane Courtois et al., The Black Book of Communism",
      "Matthew White, The Great Big Book of Horrible Things",
    ],
  },
  {
    myth: "The Bible was put together at the Council of Nicaea (325 AD)",
    category: "bible",
    correction: "Nicaea never discussed the biblical canon. This myth comes from Dan Brown's The Da Vinci Code. By the late 2nd century, the four Gospels and Paul's letters were universally accepted. The Muratorian Fragment (c. 170 AD) lists most of the NT. Irenaeus (c. 180 AD) insisted on four Gospels. The first complete matching list is Athanasius's Easter letter (367 AD). Hippo (393) and Carthage (397, 419) ratified the canon. The process was recognition, not creation.",
    keySources: [
      "Bruce Metzger, The Canon of the New Testament",
      "F.F. Bruce, The Canon of Scripture",
      "Athanasius, 39th Festal Letter (367 AD)",
      "Muratorian Fragment (c. 170 AD)",
    ],
  },
  {
    myth: "Catholics worship statues and images",
    category: "practice",
    correction: "Catholics use images as aids to devotion, like photographs of loved ones. The honor passes to the prototype (Second Council of Nicaea, 787). God Himself commanded religious images: cherubim on the Ark (Exodus 25:18-20), the bronze serpent (Numbers 21:8-9), Temple decorations (1 Kings 6:23-35). Exodus 20:4-5 forbids making images 'to worship them' — idolatry is condemned, not sacred art. St. John Damascene's On the Divine Images (c. 730 AD) is the classic defense.",
    keySources: [
      "Second Council of Nicaea (787 AD)",
      "St. John Damascene, On the Divine Images (c. 730 AD)",
      "Catechism of the Catholic Church, 2129-2132",
      "Exodus 25:18-20; Numbers 21:8-9; 1 Kings 6:23-35",
    ],
  },
];

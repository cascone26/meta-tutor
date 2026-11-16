// =============================================================================
// ECUMENICAL COUNCILS OF THE CATHOLIC CHURCH
// =============================================================================
// All 21 ecumenical councils recognized by the Catholic Church, from
// Nicaea I (325) to Vatican II (1962-1965).
// =============================================================================

export interface Council {
  name: string;
  year: string;
  location: string;
  pope?: string;
  issue: string;
  keyDefinitions: string[];
  significance: string;
}

export const COUNCILS: Council[] = [
  {
    name: "First Council of Nicaea",
    year: "325",
    location: "Nicaea (modern Iznik, Turkey)",
    pope: "Pope Sylvester I (legates attended)",
    issue:
      "The Arian heresy, which denied the full divinity of the Son, claiming He was a creature made by the Father.",
    keyDefinitions: [
      "Defined the Son as homoousios (consubstantial) with the Father \u2014 true God from true God, begotten not made",
      "Promulgated the original Nicene Creed as the baptismal profession of faith",
      "Established the date of Easter (to be celebrated on the Sunday after the first full moon of spring)",
      "Issued 20 canons on Church discipline, including regulations on the readmission of lapsed Christians",
      "Established the precedence of the sees of Rome, Alexandria, and Antioch",
    ],
    significance:
      "The first ecumenical council and the definitive response to Arianism. By defining the Son as homoousios with the Father, Nicaea established the doctrinal foundation for all subsequent Trinitarian theology. The Nicene Creed remains the normative statement of Christian faith.",
  },
  {
    name: "First Council of Constantinople",
    year: "381",
    location: "Constantinople (modern Istanbul, Turkey)",
    pope: "Pope Damasus I (not directly represented)",
    issue:
      "The continued spread of Arianism in various forms, and the Macedonian heresy (Pneumatomachi), which denied the divinity of the Holy Spirit.",
    keyDefinitions: [
      "Expanded the Nicene Creed into the Niceno-Constantinopolitan Creed still recited today, adding the article on the Holy Spirit as 'the Lord, the Giver of Life, who proceeds from the Father'",
      "Condemned Macedonianism (denial of the Spirit's divinity) and Apollinarianism (denial of Christ's human rational soul)",
      "Affirmed the full divinity of the Holy Spirit as consubstantial with the Father and the Son",
      "Gave Constantinople honorary precedence after Rome (Canon 3)",
    ],
    significance:
      "Completed the Trinitarian definition begun at Nicaea. The Creed produced here (with the later Western addition of the Filioque) is the Creed professed at every Sunday Mass in the Catholic Church to this day.",
  },
  {
    name: "Council of Ephesus",
    year: "431",
    location: "Ephesus (modern Turkey)",
    pope: "Pope Celestine I",
    issue:
      "The Nestorian heresy, which held that Mary was Christotokos (Mother of Christ) but not Theotokos (Mother of God), effectively dividing Christ into two persons.",
    keyDefinitions: [
      "Defined Mary as Theotokos (God-bearer, Mother of God), affirming the unity of Christ's person",
      "Condemned Nestorianism and deposed Nestorius as Patriarch of Constantinople",
      "Affirmed the hypostatic union: the divine and human natures are united in one Person (the Logos)",
      "Approved St. Cyril of Alexandria's Twelve Anathemas against Nestorius",
      "Forbade any alteration to the Nicene Creed",
    ],
    significance:
      "By defining Mary as Theotokos, Ephesus was primarily making a Christological statement: because the divine and human natures are united in the one Person of the Word, the woman who bore Him truly bore God. This remains the foundation of all Marian doctrine.",
  },
  {
    name: "Council of Chalcedon",
    year: "451",
    location: "Chalcedon (modern Kadikoy, Turkey)",
    pope: "Pope Leo I (the Great)",
    issue:
      "The Monophysite heresy of Eutyches, which held that Christ had only one nature after the Incarnation, effectively absorbing the human nature into the divine.",
    keyDefinitions: [
      "Defined that Christ is one Person in two natures (divine and human), without confusion, without change, without division, without separation",
      "Received Pope Leo's Tome (Epistola Dogmatica) as the definitive statement of Christological orthodoxy",
      "Condemned Eutychianism (Monophysitism) and reaffirmed the condemnation of Nestorianism",
      "Issued 27 disciplinary canons",
    ],
    significance:
      "The Chalcedonian Definition is the foundational Christological formula of the Catholic Church. Its four negative adverbs (without confusion, without change, without division, without separation) define the boundaries of all orthodox Christology. As Aquinas notes, Christ's two natures are united in the one divine Person (ST III, q. 2).",
  },
  {
    name: "Second Council of Constantinople",
    year: "553",
    location: "Constantinople",
    pope: "Pope Vigilius (reluctantly confirmed)",
    issue:
      "The Three Chapters controversy: an attempt by Emperor Justinian I to reconcile the Monophysites by condemning three theologians suspected of Nestorian sympathies.",
    keyDefinitions: [
      "Condemned the Three Chapters (the person and writings of Theodore of Mopsuestia, certain writings of Theodoret against Cyril, and the letter of Ibas to Maris)",
      "Reaffirmed the Christological definitions of Chalcedon",
      "Condemned Origenism and certain propositions attributed to Origen (pre-existence of souls, universal restoration)",
      "Emphasized the Theopaschite formula: 'One of the Trinity suffered in the flesh'",
    ],
    significance:
      "Attempted to bridge the growing divide between Chalcedonian and non-Chalcedonian Christians. Though politically motivated, it reinforced the Church's Christological teaching and its condemnation of Origenist errors.",
  },
  {
    name: "Third Council of Constantinople",
    year: "680-681",
    location: "Constantinople",
    pope: "Pope Agatho",
    issue:
      "The Monothelite heresy, which held that Christ had only one will (the divine will), denying that He possessed a distinct human will.",
    keyDefinitions: [
      "Defined that Christ has two natural wills (divine and human), corresponding to His two natures",
      "Condemned Monothelitism and its chief proponents, including Patriarch Sergius of Constantinople",
      "Posthumously condemned Pope Honorius I for negligent language that seemed to favor Monothelitism",
      "Affirmed that Christ's human will freely chose obedience to the Father's will",
    ],
    significance:
      "Completed the Christological development by affirming that Christ's full humanity includes a genuine human will. As Aquinas explains (ST III, q. 18), the human will in Christ was not absorbed by the divine will but moved in perfect harmony with it.",
  },
  {
    name: "Second Council of Nicaea",
    year: "787",
    location: "Nicaea",
    pope: "Pope Hadrian I",
    issue:
      "The Iconoclast controversy: the Byzantine emperors had decreed the destruction of sacred images, claiming their veneration was idolatry.",
    keyDefinitions: [
      "Defined that sacred images may and should be given veneration (proskynesis), though not the adoration (latreia) due to God alone",
      "Distinguished between latreia (worship due to God alone) and relative veneration given to images, which passes to the prototype",
      "Condemned Iconoclasm as a Christological heresy: to deny the possibility of depicting Christ is to deny His true Incarnation",
      "Restored icons to churches throughout the Byzantine Empire",
    ],
    significance:
      "Nicaea II established the theological foundation for sacred art in Christian worship. The honor paid to the image passes to the prototype, making iconography a legitimate expression of the Incarnation. Aquinas develops this in ST III, q. 25, a. 3.",
  },
  {
    name: "Fourth Council of Constantinople",
    year: "869-870",
    location: "Constantinople",
    pope: "Pope Hadrian II",
    issue:
      "The Photian Schism: the contested appointment of Photius as Patriarch of Constantinople after the deposition of Patriarch Ignatius.",
    keyDefinitions: [
      "Deposed Photius and restored Ignatius as Patriarch of Constantinople",
      "Condemned those who rejected the veneration of sacred images",
      "Issued 27 canons on Church discipline",
      "Affirmed papal primacy in settling disputes between patriarchs",
    ],
    significance:
      "The last ecumenical council recognized by both East and West before the Great Schism of 1054. The Eastern Orthodox Churches do not recognize this as ecumenical.",
  },
  {
    name: "First Lateran Council",
    year: "1123",
    location: "Lateran Palace, Rome",
    pope: "Pope Callixtus II",
    issue:
      "The aftermath of the Investiture Controversy between popes and emperors over the right to appoint bishops and abbots.",
    keyDefinitions: [
      "Ratified the Concordat of Worms (1122), resolving the Investiture Controversy",
      "Decreed that clergy who had received ordination through simony were to be deposed",
      "Confirmed the indulgence for Crusaders",
      "Issued canons against clerical concubinage and simony",
    ],
    significance:
      "The first ecumenical council held in the West. It established the precedent of councils meeting in Rome under direct papal authority.",
  },
  {
    name: "Second Lateran Council",
    year: "1139",
    location: "Lateran Palace, Rome",
    pope: "Pope Innocent II",
    issue:
      "The papal schism of Antipope Anacletus II and various disciplinary abuses in the Church.",
    keyDefinitions: [
      "Declared the ordinations performed by Anacletus II and his supporters invalid",
      "Definitively established clerical celibacy by declaring the marriages of those in major orders not merely illicit but invalid",
      "Condemned the teachings of Peter de Bruys and Arnold of Brescia",
      "Prohibited jousting tournaments under pain of denial of Christian burial",
    ],
    significance:
      "Established mandatory clerical celibacy as a matter of Church law, making it an invalidating impediment to marriage for those in major orders.",
  },
  {
    name: "Third Lateran Council",
    year: "1179",
    location: "Lateran Palace, Rome",
    pope: "Pope Alexander III",
    issue:
      "The aftermath of the papal schism under Frederick Barbarossa, and the need to reform the process of papal elections.",
    keyDefinitions: [
      "Established that papal elections require a two-thirds majority of the cardinals",
      "Condemned the Cathar and Waldensian heresies",
      "Prohibited the charging of fees for the administration of sacraments",
      "Required every cathedral to maintain a school for poor scholars",
      "Set minimum ages for bishops (30) and pastors (25)",
    ],
    significance:
      "The two-thirds majority rule for papal elections, established here, remained in force for over 800 years and prevented many potential schisms.",
  },
  {
    name: "Fourth Lateran Council",
    year: "1215",
    location: "Lateran Palace, Rome",
    pope: "Pope Innocent III",
    issue:
      "Comprehensive reform of the Church, clarification of doctrine against the Cathar and Albigensian heresies, and preparation for the Fifth Crusade.",
    keyDefinitions: [
      "Used the term 'transubstantiation' for the first time in a conciliar document to describe the eucharistic change",
      "Required all Catholics to confess their sins at least once a year and receive Communion at Easter (the 'Easter duty')",
      "Defined the Trinitarian faith against Joachim of Fiore's errors",
      "Issued 70 reform canons covering preaching, education, clerical discipline, and marriage law",
      "Approved the Franciscan and Dominican orders",
    ],
    significance:
      "The most important medieval council. Its use of 'transubstantiation' gave definitive language to the eucharistic mystery. Aquinas's entire eucharistic theology builds on Lateran IV's definition (ST III, q. 75).",
  },
  {
    name: "First Council of Lyon",
    year: "1245",
    location: "Lyon, France",
    pope: "Pope Innocent IV",
    issue:
      "The conflict between Pope Innocent IV and Emperor Frederick II, who was threatening the independence of the Church and the Papal States.",
    keyDefinitions: [
      "Formally deposed Emperor Frederick II for perjury, sacrilege, heresy, and oppression of the Church",
      "Issued decrees for the relief of the Holy Land",
      "Approved the wearing of the red hat by cardinals",
      "Addressed the Mongol invasions threatening Eastern Europe",
    ],
    significance:
      "Demonstrated the medieval papacy's claim to supreme authority over temporal rulers. The deposition of Frederick II was the high-water mark of papal political power.",
  },
  {
    name: "Second Council of Lyon",
    year: "1274",
    location: "Lyon, France",
    pope: "Pope Gregory X",
    issue:
      "Reunion with the Eastern Churches, reform of the Church, and aid to the Holy Land.",
    keyDefinitions: [
      "Achieved a temporary reunion with the Byzantine Church (collapsed within a decade)",
      "Defined the doctrine of the procession of the Holy Spirit from both the Father and the Son (Filioque)",
      "Established the conclave system for papal elections",
      "Thomas Aquinas died en route to this council; Bonaventure died during it",
    ],
    significance:
      "Though the reunion with Constantinople proved short-lived, the council's definition of the Filioque and the conclave system had lasting effects. Thomas Aquinas was summoned to contribute his theological expertise but died on the journey at Fossanova.",
  },
  {
    name: "Council of Vienne",
    year: "1311-1312",
    location: "Vienne, France",
    pope: "Pope Clement V",
    issue:
      "The suppression of the Knights Templar, and doctrinal questions arising from the Beguine and Beghard movements.",
    keyDefinitions: [
      "Suppressed the Knights Templar (under heavy pressure from King Philip IV of France)",
      "Condemned the errors of the Beguines and Beghards regarding the state of perfection",
      "Defined that the rational soul is the substantial form of the human body per se and essentially \u2014 a key Thomistic position",
      "Decreed the establishment of chairs of Hebrew, Arabic, and Chaldean at major universities",
    ],
    significance:
      "The definition that the soul is the form of the body (Fidei Catholicae) was a vindication of Thomas Aquinas's anthropology against both materialist and dualist alternatives. This remains the Church's definitive philosophical anthropology.",
  },
  {
    name: "Council of Constance",
    year: "1414-1418",
    location: "Constance (modern Konstanz, Germany)",
    pope: "Pope Martin V (elected by the council)",
    issue:
      "The Great Western Schism, in which three rival claimants all claimed to be the legitimate pope.",
    keyDefinitions: [
      "Ended the Great Western Schism by deposing or accepting the resignation of the three rival popes and electing Martin V",
      "Condemned the teachings of John Wycliffe (45 articles) and Jan Hus (30 articles)",
      "Burned Jan Hus at the stake despite a safe-conduct guarantee (1415)",
      "Issued the decree Haec Sancta, claiming conciliar authority over the pope \u2014 later rejected as non-binding",
      "Issued Frequens, requiring regular ecumenical councils",
    ],
    significance:
      "Resolved the greatest institutional crisis in Church history. The election of Martin V reunited Western Christendom under a single pope.",
  },
  {
    name: "Council of Basel-Ferrara-Florence",
    year: "1431-1449",
    location: "Basel, then Ferrara, then Florence",
    pope: "Pope Eugene IV",
    issue:
      "Reunion with the Eastern Churches (Greek, Armenian, Coptic, Syrian), and the ongoing conciliarist challenge to papal authority.",
    keyDefinitions: [
      "Achieved reunion with the Greek Church in the decree Laetentur Caeli (1439), defining the Filioque, papal primacy, purgatory, and eucharistic matter",
      "Issued reunion decrees with the Armenians (Exultate Deo, 1439), the Copts (Cantate Domino, 1442), and others",
      "Exultate Deo enumerated the seven sacraments and their matter, form, and minister",
      "Condemned the conciliarism of the rump council at Basel, which had elected an antipope (Felix V)",
    ],
    significance:
      "Though the Greek reunion proved temporary, Florence produced the most comprehensive doctrinal agreements between East and West prior to modern ecumenism. The decree to the Armenians became a standard reference for sacramental theology.",
  },
  {
    name: "Fifth Lateran Council",
    year: "1512-1517",
    location: "Lateran Palace, Rome",
    pope: "Pope Julius II / Pope Leo X",
    issue:
      "Reform of the Church and the condemnation of the neo-Aristotelian denial of personal immortality.",
    keyDefinitions: [
      "Defined the individual immortality of the rational soul against the neo-Averroism of Pietro Pomponazzi",
      "Condemned the conciliarist council of Pisa (1511)",
      "Issued reform decrees on preaching, printing, and the Roman Curia (largely unenforced)",
      "Approved the Montes Pietatis (charitable lending institutions) against charges of usury",
    ],
    significance:
      "The last council before the Protestant Reformation. Its failure to implement meaningful reform is often cited as a factor in the Reformation's success. It closed just months before Luther posted the 95 Theses.",
  },
  {
    name: "Council of Trent",
    year: "1545-1563",
    location: "Trent (modern Trento, Italy) and Bologna",
    pope: "Pope Paul III / Pope Julius III / Pope Pius IV",
    issue:
      "The Protestant Reformation's challenges to Catholic doctrine on Scripture, justification, the sacraments, the Mass, purgatory, indulgences, and the veneration of saints.",
    keyDefinitions: [
      "Defined the canon of Sacred Scripture (including the deuterocanonical books) and affirmed Scripture and Sacred Tradition as two sources of divine revelation",
      "Issued the Decree on Justification, defining justification as not merely forensic but a real interior transformation by sanctifying grace",
      "Defined the seven sacraments as instituted by Christ, affirmed transubstantiation, and defended the sacrificial nature of the Mass",
      "Established seminaries for the formation of priests",
      "Affirmed purgatory, the invocation of saints, the veneration of relics and images, and indulgences (while condemning abuses)",
      "Mandated the preparation of a catechism, a revised breviary, and a revised missal",
    ],
    significance:
      "The most comprehensive doctrinal and disciplinary council in Church history. Trent defined Catholic teaching on virtually every point contested by the Reformers, drawing heavily on Thomistic theology. Its doctrinal decrees remain fully authoritative.",
  },
  {
    name: "First Vatican Council",
    year: "1869-1870",
    location: "Vatican Basilica, Rome",
    pope: "Pope Pius IX",
    issue:
      "Rationalism, fideism, atheism, pantheism, and the definition of papal infallibility.",
    keyDefinitions: [
      "Defined the dogma of papal infallibility in Pastor Aeternus: when the Pope speaks ex cathedra on matters of faith and morals, he is preserved from error by divine assistance",
      "Defined the Pope's universal, ordinary, and immediate jurisdiction over the whole Church",
      "In Dei Filius, defined that God can be known with certainty by the natural light of reason from created things, but that revelation is necessary for truths that exceed reason",
      "Condemned rationalism, fideism, and pantheism",
    ],
    significance:
      "Infallibility and papal primacy were the most controversial definitions in modern Church history. The council was suspended (never formally closed) when Italian troops seized Rome in September 1870. Its teaching on faith and reason is deeply Thomistic (cf. ST I, q. 1; SCG I, cc. 3-9).",
  },
  {
    name: "Second Vatican Council",
    year: "1962-1965",
    location: "Vatican Basilica, Rome",
    pope: "Pope John XXIII / Pope Paul VI",
    issue:
      "The Church's engagement with the modern world, liturgical renewal, ecumenism, religious liberty, and the nature of the Church.",
    keyDefinitions: [
      "Sacrosanctum Concilium: reformed the sacred liturgy, permitted vernacular languages, and called for full, conscious, and active participation of the faithful",
      "Lumen Gentium: defined the Church as the People of God and Mystical Body of Christ, affirmed the universal call to holiness, restored the permanent diaconate, and taught episcopal collegiality",
      "Dei Verbum: taught that Scripture and Tradition form a single sacred deposit of the Word of God, and encouraged Catholic biblical scholarship",
      "Gaudium et Spes: addressed the Church's relationship to the modern world, treating marriage, culture, economics, politics, and peace",
      "Dignitatis Humanae: declared the right to religious liberty based on the dignity of the human person",
      "Nostra Aetate: transformed the Church's relationship with non-Christian religions, especially Judaism",
      "Unitatis Redintegratio: committed the Church to ecumenical dialogue with other Christians",
    ],
    significance:
      "The most recent ecumenical council and the most transformative event in modern Catholic history. Vatican II did not define new dogmas but profoundly reshaped Catholic worship, ecclesiology, and engagement with the world.",
  },
];

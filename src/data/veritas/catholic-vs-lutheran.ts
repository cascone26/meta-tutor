export interface CvLTopic {
  id: string;
  topic: string;
  oneLiner: string;
  catholicPosition: string;
  catholicCitations: string[];
  lutheranPosition: string;
  lutheranCitations: string[];
  aquinasView: string;
  keyVersesCatholic: string[];
  keyVersesLutheran: string[];
  commonGround: string;
  howToEngage: string;
}

export const CVL_TIMELINE: { year: string; event: string }[] = [
  { year: "1517", event: "Luther posts the Ninety-Five Theses at Wittenberg, protesting indulgence sales — not yet a break over justification itself." },
  { year: "1518–1521", event: "Leipzig Debate and the Diet of Worms. Luther denies papal and conciliar authority can bind conscience against Scripture; he is excommunicated (Decet Romanum Pontificem, 1521) and declared an outlaw of the Empire (Edict of Worms)." },
  { year: "1525", event: "Luther publishes The Bondage of the Will against Erasmus — the clearest statement that fallen man's will is not free to cooperate with grace, only to resist it until regenerated." },
  { year: "1530", event: "Augsburg Confession (Melanchthon) presented to Charles V — the founding Lutheran confessional document; Article IV states justification 'by faith, for Christ's sake, through faith, when we believe that Christ suffered for us.'" },
  { year: "1545–1563", event: "Council of Trent responds point by point: Session VI (1547) on Justification, Session XIII (1551) on the Eucharist, Session XXI–XXII on Communion and the Sacrifice of the Mass, Session XXV on purgatory, indulgences, and the veneration of saints." },
  { year: "1577", event: "Formula of Concord — Lutheranism's own internal settlement (after disputes between strict Lutherans and Melanchthon's followers), reaffirming sola fide and the 'in, with, and under' real presence against both Rome and the Reformed." },
  { year: "1999 / 2017", event: "Joint Declaration on the Doctrine of Justification (Lutheran World Federation + Catholic Church, 1999; affirmed by World Communion of Reformed Churches 2017) states the two traditions' excommunication-era condemnations on justification 'do not apply' to each other's current teaching as presented in the document — a real, historic narrowing of the gap, though not full communion and not a resolution of every remaining difference (the Mass as sacrifice, the papacy, and the number of sacraments are untouched by it)." },
];

export const CATHOLIC_VS_LUTHERAN: CvLTopic[] = [
  {
    id: "authority",
    topic: "Authority: Scripture Alone, or Scripture with Tradition and the Magisterium",
    oneLiner: "Sola Scriptura (Scripture is the sole infallible rule) vs. Scripture read within apostolic Tradition, authoritatively interpreted by the Magisterium.",
    catholicPosition:
      "Divine Revelation comes to us through both Sacred Scripture and Sacred Tradition, which 'flow from the same divine wellspring' and form a single sacred deposit entrusted to the Church. The Magisterium (pope and bishops in communion with him) does not stand above the Word of God but serves it, authentically interpreting it under the assistance of the Holy Spirit. Scripture itself was recognized and its canon fixed by the Church's living Tradition (councils of Rome 382, Hippo 393, Carthage 397, ratified at Trent 1546) — the Bible did not interpret itself into existence.",
    catholicCitations: ["CCC 80–82 (Scripture and Tradition 'form one sacred deposit')", "CCC 85–87 (the Magisterium's service to the Word)", "Dei Verbum §9–10 (Vatican II)"],
    lutheranPosition:
      "Scripture alone is the norma normans non normata — the norm that norms but is not itself normed by anything else, including councils, popes, or even the Church's own confessions (which are norma normata, 'normed norms,' binding only because they conform to Scripture). Luther's stand at Worms (1521) — 'unless I am convinced by the testimony of Scripture or by evident reason... I cannot and will not retract' — makes conscience bound to Scripture, not to ecclesial office. Tradition and councils are useful but fallible and correctable.",
    lutheranCitations: ["Augsburg Confession, Preface", "Formula of Concord, Epitome, Introduction (on the 'norma normata')", "Luther, Diet of Worms speech, 1521"],
    aquinasView:
      "Aquinas, writing two centuries before Luther, never faced sola scriptura as a live option, but his method presupposes the Catholic position: he treats Scripture as the supreme authority in theological argument (ST I, q.1, a.8 — sacred doctrine argues 'from the canonical Scriptures... as from a necessary authority') while also treating the Fathers, councils, and the Church's living teaching as proper (though lesser) authorities within the same single tradition — exactly the two-source structure Trent later formalized against Luther.",
    keyVersesCatholic: ["Matthew 16:18–19 (binding/loosing given to Peter)", "1 Timothy 3:15 ('the church of the living God, the pillar and bulwark of the truth')", "2 Thessalonians 2:15 ('hold to the traditions... whether by word of mouth or by letter')", "John 16:13 (the Spirit to 'guide you into all truth')"],
    keyVersesLutheran: ["2 Timothy 3:16–17 ('All Scripture is inspired by God... that the man of God may be complete')", "Acts 17:11 (the Bereans 'examined the Scriptures' to test Paul's preaching)", "Galatians 1:8 (Paul: even an angel preaching a different gospel is to be rejected)"],
    commonGround:
      "Both sides agree Scripture is inerrant, inspired, and the supreme written record of Revelation; neither side thinks any human authority can contradict it. The dispute is not whether Scripture rules, but who has the authority to settle a disputed reading of it when sincere believers disagree.",
    howToEngage:
      "Push on the canon question first, not transubstantiation or the papacy — it's the premise everything else rests on. Ask: who decided the New Testament has 27 books and not more or fewer? That decision was made by bishops in council, exercising teaching authority, centuries before any Reformer existed — and every Protestant today still accepts that same authority's canon call while rejecting the authority itself. That's the load-bearing inconsistency to surface, gently.",
  },
  {
    id: "justification",
    topic: "Justification: Faith Alone, or Faith Formed by Love",
    oneLiner: "Sola fide (justified by faith alone, apart from works) vs. fides caritate formata (justifying faith is always faith animated by charity, and can be lost through mortal sin).",
    catholicPosition:
      "Justification is a real, interior transformation — not a legal declaration on the basis of an external, 'alien' righteousness. Through grace, received first in Baptism, the sinner is actually made just, infused with sanctifying grace, faith, hope, and charity. Justifying faith is never faith alone in isolation; it is 'faith working through love' (Galatians 5:6), and because it is a real created participation in God's own life, it can be diminished or destroyed by mortal sin and must be restored (ordinarily through the sacrament of Penance).",
    catholicCitations: ["CCC 1987–1995 (justification as interior renewal, not mere imputation)", "CCC 1996 ('Our justification comes from the grace of God')", "CCC 2010 (merit presupposes grace already given)", "Council of Trent, Session VI, Decree on Justification, chs. 7, 16, canon 9"],
    lutheranPosition:
      "Man is justified by grace alone, through faith alone, for Christ's sake alone (sola gratia, sola fide, propter Christum) — the 'article on which the Church stands or falls.' Christ's righteousness is imputed (credited) to the believer, who remains simul justus et peccator — simultaneously righteous (by imputation) and a sinner (in fact) — for as long as he lives. Good works are the necessary fruit and evidence of genuine faith but add nothing to, and are not the basis of, one's standing before God.",
    lutheranCitations: ["Augsburg Confession, Article IV ('Of Justification')", "Apology of the Augsburg Confession, Article IV", "Luther, commentary on Romans and Galatians (on simul justus et peccator)"],
    aquinasView:
      "Aquinas's own treatment of justification (ST I-II, q.113) is, ironically, one of the strongest bridges between the two sides: he teaches that the infusion of grace, the remission of sin, and the movement of free will toward God all happen together, 'in an instant,' by grace alone and not by any preceding human merit (q.113, a.3 — 'the justification of the ungodly is not a successive, but an instantaneous work'). He insists as firmly as Luther that no one merits their first justification. Where he parts from Luther is in holding that the grace received is a real, infused quality that truly renews the soul (not merely God's favorable legal verdict) and that charity, not faith by itself, is 'the form of faith' that makes faith salvific (ST II-II, q.4, a.3).",
    keyVersesCatholic: ["James 2:24 ('a person is justified by works and not by faith alone')", "Galatians 5:6 ('faith working through love')", "Philippians 2:12 ('work out your own salvation with fear and trembling')", "Romans 2:13 ('it is not the hearers of the law who are righteous, but the doers')"],
    keyVersesLutheran: ["Romans 3:28 ('a person is justified by faith apart from works of the law')", "Romans 4:5 (God 'justifies the ungodly')", "Ephesians 2:8–9 ('by grace you have been saved through faith... not because of works')", "Galatians 2:16 ('no one is justified by works of the law')"],
    commonGround:
      "The 1999/2017 Joint Declaration on the Doctrine of Justification found that both sides confess: justification is by grace alone, received through faith, rooted entirely in Christ's saving work, never a human achievement that obligates God. Catholics affirm sola gratia without reservation; Lutherans affirm that justifying faith necessarily issues in works of love. The traditions' 16th-century mutual condemnations on this specific point are declared not to apply to each other's confessed teaching today.",
    howToEngage:
      "Don't fight the strawman — few informed Lutherans deny faith must produce works, and Trent explicitly denies justification is ever merited beforehand. The real residual difference is ontological: is the believer actually, interiorly made righteous (Catholic), or righteous by extrinsic imputation while remaining a sinner in fact (Lutheran)? Ask what James 2:24 means on a sola fide reading, and ask what 1 John 3:9 ('No one born of God practices sin') means if the believer is still, factually, 'a sinner' in the same sense as before conversion.",
  },
  {
    id: "free-will",
    topic: "Free Will and Grace: Bondage of the Will, or Grace-Assisted Freedom",
    oneLiner: "Luther: fallen man's will is in total bondage to sin and can only resist, never cooperate with, grace until regenerated. Catholic: grace enables and elevates a wounded but not destroyed freedom to really cooperate.",
    catholicPosition:
      "Original sin wounded human nature — darkening the intellect and weakening the will (concupiscence) — but did not destroy free will. Grace does not override freedom; it heals and elevates it so the person can truly, freely cooperate with God's initiative. Both the initial movement toward God and all subsequent growth are gifts of grace, but the human 'yes' is a real, free created cause, not a mere passive reception.",
    catholicCitations: ["CCC 1730, 1993 ('Justification establishes cooperation between God's grace and man's freedom')", "CCC 406 (original sin does not entail 'total corruption')", "Council of Trent, Session VI, ch. 5 and canon 4–5 (against denying free cooperation)"],
    lutheranPosition:
      "In spiritual matters touching salvation, the fallen will has no freedom at all — it is 'bound' and can only sin and resist the Holy Spirit until God regenerates it unilaterally; after regeneration the will can and does cooperate, but the initial turning is entirely God's monergistic act. Luther's Bondage of the Will (1525) frames this as the deepest possible disagreement with Erasmus (and by extension, with the later Tridentine position): to grant any pre-grace contribution from man, however small, is to rob God's grace of its gratuity.",
    lutheranCitations: ["Luther, De Servo Arbitrio (The Bondage of the Will), 1525", "Augsburg Confession, Article XVIII ('Of Free Will') — natural man has civil freedom but not freedom 'to work the righteousness of God'"],
    aquinasView:
      "Aquinas gives Catholics their sharpest tool here: he holds, as strongly as any Reformer, that man cannot prepare himself for grace or merit the first grace by his own natural powers (ST I-II, q.109, a.6 — man cannot move himself to grace 'unless God moves him') — but he holds this while still affirming the will remains a true secondary cause under grace's motion, moved by God yet moving itself (q.111, a.2 on 'operating' and 'cooperating' grace). This is the technical distinction (God as first cause, free will as a real but subordinate second cause) that Trent later used to answer Luther without denying grace's absolute priority.",
    keyVersesCatholic: ["Philippians 2:12–13 ('work out your own salvation... for it is God who works in you')", "Revelation 3:20 (Christ 'stands at the door and knocks' — awaiting a free response)", "Deuteronomy 30:19 ('choose life')", "Acts 7:51 ('you always resist the Holy Spirit')"],
    keyVersesLutheran: ["John 6:44 ('No one can come to me unless the Father... draws him')", "Romans 9:16 ('it depends not on human will or exertion, but on God who has mercy')", "Ephesians 2:1 (dead in sin, before being made alive)", "John 15:5 ('apart from me you can do nothing')"],
    commonGround:
      "Both traditions reject Pelagianism outright and agree the first grace cannot be earned or self-generated. The real daylight is narrower than popular caricature suggests: it is about whether the human will's response to that first grace is a real (if entirely grace-enabled) free cause, or purely a passive effect until regeneration is complete.",
    howToEngage:
      "Acts 7:51 is the single hardest verse for strict monergism to absorb cleanly — Stephen accuses his hearers of resisting the Holy Spirit, which presumes they had the capacity to do otherwise. Use it alongside the operating/cooperating grace distinction (Aquinas) to show the Catholic position isn't semi-Pelagian: grace moves first and entirely enables the response, but the response is still, really, the person's own.",
  },
  {
    id: "sacraments",
    topic: "The Sacraments: Seven Instituted Signs, or Two (Sometimes Three)",
    oneLiner: "Catholic: seven sacraments, all instituted by Christ and really conferring the grace they signify. Lutheran: properly two (Baptism, Eucharist) — sometimes three with Absolution — defined by a visible sign Christ himself commanded joined to a promise of grace.",
    catholicPosition:
      "Christ instituted seven sacraments — Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders, Matrimony — each an efficacious sign of grace, 'instituted by Christ and entrusted to the Church,' which really confer the grace they signify (ex opere operato — by the very fact of the rite being performed, not dependent on the holiness of the minister, though the recipient's disposition matters for fruitfulness).",
    catholicCitations: ["CCC 1113 ('seven sacraments of the New Law')", "CCC 1127–1128 (ex opere operato)", "Council of Trent, Session VII, canon 1 (anathema against denying there are seven)"],
    lutheranPosition:
      "A sacrament requires both a visible element/sign and an explicit divine command and promise attached to it by Christ in Scripture; by this standard, Luther judged only Baptism and the Lord's Supper clearly qualify (he treated Absolution sympathetically in the Catechisms as a return to Baptism, sometimes numbering it a third, but it lacks a distinct physical 'element'). Confirmation, Marriage, Holy Orders, and Anointing are retained as good rites or estates but not sacraments that confer grace in the same sense.",
    lutheranCitations: ["Augsburg Confession, Article XIII ('Of the Use of the Sacraments')", "Apology of the Augsburg Confession, Article XIII (on the Baptism/Eucharist/Absolution count)", "Luther, Small Catechism (Baptism and the Sacrament of the Altar treated at length; the other five are not)"],
    aquinasView:
      "Aquinas's sacramental theology (ST III, qq.60–65) is the direct target Trent defended: a sacrament is a sensible sign that actually causes the grace it signifies (instrumental causality, q.62), and he gives the systematic argument for exactly seven, mapped onto the stages of the spiritual life — birth (Baptism), growth (Confirmation), nourishment (Eucharist), healing from sin (Penance) and from sickness (Anointing), and the two sacraments ordered to the community (Orders, Matrimony) (q.65, a.1).",
    keyVersesCatholic: ["John 20:22–23 (power to forgive sins given to the Apostles)", "James 5:14–15 (anointing the sick with oil, 'and the Lord will raise him up')", "Ephesians 5:32 (marriage called a 'mystery'/sacramentum in the Vulgate)", "2 Timothy 1:6 (grace given 'through the laying on of my hands')"],
    keyVersesLutheran: ["Matthew 28:19 (baptismal command with the explicit institution formula)", "Luke 22:19–20 ('Do this in remembrance of me' — explicit command attached to bread and wine)", "Romans 10:17 ('faith comes from hearing' — emphasis on the Word over additional rites)"],
    commonGround:
      "Neither side disputes the sacramental status of Baptism and the Eucharist, or that both are real means through which God acts, not bare symbols. The dispute is definitional (what counts as a 'sacrament' at all) more than it is about whether, say, confession, marriage, or ordination matter.",
    howToEngage:
      "Grant the Lutheran definition for the sake of argument, then ask why John 20:22–23 and James 5:14–15 don't meet it — both have a specific physical action (breathing/words; anointing with oil) joined to an explicit promise (sins forgiven; the sick will be raised up). The Lutheran count tends to under-weight these two texts specifically.",
  },
  {
    id: "eucharist",
    topic: "The Eucharist: Transubstantiation, or Sacramental/Real Union",
    oneLiner: "Catholic: the bread and wine's whole substance is changed into Christ's Body and Blood, though the appearances remain. Lutheran: Christ is truly, bodily present 'in, with, and under' the bread and wine, which remain bread and wine.",
    catholicPosition:
      "At the consecration, the entire substance of the bread and the entire substance of the wine are changed into the substance of Christ's Body and Blood — transubstantiation — while the accidents (appearance, taste, texture) remain unchanged. This is not symbolic or merely spiritual presence; it is Christ, whole and entire, Body, Blood, Soul, and Divinity, truly, really, and substantially present, offered sacramentially as the same sacrifice of Calvary, re-presented (not repeated) on the altar.",
    catholicCitations: ["CCC 1374–1377 (transubstantiation, citing Trent verbatim)", "CCC 1366 ('one single sacrifice' as Calvary, re-presented)", "Council of Trent, Session XIII, ch. 4 and canon 2"],
    lutheranPosition:
      "Christ's Body and Blood are truly and substantially present 'in, with, and under' the bread and wine (sometimes loosely called 'sacramental union' or, by later theologians, consubstantiation) — but the bread remains bread and the wine remains wine; there is no change of substance, and Luther rejected Aristotelian 'substance/accident' metaphysics as an unnecessary philosophical overlay on a mystery Scripture states plainly ('This is my body'). Luther also firmly rejected calling the Mass a sacrifice offered by the priest — for him it is a testament/gift received, not an oblation made.",
    lutheranCitations: ["Augsburg Confession, Article X ('Of the Supper of the Lord')", "Formula of Concord, Article VII ('Of the Holy Supper'), rejecting both transubstantiation and the Reformed 'spiritual only' view", "Luther, Against the Fanatics / That These Words of Christ Still Stand Firm (1527)"],
    aquinasView:
      "Aquinas gives the fullest philosophical account of exactly the position Luther rejected: in ST III, q.75, he argues the substance of the bread does not remain alongside Christ's Body (a.2 — against what later gets called consubstantiation) because that would mean Christ's Body comes to be where it previously was not by local motion, which is false — rather the whole substance is converted, while the accidents are miraculously sustained without their proper substance (q.77) so that what is seen, tasted, and touched remains bread-like, even though it is not bread.",
    keyVersesCatholic: ["John 6:51–56 ('unless you eat the flesh of the Son of Man... my flesh is true food')", "1 Corinthians 11:27 (warning of judgment for receiving 'unworthily' — implying real presence, not a mere symbol)", "Luke 22:19–20 ('This is my body... this is my blood')"],
    keyVersesLutheran: ["Luke 22:19 ('This is my body' — taken with maximal literalness, against any philosophical gloss)", "1 Corinthians 10:16 ('the bread we break, is it not a participation in the body of Christ?')", "1 Corinthians 11:24 ('Do this in remembrance of me' — Luther stresses the gift-character over sacrificial language)"],
    commonGround:
      "Both affirm the Real Presence against any merely symbolic or spiritual-only view — Lutherans and Catholics are substantially closer to each other here than either is to the Reformed/Zwinglian tradition (which denies bodily presence altogether). Both read John 6 and the Words of Institution with maximal realism.",
    howToEngage:
      "This is the strongest point of agreement to lead with before pivoting to the real difference: if Christ is bodily present in, with, and under the bread (Lutheran), ask what becomes of that presence once the elements are consumed or after the service — the Catholic doctrine (and classical Lutheranism's own historic reticence to speculate past the Words of Institution) both resist reducing the mystery to a mechanism, so argue for the coherence of transubstantiation as metaphysical precision, not an added burden of faith beyond what both already confess about real presence.",
  },
  {
    id: "church-authority",
    topic: "Church Governance: Priesthood of All Believers, or Apostolic Succession and the Papacy",
    oneLiner: "Lutheran: all baptized Christians share one priesthood; pastoral office is a function, not an ontologically distinct order, and no bishop (including Rome's) holds universal jurisdiction. Catholic: a sacramentally distinct ministerial priesthood, received through unbroken apostolic succession, with the Bishop of Rome as the visible head of the whole Church.",
    catholicPosition:
      "Christ built his Church on the Apostles, with Peter given a unique role of strengthening and unifying the others (Luke 22:32, John 21:15–17) that continues in his successors, the Bishops of Rome. Bishops, as successors of the Apostles, and priests, ordained by them, receive a sacramental character in Holy Orders that is distinct in kind (not just function) from the common priesthood of the baptized — both are real and necessary, but the ministerial priesthood exists to serve and build up the common priesthood, not duplicate it.",
    catholicCitations: ["CCC 880–882 (the College of Bishops and its head)", "CCC 1547 ('the ministerial priesthood differs in essence' from the common priesthood)", "Lumen Gentium §18–23 (Vatican II, on episcopal collegiality under the pope)"],
    lutheranPosition:
      "All the baptized constitute a 'royal priesthood' (1 Peter 2:9) with direct access to God requiring no mediating human priesthood between the believer and Christ; the pastoral office is instituted by God for the sake of good order in preaching and administering the sacraments, but it is a function delegated by the congregation of believers, not a separate sacramental order conferring an indelible character. No single bishop, including the Pope, holds divine right to jurisdiction over the whole Church — Luther's Smalcald Articles go so far as to identify the papal claim to such authority with 'the Antichrist.'",
    lutheranCitations: ["Augsburg Confession, Article XXVIII ('Of Ecclesiastical Power')", "Luther, To the Christian Nobility of the German Nation (1520) — on the priesthood of all believers", "Smalcald Articles, Part II, Article IV (on the papacy)"],
    aquinasView:
      "Aquinas affirms the sacramental distinction of Holy Orders directly: priestly ordination confers a permanent spiritual power (character) to consecrate the Eucharist and act in persona Christi that baptism alone does not confer (ST III, q.63, a.6; Supplement, q.34–40 on the sacrament of Orders), and he treats the papal primacy as flowing from Christ's commission to Peter — a position the whole medieval tradition held and that the Reformers were the first within the Western Church to reject outright.",
    keyVersesCatholic: ["Matthew 16:18–19 (Peter, the rock, keys of the kingdom)", "John 21:15–17 ('Feed my sheep')", "Luke 22:32 ('I have prayed for you, that your faith may not fail... strengthen your brothers')", "2 Timothy 1:6 (ordination by the laying on of hands conferring a 'gift')"],
    keyVersesLutheran: ["1 Peter 2:9 ('you are a royal priesthood')", "Revelation 1:6 (Christ 'made us... a kingdom and priests')", "1 Timothy 2:5 ('one mediator between God and men, the man Christ Jesus')", "Galatians 2:11 (Paul publicly corrects Peter — cited as evidence Peter held no supreme, unaccountable authority)"],
    commonGround:
      "Both affirm a real priesthood of all the baptized by virtue of baptism, and both retain an ordained pastoral office that is not optional or purely a human arrangement — classical Lutheranism never adopted congregationalism or denied the office is divinely instituted, it denies only its sacramental/ontological distinctness and the papacy's universal jurisdiction.",
    howToEngage:
      "Galatians 2:11 is the verse most often raised against Petrine primacy — answer it by distinguishing primacy of jurisdiction/teaching authority from personal impeccability: the Catholic claim has never been that Peter (or any pope) cannot sin or err in private judgment, only that he cannot bind the whole Church to formal doctrinal error when speaking in his official capacity (and even that guarantee — infallibility — is itself a 19th-century-defined, narrowly scoped claim, not a blanket one).",
  },
  {
    id: "purgatory",
    topic: "Purgatory, Indulgences, and Prayer for the Dead",
    oneLiner: "Catholic: the dead who die in God's friendship but imperfectly purified undergo a final purification before heaven, which the living can assist through prayer, Mass, and indulgences. Lutheran: purgatory and indulgences are rejected outright as unscriptural and as the very occasion of the Reformation.",
    catholicPosition:
      "Those who die in God's grace but are not yet perfectly purified of attachment to sin undergo purification after death — purgatory — before entering the joy of heaven; this is utterly different in kind from hell and is a state of certain salvation, not a 'second chance.' The living can help the souls in purgatory through prayer, almsgiving, and especially the Mass, and through indulgences, which apply the Church's treasury of merit (Christ's and the saints') to remit the temporal debt still owed. The indulgence abuses Luther protested (the sale of indulgences, hawked with exaggerated promises) were themselves later condemned by the Church's own reforms (e.g., Trent's own decree against indulgence abuse, 1563).",
    catholicCitations: ["CCC 1030–1032 (purgatory as final purification)", "CCC 1471–1479 (indulgences and the treasury of the Church)", "Council of Trent, Session XXV, Decree on Purgatory and Decree on Indulgences (which explicitly condemns abuses)"],
    lutheranPosition:
      "Purgatory has no basis in Scripture and was, in Luther's judgment, invented to justify a lucrative trade in indulgences that obscured the sufficiency of Christ's one atonement and the finality of justification by faith; Thesis 1 of the Ninety-Five Theses already reframes all of life as repentance, and later theses attack the claim that the pope can remit the temporal punishment of souls in purgatory by indulgence at all. The dead are either with Christ or not; there is no intermediate purification process the living can affect.",
    lutheranCitations: ["Luther, Ninety-Five Theses, §§5–29 (on indulgences and papal power over purgatory)", "Augsburg Confession, Article XXI and the Apology's broader rejection of satisfaction-based practices tied to purgatory"],
    aquinasView:
      "Aquinas treats purgatory as a settled doctrine, not a speculative opinion, grounded in the justice and mercy of God: souls who die truly contrite but with unexpiated temporal debt or unpurged attachment to venial sin are cleansed by a purifying punishment before admission to the vision of God (Supplement, qq.69–71), and he affirms suffrages (prayers, Masses, alms) offered by the living genuinely help them by the bond of charity in the Communion of Saints (Suppl., q.71, a.1) — centuries before indulgence sales became the flashpoint that triggered the Reformation.",
    keyVersesCatholic: ["2 Maccabees 12:44–46 (prayer and sin-offerings for the dead 'that they might be delivered from their sin')", "1 Corinthians 3:11–15 (built on the foundation, yet suffering loss, 'saved, but only as through fire')", "Matthew 5:26 (paying 'the last penny' — read patristically as purgative)", "2 Timothy 1:16–18 (Paul prays for the deceased Onesiphorus, 'may the Lord grant him mercy on that Day')"],
    keyVersesLutheran: ["Luke 23:43 ('Today you will be with me in paradise' — immediate, not delayed, entry)", "Hebrews 9:27 ('it is appointed for man to die once, and after that comes judgment' — no intermediate stage named)", "2 Maccabees rejected from the Protestant canon entirely, removing its chief textual basis"],
    commonGround:
      "Both sides condemn the historical abuse of indulgence-selling as a corruption; the Church's own Trent decree agrees abuses occurred. The real disagreement is upstream of practice — it's about the canon (is 2 Maccabees Scripture?) and about whether any purification after death is compatible with 'faith alone, apart from works.'",
    howToEngage:
      "1 Corinthians 3:15 is the single hardest New Testament text (independent of the deuterocanon) for a flat denial of any post-mortem purifying process — Paul describes a person whose work is burned yet who 'himself will be saved... through fire.' Lead there rather than with indulgences, which concedes the historically weakest ground first.",
  },
  {
    id: "mary-saints",
    topic: "Mary and the Saints: Intercession and Veneration",
    oneLiner: "Catholic: the saints in heaven, especially Mary, can be asked to intercede for us, and are honored (not worshiped) with veneration; Mary holds a unique place as Mother of God, Immaculate, Assumed. Lutheran: Christ alone is mediator; honoring Mary as a model of faith is fine, but invoking saints in prayer and Marian dogmas beyond Scripture are rejected.",
    catholicPosition:
      "The saints in heaven are alive in Christ and their prayers for us, like the prayers of any living Christian, are real and effective (the Communion of Saints); asking for their intercession no more competes with Christ's unique mediatorship than asking a friend on earth to pray for you does. Mary receives a distinct veneration (hyperdulia, greater than that given other saints but infinitely less than the adoration (latria) owed to God alone) because of her unique role as Theotokos, and the Church holds as dogma her Immaculate Conception (1854) and bodily Assumption (1950) — both understood as flowing from, not added to, her unique role in the Incarnation.",
    catholicCitations: ["CCC 956, 2683 (intercession of the saints in the Communion of Saints)", "CCC 971, 2673–2679 (veneration of Mary; distinction from adoration)", "CCC 490–493, 966 (Immaculate Conception and Assumption)"],
    lutheranPosition:
      "There is 'one mediator between God and men' (1 Timothy 2:5), and Scripture nowhere commands or models praying to the saints or to Mary for intercession; the Apology of the Augsburg Confession allows that the saints should be honored as examples of faith to imitate but explicitly rejects invoking them as a liturgical practice as lacking scriptural warrant and risking Christ's unique mediatorial role. Luther himself retained real devotion to Mary (he continued, for a time, to affirm her perpetual virginity and even spoke approvingly of calling her Theotokos), but later Lutheranism firmly rejected the Immaculate Conception and Assumption as unscriptural dogmas binding consciences beyond what Scripture requires.",
    lutheranCitations: ["Apology of the Augsburg Confession, Article XXI ('Of the Worship of the Saints')", "Augsburg Confession, Article XXI", "Luther's Smalcald Articles (rejecting invocation of saints as a 'Romish abuse')"],
    aquinasView:
      "Aquinas carefully distinguishes the honor owed to Mary (hyperdulia) from the worship (latria) owed to God alone — the exact distinction Trent and the modern Catechism preserve — and grounds the fittingness of asking the saints' intercession in the same logic Paul uses when he asks living Christians to pray for him (ST, Suppl., q.72 on invoking saints; II-II q.83, a.4 on asking others to pray for us as an act of charity, not a diminishment of Christ's mediation, since the saints' intercession is itself entirely dependent on and subordinate to Christ's).",
    keyVersesCatholic: ["Luke 1:28, 48 ('full of grace'; 'all generations will call me blessed')", "Revelation 5:8 (the twenty-four elders in heaven present 'the prayers of the saints')", "James 5:16 ('the prayer of a righteous person has great power' — a fortiori, the saints in heaven)", "John 2:3–5 (Mary's intercession at Cana, honored by Christ's response)"],
    keyVersesLutheran: ["1 Timothy 2:5 ('one mediator between God and men, the man Christ Jesus')", "1 John 2:1 ('we have an advocate with the Father, Jesus Christ the righteous')", "Hebrews 4:16 ('let us... draw near to the throne of grace' — direct access, no intermediary named)"],
    commonGround:
      "Neither tradition denies the saints are alive with Christ, or that Mary deserves profound honor as the Mother of the Lord (classical Lutheranism, unlike later low-church Protestantism, retained real Marian devotion and feast days for centuries). The dispute is narrower than it looks: whether asking a saint's intercession is itself biblically warranted devotion or an unwarranted liturgical innovation, and whether any doctrine not explicit in Scripture (Immaculate Conception, Assumption) can bind as dogma.",
    howToEngage:
      "Revelation 5:8 is the strongest single text — it depicts departed/heavenly beings actively presenting the prayers of believers to God, which is functionally what Catholics mean by intercession of the saints. Combine it with the ordinary, uncontroversial Protestant practice of asking a living friend to pray for you: once that's granted as biblical and not a violation of 1 Timothy 2:5, the only remaining question is whether death ends a Christian's ability to love and intercede for others — and Hebrews 12:1's 'great cloud of witnesses' suggests otherwise.",
  },
];

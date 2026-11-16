export interface CCCText {
  num: string;
  text: string;
}

export interface MagisterialDocument {
  title: string;
  issuedBy: string;
  year: string;
  summary: string;
}

export interface TerminologyPoint {
  term: string;
  explanation: string;
}

export interface ObjectionResponse {
  objection: string;
  response: string;
}

export const CCC_TEXTS: CCCText[] = [
  {
    num: "2357",
    text:
      "Homosexuality refers to relations between men or between women who experience an exclusive or predominant sexual attraction toward persons of the same sex. It has taken a great variety of forms through the centuries and in different cultures. Its psychological genesis remains largely unexplained. Basing itself on Sacred Scripture, which presents homosexual acts as acts of grave depravity, tradition has always declared that \"homosexual acts are intrinsically disordered.\" They are contrary to the natural law. They close the sexual act to the gift of life. They do not proceed from a genuine affective and sexual complementarity. Under no circumstances can they be approved.",
  },
  {
    num: "2358",
    text:
      "The number of men and women who have deep-seated homosexual tendencies is not negligible. This inclination, which is objectively disordered, constitutes for most of them a trial. They must be accepted with respect, compassion, and sensitivity. Every sign of unjust discrimination in their regard should be avoided. These persons are called to fulfill God's will in their lives and, if they are Christians, to unite to the sacrifice of the Lord's Cross the difficulties they may encounter from their condition.",
  },
  {
    num: "2359",
    text:
      "Homosexual persons are called to chastity. By the virtues of self-mastery that teach them inner freedom, at times by the support of disinterested friendship, by prayer and sacramental grace, they can and should gradually and resolutely approach Christian perfection.",
  },
  {
    num: "2396",
    text:
      "Among the sins gravely contrary to chastity are masturbation, fornication, pornography, and homosexual practices.",
  },
];

export const AQUINAS_NATURAL_LAW = {
  reference: "Summa Theologiae, II-II, q.154, a.11 — 'Whether the unnatural vice is a species of lust?'",
  summary:
    "Aquinas classifies sins against chastity by how far they depart from the natural order of the generative act. Within that framework he treats what he calls 'the unnatural vice' (vitium contra naturam) — along with masturbation, bestiality, and sodomy as he understood the term — as departing from nature's order more gravely than fornication or adultery, precisely because those other sins at least preserve the natural form of the act (apt in itself for generation) even when circumstances make them otherwise wrong. The underlying principle, consistent with the Marriage and Sexual Ethics entry in the Natural Law catalog, is that the venereal act is naturally ordered to both union and the generation of offspring, and an act that structurally cannot serve that end is 'against nature' in a way fornication is not.",
  modernNote:
    "This is a 13th-century scholastic classification, not itself the Church's current pastoral language — the Catechism does not use Aquinas's technical ranking of sins. It is presented here as the historical natural-law root that CCC 2357's phrase 'contrary to the natural law' draws on, not as the full or final word the Church uses to address real people today (see the Pastoral Care and Terminology sections below).",
};

export const MAGISTERIAL_DOCUMENTS: MagisterialDocument[] = [
  {
    title: "Persona Humana (Declaration on Certain Questions Concerning Sexual Ethics)",
    issuedBy: "Congregation for the Doctrine of the Faith",
    year: "1975",
    summary:
      "One of the first modern magisterial documents to address homosexuality directly. It distinguishes homosexuals 'whose definitive disposition' is such 'almost innate' from those whose homosexuality is 'transitory' or from other causes, and states that while the condition itself must be judged with pastoral care, homosexual acts themselves 'are intrinsically disordered and can in no case be approved of' — the direct source of CCC 2357's language.",
  },
  {
    title: "Letter to the Bishops of the Catholic Church on the Pastoral Care of Homosexual Persons (\"Homosexualitatis Problema\")",
    issuedBy: "Congregation for the Doctrine of the Faith (Cardinal Ratzinger)",
    year: "1986",
    summary:
      "Clarifies that while the inclination itself is 'not a sin,' it is 'a more or less strong tendency ordered toward an intrinsic moral evil' and so 'must be seen as an objective disorder' — the direct source of CCC 2358's 'objectively disordered' language about the inclination (distinct from the act). Explicitly condemns violence and unjust discrimination against homosexual persons while rejecting arguments that the inclination itself is morally neutral.",
  },
  {
    title: "Considerations Regarding Proposals to Give Legal Recognition to Unions Between Homosexual Persons",
    issuedBy: "Congregation for the Doctrine of the Faith",
    year: "2003",
    summary:
      "Addresses civil recognition of same-sex unions specifically (as distinct from the moral status of acts or persons), arguing the state has no basis to grant marriage's legal status to unions that cannot fulfill marriage's natural ends, and that Catholic legislators have a duty in conscience to oppose such laws.",
  },
  {
    title: "Ministry to Persons with a Homosexual Inclination: Guidelines for Pastoral Care",
    issuedBy: "United States Conference of Catholic Bishops (USCCB)",
    year: "2006",
    summary:
      "A pastoral (not doctrinal) document applying CCC 2357–2359 to parish life in the U.S.: urges welcoming persons with same-sex attraction into the sacramental and community life of the Church, explicit opposition to unjust discrimination and violence, encouragement of chastity-based support (naming the Courage apostolate), and caution against both rejection and 'approval of homosexual activity or a gay lifestyle.'",
  },
  {
    title: "Amoris Laetitia, §250–251",
    issuedBy: "Pope Francis",
    year: "2016",
    summary:
      "Reaffirms 'every person, regardless of sexual orientation, ought to be respected in his or her dignity and treated with consideration,' condemns 'every sign of unjust discrimination,' and states plainly that the Church has 'no basis for considering homosexual unions to be in any way similar or even remotely analogous to God's plan for marriage and family' — pastoral warmth paired with unchanged doctrine.",
  },
  {
    title: "Fiducia Supplicans",
    issuedBy: "Dicastery for the Doctrine of the Faith (approved by Pope Francis)",
    year: "2023",
    summary:
      "Authorizes brief, non-liturgical blessings of individuals in same-sex (and other 'irregular') relationships who request one, explicitly as a blessing of the persons, not of the union or relationship itself. The document repeatedly insists it 'does not in any way approve' of same-sex unions, introduces no change to the doctrine on marriage or to CCC 2357–2359, and forbids any rite, liturgical form, or anything resembling a wedding. It was controversial even among bishops (some conferences, e.g. several African bishops' conferences, publicly declined to implement it, citing pastoral and cultural concerns, with Rome's acknowledgment that local application could vary) — presented here as Report: a real, still-debated document, not settled universal practice.",
  },
];

export const TERMINOLOGY: TerminologyPoint[] = [
  {
    term: "Inclination vs. Act",
    explanation:
      "The Church's moral evaluation targets homosexual acts, not persons, and treats the involuntary inclination itself as morally neutral in the sense that having it is not a sin (CDF 1986). What CCC 2358 calls 'objectively disordered' is the inclination considered as a tendency ordered toward acts the Church judges objectively wrong — a claim about the orientation's structure relative to natural ends, not a claim that a person who experiences it has thereby sinned or is of lesser worth.",
  },
  {
    term: "\"Intrinsically disordered\" (acts) vs. \"objectively disordered\" (inclination)",
    explanation:
      "These are two distinct technical phrases often conflated in popular debate. CCC 2357 calls the acts themselves 'intrinsically disordered' — wrong by their nature, in every circumstance. CCC 2358 calls the inclination 'objectively disordered' — not a sin, but oriented toward something the Church judges not to be a true human good. Critics (including some Catholic moral theologians) have argued the 'disordered' language is pastorally harsh; defenders note the Latin original (inclinatio... objective inordinata) is a technical judgment about teleological ordering, structurally the same kind of language the Catechism uses for any disordered appetite (e.g., CCC 377 on concupiscence generally), not a unique singling-out.",
  },
  {
    term: "\"Gay Catholic\" vs. \"person experiencing same-sex attraction\"",
    explanation:
      "A live, ongoing pastoral and linguistic debate within the Church, not a settled doctrinal point. Some priests, theologians, and ministries (most visibly Fr. James Martin, S.J. and the Outreach ministry) use identity language like 'gay Catholic' and emphasize welcome and belonging. Others (most visibly the Courage apostolate and many bishops' pastoral letters) deliberately avoid identity-based language, preferring 'persons with same-sex attraction,' on the grounds that sexual attraction should not be treated as identity-constituting. Both approaches claim fidelity to CCC 2358's call for 'respect, compassion, and sensitivity'; this is a real disagreement among faithful Catholics about pastoral method, not a doctrinal dispute about CCC 2357–2359 itself.",
  },
  {
    term: "Unjust discrimination",
    explanation:
      "CCC 2358 explicitly condemns 'every sign of unjust discrimination' against persons with same-sex attraction. The word 'unjust' is doing real work: the Church does not teach all distinctions based on sexual orientation are wrongful (e.g., she maintains the right to decline same-sex civil marriage recognition, Holy Orders, or employment in certain ministerial roles) but does teach that violence, hatred, mockery, housing or employment discrimination untethered to a legitimate reason, and similar treatment are themselves sins against charity and justice.",
  },
];

export const PASTORAL_CARE = {
  courage: {
    name: "Courage International",
    description:
      "An apostolate of the Catholic Church, endorsed by the USCCB's 2006 pastoral guidelines, offering support groups, spiritual direction, and fellowship for Catholics with same-sex attraction who seek to live chastely in accord with Church teaching. Its sister apostolate, EnCourage, supports family members and friends.",
  },
  callToChastity:
    "CCC 2359 frames the call positively, not merely as prohibition: persons with same-sex attraction are called to the same chastity asked of every unmarried Christian (and, differently, of every married Christian) — growth in self-mastery and inner freedom, supported by friendship, prayer, and sacramental grace, moving toward 'Christian perfection.' The Church's framework is that this demand is difficult but not inhuman, following the same logic applied to every Christian's call to chastity according to his or her state in life (CCC 2337–2350 more broadly).",
  developmentVsChange:
    "A frequent objection asks whether this teaching could develop the way teaching on usury, slavery, or religious liberty developed. The Church's own distinction (echoed in Ordinatio Sacerdotalis and elsewhere on other topics) is between disciplinary/practical applications, which can develop, and judgments concerning intrinsic moral evil tied to natural law and consistent biblical witness, which the Magisterium holds itself unable to reverse. Whether that distinction is persuasively drawn in this specific case is itself part of the live theological debate — presented here as a real argument to engage, not resolved by assertion.",
};

export const OBJECTIONS: ObjectionResponse[] = [
  {
    objection: "People are born this way — a condition someone didn't choose can't be morally wrong.",
    response:
      "The Church's own teaching already concedes the premise: CDF 1986 and CCC 2358 both treat the inclination itself as not sinful, regardless of its origin (which the Catechism itself says 'remains largely unexplained,' CCC 2357). The moral claim is narrower and about something chosen — the act, not the attraction. The structurally parallel case the Church itself uses elsewhere: an unchosen, deep-seated inclination toward e.g. anger, or a heterosexual person's unchosen attraction toward someone other than their spouse, isn't sinful either, but acting on it still can be. The 'born this way' argument answers a question (is the inclination blameworthy?) the Church already answered the same way; it doesn't by itself settle the separate question of whether acting on the inclination is good.",
  },
  {
    objection: "Jesus never said a single word about homosexuality in the Gospels — why should it matter so much to His Church?",
    response:
      "True as a textual observation, but it proves less than it seems to: Jesus also says nothing explicit about, for instance, bestiality, incest, or a number of other sexual sins universally held wrong in the Judaism of his time — his silence reflects that these were not contested questions among his Jewish audience, not that he set aside the Torah's sexual ethic. Jesus does explicitly affirm the Genesis creation account of marriage as one man and one woman becoming 'one flesh' as the normative pattern (Matthew 19:4–6), which is the same positive teleology of sexuality (procreative and unitive, male-female complementarity) that CCC 2357 appeals to, and he raises the Torah's moral demands rather than relaxing them (Matthew 5:17–48).",
  },
  {
    objection: "'Love is love' — the Church teaches you should love your neighbor, so why withhold approval of loving relationships?",
    response:
      "The Church does not dispute that real affection, loyalty, and self-sacrifice can exist between two people of the same sex, or call that affection itself sinful (friendship and even deep love between persons of the same sex is praised elsewhere in the tradition, e.g. in Aquinas's treatment of friendship, ST II-II q.23–26). The Church's claim is specifically about the sexual act's structure and ends, not about the reality or value of love or companionship as such — CCC 2347 explicitly commends 'the treasures of friendship offered by God' to those called to continence. Collapsing 'love' and 'the moral status of a specific genital act' is, on the Church's own terms, the move actually in dispute, not a premise both sides already share.",
  },
  {
    objection: "The 'intrinsically disordered' language is needlessly harsh and has caused real pastoral harm.",
    response:
      "This is a fair and widely made criticism, including from within the Church — it is reported here honestly rather than dismissed. Some bishops, theologians, and pastoral workers (not dissenting from the substance of the teaching) have argued the phrase is easily misheard as a claim about the person rather than the act, and have proposed or practiced gentler framing while maintaining the same underlying moral judgment (e.g. emphasizing CCC 2358's 'respect, compassion, and sensitivity' and the condemnation of unjust discrimination as equally binding, not as an asterisk). The Church has not revised the CCC's wording as of this writing; the pastoral-language debate and the doctrinal content are separable, and conflating 'I think this phrase is pastorally counterproductive' with 'therefore the underlying moral teaching is false' is a non sequitur worth naming explicitly when it comes up.",
  },
];

export const RELATED_GLOSSARY_TERMS = [
  "Natural Law",
  "Intrinsically Disordered",
  "Concupiscence",
  "Chastity",
  "Theology of the Body",
  "Complementarity",
  "Magisterium",
  "Development of Doctrine",
];

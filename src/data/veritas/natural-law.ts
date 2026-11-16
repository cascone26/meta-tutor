export interface NaturalLawTopic {
  topic: string;
  naturalLawArgument: string;
  aquinasReference: string;
  modernApplication: string;
  commonObjection: string;
  response: string;
}

export const NATURAL_LAW_TOPICS: NaturalLawTopic[] = [
  {
    topic: "The Existence of Natural Law",
    naturalLawArgument: "Natural law is the rational creature's participation in the eternal law of God. Since human beings have reason, they can discern the fundamental principles of good and evil inscribed in human nature itself. The first principle: good is to be done and pursued, and evil is to be avoided.",
    aquinasReference: "ST I-II, q.91, a.2 — 'The natural law is nothing else than the rational creature's participation of the eternal law.'",
    modernApplication: "Natural law grounds the idea of universal human rights. The UN Declaration of Human Rights implicitly appeals to natural law — rights that exist prior to any government's decree.",
    commonObjection: "Natural law is just a Catholic invention to impose religious morality on everyone.",
    response: "Natural law predates Christianity. Aristotle, Cicero, and the Stoics all recognized it. It is accessible to reason alone, which is why Paul says even Gentiles 'do by nature things required by the law' (Romans 2:14-15). You don't need to be Catholic to recognize that murder is wrong."
  },
  {
    topic: "The Sanctity of Human Life",
    naturalLawArgument: "Human life is inviolable because the human person is made in the image of God and possesses inherent dignity by nature, not by convention. Directly killing an innocent human being is always intrinsically evil.",
    aquinasReference: "ST II-II, q.64, a.6 — 'It is in no way lawful to slay the innocent.'",
    modernApplication: "Applies to abortion, euthanasia, embryo destruction, and capital punishment. The consistent ethic of life flows from natural law.",
    commonObjection: "A fetus isn't a person — it's just a clump of cells.",
    response: "From the moment of conception, the embryo has a complete and unique human genome, directing its own development. It is not a part of the mother's body but a distinct human organism at the earliest stage of development. The question 'When does personhood begin?' is a philosophical question — and the only non-arbitrary answer is conception."
  },
  {
    topic: "Marriage and Sexual Ethics",
    naturalLawArgument: "Marriage is the natural institution ordered to two inseparable ends: the procreation and education of children, and the mutual good of the spouses. The sexual act has an inherent teleology — it is ordered to both union and procreation, and these ends may not be deliberately separated.",
    aquinasReference: "ST Suppl., q.41, a.1 — Marriage is 'the union of man and woman for the purpose of generating and rearing offspring.'",
    modernApplication: "Grounds the Church's teaching on contraception (Humanae Vitae), same-sex unions, and the indissolubility of marriage.",
    commonObjection: "Love is love. Who are you to tell people who they can marry?",
    response: "The natural law argument isn't about feelings — it's about the nature of the institution. Marriage as a natural institution is defined by its ordering to procreation and the complementarity of the sexes. This isn't bigotry; it's biology and metaphysics. Two men can love each other deeply, but that relationship is a different kind of union than marriage."
  },
  {
    topic: "The Common Good",
    naturalLawArgument: "Human beings are social by nature. The common good is the set of conditions that allow individuals and groups to reach their fulfillment more fully and more easily. Government exists to serve the common good, not the interests of the powerful.",
    aquinasReference: "ST I-II, q.90, a.2 — 'Law is an ordinance of reason for the common good, made by him who has care of the community.'",
    modernApplication: "Critiques both libertarian individualism (which denies social obligation) and collectivism (which absorbs the individual into the state). Supports subsidiarity — decisions made at the lowest competent level.",
    commonObjection: "The common good is just a cover for government overreach.",
    response: "The common good is not the 'greatest good for the greatest number' (utilitarianism) nor the state's interest. It is the conditions that allow every person to flourish — including protection of individual rights. Subsidiarity is built into the concept: the state should do only what lower communities cannot."
  },
  {
    topic: "Private Property",
    naturalLawArgument: "The right to private property is natural because it flows from the natural law principles of self-preservation and human industriousness. However, property has a social mortgage — the goods of the earth are destined for all, and the right to property is subordinate to the universal destination of goods.",
    aquinasReference: "ST II-II, q.66, a.2 — 'It is lawful for man to possess things as his own... The common ownership of things is to be attributed to natural law.'",
    modernApplication: "Rejects both absolute property rights (libertarianism) and abolition of private property (communism). Supports just wages, limits on accumulation, and the duty to share with the poor.",
    commonObjection: "Aquinas said it's okay to steal if you're starving — doesn't that undermine property rights?",
    response: "Yes, Aquinas teaches that in extreme necessity, taking what you need to survive is not theft (ST II-II, q.66, a.7). This doesn't undermine property rights — it shows that property rights are real but not absolute. The right to life is more fundamental than the right to property."
  },
  {
    topic: "Just War",
    naturalLawArgument: "War can be just if it meets strict criteria: (1) declared by legitimate authority, (2) for a just cause (defense against aggression), (3) with right intention (not revenge or domination), and (4) as a last resort with proportionate means.",
    aquinasReference: "ST II-II, q.40, a.1 — Three conditions for a just war: authority of the sovereign, just cause, and right intention.",
    modernApplication: "Applied to modern military ethics, humanitarian intervention, nuclear deterrence, and the responsibility to protect (R2P).",
    commonObjection: "Jesus said to turn the other cheek. Christians shouldn't fight wars.",
    response: "Turning the other cheek is about personal insult, not defense of the innocent. Aquinas distinguishes between personal patience (a virtue) and the duty of those in authority to protect the common good. A ruler who fails to defend his people against aggression sins against justice."
  },
  {
    topic: "Lying and Truth-Telling",
    naturalLawArgument: "Lying is intrinsically evil because speech is naturally ordered to communicating truth. A lie perverts the natural faculty of speech and violates the trust that makes human community possible.",
    aquinasReference: "ST II-II, q.110, a.3 — 'A lie is sinful not only because it causes harm to one's neighbor, but because of its own inordinate quality.'",
    modernApplication: "Applies to media ethics, political speech, advertising, and the question of whether one may lie to protect the innocent (e.g., hiding Jews from Nazis).",
    commonObjection: "What about lying to save someone's life? Surely that's justified.",
    response: "Aquinas holds that lying is always wrong, but one may use mental reservation, ambiguity, or silence. The Catechism (CCC 2489) teaches that one need not reveal the truth to those who have no right to it. You don't have to lie to Nazis — you can refuse to answer, misdirect without lying, or simply say nothing."
  },
  {
    topic: "Capital Punishment",
    naturalLawArgument: "Aquinas held that the state has the authority to execute criminals for the common good, just as a surgeon may amputate a limb to save the body. However, this authority is limited to cases of absolute necessity.",
    aquinasReference: "ST II-II, q.64, a.2 — 'If a man be dangerous and infectious to the community, on account of some sin, it is praiseworthy and advantageous that he be killed.'",
    modernApplication: "The Church's position has developed. The 2018 revision of the Catechism (CCC 2267) declares the death penalty 'inadmissible' because modern prison systems can protect society without killing.",
    commonObjection: "Aquinas supported the death penalty. How can the Church reverse his teaching?",
    response: "The Church hasn't reversed the principle (the state's right to protect the common good) but has applied it differently to modern circumstances. Aquinas's argument rested on necessity — when no other means could protect society. Modern states have other means. Development of doctrine applies principles to new situations."
  },
  {
    topic: "Contraception",
    naturalLawArgument: "Contraception is contrary to natural law because it deliberately frustrates the procreative end of the sexual act. The sexual faculty is naturally ordered to procreation, and to use it while deliberately blocking that end is to act against nature.",
    aquinasReference: "ST II-II, q.154, a.1 — Sins against nature are those that go against the natural order of the sexual act. Cf. Humanae Vitae (1968).",
    modernApplication: "Distinguishes between artificial contraception (always wrong) and Natural Family Planning (morally licit because it cooperates with natural cycles rather than suppressing them).",
    commonObjection: "NFP and contraception have the same intent — avoiding pregnancy. What's the difference?",
    response: "Intent is necessary but not sufficient for moral analysis. You also need to consider the act itself. NFP respects the natural integrity of the act — the couple abstains during fertile periods rather than corrupting a fertile act. The difference is between not eating and eating then purging: same result, different moral quality."
  },
  {
    topic: "Euthanasia and Assisted Suicide",
    naturalLawArgument: "Directly killing an innocent person — including oneself — is always intrinsically evil. Life is a gift from God, and we are stewards, not owners, of our lives. However, one is not obligated to pursue extraordinary or disproportionate medical treatment.",
    aquinasReference: "ST II-II, q.64, a.5 — 'It is altogether unlawful to kill oneself... because life is God's gift to man, and is subject to His power.'",
    modernApplication: "Applies to physician-assisted suicide, euthanasia laws, withdrawal of life support, and palliative care ethics. The principle of double effect allows pain management even if it shortens life.",
    commonObjection: "It's compassionate to end suffering. Why force someone to suffer?",
    response: "Compassion means 'to suffer with,' not 'to kill.' The answer to suffering is not to kill the sufferer but to accompany them, manage their pain, and surround them with love. Palliative care can manage virtually all pain. The real danger is a culture that says some lives aren't worth living."
  },
  {
    topic: "Religious Liberty",
    naturalLawArgument: "The human person has a natural right to seek truth and to follow conscience in matters of religion, free from coercion. This right belongs to the dignity of the human person, not to the truth or falsity of any particular religion.",
    aquinasReference: "ST II-II, q.10, a.8 — 'The rites of unbelievers... are not to be tolerated on account of evil therefrom, but may be tolerated to avoid a greater evil or for some good.' Cf. Dignitatis Humanae (1965).",
    modernApplication: "Grounds the Church's defense of religious freedom worldwide, including for non-Catholics. Critiques both state atheism and theocratic coercion.",
    commonObjection: "Didn't the Church used to support state coercion of heretics? The Inquisition?",
    response: "Yes, and the Church has acknowledged this was wrong. Dignitatis Humanae (Vatican II) affirmed religious liberty as a natural right. This is development of doctrine, not contradiction — the Church always held that faith must be free (ST II-II, q.10, a.8); it took time to fully work out the implications."
  },
  {
    topic: "The Principle of Double Effect",
    naturalLawArgument: "An action with both good and bad effects is morally permissible if: (1) the act itself is good or neutral, (2) the good effect is intended and the bad effect is foreseen but not intended, (3) the bad effect is not the means to the good effect, and (4) there is proportionate reason.",
    aquinasReference: "ST II-II, q.64, a.7 — Aquinas's treatment of self-defense, where killing the aggressor is foreseen but not intended.",
    modernApplication: "Applied in medical ethics (pain management that shortens life), military ethics (civilian casualties in legitimate targets), and bioethics (removing a cancerous uterus in pregnancy).",
    commonObjection: "This sounds like a loophole to justify anything.",
    response: "The four conditions are strict, not loose. The bad effect cannot be intended (condition 2) and cannot be the means to the good effect (condition 3). You can't bomb civilians to demoralize the enemy — that uses the bad effect as a means. You can attack a military target knowing civilians nearby may be harmed, if the military necessity is proportionate."
  },
];

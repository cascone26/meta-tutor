export interface Virtue {
  name: string;
  type: "theological" | "cardinal" | "capital-sin" | "gift" | "fruit" | "beatitude";
  description: string;
  aquinasRef: string;
  opposingVice?: string;
}

export const VIRTUES: Virtue[] = [
  {
    name: "Faith",
    type: "theological",
    description:
      "The theological virtue by which we believe in God and believe all that He has said and revealed to us, and that Holy Church proposes for our belief, because He is truth itself. Faith is an act of the intellect assenting to divine truth by command of the will moved by God through grace (CCC 1814).",
    aquinasRef:
      "ST II-II, qq. 1-16. Thomas defines faith as the habit by which the intellect is determined to assent to things not seen, on the authority of God revealing. Faith is the substance of things hoped for, the evidence of things not seen (Hebrews 11:1). It is the first of the theological virtues because it is the foundation of the entire spiritual life.",
    opposingVice: "Unbelief (Infidelity)",
  },
  {
    name: "Hope",
    type: "theological",
    description:
      "The theological virtue by which we desire the kingdom of heaven and eternal life as our happiness, placing our trust in Christ's promises and relying not on our own strength but on the help of the grace of the Holy Spirit (CCC 1817). Hope keeps us from discouragement, sustains us during desolation, and opens our hearts in expectation of eternal beatitude.",
    aquinasRef:
      "ST II-II, qq. 17-22. Thomas teaches that hope is a movement of the appetitive power toward a future good that is arduous but possible to obtain with divine help. Its object is eternal beatitude — the vision of God. Hope presupposes faith (we must believe in the good we hope for) and is perfected by charity.",
    opposingVice: "Despair / Presumption",
  },
  {
    name: "Charity (Love)",
    type: "theological",
    description:
      "The theological virtue by which we love God above all things for His own sake, and our neighbor as ourselves for the love of God. Charity is the form of all the virtues — it animates and gives supernatural merit to all other virtues (CCC 1822-1829). Without charity, the other virtues are dead.",
    aquinasRef:
      "ST II-II, qq. 23-46. Thomas calls charity the 'mother and root of all virtues' (mater et radix omnium virtutum) because it directs all virtues to their ultimate end — union with God. Charity is friendship with God (amicitia Dei), a mutual indwelling of love between God and the soul. It is the greatest of the theological virtues (1 Corinthians 13:13).",
    opposingVice: "Hatred of God",
  },
  {
    name: "Prudence",
    type: "cardinal",
    description:
      "The virtue that disposes practical reason to discern our true good in every circumstance and to choose the right means of achieving it. Prudence is the 'charioteer of the virtues' — it guides the other virtues by setting rule and measure (CCC 1806). It is not mere caution or timidity but right reason applied to action (recta ratio agibilium).",
    aquinasRef:
      "ST II-II, qq. 47-56. Thomas identifies prudence as the most necessary of the cardinal virtues because without it, the other moral virtues cannot function properly. Prudence has three acts: counsel (deliberation), judgment (evaluation), and command (execution). Its integral parts include memory, understanding, docility, shrewdness, reason, foresight, circumspection, and caution.",
    opposingVice: "Imprudence / Negligence",
  },
  {
    name: "Justice",
    type: "cardinal",
    description:
      "The moral virtue that consists in the constant and firm will to give God and neighbor what is due to them. Justice toward God is called the 'virtue of religion' and toward men disposes one to respect the rights of each and to establish harmony in human relationships (CCC 1807). It is the only cardinal virtue that perfects the will rather than the passions.",
    aquinasRef:
      "ST II-II, qq. 57-122. Thomas's treatise on justice is the longest section of the Summa. He distinguishes commutative justice (between individuals), distributive justice (of the community toward individuals), and legal justice (of individuals toward the common good). The virtue of religion, which renders to God what is due, is the highest part of justice.",
    opposingVice: "Injustice",
  },
  {
    name: "Fortitude",
    type: "cardinal",
    description:
      "The moral virtue that ensures firmness in difficulties and constancy in the pursuit of the good. It strengthens the resolve to resist temptations and to overcome obstacles in the moral life. Fortitude enables one to conquer fear, even the fear of death, and to face trials and persecutions (CCC 1808).",
    aquinasRef:
      "ST II-II, qq. 123-140. Thomas teaches that fortitude's principal act is endurance (sustinere), not attack (aggredi). The brave person endures difficulty for the sake of the good. Fortitude moderates both fear and daring. Its parts include magnanimity (greatness of soul), magnificence, patience, and perseverance. Martyrdom is fortitude's most perfect act.",
    opposingVice: "Cowardice / Rashness",
  },
  {
    name: "Temperance",
    type: "cardinal",
    description:
      "The moral virtue that moderates the attraction of pleasures and provides balance in the use of created goods. It ensures the will's mastery over instincts and keeps desires within the limits of what is honorable (CCC 1809). Temperance governs the concupiscible appetite, particularly regarding the pleasures of touch — food, drink, and sexual pleasure.",
    aquinasRef:
      "ST II-II, qq. 141-170. Thomas identifies temperance's integral parts as shame (verecundia) and the sense of honor (honestas). Its subjective parts include abstinence, sobriety, and chastity. Its potential parts include continence, humility, meekness (clemency), and modesty. Temperance brings order to the soul's relationship with bodily pleasures.",
    opposingVice: "Intemperance / Insensibility",
  },
  {
    name: "Pride (Superbia)",
    type: "capital-sin",
    description:
      "The disordered desire of one's own excellence. Pride is the root of all sin because it turns the soul away from God and toward the self as its own ultimate end. It manifests as an inordinate self-esteem, contempt for others, refusal to submit to God, and the desire to be one's own rule and measure. St. Augustine called pride 'the beginning of all sin' (Sirach 10:13).",
    aquinasRef:
      "ST II-II, q. 162. Thomas identifies pride as the queen and mother of all vices, distinct from vainglory (which is a species of pride). Pride is the root sin because every sin involves a turning away from God's rule, which is essentially what pride does. Its four species (from St. Gregory): thinking one has goods from oneself, thinking one deserves them, boasting of goods one does not have, and despising others.",
    opposingVice: "Humility",
  },
  {
    name: "Avarice (Avaritia)",
    type: "capital-sin",
    description:
      "The disordered love of riches and material possessions. Avarice (or greed) is an excessive attachment to temporal goods, treating them as ends in themselves rather than means to good ends. It includes both the excessive desire to acquire wealth and the excessive reluctance to part with it. Scripture warns that 'the love of money is the root of all evils' (1 Timothy 6:10).",
    aquinasRef:
      "ST II-II, q. 118. Thomas teaches that avarice is a sin against justice because the greedy person takes or retains more than their due. It is a capital sin because many other sins flow from it: treachery, fraud, falsehood, perjury, restlessness, violence, and hardness of heart. Avarice grows more dangerous with age, as the elderly tend to cling more tightly to material security.",
    opposingVice: "Generosity (Liberality)",
  },
  {
    name: "Lust (Luxuria)",
    type: "capital-sin",
    description:
      "The disordered desire for or inordinate enjoyment of sexual pleasure. Lust separates the sexual act from its God-given purposes of union and procreation within marriage. It reduces persons to objects of pleasure and undermines the virtue of chastity. Lust clouds the intellect, weakens the will, and disorders the entire moral life.",
    aquinasRef:
      "ST II-II, q. 153. Thomas identifies lust as a capital vice because it gives rise to many other sins: blindness of mind, thoughtlessness, inconstancy, rashness, self-love, hatred of God, attachment to the present world, and horror of the future judgment. Its species include fornication, adultery, incest, sacrilege, and sins against nature.",
    opposingVice: "Chastity",
  },
  {
    name: "Wrath (Ira)",
    type: "capital-sin",
    description:
      "The disordered desire for vengeance. While anger in itself is a passion that can be morally neutral or even righteous (as when directed against genuine injustice), sinful wrath seeks revenge in a disproportionate, unjust, or uncontrolled manner. It manifests as rage, bitterness, vindictiveness, and the refusal to forgive.",
    aquinasRef:
      "ST II-II, q. 158. Thomas distinguishes sinful anger from righteous indignation. Anger becomes sinful in three ways: when one desires vengeance against the innocent, when one desires disproportionate punishment, or when the desire for vengeance is fueled by selfish motives rather than zeal for justice. From wrath arise quarreling, swelling of the mind, contumely, clamor, indignation, and blasphemy.",
    opposingVice: "Patience / Meekness",
  },
  {
    name: "Gluttony (Gula)",
    type: "capital-sin",
    description:
      "The disordered desire for the pleasure of food and drink. Gluttony is not merely eating too much but any disordered relationship with food: eating too much, too expensively, too eagerly, too daintily, or at inappropriate times. It is a failure of temperance regarding the most basic bodily pleasure.",
    aquinasRef:
      "ST II-II, q. 148. Thomas lists five species of gluttony (using the medieval mnemonic praepropere, laute, nimis, ardenter, studiose): eating too soon, too expensively, too much, too eagerly, or too daintily. From gluttony arise dullness of mind, unseemly joy, scurrility, talkativeness, and uncleanness.",
    opposingVice: "Abstinence / Temperance",
  },
  {
    name: "Envy (Invidia)",
    type: "capital-sin",
    description:
      "Sorrow at another's good fortune, or joy at another's misfortune, insofar as another's good is perceived as diminishing one's own excellence. Envy is directly opposed to charity, which rejoices in the good of others. It is particularly destructive because it poisons relationships and turns every blessing into a source of bitterness.",
    aquinasRef:
      "ST II-II, q. 36. Thomas defines envy as sadness at another's good. It is a capital sin because it gives rise to hatred, tale-bearing, detraction, joy at another's misfortune, and grief at another's prosperity. Envy is a sin against charity and is distinguished from holy zeal (which is sorrow at another's sin) and from competitive emulation (which desires to equal the good of others without begrudging it).",
    opposingVice: "Kindness / Brotherly Love",
  },
  {
    name: "Sloth (Acedia)",
    type: "capital-sin",
    description:
      "Spiritual apathy or sorrow in the face of spiritual good. Sloth is not mere laziness but a deep aversion to the demands of divine friendship. It is disgust with the spiritual life, a torpor of soul that refuses the joy of God. The slothful person finds the effort of loving God burdensome and retreats into worldly distractions.",
    aquinasRef:
      "ST II-II, q. 35. Thomas defines acedia as 'sorrow about spiritual good insofar as it is a divine good' — a sadness about the very thing that should bring joy. It is a sin against the joy of charity. From sloth arise malice, spite, faint-heartedness, despair, sluggishness regarding the commandments, and wandering of the mind after unlawful things. The desert fathers considered acedia the 'noonday devil' (Psalm 91:6).",
    opposingVice: "Diligence / Zeal",
  },
  {
    name: "Wisdom",
    type: "gift",
    description:
      "The gift that perfects the virtue of charity by enabling the soul to judge all things according to divine truth and to savor the things of God. Wisdom gives a connaturality with divine things — an experiential knowledge of God that goes beyond mere intellectual understanding. It corresponds to the beatitude 'Blessed are the peacemakers' because the wise soul orders all things to God, producing interior peace.",
    aquinasRef:
      "ST II-II, qq. 45. Thomas teaches that wisdom is the highest of the gifts because it judges all things by the highest cause — God Himself. While the intellectual virtue of wisdom judges by rational principles, the gift of wisdom judges by a certain divine instinct or connaturality with divine things, produced by charity.",
    opposingVice: "Foolishness",
  },
  {
    name: "Understanding",
    type: "gift",
    description:
      "The gift that perfects the virtue of faith by granting a penetrating insight into the truths of revelation. Understanding enables the soul to grasp the deeper meaning of Scripture, the mysteries of the faith, and the inner connections between revealed truths. It does not produce full comprehension (which belongs to the beatific vision) but a taste of the intelligibility hidden within faith's obscurity.",
    aquinasRef:
      "ST II-II, q. 8. Thomas distinguishes the gift of understanding from the intellectual virtue of the same name. The gift penetrates the inner truth of things proposed by faith — not by adding new content but by deepening our grasp of what we already believe. It corresponds to the beatitude 'Blessed are the pure in heart, for they shall see God.'",
    opposingVice: "Spiritual blindness",
  },
  {
    name: "Counsel",
    type: "gift",
    description:
      "The gift that perfects the virtue of prudence by enabling the soul to judge promptly and rightly what must be done in difficult or uncertain situations, under the direct inspiration of the Holy Spirit. Counsel goes beyond natural prudence by providing supernatural guidance in matters where human reason alone would be insufficient.",
    aquinasRef:
      "ST II-II, q. 52. Thomas teaches that while prudence enables us to reason correctly about practical matters, counsel enables us to be directed by God Himself in matters that exceed our natural capacity for deliberation. It corresponds to the beatitude 'Blessed are the merciful,' because mercy requires the right judgment about when and how to help others.",
    opposingVice: "Rashness / Thoughtlessness",
  },
  {
    name: "Fortitude (Gift)",
    type: "gift",
    description:
      "The gift that perfects the cardinal virtue of fortitude by infusing supernatural courage to endure all things for God's sake, even martyrdom. While the natural virtue of fortitude enables us to face difficulties through our own moral strength (aided by grace), the gift of fortitude empowers the soul to do and suffer things that are beyond the capacity of human nature.",
    aquinasRef:
      "ST II-II, q. 139. Thomas teaches that the gift of fortitude supplies what the virtue of fortitude cannot: a confidence of overcoming all dangers by the help of the Holy Spirit. It corresponds to the beatitude 'Blessed are those who hunger and thirst for righteousness,' because the pursuit of justice requires extraordinary courage.",
    opposingVice: "Fear / Worldliness",
  },
  {
    name: "Knowledge (Scientia)",
    type: "gift",
    description:
      "The gift that enables the soul to judge rightly about created things in relation to God — to see creatures as signs pointing to the Creator, and to recognize the vanity of worldly things when they are pursued apart from God. Knowledge gives a right appreciation of temporal goods and evils in light of eternity.",
    aquinasRef:
      "ST II-II, q. 9. Thomas distinguishes the gift of knowledge from the gift of understanding: understanding penetrates divine truths themselves, while knowledge judges created things in relation to God. It corresponds to the beatitude 'Blessed are those who mourn,' because true knowledge of creatures reveals their insufficiency and moves the soul to grieve over sin and attachment to passing things.",
    opposingVice: "Ignorance",
  },
  {
    name: "Piety",
    type: "gift",
    description:
      "The gift that perfects the virtue of justice (specifically the virtue of religion) by inspiring a filial affection toward God as Father and a tender regard for all things related to God — the saints, Sacred Scripture, the Church, and all who belong to God. Piety makes our worship warm and personal rather than merely dutiful.",
    aquinasRef:
      "ST II-II, q. 121. Thomas teaches that while the virtue of religion renders to God what is due in strict justice, the gift of piety moves us to relate to God with the tenderness of children toward a beloved father. It corresponds to the beatitude 'Blessed are the meek,' because filial piety produces gentleness toward God and neighbor.",
    opposingVice: "Hardness of heart",
  },
  {
    name: "Fear of the Lord",
    type: "gift",
    description:
      "The gift that perfects the virtue of hope and temperance by inspiring a filial reverence for God that makes the soul shrink from offending Him. It is not servile fear (fear of punishment) but filial fear (fear of displeasing the One we love). The fear of the Lord is the beginning of wisdom (Proverbs 9:10) and the foundation of the spiritual life.",
    aquinasRef:
      "ST II-II, q. 19. Thomas distinguishes servile fear (which fears punishment) from filial fear (which fears separation from God). The gift of fear of the Lord is filial fear elevated by the Holy Spirit. It corresponds to the beatitude 'Blessed are the poor in spirit,' because fear of the Lord produces the humility that empties the soul of pride and makes room for God.",
    opposingVice: "Pride / Presumption",
  },
  {
    name: "Charity (Fruit)",
    type: "fruit",
    description:
      "The supernatural love of God and neighbor that the Holy Spirit produces in the soul as a sweet fruit of grace. As a fruit, charity is not the theological virtue itself but the delight and ease with which the mature soul exercises love.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas explains that the fruits of the Spirit are the ultimate acts of virtue produced with sweetness and delight by the Holy Spirit. Charity as fruit is love experienced as joy rather than effort.",
  },
  {
    name: "Joy",
    type: "fruit",
    description:
      "The spiritual gladness that comes from the possession of the supreme good — God Himself. Joy is not mere natural happiness but a supernatural delight that persists even amid suffering, because its source is the indwelling of the Holy Spirit.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas identifies joy as the fruit that follows from charity, since we rejoice in possessing what we love. Spiritual joy is a sign of the soul's union with God.",
  },
  {
    name: "Peace",
    type: "fruit",
    description:
      "The tranquility of order (tranquillitas ordinis) — the harmony that reigns in the soul when all desires are rightly ordered toward God. Peace is the fruit of charity and joy working together to bring serenity to the entire person.",
    aquinasRef:
      "ST II-II, q. 29, a. 1. Thomas defines peace as the tranquility of order. As a fruit, it is the experienced calm of a soul whose passions are ordered by grace. It surpasses natural tranquility because it comes from union with the God of peace.",
  },
  {
    name: "Patience",
    type: "fruit",
    description:
      "The capacity to endure suffering and adversity without losing interior peace or falling into sadness. As a fruit, patience is not mere stoic endurance but a sweet acceptance of God's will even in the midst of trial.",
    aquinasRef:
      "ST II-II, q. 136. Thomas links patience to the virtue of fortitude. As a fruit, patience is experienced not as grim determination but as a peaceful bearing of difficulties because the soul trusts in God's providence.",
  },
  {
    name: "Kindness (Benignity)",
    type: "fruit",
    description:
      "A gentle benevolence toward others that manifests in gracious speech, generous acts, and a warm disposition. Kindness flows from charity and makes the Christian a source of comfort and encouragement to all.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas lists benignity among the fruits directed toward the good of one's neighbor. It is the outward manifestation of interior charity — goodness of heart overflowing into goodness of action.",
  },
  {
    name: "Goodness",
    type: "fruit",
    description:
      "The moral excellence that radiates from a soul perfected by grace. Goodness goes beyond kindness to encompass the entire character of the virtuous person — their integrity, righteousness, and consistency of life.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas distinguishes goodness from kindness: kindness is gentle and affable, while goodness carries the added note of moral rectitude and firmness in doing what is right.",
  },
  {
    name: "Long-suffering (Longanimity)",
    type: "fruit",
    description:
      "The capacity to wait patiently for the fulfillment of God's promises without growing bitter or despondent. Long-suffering differs from patience in that patience endures present suffering while long-suffering endures the prolonged delay of hoped-for goods.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas identifies longanimity as the fruit that sustains the soul during extended periods of trial or unfulfilled desire. It is the fruit that perfects hope's endurance over time.",
  },
  {
    name: "Gentleness (Mildness)",
    type: "fruit",
    description:
      "A soft and considerate manner in dealing with others, especially when one has the power or right to be severe. Gentleness moderates anger and responds to provocation with calm and grace.",
    aquinasRef:
      "ST I-II, q. 70, a. 3; ST II-II, q. 157. Thomas associates gentleness with the virtue of meekness (mansuetudo). As a fruit, it is experienced as an effortless mildness that comes from the Spirit's governance of the irascible appetite.",
  },
  {
    name: "Faith (Fruit)",
    type: "fruit",
    description:
      "As a fruit, faith refers not to the theological virtue itself but to the faithfulness and trustworthiness that the Spirit produces — reliability in one's word, fidelity to commitments, and steadfast loyalty to God and neighbor.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas notes that faith as a fruit signifies faithfulness (fidelitas) — the trustworthiness and constancy that flow from a soul deeply rooted in the theological virtue of faith.",
  },
  {
    name: "Modesty",
    type: "fruit",
    description:
      "The right ordering of one's exterior behavior, speech, dress, and deportment according to the standards of grace and reason. Modesty reflects interior order in outward conduct.",
    aquinasRef:
      "ST II-II, q. 160. Thomas treats modesty as a potential part of temperance. As a fruit, modesty is the easy, natural propriety that flows from a soul whose passions are well-ordered by the Holy Spirit.",
  },
  {
    name: "Continence",
    type: "fruit",
    description:
      "Mastery over disordered desires, especially in matters of sexual pleasure. As a fruit, continence is not the painful struggle against temptation but the Spirit-given freedom from the tyranny of disordered passions.",
    aquinasRef:
      "ST I-II, q. 70, a. 3. Thomas lists continence among the fruits that relate to mastery over the concupiscible appetite. As a fruit, it signifies the joyful self-possession of one who has been freed from slavery to passion.",
  },
  {
    name: "Chastity (Fruit)",
    type: "fruit",
    description:
      "The right ordering of sexual desire according to one's state in life. As a fruit, chastity is experienced not as mere restraint but as a joyful integration of sexuality within the whole person — a freedom to love rightly.",
    aquinasRef:
      "ST I-II, q. 70, a. 3; ST II-II, q. 151. Thomas identifies chastity as the highest fruit relating to the governance of bodily pleasure. As a fruit, it represents the peaceful possession of purity that comes from the Holy Spirit's transforming work.",
  },
  {
    name: "Blessed are the poor in spirit",
    type: "beatitude",
    description:
      "Poverty of spirit is the interior detachment from riches and worldly goods, whether one is materially rich or poor. It is the recognition that all we have comes from God and belongs to God, freeing us from the tyranny of possessions. The poor in spirit possess the kingdom because they possess God, who is the true and infinite treasure.",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas teaches that poverty of spirit corresponds to the gift of fear of the Lord, which empties the soul of pride and attachment to created goods. The reward — 'theirs is the kingdom of heaven' — is given in the present tense because detachment from the world is the beginning of heavenly possession.",
  },
  {
    name: "Blessed are those who mourn",
    type: "beatitude",
    description:
      "Those who mourn are blessed not because suffering is good in itself, but because mourning over sin, over the world's rejection of God, and over the distance between earthly exile and heavenly homeland disposes the soul to receive divine consolation. Godly sorrow produces repentance (2 Corinthians 7:10).",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas links this beatitude to the gift of knowledge, which reveals the vanity of created things and moves the soul to mourn their insufficiency. The comfort promised is the consolation of the Holy Spirit and, ultimately, the joy of heaven where God will wipe away every tear (Revelation 21:4).",
  },
  {
    name: "Blessed are the meek",
    type: "beatitude",
    description:
      "Meekness is not weakness but strength under control — the capacity to respond to provocation with calmness and charity rather than anger and retaliation. The meek inherit the earth because they do not grasp at power but receive all things as gifts from God, and in the end, the earth made new belongs to them.",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas associates meekness with the gift of piety, which produces a filial gentleness toward God and neighbor. The meek 'inherit the earth' because their interior peace gives them a possession of the world that the violent can never achieve. In the eschaton, the renewed earth is the inheritance of the saints.",
  },
  {
    name: "Blessed are those who hunger and thirst for righteousness",
    type: "beatitude",
    description:
      "An intense and persistent desire for holiness — both personal sanctification and justice in the world. This beatitude describes those who are not content with mediocrity in the spiritual life but ardently desire the fullness of God's will. They shall be satisfied because God never leaves such desire unfulfilled.",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas connects this beatitude to the gift of fortitude, which sustains the soul in its pursuit of righteousness against all obstacles. The satisfaction promised is the fulfillment of every good desire in the vision of God, where the soul is perfectly conformed to divine justice.",
  },
  {
    name: "Blessed are the merciful",
    type: "beatitude",
    description:
      "The merciful are those who feel the misery of others as their own and act to relieve it, whether through corporal or spiritual works of mercy. Mercy imitates God's own character: 'Be merciful, even as your Father is merciful' (Luke 6:36). Those who show mercy receive mercy — not as a transaction but because mercy opens the soul to receive what God always desires to give.",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas links this beatitude to the gift of counsel, which directs us to right action toward our neighbor. Mercy is the overflow of charity into concrete acts of compassion. The reward — 'they shall obtain mercy' — is both temporal (the experience of God's mercy in this life) and eternal (the definitive mercy of salvation).",
  },
  {
    name: "Blessed are the pure in heart",
    type: "beatitude",
    description:
      "Purity of heart is the undivided intention of the soul directed entirely toward God. It is freedom not only from sins of the flesh but from all duplicity, guile, and divided loyalties. The pure in heart see God because nothing stands between their soul and the divine light — no idol, no disordered attachment, no self-deception.",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas connects this beatitude to the gift of understanding, which penetrates the inner meaning of divine truth. Purity of heart removes the obstacles to spiritual vision. The reward — 'they shall see God' — refers to the beatific vision, the direct, face-to-face knowledge of God that is the ultimate happiness of the human person (ST I, q. 12).",
  },
  {
    name: "Blessed are the peacemakers",
    type: "beatitude",
    description:
      "Peacemakers actively work to establish and restore right relationships — between persons, between communities, and between humanity and God. They do not merely avoid conflict but labor to bring about the tranquility of order (true peace). They are called children of God because they imitate the Son, who reconciled all things through the Cross (Colossians 1:20).",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas connects peacemaking to the gift of wisdom, which orders all things to their proper end and thereby produces peace. The title 'children of God' is fitting because peace is the fruit of conformity to the divine will, and those who bring peace share in God's own work of reconciliation.",
  },
  {
    name: "Blessed are those persecuted for righteousness' sake",
    type: "beatitude",
    description:
      "Those who suffer persecution for the sake of justice, truth, and fidelity to Christ are blessed because their suffering unites them to the Cross and guarantees their share in the Resurrection. Persecution for righteousness is the ultimate test of all the other beatitudes — the synthesis of poverty, mourning, meekness, hunger for justice, mercy, purity, and peacemaking under fire.",
    aquinasRef:
      "ST I-II, q. 69, a. 3. Thomas teaches that this beatitude is the consummation of all the others: it contains all the preceding beatitudes under the supreme trial of persecution. The reward — 'theirs is the kingdom of heaven' — echoes the first beatitude, forming an inclusion that encompasses the entire Sermon on the Mount. Martyrdom is the perfect act of this beatitude.",
  },
];

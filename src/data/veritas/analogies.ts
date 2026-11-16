export interface Analogy {
  doctrine: string;
  analogy: string;
  source?: string;
  strengths: string;
  limitations: string;
  heresyWarning?: string;
}

export const ANALOGIES: Analogy[] = [
  {
    doctrine: "The Trinity",
    analogy: "The sun: the sun itself (Father), its light (Son), and its heat (Spirit) — three distinct realities from one source.",
    source: "Various Fathers; popularized in catechesis",
    strengths: "Shows how three distinct realities can flow from one source. Light is 'begotten' from the sun, heat 'proceeds' from both.",
    limitations: "The sun, light, and heat are not three persons — they are properties of one thing. Light and heat are effects, not co-equal with the sun itself.",
    heresyWarning: "Can tend toward Arianism if it implies the Son and Spirit are lesser than or caused by the Father in a temporal sense.",
  },
  {
    doctrine: "The Trinity",
    analogy: "Water in three states: ice, liquid, steam — one substance in three forms.",
    source: "Popular catechesis (though theologically problematic)",
    strengths: "Shows that one substance can manifest in different ways. Accessible and easy to visualize.",
    limitations: "Water changes from one state to another — it is not simultaneously ice, liquid, and steam. This directly implies that God changes modes, being Father at one time and Son at another.",
    heresyWarning: "This is MODALISM (Sabellianism). The three Persons of the Trinity exist simultaneously and eternally, not sequentially. This analogy should be used only to show what the Trinity is NOT.",
  },
  {
    doctrine: "The Trinity",
    analogy: "St. Patrick's shamrock: one leaf with three distinct lobes.",
    source: "Attributed to St. Patrick (legendary)",
    strengths: "Shows unity (one leaf) with real distinction (three lobes). Very simple and memorable.",
    limitations: "Each lobe is only one-third of the shamrock — each Person of the Trinity is fully God, not one-third of God. The lobes are parts; the Persons are not parts.",
    heresyWarning: "Can tend toward Partialism — the heresy that each Person is only part of God. The Father is fully God, the Son is fully God, the Spirit is fully God.",
  },
  {
    doctrine: "The Trinity",
    analogy: "Augustine's psychological analogy: the mind knows itself (memory/Father), generates a word/concept of itself (understanding/Son), and loves what it knows (will/Spirit).",
    source: "St. Augustine, De Trinitate, Books VIII-XV",
    strengths: "The best classical analogy. Shows how one mind can have real internal relations (knowing and loving) that are not parts or phases. Memory, understanding, and will are co-present and mutually implicating. Grounds the Trinity in the highest created reality (rational soul).",
    limitations: "Memory, understanding, and will are faculties of one person, not three persons. The analogy works at the level of processions (generation and spiration) but does not fully capture the distinction of Persons.",
  },
  {
    doctrine: "The Trinity",
    analogy: "Three men (e.g., Peter, James, and John) sharing one human nature.",
    source: "Gregory of Nyssa, On 'Not Three Gods'",
    strengths: "Shows how distinct subsistents can share one nature. Emphasizes the real distinction of Persons.",
    limitations: "Three men have three separate instantiations of human nature. The divine Persons share numerically ONE nature, not three instances of the same kind. Three men can be separated; the Persons cannot.",
    heresyWarning: "Can tend toward TRITHEISM — the heresy that there are three gods. Must emphasize that the divine nature is numerically one, not merely specifically one.",
  },
  {
    doctrine: "The Incarnation",
    analogy: "A sword heated in fire: the sword (human nature) and the fire (divine nature) are united without the sword ceasing to be a sword or the fire ceasing to be fire. The sword cuts and burns simultaneously.",
    source: "St. John of Damascus, De Fide Orthodoxa, III.15",
    strengths: "Shows how two natures can be united without confusion or change. The sword has its own properties (cutting) and the fire has its own (burning), but the heated sword exercises both through one action.",
    limitations: "The union of sword and fire is accidental, not hypostatic — they can be separated. The Incarnation is a permanent, inseparable union of natures in one Person.",
  },
  {
    doctrine: "The Incarnation",
    analogy: "The union of body and soul in a human being: two very different realities (material and spiritual) united in one person without either ceasing to be what it is.",
    source: "Athanasian Creed; various Fathers",
    strengths: "The Athanasian Creed uses this explicitly: 'As the rational soul and flesh is one man, so God and man is one Christ.' Shows how two natures can constitute one person.",
    limitations: "The body-soul union produces a composite nature (human nature). The hypostatic union does NOT produce a composite nature — Christ has two complete, unmingled natures. The analogy is one of proportionality, not strict identity.",
    heresyWarning: "If pressed too far, can tend toward Monophysitism — suggesting the two natures blend into a third thing.",
  },
  {
    doctrine: "The Eucharist",
    analogy: "Food transformed into the one who eats — but in the Eucharist, the reverse: we are transformed into Christ whom we receive.",
    source: "St. Augustine, Confessions VII.10: 'I am the food of the fully grown; grow and you will feed on me. And you will not change me into you like the food your flesh eats, but you will be changed into me.'",
    strengths: "A brilliant reversal that captures the transformative power of the Eucharist. Grounded in Augustine's actual words. Shows that Communion is not merely nourishment but divinization.",
    limitations: "Does not directly address how bread becomes the body of Christ (transubstantiation). More about the effect of Communion than the metaphysics of the change.",
  },
  {
    doctrine: "Grace",
    analogy: "A vine and branches: the branches (human persons) receive life from the vine (Christ) and can bear fruit only when connected to it. Severed branches wither and die.",
    source: "Jesus Christ, John 15:1-8",
    strengths: "Given by Christ Himself. Shows the absolute necessity of grace ('without me you can do nothing,' John 15:5), the organic union between Christ and the Christian, and the real possibility of being 'cut off' (mortal sin). Shows that bearing fruit (good works) flows naturally from the life of grace.",
    limitations: "A branch has no choice about being attached to the vine — but humans have free will and can cooperate with or resist grace.",
  },
  {
    doctrine: "Grace",
    analogy: "Iron heated in fire: the iron does not cease to be iron, but it glows and acts with the properties of fire (heat, light). Grace elevates nature without destroying it.",
    source: "Common Thomistic analogy; related to John of Damascus's sword analogy",
    strengths: "Shows that grace elevates and transforms nature without destroying or replacing it. The iron's own properties are enhanced, not eliminated. Illustrates the Thomistic principle: 'Grace does not destroy nature but perfects it' (gratia non tollit naturam sed perficit).",
    limitations: "Iron in fire is a temporary, accidental change. Sanctifying grace is a habitual, supernatural quality that inheres in the soul more deeply than heat in iron.",
  },
  {
    doctrine: "The Church",
    analogy: "The human body: many different members with different functions, but one body animated by one soul. Christ is the head, the faithful are the members, and the Holy Spirit is the soul.",
    source: "St. Paul, 1 Corinthians 12:12-27; Pius XII, Mystici Corporis",
    strengths: "Paul's own analogy. Shows unity in diversity, the interdependence of members, the headship of Christ, and the real but differentiated participation of all members. Each organ matters; no one can say 'I have no need of you.'",
    limitations: "Members of a body do not have individual free will — they cannot choose to detach from the body. Church members can (through schism or mortal sin). Also, the Church is not merely an organism but a divine-human institution with visible structure.",
  },
  {
    doctrine: "The Church",
    analogy: "Noah's Ark: one ship, one pilot, holding all who will be saved through the flood of the world.",
    source: "1 Peter 3:20-21; used extensively by the Fathers",
    strengths: "Shows the Church as the ordinary means of salvation, the necessity of entering through the one door, and the visible, institutional nature of the Church. The Ark had structure, hierarchy (Noah commanding), and carried a diverse 'congregation.'",
    limitations: "Can seem to imply there is absolutely no salvation outside the visible boundaries of the Church. Catholic teaching (Lumen Gentium 16) holds that those invincibly ignorant of the Gospel may be saved through Christ's grace, even if not visibly within the Church.",
  },
  {
    doctrine: "Salvation / Justification",
    analogy: "A doctor healing a patient: justification is not merely declaring a sick person 'well' (forensic) but actually curing them (transformative). God does not merely call us righteous — He makes us righteous.",
    source: "Catholic theological tradition; contra Luther's 'snow covering dung' analogy",
    strengths: "Directly addresses the Catholic-Protestant dispute on justification. Shows that God's grace is efficacious — it actually changes the person. Counters Luther's analogy of snow covering a dunghill (simul justus et peccator in its strong form).",
    limitations: "The healing is not instantaneous in the way a doctor might cure an infection. Sanctification is a lifelong process. The patient must also cooperate with the treatment (free will + grace).",
  },
  {
    doctrine: "Salvation / Merit",
    analogy: "A father who gives his child money and then rewards the child for buying a gift with it. The gift is truly the child's act, but the ability to do it came entirely from the father.",
    source: "Adapted from Augustine's principle: 'When God rewards our merits, He crowns His own gifts'",
    strengths: "Shows how merit and grace are compatible. Our good works are truly ours (and truly meritorious), but they are only possible because of God's prior grace. No room for boasting — all comes from the Father.",
    limitations: "In reality, God's 'giving' is more radical than a father giving money — grace transforms the very will and capacities of the person.",
  },
  {
    doctrine: "Purgatory",
    analogy: "Gold refined by fire: the gold (the saved soul) is genuine and precious, but impurities remain that must be burned away before it reaches its full brilliance.",
    source: "1 Peter 1:7; Malachi 3:2-3; 1 Corinthians 3:13-15",
    strengths: "Directly biblical. Shows that the fire is purifying, not destructive — the gold is not consumed but perfected. The person in purgatory is already 'gold' (saved) but not yet pure enough for the Beatific Vision.",
    limitations: "Gold is passive in the refining process. Souls in purgatory may actively cooperate through their love for God.",
  },
  {
    doctrine: "The Sacraments",
    analogy: "A pipe carrying water from a reservoir: the water (grace) comes from the reservoir (God), and the pipe (sacrament) is the instrument through which it reaches us. The pipe does not create the water, but without it the water does not reach the garden.",
    source: "Common Thomistic analogy",
    strengths: "Shows the instrumental causality of the sacraments — they are real causes of grace, but only as instruments of the principal cause (God). Explains why sacraments work ex opere operato (the water flows regardless of the pipe's material).",
    limitations: "Sacraments are not merely passive conduits — they are signs that also signify and teach. The sacramental encounter is personal (with Christ), not merely mechanical.",
  },
  {
    doctrine: "The Immaculate Conception",
    analogy: "A person prevented from falling into a pit versus one pulled out after falling. Mary was prevented from ever falling into original sin (preservation), while the rest of us are rescued from it (redemption). Both are acts of the Savior.",
    source: "Attributed to Blessed Duns Scotus's defense of the Immaculate Conception",
    strengths: "Shows that Mary was still redeemed by Christ — in fact, more perfectly redeemed, since prevention is a greater act of saving than rescue. Addresses the objection that the Immaculate Conception means Mary did not need a Savior.",
    limitations: "The analogy is logically precise rather than imaginatively vivid. Works better as an argument than as a teaching illustration.",
  },
  {
    doctrine: "Faith and Reason",
    analogy: "Two wings of a bird: faith and reason are both necessary for the soul to rise to the knowledge of truth. Neither alone suffices; both together allow flight.",
    source: "Pope St. John Paul II, Fides et Ratio (1998), opening line",
    strengths: "Captures the Catholic conviction that faith and reason are complementary, not opposed. A bird with one wing cannot fly. Reason without faith is incomplete; faith without reason risks fideism.",
    limitations: "Faith and reason are not equal in the same way two wings are — faith reveals truths that surpass reason's capacity (e.g., the Trinity). The analogy might suggest they are on exactly the same level.",
  },
  {
    doctrine: "Original Sin",
    analogy: "A genetic disease transmitted from parent to child: original sin is not a personal act but a condition inherited by nature. Just as a genetic disorder is not the child's fault but really affects them, original sin is not our personal sin but truly disorders our nature.",
    source: "Modern catechetical analogy",
    strengths: "Makes the concept of inherited sinfulness comprehensible to modern minds. Shows that original sin is about nature, not personal guilt.",
    limitations: "Genetic diseases are purely biological; original sin is a spiritual reality (the privation of sanctifying grace). The analogy is only proportional.",
  },
  {
    doctrine: "The Real Presence / Transubstantiation",
    analogy: "An ambassador who IS the king in legal reality, though he looks like an ordinary man. The appearances are of a man, but the authority and legal reality is the king's. Similarly, the appearances remain bread and wine, but the reality IS Christ.",
    source: "Adapted from various catechetical sources",
    strengths: "Helps people understand the distinction between appearances (accidents) and deeper reality (substance). Shows that what something IS can differ from what it LOOKS like.",
    limitations: "An ambassador is not literally the king — he represents the king. Christ is not represented in the Eucharist; He IS present. The analogy must not be used to support a merely symbolic view.",
    heresyWarning: "Must be carefully qualified: the Eucharist is NOT a representation of Christ but Christ Himself truly, really, and substantially present.",
  },
];

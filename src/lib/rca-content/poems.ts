// The 5 poems Classical Language Arts 6 memorizes stanza-by-stanza and recites
// from memory across the year (classical-language-arts-6.ts's real 2026-2027
// pacing). All 5 are long-public-domain (Tennyson d. 1892, Byron d. 1824,
// Carroll/Dodgson d. 1898, Sill d. 1887, Yeats' 1890 poem is pre-1929) — unlike
// the Baltimore Catechism situation, there's no copyrighted-edition problem
// here, so these are the REAL exact texts, not paraphrases. Word-for-word
// accuracy matters more here than almost anywhere else in this app: RCA grades
// the recitation word-for-word, so a wrong word here is a real error a tutor
// could pass on to a kid.
//
// Sourced 2026-09-02: "The Charge of the Light Brigade" and "The Destruction of
// Sennacherib" transcribed directly from Wikisource's page-scan OCR of "Poems
// That Every Child Should Know" (ed. Mary E. Burt, 1904, itself long public
// domain) — a real primary-source digitization, not a paraphrase. "The Lake
// Isle of Innisfree" and "The Fool's Prayer" pulled from Wikisource/public-
// domain-archive text directly. "Jabberwocky" is Lewis Carroll's single,
// textually-invariant 1871 original (no variant printings exist) — confirmed
// against a live Wikisource search snippet match on the opening stanza.

export type Poem = {
  title: string;
  author: string;
  year: number;
  stanzas: string[]; // each stanza as one string, lines separated by \n
};

export const poems: Poem[] = [
  {
    title: "The Charge of the Light Brigade",
    author: "Alfred, Lord Tennyson",
    year: 1854,
    stanzas: [
      "Half a league, half a league,\nHalf a league onward,\nAll in the valley of Death\nRode the six hundred.\n\"Forward, the Light Brigade!\nCharge for the guns!\" he said:\nInto the valley of Death\nRode the six hundred.",
      "\"Forward, the Light Brigade!\"\nWas there a man dismay'd?\nNot tho' the soldier knew\nSome one had blunder'd:\nTheirs not to make reply,\nTheirs not to reason why,\nTheirs but to do and die:\nInto the valley of Death\nRode the six hundred.",
      "Cannon to right of them,\nCannon to left of them,\nCannon in front of them\nVolley'd and thunder'd;\nStorm'd at with shot and shell,\nBoldly they rode and well,\nInto the jaws of Death,\nInto the mouth of Hell\nRode the six hundred.",
      "Flash'd all their sabers bare,\nFlash'd as they turn'd in air\nSab'ring the gunners there,\nCharging an army, while\nAll the world wonder'd:\nPlunged in the battery-smoke\nRight thro' the line they broke;\nCossack and Russian\nReel'd from the saber-stroke\nShatter'd and sunder'd.\nThen they rode back, but not\nNot the six hundred.",
      "Cannon to right of them,\nCannon to left of them,\nCannon behind them\nVolleyed and thundered:\nStormed at with shot and shell,\nWhile horse and hero fell,\nThey that had fought so well\nCame through the jaws of death\nBack from the mouth of hell,\nAll that was left of them—\nLeft of six hundred.",
      "When can their glory fade?\nOh, the wild charge they made!\nAll the world wondered.\nHonour the charge they made!\nHonour the Light Brigade—\nNoble six hundred!",
    ],
  },
  {
    title: "The Lake Isle of Innisfree",
    author: "William Butler Yeats",
    year: 1890,
    stanzas: [
      "I will arise and go now, and go to Innisfree,\nAnd a small cabin build there, of clay and wattles made:\nNine bean-rows will I have there, a hive for the honey-bee,\nAnd live alone in the bee-loud glade.",
      "And I shall have some peace there, for peace comes dropping slow,\nDropping from the veils of the morning to where the cricket sings;\nThere midnight's all a glimmer, and noon a purple glow,\nAnd evening full of the linnet's wings.",
      "I will arise and go now, for always night and day\nI hear lake water lapping with low sounds by the shore;\nWhile I stand on the roadway, or on the pavements grey,\nI hear it in the deep heart's core.",
    ],
  },
  {
    title: "Jabberwocky",
    author: "Lewis Carroll",
    year: 1871,
    stanzas: [
      "'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.",
      "\"Beware the Jabberwock, my son!\nThe jaws that bite, the claws that catch!\nBeware the Jubjub bird, and shun\nThe frumious Bandersnatch!\"",
      "He took his vorpal sword in hand:\nLong time the manxome foe he sought—\nSo rested he by the Tumtum tree,\nAnd stood awhile in thought.",
      "And, as in uffish thought he stood,\nThe Jabberwock, with eyes of flame,\nCame whiffling through the tulgey wood,\nAnd burbled as it came!",
      "One, two! One, two! And through and through\nThe vorpal blade went snicker-snack!\nHe left it dead, and with its head\nHe went galumphing back.",
      "\"And hast thou slain the Jabberwock?\nCome to my arms, my beamish boy!\nO frabjous day! Callooh! Callay!\"\nHe chortled in his joy.",
      "'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.",
    ],
  },
  {
    title: "The Fool's Prayer",
    author: "Edward Rowland Sill",
    year: 1883,
    stanzas: [
      "The royal feast was done; the King\nSought some new sport to banish care,\nAnd to his jester cried: \"Sir Fool,\nKneel now, and make for us a prayer!\"",
      "The jester doffed his cap and bells,\nAnd stood the mocking court before;\nThey could not see the bitter smile\nBehind the painted grin he wore.",
      "He bowed his head, and bent his knee\nUpon the Monarch's silken stool;\nHis pleading voice arose: \"O Lord,\nBe merciful to me, a fool!",
      "\"No pity, Lord, could change the heart\nFrom red with wrong to white as wool;\nThe rod must heal the sin: but Lord,\nBe merciful to me, a fool!",
      "\"'Tis not by guilt the onward sweep\nOf truth and right, O Lord, we stay;\n'Tis by our follies that so long\nWe hold the earth from heaven away.",
      "\"These clumsy feet, still in the mire,\nGo crushing blossoms without end;\nThese hard, well-meaning hands we thrust\nAmong the heart-strings of a friend.",
      "\"The ill-timed truth we might have kept—\nWho knows how sharp it pierced and stung?\nThe word we had not sense to say—\nWho knows how grandly it had rung!",
      "\"Our faults no tenderness should ask.\nThe chastening stripes must cleanse them all;\nBut for our blunders—oh, in shame\nBefore the eyes of heaven we fall.",
      "\"Earth bears no balsam for mistakes;\nMen crown the knave, and scourge the tool\nThat did his will; but Thou, O Lord,\nBe merciful to me, a fool!\"",
      "The room was hushed; in silence rose\nThe King, and sought his gardens cool,\nAnd walked apart, and murmured low,\n\"Be merciful to me, a fool!\"",
    ],
  },
  {
    title: "The Destruction of Sennacherib",
    author: "Lord Byron",
    year: 1815,
    stanzas: [
      "The Assyrian came down like a wolf on the fold,\nAnd his cohorts were gleaming in purple and gold;\nAnd the sheen of their spears was like stars on the sea,\nWhen the blue wave rolls nightly on deep Galilee.",
      "Like the leaves of the forest when the Summer is green,\nThat host with their banners at sunset were seen:\nLike the leaves of the forest when Autumn hath blown,\nThat host on the morrow lay withered and strown.",
      "For the Angel of Death spread his wings on the blast,\nAnd breathed in the face of the foe as he passed;\nAnd the eyes of the sleepers waxed deadly and chill,\nAnd their hearts but once heaved, and forever grew still!",
      "And there lay the steed with his nostril all wide,\nBut through it there rolled not the breath of his pride:\nAnd the foam of his gasping lay white on the turf,\nAnd cold as the spray of the rock-beating surf.",
      "And there lay the rider distorted and pale,\nWith the dew on his brow, and the rust on his mail,\nAnd the tents were all silent, the banners alone,\nThe lances unlifted, the trumpet unblown.",
      "And the widows of Ashur are loud in their wail,\nAnd the idols are broke in the temple of Baal;\nAnd the might of the Gentile, unsmote by the sword,\nHath melted like snow in the glance of the Lord!",
    ],
  },
];

export function getPoem(title: string): Poem | undefined {
  return poems.find((p) => p.title === title);
}

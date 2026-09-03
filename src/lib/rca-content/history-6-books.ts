// Real chapter/section-by-section reference content for the books History 6
// actually reads (history-6.ts's real 2026-2027 pacing references these by
// title + chapter number, e.g. "Discuss BAW Ch. 6 & 7", but until now the app
// had no idea what those chapters actually contain — same gap the Baltimore
// Catechism guide fixed for Religion 6). Built 2026-09-02 from a parallel
// research pass (6 agents, one per book) over publicly available sources:
// publisher descriptions, study guides (BookRags/SuperSummary/Progeny Press),
// Goodreads/reviews, homeschool curriculum sites, Quizlet sets. NOT verbatim
// book text (these are real, still-in-print copyrighted novels/textbooks,
// unlike the poems or the 1885 catechism) — original summaries written from
// those sources, same paraphrase-not-copy approach as every other content file
// here. Honest gaps are marked explicitly rather than invented — several
// chapters genuinely have no public summary available; better to say so than
// fabricate a plot detail for a real book real students are reading.

export type ChapterSummary = { chapter: string; title?: string; summary: string };
export type BookGuide = {
  title: string;
  author: string;
  note: string; // identification confidence / sourcing note
  chapters: ChapterSummary[];
};

export const bookOfAncientWorld: BookGuide = {
  title: "The Book of the Ancient World",
  author: "Dorothy Mills (1923; current classical-curriculum edition via Memoria Press)",
  note:
    "High-confidence identification (Memoria Press's 'Book of the Ancient World' set, used across classical " +
    "homeschool curricula matching RCA's own citation style). No public chapter-by-chapter summaries were " +
    "found — Memoria Press's own curriculum structures it as 28 lessons across Egypt, Mesopotamia, Palestine/" +
    "the Hebrews, the Hittites, Persia, and Phoenicia, each with facts/vocabulary/comprehension questions, but " +
    "the specific per-chapter content isn't publicly indexed. Note the book itself (1923) is old enough to be " +
    "public domain, unlike the novels below — a full-text pull from Internet Archive/HathiTrust is a real next " +
    "step if this level of gap matters enough to be worth doing.",
  chapters: [],
};

export const pyramidBook: BookGuide = {
  title: "Pyramid",
  author: "David Macaulay (1975)",
  note: "High confidence. Illustrated nonfiction narrative (no discrete numbered chapters), not a novel with plot/characters.",
  chapters: [
    { chapter: "opening", summary: "A pharaoh commissions his pyramid; introduces Old Kingdom (~3rd millennium BC) Egyptian afterlife beliefs and funeral preparations that motivate the project." },
    { chapter: "planning", summary: "Architects sketch plans and survey the building site; work facilities and a labor camp are established near the site." },
    { chapter: "temple", summary: "Construction of the mortuary temple and subsidiary structures alongside the pyramid itself." },
    { chapter: "labor & tools", summary: "Real construction methods: copper chisels, wooden sledges, levers, and ramps; how stone was cut, moved, and organized labor gangs did the work." },
    { chapter: "building", summary: "Step-by-step account of hauling, hoisting, and placing stone blocks as the pyramid rises in stages." },
    { chapter: "completion", summary: "The capstone is placed; the pharaoh's body is prepared and sealed in the burial chamber, completing the project." },
  ],
};

export const pharaohsBook: BookGuide = {
  title: "The Pharaohs of Ancient Egypt",
  author: "Elizabeth Payne (1964, Landmark Books)",
  note:
    "High confidence on identification (Landmark Books series, used in classical homeschool curricula alongside " +
    "'Pyramid'). 7 chapters confirmed to exist; individual chapter titles are not publicly listed, so this is " +
    "organized by real content covered rather than exact chapter boundaries — treat chapter number citations " +
    "in the pacing doc as approximate mapping to this content order.",
  chapters: [
    { chapter: "intro", summary: "How Egyptology began: the discovery and decipherment of the Rosetta Stone by French scholars in the Napoleonic era, and how archaeologists reconstructed Egyptian history from it." },
    { chapter: "early", summary: "Egypt's prehistory (~10,000-3200 BC) and the emergence of Nile Valley civilization; Pharaoh Narmer/Menes (~3200 BC) unifies Upper and Lower Egypt." },
    { chapter: "old kingdom", summary: "The pyramid-building age under Khufu (Cheops) — monumental construction and the height of Old Kingdom power." },
    { chapter: "new kingdom", summary: "Military expansion under Thutmose III; the reign of Queen Hatshepsut, one of Egypt's few female pharaohs, at the empire's territorial peak." },
    { chapter: "later", summary: "Ramses II's reign — major military campaigns in the Middle East, monument-building, and cultural developments; the eventual decline of Egyptian power." },
  ],
};

export const goldenGoblet: BookGuide = {
  title: "The Golden Goblet",
  author: "Eloise Jarvis McGraw (1961 Newbery Honor)",
  note: "High confidence, well-documented via BookRags/SuperSummary study guides. Protagonist: Ranofer, an orphaned 12-year-old in Thebes who dreams of becoming a goldsmith.",
  chapters: [
    { chapter: "1", summary: "Ranofer works as a porter in master goldsmith Rekh's shop, dreaming of apprenticeship. His cruel half-brother Gebu refuses to pay for his training and takes his wages. Ranofer unknowingly carries stolen gold home for coworker Ibni, who is smuggling it to Gebu." },
    { chapter: "3", summary: "Ranofer meets Heqet outside the apprentice quarters, accepts food from him despite his pride, and the two become friends as Ranofer teaches him goldsmith techniques." },
    { chapter: "4", summary: "Ranofer visits his late father Thutra's tomb for inspiration and confides the full theft scheme to Heqet, who agrees to report Ibni to Rekh to protect Ranofer from Gebu." },
    { chapter: "5", summary: "Heqet reports Ibni's theft to Rekh. Ranofer witnesses the grim aftermath of tomb-robbery executions — a reminder that grave robbery is a capital crime in Egypt. Ibni disappears from work." },
    { chapter: "6", summary: "Ranofer comes home to find Gebu confronting and dismissing Ibni. Gebu then crushes Ranofer's goldsmith dreams with unexpected bad news." },
    { chapter: "7", summary: "Ranofer is transferred to Gebu's stonecutting shop, meets old stonecutter Zahotep, and begins plotting a path to independence (cutting and selling reeds) that could lead to training under master goldsmith Zau." },
    { chapter: "9", summary: "Ranofer arrives at work bruised from Gebu's beatings and notices Gebu's sudden new wealth. He, Heqet, and the Ancient (a wise old man) devise a plan to each surveil one of Gebu's associates." },
    { chapter: "11-12", summary: "Ranofer investigates Gebu's door lock and grows preoccupied with a valuable golden goblet he's seen. The Ancient reveals Gebu and his accomplice Setma argued over payment for a tomb-theft scheme; the goblet then disappears." },
    { chapter: "13", summary: "Ranofer follows Gebu into the Valley of the Tombs of the Kings and discovers a hidden underground entrance, falling into it after being startled." },
    { chapter: "15-16", summary: "Heqet and the Ancient help Ranofer, who then makes his way to the palace and infiltrates the grounds seeking help. The story resolves with Ranofer earning the Queen's trust, exposing Gebu's tomb-robbing, and finally winning his goldsmith apprenticeship with Zau." },
  ],
};

export const tirzah: BookGuide = {
  title: "Tirzah",
  author: "Lucille Travis",
  note:
    "Christian historical fiction about a 12-year-old Israelite girl's family during the Exodus. Chapter titles " +
    "confirmed via Google Books preview; detailed chapter-by-chapter plot summaries are not publicly available " +
    "(genuinely niche title) — main characters and overall event sequence are solid, individual chapter events beyond " +
    "what's listed here are an honest gap.",
  chapters: [
    { chapter: "1", title: "Why Must You Die?", summary: "Tirzah and her family prepare to leave Egypt as the final plague approaches." },
    { chapter: "2", title: "Darkness over Egypt", summary: "References the plague of darkness over Egypt." },
    { chapter: "3", title: "Go and Do Not Return", summary: "Pharaoh finally releases the Israelites." },
    { chapter: "4", title: "The Trap", summary: "Pharaoh changes his mind and pursues the Israelites with chariots." },
    { chapter: "5", title: "The Bottom of the Sea", summary: "The Red Sea crossing." },
    { chapter: "6", title: "Escape", summary: "The flight from Egypt continues." },
    { chapter: "7", title: "Forgiven", summary: "Reflection in the aftermath of deliverance." },
    { chapter: "8", title: "Merrie", summary: "Introduces Merrie, an Egyptian girl who flees with the Israelites — Tirzah befriends her despite prejudice." },
    { chapter: "11", title: "A Golden Idol", summary: "The golden calf incident at Sinai." },
    { chapter: "16", title: "Meat from the [Sky?]", summary: "Likely the quail provision in the wilderness (title truncated in available sources)." },
  ],
};

export const godKing: BookGuide = {
  title: "God King",
  author: "Joanne Williamson (Bethlehem Books)",
  note:
    "Historical fiction: young Kushite Prince Taharka becomes Pharaoh of Egypt, flees court intrigue, and " +
    "arrives in Judah during Sennacherib's Assyrian siege of Jerusalem (701 BC) — ties directly into Religion 6's " +
    "own Sennacherib/Hezekiah material. Chapters 1-3 and the overall arc are well-documented; chapters 4-26 have " +
    "confirmed real titles but no public detailed summaries (honest gap, not fabricated).",
  chapters: [
    { chapter: "1", title: "Crocodile!", summary: "12-year-old Prince Taharka joins a crocodile hunt on the Nile. When a boatman is badly wounded, Taharka breaks sacred taboo by using his ritual cloth to bandage a slave's wound, saving his life." },
    { chapter: "2", title: "Death of a God", summary: "Taharka is summoned to his dying father, Pharaoh Shabaka. Despite the taboo violation, Shabaka is impressed by his son's compassion and names Taharka — not his older brother Shabataka — his successor." },
    { chapter: "3", title: "Shabataka", summary: "Taharka's passed-over older brother Shabataka is furious and begins plotting against him, setting up the novel's central conflict." },
    { chapter: "4-26 (titles only)", summary: "Real chapter titles confirmed (The Journey; Gods and Goddesses; Gathering Clouds; Embutah!; The Smile on the High Priest's Face; Nightmare; The House of Talos; Physician; Shabataka, My Brother; Flight from Thebes; No Ships to the East; Shabataka in the Night; The Sea and the Smoke; Rab Shaka; The Tabernacle; Don't Let Them See You Cry; Pharaoh of Egypt; The Spring and the Tunnel; The Mad King; He Will Not Come Into the City; The Man with the Scar; The Confrontation; The Return of a King) — detailed per-chapter plot summaries are an honest gap." },
    { chapter: "overall arc", summary: "As Pharaoh, Taharka faces assassination plots; his uncle Embutah is murdered and his royal taster poisoned. He flees Egypt disguised as a medical assistant, crosses the Sinai, and reaches Judah during Sennacherib's siege of Jerusalem — forced to choose between allying with mighty Assyria or trusting Hezekiah's faith in Yahweh. The Assyrian army is struck by a mysterious plague and withdraws, vindicating Hezekiah." },
  ],
};

export const victoryOnTheWalls: BookGuide = {
  title: "Victory on the Walls",
  author: "Frieda Clark Hyman (Bethlehem Books)",
  note:
    "Historical fiction about Nehemiah rebuilding Jerusalem's walls (445 BC), told through the eyes of a fictional " +
    "13-year-old orphan, Bani. Only the opening chapters and overall arc are publicly documented — most chapter " +
    "content is a genuine, honestly-flagged gap.",
  chapters: [
    { chapter: "1-2", summary: "Introduces Bani, a 13-year-old orphan raised in Susa, Persia, who identifies as Persian despite being born in Jerusalem. Establishes his teacher Jadon and daily life in the Persian court." },
    { chapter: "3", summary: "Nehemiah, cupbearer to King Artaxerxes, is found in mourning/prayer over Jerusalem's ruined walls; the King grants him leave to travel to Jerusalem and rebuild them." },
    { chapter: "later (unordered)", summary: "The journey from Susa to Jerusalem; arrival and opposition from Sanballat, Tobiah, and Geshem; the physical work of rebuilding the wall; Bani's own journey from Persian-identified orphan to embracing his Jewish heritage." },
  ],
};

export type MythSummary = { title: string; summary: string };
export const greekMythsBook: { title: string; author: string; note: string; myths: MythSummary[] } = {
  title: "D'Aulaires' Book of Greek Myths",
  author: "Ingri and Edgar Parin d'Aulaire (1962)",
  note:
    "High confidence (95%+) — directly confirmed as the classical-curriculum standard for this exact reading, " +
    "used by Regina Caeli Academy's own curriculum materials. Not chapter-numbered — organized by story, since " +
    "the pacing doc has the tutor 'choose a few stories to discuss.'",
  myths: [
    { title: "Persephone and Demeter", summary: "Hades kidnaps Persephone; her mother Demeter refuses to let anything grow until she's freed. Persephone returns but must spend half the year in the underworld because she ate pomegranate seeds there — explaining the seasons." },
    { title: "Prometheus and Pandora", summary: "Prometheus steals fire from the gods for humanity and is punished by being chained to a rock, his liver eaten daily by an eagle. Zeus sends Pandora with a sealed jar; she opens it, releasing all human miseries — only Hope remains inside." },
    { title: "Perseus and Medusa", summary: "Perseus, son of Zeus, is given divine weapons to hunt the Gorgon Medusa, whose gaze turns men to stone. Using a reflective shield to avoid her eyes directly, he beheads her and later rescues Princess Andromeda." },
    { title: "The Labors of Hercules (Heracles)", summary: "Driven mad by Hera and caused to kill his own family, Heracles must complete twelve seemingly impossible labors as atonement — including slaying the Nemean Lion and stealing the Golden Apples of the Hesperides — becoming Greece's greatest hero." },
    { title: "Theseus and the Minotaur", summary: "Theseus volunteers to be sacrificed to the Minotaur, a half-man half-bull monster trapped in an inescapable Labyrinth on Crete. Using a thread from Ariadne to find his way back out, he slays the beast." },
    { title: "Daedalus and Icarus", summary: "The inventor Daedalus, imprisoned after building the Labyrinth, crafts wax-and-feather wings so he and his son Icarus can escape. Icarus flies too close to the sun despite his father's warning; the wax melts and he falls into the sea." },
    { title: "King Midas", summary: "Granted his wish that everything he touches turn to gold, Midas is overjoyed until his food, drink, and even his own daughter turn to gold at his touch, teaching him the cost of greed." },
    { title: "Jason and the Golden Fleece", summary: "Jason leads the Argonauts, a crew of Greece's greatest heroes, on a perilous voyage to retrieve the Golden Fleece, facing monsters and divine obstacles along the way, ultimately succeeding with the sorceress Medea's help." },
    { title: "Orpheus and Eurydice", summary: "The musician Orpheus, whose playing charms all living things, journeys to the underworld to bring back his dead wife Eurydice. Hades allows it on one condition — he cannot look back at her until they've left — but Orpheus fails at the last moment and loses her forever." },
    { title: "Sisyphus", summary: "Punished for trickery against the gods, Sisyphus is condemned to eternally push a boulder up a mountain, only for it to roll back down each time he nears the top." },
  ],
};

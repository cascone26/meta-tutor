// One-time port of the standalone veritas app's full-text corpora (Bible, Summa Contra
// Gentiles, Catena Aurea, Catechism) into meta-tutor's existing Library reader format.
// Copies markdown into public/veritas-books/ and emits src/data/veritas/corpora-books.ts.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const SRC = "/Users/scones/projects/veritas/public";
const DEST_BOOKS = join(process.cwd(), "public/veritas-books");
const DEST_DATA = join(process.cwd(), "src/data/veritas/corpora-books.ts");

mkdirSync(DEST_BOOKS, { recursive: true });

// Canonical Douay-Rheims 73-book order, with modern-name aliases folded into `covers`
// for search. [filenameStem, Display Title, modern alias or null, testament]
const BIBLE_BOOKS = [
  ["genesis", "Genesis", null, "OT"],
  ["exodus", "Exodus", null, "OT"],
  ["leviticus", "Leviticus", null, "OT"],
  ["numbers", "Numbers", null, "OT"],
  ["deuteronomy", "Deuteronomy", null, "OT"],
  ["josue", "Josue", "Joshua", "OT"],
  ["judges", "Judges", null, "OT"],
  ["ruth", "Ruth", null, "OT"],
  ["1-kings", "1 Kings", "1 Samuel", "OT"],
  ["2-kings", "2 Kings", "2 Samuel", "OT"],
  ["3-kings", "3 Kings", "1 Kings", "OT"],
  ["4-kings", "4 Kings", "2 Kings", "OT"],
  ["1-paralipomenon", "1 Paralipomenon", "1 Chronicles", "OT"],
  ["2-paralipomenon", "2 Paralipomenon", "2 Chronicles", "OT"],
  ["1-esdras", "1 Esdras", "Ezra", "OT"],
  ["2-esdras", "2 Esdras", "Nehemiah", "OT"],
  ["tobias", "Tobias", "Tobit", "OT"],
  ["judith", "Judith", null, "OT"],
  ["esther", "Esther", null, "OT"],
  ["job", "Job", null, "OT"],
  ["psalms", "Psalms", null, "OT"],
  ["proverbs", "Proverbs", null, "OT"],
  ["ecclesiastes", "Ecclesiastes", null, "OT"],
  ["canticle-of-canticles", "Canticle of Canticles", "Song of Songs", "OT"],
  ["wisdom", "Wisdom", null, "OT"],
  ["ecclesiasticus", "Ecclesiasticus", "Sirach", "OT"],
  ["isaias", "Isaias", "Isaiah", "OT"],
  ["jeremias", "Jeremias", "Jeremiah", "OT"],
  ["lamentations", "Lamentations", null, "OT"],
  ["baruch", "Baruch", null, "OT"],
  ["ezechiel", "Ezechiel", "Ezekiel", "OT"],
  ["daniel", "Daniel", null, "OT"],
  ["osee", "Osee", "Hosea", "OT"],
  ["joel", "Joel", null, "OT"],
  ["amos", "Amos", null, "OT"],
  ["abdias", "Abdias", "Obadiah", "OT"],
  ["jonas", "Jonas", "Jonah", "OT"],
  ["micheas", "Micheas", "Micah", "OT"],
  ["nahum", "Nahum", null, "OT"],
  ["habacuc", "Habacuc", "Habakkuk", "OT"],
  ["sophonias", "Sophonias", "Zephaniah", "OT"],
  ["aggeus", "Aggeus", "Haggai", "OT"],
  ["zacharias", "Zacharias", "Zechariah", "OT"],
  ["malachias", "Malachias", "Malachi", "OT"],
  ["1-machabees", "1 Machabees", "1 Maccabees", "OT"],
  ["2-machabees", "2 Machabees", "2 Maccabees", "OT"],
  ["matthew", "Matthew", null, "NT"],
  ["mark", "Mark", null, "NT"],
  ["luke", "Luke", null, "NT"],
  ["john", "John", null, "NT"],
  ["acts", "Acts of the Apostles", null, "NT"],
  ["romans", "Romans", null, "NT"],
  ["1-corinthians", "1 Corinthians", null, "NT"],
  ["2-corinthians", "2 Corinthians", null, "NT"],
  ["galatians", "Galatians", null, "NT"],
  ["ephesians", "Ephesians", null, "NT"],
  ["philippians", "Philippians", null, "NT"],
  ["colossians", "Colossians", null, "NT"],
  ["1-thessalonians", "1 Thessalonians", null, "NT"],
  ["2-thessalonians", "2 Thessalonians", null, "NT"],
  ["1-timothy", "1 Timothy", null, "NT"],
  ["2-timothy", "2 Timothy", null, "NT"],
  ["titus", "Titus", null, "NT"],
  ["philemon", "Philemon", null, "NT"],
  ["hebrews", "Hebrews", null, "NT"],
  ["james", "James", null, "NT"],
  ["1-peter", "1 Peter", null, "NT"],
  ["2-peter", "2 Peter", null, "NT"],
  ["1-john", "1 John", null, "NT"],
  ["2-john", "2 John", null, "NT"],
  ["3-john", "3 John", null, "NT"],
  ["jude", "Jude", null, "NT"],
  ["apocalypse", "Apocalypse", "Revelation", "NT"],
];

const SCG_BOOKS = [
  ["scg-book1", "book1", "Summa Contra Gentiles — Book I: God"],
  ["scg-book2", "book2", "Summa Contra Gentiles — Book II: Creation"],
  ["scg-book3", "book3", "Summa Contra Gentiles — Book III: Providence"],
  ["scg-book4", "book4", "Summa Contra Gentiles — Book IV: Salvation"],
];

const CATENA_BOOKS = [
  ["catena-matthew", "matthew", "Catena Aurea — Gospel of Matthew"],
  ["catena-mark", "mark", "Catena Aurea — Gospel of Mark"],
  ["catena-luke", "luke", "Catena Aurea — Gospel of Luke"],
  ["catena-john", "john", "Catena Aurea — Gospel of John"],
];

// CCC source files use `#### ` for every heading level below Part (flat export).
// Promote lines matching CHAPTER markers (and the title line immediately after) to
// `## ` so the existing reader's chapter-splitter (exact `## `) gets real reader-sized
// chapters instead of one giant chapter per Part. Keep `####`/`###`/etc. elsewhere as
// in-content subheadings (the reader already renders those fine within a chapter).
function promoteCCCChapters(markdown) {
  const lines = markdown.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isChapterMarker = /^####\s+(CHAPTER|ARTICLE)\s+[A-Z]+\s*$/i.test(line.trim());
    if (isChapterMarker) {
      out.push("## " + line.replace(/^####\s+/, "").replace(/:$/, ""));
      // Fold the following title line(s) (also ####, possibly separated by blank lines) in.
      let j = i + 1;
      const titleParts = [];
      while (j < lines.length && titleParts.length < 2) {
        if (lines[j].trim() === "") { j++; continue; }
        if (!/^####\s+/.test(lines[j])) break;
        titleParts.push(lines[j].replace(/^####\s+/, ""));
        j++;
      }
      if (titleParts.length) {
        out[out.length - 1] += ": " + titleParts.join(" ");
        i = j - 1;
      }
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

const CCC_PARTS = [
  ["ccc-part1", "part1", "Catechism of the Catholic Church — Part 1: The Profession of Faith"],
  ["ccc-part2", "part2", "Catechism of the Catholic Church — Part 2: The Celebration of the Christian Mystery"],
  ["ccc-part3", "part3", "Catechism of the Catholic Church — Part 3: Life in Christ"],
  ["ccc-part4", "part4", "Catechism of the Catholic Church — Part 4: Christian Prayer"],
];

// One-line theological takeaway per book/corpus — used as `keyInsight`.
const KEY_INSIGHT = {
  genesis: "Creation, fall, and promise — God forms a people through Abraham out of a world broken by sin.",
  exodus: "God delivers His people from slavery and binds Himself to them in covenant at Sinai.",
  leviticus: "Holiness has a shape: Israel's worship and purity laws teach that a holy God must be approached rightly.",
  numbers: "Even a redeemed people can refuse the promised land through unbelief — the wilderness generation's warning.",
  deuteronomy: "Moses's farewell restates the covenant as a choice: 'I have set before you life and death... choose life.'",
  josue: "God is faithful to the promise of the land — conquest as the fulfillment of centuries of waiting.",
  judges: "Without faithful leadership, 'every man did what was right in his own eyes' — the case for kingship under God.",
  ruth: "Loyalty and providence in an ordinary life — a Moabite widow becomes an ancestor of David, and of Christ.",
  "1-kings": "Israel demands a king like the nations; Saul's rise and fall shows the cost of kingship without humility.",
  "2-kings": "David — a man after God's own heart who still falls, repents, and is restored; mercy within real consequence.",
  "3-kings": "Solomon's wisdom and the kingdom's glory give way to division — the peril of a divided heart.",
  "4-kings": "The northern and southern kingdoms unravel into exile — prophetic warnings ignored to the end.",
  "1-paralipomenon": "A priestly retelling of Israel's history centered on worship, the Temple, and the line of David.",
  "2-paralipomenon": "From Solomon's Temple to Babylonian exile — history read through the lens of fidelity to the covenant.",
  "1-esdras": "Return from exile and the rebuilding of the Temple — restoration after judgment.",
  "2-esdras": "Nehemiah rebuilds Jerusalem's walls — the hard, practical work of restoring a broken community.",
  tobias: "Providence works quietly through ordinary faithfulness, a guardian angel, and a long-suffering family.",
  judith: "A faithful widow's courage delivers her people — God works through the unlikely and unarmed.",
  esther: "God's providence, unnamed but unmistakable, saves His people through one woman's courage 'for such a time as this.'",
  job: "Suffering is not always punishment — Job's story confronts the mystery of innocent suffering and God's sovereignty.",
  psalms: "The prayer book of the Bible — every human emotion brought honestly before God, often by Christ Himself on the Cross.",
  proverbs: "Practical wisdom for ordinary life: 'The fear of the Lord is the beginning of wisdom.'",
  ecclesiastes: "Without God, everything under the sun is 'vanity' — the search for meaning in a world of its own eventually despairs.",
  "canticle-of-canticles": "Read by the Fathers and Aquinas as an allegory of the soul's (and the Church's) love for God.",
  wisdom: "A sustained meditation on divine Wisdom and the justice awaiting both the righteous and the wicked.",
  ecclesiasticus: "Practical wisdom literature in the tradition of Proverbs — virtue, friendship, family, and the fear of the Lord.",
  isaias: "The most-quoted prophet in the New Testament — judgment, the Suffering Servant, and the hope of a Messiah.",
  jeremias: "The 'weeping prophet' confronts a nation's unfaithfulness and promises a New Covenant written on the heart.",
  lamentations: "Grief over Jerusalem's fall held together with hope: 'His mercies... are new every morning.'",
  baruch: "Exile, repentance, and the hope of return, written in the voice of Jeremiah's scribe.",
  ezechiel: "Visions of God's glory departing and returning — judgment, exile, and the promise of a new heart and new spirit.",
  daniel: "Faithfulness under pagan empires, and apocalyptic visions of the kingdoms of the world giving way to God's kingdom.",
  osee: "God's covenant love pictured as a faithful husband to an unfaithful Israel — judgment that never stops being love.",
  joel: "A locust plague becomes the occasion for a call to repentance and the promise of the Spirit 'poured out on all flesh.'",
  amos: "A shepherd-prophet thunders against social injustice and empty ritual religion without justice.",
  abdias: "The shortest Old Testament book — a warning against pride, aimed at Israel's hostile neighbor Edom.",
  jonas: "God's mercy extends even to Israel's enemies — and even a prophet can resent the God he serves.",
  micheas: "Judgment on injustice paired with one of Scripture's clearest prophecies of the Messiah's birthplace, Bethlehem.",
  nahum: "A prophecy of judgment against Nineveh — God's patience (shown in Jonah) is not inexhaustible for the unrepentant.",
  habacuc: "'The just man lives by his faith' — wrestling honestly with God over why evil seems to prosper.",
  sophonias: "The 'Day of the Lord' as both judgment and the promise of a purified, rejoicing remnant.",
  aggeus: "A call to rebuild the Temple — God's house must come before personal comfort.",
  zacharias: "Rich messianic imagery (a king on a donkey, thirty pieces of silver, a pierced one) later fulfilled in Christ.",
  malachias: "The last Old Testament voice: a call to renewed worship and the promise of Elijah's return before 'the great Day.'",
  "1-machabees": "The Jewish revolt against forced Hellenization — faithful resistance and the origin of Hanukkah.",
  "2-machabees": "Martyrdom, resurrection hope, and prayer for the dead — key texts for later Catholic doctrine on purgatory.",
  matthew: "Christ as the fulfillment of the Old Testament and the new Moses, written for a Jewish audience.",
  mark: "The shortest, fastest-paced Gospel — Christ the suffering Servant, action over discourse.",
  luke: "Christ's mercy toward the poor, women, and outcasts, by the 'physician' who also wrote Acts.",
  john: "Christ's divinity proclaimed from the first verse — 'the Word was God' — through seven signs and seven 'I AM' statements.",
  acts: "The Holy Spirit builds the Church from Jerusalem to Rome through the apostles, especially Peter and Paul.",
  romans: "Paul's fullest theological treatise — sin, justification, grace, and the mystery of Israel and the Gentiles.",
  "1-corinthians": "Paul corrects a divided, scandal-ridden church — love, the Eucharist, and the resurrection of the body.",
  "2-corinthians": "Paul defends his apostleship and models Christian suffering, weakness, and reconciliation.",
  galatians: "Justification is by grace through faith, not by the works of the Mosaic law — Paul's sharpest polemic.",
  ephesians: "The Church as Christ's body and bride, and the Christian household ordered by mutual self-gift.",
  philippians: "Joy in suffering and the great Christological hymn: Christ 'emptied himself, taking the form of a servant.'",
  colossians: "Christ's supremacy over all creation and every philosophy — 'in him all things hold together.'",
  "1-thessalonians": "Paul's earliest letter — perseverance in persecution and hope for Christ's return.",
  "2-thessalonians": "Correcting confusion about the Day of the Lord and warning against idleness in light of it.",
  "1-timothy": "Pastoral instruction for Church order — qualifications for bishops and deacons, sound doctrine.",
  "2-timothy": "Paul's last letter before martyrdom: 'I have fought the good fight... I have kept the faith.'",
  titus: "Instructions for organizing a young church in Crete — sound teaching matched by good works.",
  philemon: "A personal appeal for mercy toward a runaway slave — the Gospel reshaping even social relationships.",
  hebrews: "Christ as the true and final High Priest, whose one sacrifice fulfills and surpasses the entire Old Covenant.",
  james: "'Faith without works is dead' — practical Christianity and the discipline of the tongue.",
  "1-peter": "Hope and perseverance in suffering, for Christians scattered as 'resident aliens' under persecution.",
  "2-peter": "A warning against false teachers and a reminder that 'the Lord is not slow... but patient.'",
  "1-john": "God is love, and love of God is inseparable from love of neighbor — tests for knowing we are truly His.",
  "2-john": "A brief warning to walk in truth and love, and to beware deceivers who deny Christ come in the flesh.",
  "3-john": "A short personal letter commending hospitality shown to traveling missionaries.",
  jude: "A sharp warning against false teachers, ending in one of Scripture's great doxologies.",
  apocalypse: "Christ's ultimate victory over evil, told in apocalyptic vision — history is going somewhere, and He wins.",
  "scg-book1": "Natural reason alone can establish God's existence and attributes, before revelation is even introduced.",
  "scg-book2": "Creation ex nihilo, the soul's nature, and the created order flow from God as first efficient cause.",
  "scg-book3": "Divine providence governs all things toward their end, including the moral order and human happiness.",
  "scg-book4": "Truths reason alone cannot reach — Trinity, Incarnation, sacraments, resurrection — are fitting, not irrational.",
  "catena-matthew": "The Fathers, woven verse by verse, show the Gospel was never read in isolation from the whole Tradition.",
  "catena-mark": "Patristic commentary reveals layers of meaning in Mark's spare, fast-moving narrative.",
  "catena-luke": "The Fathers draw out Luke's themes of mercy and the Holy Spirit verse by verse.",
  "catena-john": "Patristic depth on John's high Christology, assembled by Aquinas himself as a teaching tool.",
  "ccc-part1": "The Creed, article by article — what the Church believes and why, from God's existence to eternal life.",
  "ccc-part2": "Christian worship — the seven sacraments as Christ's ongoing presence and action in the Church.",
  "ccc-part3": "The moral life as the path to beatitude — the Commandments as a map to genuine human flourishing.",
  "ccc-part4": "Prayer in general and the Our Father in particular, as the summary of the whole Gospel.",
};

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}
function formatWordCount(n) {
  return `~${n.toLocaleString()} words`;
}
function formatReadingDays(n) {
  const days = Math.max(1, Math.round(n / 5000));
  const lo = Math.max(1, days - Math.round(days * 0.3));
  const hi = days + Math.round(days * 0.3);
  return `${lo}-${hi} days at 20 min/day`;
}
function countChapters(markdown) {
  return Math.max(1, (markdown.match(/^## /gm) || []).length);
}

const entries = [];

function addEntry({ slug, writtenText, ...rest }) {
  const words = countWords(writtenText);
  entries.push({
    ...rest,
    slug,
    keyInsight: KEY_INSIGHT[slug.replace(/^(bible-|)/, "")] ?? KEY_INSIGHT[slug] ?? "A core text of the Catholic intellectual and spiritual tradition.",
    chapters: countChapters(writtenText),
    wordCount: formatWordCount(words),
    readingDays: formatReadingDays(words),
    availableOnSite: true,
  });
}

// --- Bible ---
for (const [slug, title, alias, testament] of BIBLE_BOOKS) {
  const src = join(SRC, "bible", `${slug}.md`);
  if (!existsSync(src)) { console.error("MISSING bible:", src); continue; }
  const text = readFileSync(src, "utf8");
  const outSlug = `bible-${slug}`;
  writeFileSync(join(DEST_BOOKS, `${outSlug}.md`), text);
  addEntry({
    slug: outSlug,
    writtenText: text,
    title,
    author: "Sacred Scripture",
    period: testament === "OT" ? "Old Testament" : "New Testament",
    difficulty: "beginner",
    category: "scripture",
    covers: alias ? `${testament === "OT" ? "Old" : "New"} Testament. Also known as ${alias}. Douay-Rheims translation.` : `${testament === "OT" ? "Old" : "New"} Testament. Douay-Rheims translation.`,
    bestFor: "Reading Scripture directly, verse by verse, in the Church's traditional English translation.",
  });
}

// --- Summa Contra Gentiles ---
for (const [outSlug, bookFile, title] of SCG_BOOKS) {
  const src = join(SRC, "scg", `${bookFile}.md`);
  if (!existsSync(src)) { console.error("MISSING scg:", src); continue; }
  const text = readFileSync(src, "utf8");
  writeFileSync(join(DEST_BOOKS, `${outSlug}.md`), text);
  addEntry({
    slug: outSlug,
    writtenText: text,
    title,
    author: "St. Thomas Aquinas",
    period: "13th century (c. 1259–1265)",
    difficulty: "advanced",
    category: "theology",
    covers: "Aquinas's great missionary apologetic, written for Dominican friars evangelizing Muslims and Jews in Spain — natural-reason arguments for the faith, book by book: God's existence and nature, creation, divine providence and natural law, and the mysteries of faith (Trinity, Incarnation, sacraments, resurrection).",
    bestFor: "Readers who want Aquinas's apologetic case built from natural reason, before diving into the Summa Theologiae's objection/response format.",
  });
}

// --- Catena Aurea ---
for (const [outSlug, gospelFile, title] of CATENA_BOOKS) {
  const src = join(SRC, "catena", `${gospelFile}.md`);
  if (!existsSync(src)) { console.error("MISSING catena:", src); continue; }
  const text = readFileSync(src, "utf8");
  writeFileSync(join(DEST_BOOKS, `${outSlug}.md`), text);
  addEntry({
    slug: outSlug,
    writtenText: text,
    title,
    author: "St. Thomas Aquinas (compiler)",
    period: "13th century (c. 1264)",
    difficulty: "advanced",
    category: "theology",
    covers: "Aquinas's verse-by-verse 'golden chain' of patristic commentary — Church Fathers East and West woven together on every verse of the Gospel, compiled at the request of Pope Urban IV.",
    bestFor: "Deep Scripture study — seeing how the Fathers read each verse, organized by Aquinas himself.",
  });
}

// --- Catechism ---
for (const [outSlug, partFile, title] of CCC_PARTS) {
  const src = join(SRC, "ccc", `${partFile}.md`);
  if (!existsSync(src)) { console.error("MISSING ccc:", src); continue; }
  const promoted = promoteCCCChapters(readFileSync(src, "utf8"));
  writeFileSync(join(DEST_BOOKS, `${outSlug}.md`), promoted);
  addEntry({
    slug: outSlug,
    writtenText: promoted,
    title,
    author: "Catholic Church (Promulgated by Pope John Paul II, 1992)",
    period: "1992 (2nd typical edition 1997)",
    difficulty: "intermediate",
    category: "theology",
    covers: "The Catechism's full, official text for this Part — the Creed, the Sacraments, Life in Christ (the Commandments), or Christian Prayer, numbered by paragraph as in the official edition.",
    bestFor: "Looking up the Church's actual teaching, paragraph by paragraph, rather than a summary of it.",
  });
}

const tsOut = `// Auto-generated by scripts/veritas-port-corpora.mjs — full-text corpora ported from
// the standalone veritas app: the 73-book Douay-Rheims Bible, Summa Contra Gentiles,
// Catena Aurea, and the Catechism of the Catholic Church. All read through the existing
// Library reader (/veritas/library/[slug]) — same component, no new reader code.
import type { SpiritualBook } from "./spiritual-reading";

export const CORPORA_BOOKS: SpiritualBook[] = ${JSON.stringify(entries, null, 2)};
`;

writeFileSync(DEST_DATA, tsOut);
console.log(`Wrote ${entries.length} entries to ${DEST_DATA}`);
console.log(`Copied ${entries.length} markdown files to ${DEST_BOOKS}`);

// Music 3-4 Year B — transcribed/condensed from RCA's official master lesson plan doc
// (docs.google.com/document/d/1FupKLzgdbmjjpU6ifTUyCConhd5xmkpvGXBZXA_BGpM), pulled 2026-08-09.
// Every class: Opening Prayer (Signum Crucis) -> Choral Warm-up -> Hymns and Chants -> Recorder -> Closing Prayer.
// Condensed to the actionable teaching content; full sheet music/audio files/QR codes live in the source doc.

export type MusicLesson = {
  n: number;
  warmup: string;
  hymnsChants: string;
  recorder: string;
  note?: string;
};

export const music34Overview =
  "Music 3-4 Year B: singing (rounds + Latin hymns/Mass chants) and recorder, one lesson/week, 32 lessons. " +
  "Every class follows the same shape — Opening Prayer (Sign of the Cross) -> Choral Warm-up (round) -> Hymns and Chants -> Recorder -> Closing Prayer. " +
  "Seat boys and girls separately in a chorale arrangement; assign seats with a seating chart. Recorder book is used across two years — this class covers roughly half the pieces.";

export const music34Lessons: MusicLesson[] = [
  { n: 1, warmup: "Introduce round \"Father, I Adore You.\" Sing/play it, then have students join in.", hymnsChants: "Introduce \"Regina Caeli\" (Marian hymn sung Easter–Pentecost). Play, ask about Latin/English cognates, translate line by line, follow along on sheets.", recorder: "Cover class rules (when to play/not, blow gently). Intro lesson pp.2-3: breathing, tone, holding the recorder. Check left hand on top." },
  { n: 2, warmup: "Sing \"Father, I Adore You\" — direct soft vs. strong (forte = \"strong,\" not loud; stop if it becomes yelling).", hymnsChants: "Continue \"Regina Caeli\" — say Latin line-by-line for pronunciation, students echo.", recorder: "Review pp.2-3. New: Quarter Note, Quarter Rest, Tonguing. Play Let's Play B / Let's Play A / Let's Play G." },
  { n: 3, warmup: "Sing \"Father, I Adore You\"; if confident, try as a round (tutor softly sings 2nd part).", hymnsChants: "Sing \"Regina Caeli.\"", recorder: "Review p.4 + Review exercise. New: Tone (p.5). Play Changing Notes / From the Top / Up and Down." },
  { n: 4, warmup: "Sing \"Father, I Adore You\" as a round in 2 parts (2 groups).", hymnsChants: "Introduce \"Kyrie XI\" (Missa Orbis Factor). Translation: \"Lord have mercy, Christ have mercy, Lord have mercy\" — note it's Greek, not Latin. Coloring page of Pope St. Gregory the Great while listening (Gregorian chant background).", recorder: "Review B/A/G. Play Changing Notes / From the Top / Up and Down. New: Rhythm note + Essential Elements Quiz piece (played, not graded)." },
  { n: 5, warmup: "Sing \"Father, I Adore You\" as a round in 2, then 3 parts if ready.", hymnsChants: "Examine Kyrie XI notation (square/diamond notes = 1 beat, dot = hold 2 beats, \"bis\" = twice). Play recording, follow along, sing quietly.", recorder: "Review Quiz piece. p.6: write in note names, play Step It Up. New: Half Note/Rest, play Time Out." },
  { n: 6, warmup: "Introduce round \"Make New Friends.\"", hymnsChants: "Play Kyrie XI, follow along and sing quietly.", recorder: "pp.6-7: Breath Mark, Melody — play What's Baking? New: Repeat Sign — play Twice Is Nice, Essential Creativity." },
  { n: 7, warmup: "Sing \"Make New Friends\" — soft vs. strong.", hymnsChants: "Sing Kyrie XI. Introduce \"Sub Tuum\" (oldest known Marian hymn, ~4th century) — play, echo Latin pronunciation, translate, follow sheets.", recorder: "Review Essential Creativity. New: Fermata (p.8) — play Skipping Around, Rolling Along." },
  { n: 8, warmup: "Sing \"Make New Friends\" as a round.", hymnsChants: "Sing Kyrie XI + Sub Tuum.", recorder: "Review Rolling Along. New: Eighth Notes (p.9) — Rhythm Rap, play Mix 'Em Up, Hop Old Squirrel (quiz piece, ungraded)." },
  { n: 9, warmup: "Sing \"Make New Friends\" as a round in 2 parts.", hymnsChants: "Sing Kyrie XI + Sub Tuum.", recorder: "Review Hop Old Squirrel. New: Time Signature & Conducting (p.10) — Rhythm Rap, play Two by Two. Tempo Markings — play The Bell Tower." },
  { n: 10, warmup: "Sing \"Make New Friends\" as a round in 2, then 3 parts.", hymnsChants: "Sing Sub Tuum. Introduce \"Veni, Veni Emmanuel\" (\"O Come, O Come Emmanuel\") — each verse = one O Antiphon. Teach first two verses, translate.", recorder: "Review The Bell Tower. Play Good News (p.11). New: Pick-Up Notes — play EEQ The Boatman." },
  { n: 11, warmup: "Introduce round \"Come Let Us Gather.\"", hymnsChants: "Sing Sub Tuum. Continue \"Veni, Veni Emmanuel\" — teach next two verses.", recorder: "Review Good News. Play Dry Bones. New: Harmony — play Grandma Grunts as a duet if possible." },
  { n: 12, warmup: "Sing \"Come Let Us Gather\" — soft vs. strong.", hymnsChants: "Sing Sub Tuum + Veni Veni Emmanuel.", recorder: "p.12: new note E — Let's Play E, Star Light Star Bright, Flower Song." },
  { n: 13, warmup: "Sing \"Come Let Us Gather\" as a round.", hymnsChants: "Sing Veni Veni Emmanuel. Introduce \"Adeste Fidelis\" (\"O Come All Ye Faithful\").", recorder: "Review Flower Song. New: Dynamics (p.13) — Lucy Locket, Little Sally Water." },
  { n: 14, warmup: "Sing \"Come Let Us Gather\" as a round in 2 parts.", hymnsChants: "Sing Veni Veni Emmanuel. Continue Adeste Fidelis — teach verses, sing along.", recorder: "Review Little Sally Water. New: Composition — compose/write notes to finish a piece as a class, then play it (Enchanted Melody). New: Tie (p.14) — Alouette." },
  { n: 15, warmup: "Sing \"Come Let Us Gather\" as a round in 2, then 3 parts.", hymnsChants: "Sing Veni Veni Emmanuel + Adeste Fidelis.", recorder: "Review Alouette. New: Dotted Half Note — Alouette the Sequel, Country Jig." },
  { n: 16, warmup: "Review rounds: Father I Adore You, Make New Friends, Come Let Us Gather.", hymnsChants: "Review Kyrie XI, Sub Tuum, Veni Veni Emmanuel, Adeste Fidelis.", recorder: "Review/make-up week — catch up on missed material or revisit favorites.", note: "Review / make-up week (mid-year)." },
  { n: 17, warmup: "Introduce round \"Pauper Sum Ego\" (\"I am a poor man, nothing do I own, I give you my heart\").", hymnsChants: "Sing Adeste Fidelis. Introduce \"Sanctus XI\" — follow Gregorian chant notation with fingers, discuss translation.", recorder: "New: Time Signature & Conducting in 3/4 (p.15) — Fais-Do-Do. New: D.C. al Fine — EEQ Rockin' Rests." },
  { n: 18, warmup: "Sing \"Pauper Sum Ego\" — soft vs. strong.", hymnsChants: "Sing Adeste Fidelis + Sanctus XI.", recorder: "Review Fais-Do-Do. p.16: new note D — Let's Play D, Chippewa Lullaby." },
  { n: 19, warmup: "Sing \"Pauper Sum Ego\" as a round.", hymnsChants: "Sing Adeste Fidelis + Sanctus XI.", recorder: "Review Chippewa Lullaby. New: Phrase — Hey Betty Martin, The Jolly Miller (p.17)." },
  { n: 20, warmup: "Sing \"Pauper Sum Ego\" as a round in 2 parts.", hymnsChants: "Sing Sanctus XI. Introduce \"Stabat Mater\" (Stations of the Cross — Mary's sorrow at the foot of the Cross).", recorder: "Review Hey Betty Martin. New: 1st/2nd Endings — Wayfaring Stranger, EEQ Old Brass Band." },
  { n: 21, warmup: "Sing \"Pauper Sum Ego\" as a round in 2, then 3 parts.", hymnsChants: "Sing Sanctus XI. Continue Stabat Mater — teach several verses (don't worry about all of them).", recorder: "Review Wayfaring Stranger. p.18: Join That Band — play as a duet if possible." },
  { n: 22, warmup: "Introduce round \"Chairs to Mend\" (street cries of chair-menders/fishmongers/ragpickers, 1700s-1800s Oxford).", hymnsChants: "Sing Sanctus XI + Stabat Mater.", recorder: "p.19: new note C — Let's Play C, Stepping Out. New: Baroque Music — Volga Boatman." },
  { n: 23, warmup: "Sing \"Chairs to Mend\" — optionally add hand motions.", hymnsChants: "Sing Stabat Mater. Introduce \"Agnus Dei XI\" — review words/pronunciation, follow song sheets.", recorder: "Review Volga Boatman. Silver Moon Boat. New: Dotted Quarter & Eighth Notes (p.20) — The Dot Counts." },
  { n: 24, warmup: "Sing \"Chairs to Mend\" as a round.", hymnsChants: "Sing Agnus Dei.", recorder: "Review The Dot Counts. New: Repeat Signs — Finlandia, Hole in My Shoe." },
  { n: 25, warmup: "Sing \"Chairs to Mend\" as a round in 2 parts.", hymnsChants: "Sing Agnus Dei.", recorder: "Review Finlandia. p.21: new note High D — Let's Play High D, Turnabout." },
  { n: 26, warmup: "Sing \"Chairs to Mend\" as a round in 2, then 3 parts.", hymnsChants: "Sing Agnus Dei. Introduce \"O Salutaris Hostia\" (written by St. Thomas Aquinas, sung at Exposition of the Blessed Sacrament).", recorder: "Review Turnabout. New: Symphony — Going Home, EEQ Guten Tag!" },
  { n: 27, warmup: "Teach a new round (French and/or English words, tutor's choice).", hymnsChants: "Sing Agnus Dei. Continue O Salutaris — teach words/translation.", recorder: "Review Going Home. p.22: Whole Note/Rest, Rhythm Rap, The Long Air Stream. New: Ritardando — Lightly Row." },
  { n: 28, warmup: "Sing \"Frere Jacques / Are You Sleeping\" — optionally act it out.", hymnsChants: "Sing Agnus Dei + O Salutaris.", recorder: "Review Lightly Row. p.23: Jack in the Box. New: Staccato & Legato — Shepherd's Hey." },
  { n: 29, warmup: "Sing \"Frere Jacques\" as a round.", hymnsChants: "Sing O Salutaris. Introduce \"Ave Maria\" (the Hail Mary) — teach words/translation.", recorder: "Review Jack in the Box. EEQ When the Saints Go Marching In. New note F (p.24) — Let's Play F (continues next week).", note: "Coordinate a Marian hymn with Music 5-6 / 1-2 classes for the May Crowning ceremony on Field Day." },
  { n: 30, warmup: "Sing \"Frere Jacques\" as a round in 2 parts.", hymnsChants: "Sing O Salutaris + Ave Maria.", recorder: "Continue new note F — Let's Play F. New: American Music — Who's That, The Mocking Bird." },
  { n: 31, warmup: "Sing \"Frere Jacques\" as a round in 2, then 3 parts.", hymnsChants: "Sing O Salutaris + Ave Maria.", recorder: "New: Sharp, new note F# (p.25) — Let's Play F#, Row Row Row Your Boat, EEQ Oh! Susannah." },
  { n: 32, warmup: "Review rounds: Pauper Sum Ego, Chairs to Mend, Frere Jacques.", hymnsChants: "Review Sanctus, Agnus Dei, O Salutaris, Ave Maria (this semester's chants).", recorder: "Review/make-up week — catch-up, revisit favorites, optionally start p.26. Encourage summer recorder practice.", note: "Review / make-up week (end of year)." },
];

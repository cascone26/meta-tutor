// Real supply lists + procedure summaries for the 26 numbered hands-on experiments
// science-6.ts's pacing already references by number/title (e.g. "Experiment #13
// Conductors and Insulators"). Until now the app only had the experiment's NAME —
// this fills in what actually happens, so the AI tutor can help Jacob prep supplies
// or explain an experiment instead of guessing. Built 2026-09-09 from Jacob's own
// physical copy of the workbook's Experiments appendix (photographed page-by-page,
// ~/Desktop/MT;RCAmaterial). Paraphrased/condensed, not verbatim — same
// paraphrase-not-copy approach as every other content file here (the source is a
// real, currently-sold homeschool science workbook). A few experiment numbers
// (#3 Liquid Layers, listed in the pacing note as a fall-topic count of 26 but not
// separately scheduled in science-6.ts's week-by-week pacing) are included anyway
// since they're real numbered experiments in the book and may come up.

export type ExperimentGuide = {
  n: number;
  title: string;
  supplies: string[];
  summary: string;
  safety?: string;
};

export const science6Experiments: ExperimentGuide[] = [
  { n: 1, title: "Mass and Density", supplies: ["kitchen/center scale", "1-cup measuring cup", "1 cup each: rice, sugar, flour, rice crispies, rolled oats, brown sugar, water, oil, peanut butter, molasses"], summary: "Weigh exactly 1 cup of each of 10 household ingredients (rinsing the cup between wet ones) and record each weight in the Science Notebook. Hypothesize the density order first, then rank the ingredients by their actual measured density and compare to the prediction." },
  { n: 2, title: "Floating Egg", supplies: ["tall glass of water", "raw egg in shell", "1/4 cup salt"], summary: "Place the egg in plain water — it sinks. Remove it, stir 1/4 cup salt into the water until dissolved, and place the egg back in. Salt water is denser than the egg, so it now floats — demonstrates buoyancy/density." },
  { n: 3, title: "Liquid Layers", supplies: ["large glass jar", "molasses", "water", "oil", "small objects (eraser, paper clip, cork, grape, rice, peanut, dried bean, etc.)"], summary: "Layer molasses, then water, then oil in a jar (pouring each over a spoon to keep them from mixing) so the three liquids stack by density. Drop small objects in one at a time and record which liquid layer each settles at, ranking objects by density." },
  { n: 4, title: "Physical Separation", supplies: ["1 cup heavy whipping cream (room temp)", "electric mixer", "salt (optional)"], summary: "Beat cream until the butterfat clumps into butter, separating from the buttermilk (a physical, not chemical, separation). Pour off buttermilk, rinse the butter ball, optionally salt it, and store." },
  { n: 5, title: "Chemical Separation", supplies: ["1 cup hydrogen peroxide (3%)", "2 tsp active dry yeast", "empty plastic bottle", "uninflated balloon", "rubber band"], summary: "Pour peroxide into the bottle, wrap yeast in a tissue and drop it in, then quickly seal a balloon over the mouth. The yeast's enzymes catalyze the peroxide's decomposition into water + oxygen gas (an exothermic chemical reaction), inflating the balloon.", safety: "Adult supervision recommended" },
  { n: 6, title: "Shrinking Bottle", supplies: ["empty plastic water bottle with cap"], summary: "Freeze a capped, empty water bottle for 10 minutes. The air inside cools and contracts, visibly caving in the bottle's sides — demonstrates gas contraction with temperature." },
  { n: 7, title: "Jumping Quarter", supplies: ["empty glass soda bottle", "quarter", "water"], summary: "Freeze the empty bottle, then wet its mouth and balance a quarter on top. Warming air inside the bottle expands and pushes past the coin, making it audibly jump/rattle — demonstrates gas expansion with temperature." },
  { n: 8, title: "Can Crunch", supplies: ["empty soda can", "stove", "tongs", "bowl of cold water"], summary: "Boil a little water in the can on the stove until it steams, then use tongs to flip it immediately into cold water. The trapped steam condenses instantly, dropping the internal pressure and crushing the can — demonstrates water vapor's density difference from liquid water.", safety: "Do not attempt without adult supervision/assistance" },
  { n: 9, title: "Freezing Points", supplies: ["ice cube tray", "water", "milk", "oil", "rubbing alcohol", "salt water", "soda pop or sugar water"], summary: "Fill each ice-tray well with a different liquid, predict the freezing order, then freeze overnight and check hourly, recording which liquid actually freezes first vs. the prediction — different freezing points from dissolved solids/composition." },
  { n: 10, title: "Expanding Ice", supplies: ["plastic cup", "water"], summary: "Fill a cup to the brim with water and freeze it overnight; record and explain how far the ice expands above the original waterline — water is one of the few substances denser as a liquid than a solid." },
  { n: 11, title: "Gluten", supplies: ["2/3 cup water", "1 cup flour", "bowl"], summary: "Knead flour and water into a dough, rest it, then rinse it under cold water until the starch washes away, leaving a rubbery ball of pure gluten — the elastic protein in wheat that gives bread its structure." },
  { n: 12, title: "Baking Soda-Vinegar Rocket", supplies: ["empty glass bottle with a cork (e.g. wine bottle)", "2 tbsp baking soda", "1/2 cup household vinegar"], summary: "Pour vinegar into the bottle, wrap baking soda in tissue, drop it in, seal the cork immediately, and step back outdoors. The chemical reaction's gas pressure builds until it launches the cork — measure and record launch distance.", safety: "Do not attempt without adult supervision; do outdoors, never point at anyone" },
  { n: 13, title: "Conductors and Insulators", supplies: ["rice sock or hot/cold pack (not electric)", "3 kitchen utensils of similar size — 1 plastic, 1 wood, 1 metal", "3 plastic cups", "water"], summary: "Freeze utensil handles standing in cups of water overnight, then lay a heated rice sock across all three handles and time how fast each surrounding ice melts, ranking plastic/wood/metal by heat conduction." },
  { n: 14, title: "Convection Current", supplies: ["clear glass casserole dish", "eyedropper or straw", "dye (or milk)", "water", "3 coffee mugs of the same height"], summary: "Set the dish of room-temp water on two mugs, release a drop of dye/milk in the center, then slide boiling water in a third mug underneath. Watch the dye trace the rising/sinking convection current formed as the water heats unevenly." },
  { n: 15, title: "Fun with Static Electricity", supplies: ["2 balloons", "wool garment", "empty plastic bottle", "scotch tape"], summary: "Rub a balloon on wool to charge it, then test what it attracts (hair, a ceiling, another charged balloon rolling a bottle, repelling taped tape strips) — demonstrates static charge transfer and like-charge repulsion." },
  { n: 16, title: "More Fun with Static Electricity", supplies: ["balloon", "wool garment", "unflavored gelatin", "rolled oats", "faucet with adjustable stream"], summary: "Charge a balloon on wool, then use it to make gelatin form 'stalactites,' make rolled oats jump between a plate and the balloon, and bend a thin stream of water — all from the same static-charge attraction." },
  { n: 17, title: "Fun with Magnets", supplies: ["3 bar or horseshoe magnets of similar strength", "string", "iron filings (or collect with a magnet from dry soil/sand)"], summary: "Hang magnets on strings to watch them interact at a distance, then sprinkle iron filings around a magnet on a plate to visualize the magnetic field lines directly." },
  { n: 18, title: "Electrical Potential Difference (Optional)", supplies: ["fluorescent light tube", "balloon", "wool garment"], summary: "With a parent, charge a balloon and touch it to one end of a removed fluorescent tube — the tube flickers as the potential difference drives electrons through the gas.", safety: "Do not perform without a parent's permission and assistance; tubes can implode if broken" },
  { n: 19, title: "Wheel and Axle", supplies: ["large raw potato", "paring knife", "string", "small weight (bag/bucket of coins)", "wooden pencil with flat sides"], summary: "Carve a potato into a round wheel, push a pencil through its center as an axle, then wind strings at the wheel's rim vs. at the axle and compare how much effort/string is needed to raise the same weight from each — demonstrates mechanical advantage.", safety: "Requires a sharp knife — parent permission/assistance" },
  { n: 20, title: "Simple and Fixed Pulleys", supplies: ["string", "2 large raw potatoes", "2 pencils with smooth sides", "small weight", "sharp knife"], summary: "Build two potato-and-pencil pulleys, rig one as a fixed pulley (over a chair back) and one as a moveable pulley, then compare the pull effort needed to lift the same weight with a fixed pulley, a moveable pulley, and both combined.", safety: "Requires a sharp knife — parent permission/assistance" },
  { n: 21, title: "Frozen Celery Cells", supplies: ["stalk of celery"], summary: "Freeze a celery stalk solid, thaw it, then examine and describe its now-limp, water-logged texture — freezing ruptures plant cell walls as the water inside expands." },
  { n: 22, title: "Parabolic Solar Heater", supplies: ["3-4 large round kitchen bowls", "aluminum foil", "direct sunlight"], summary: "Line a bowl with foil (shiny side out) and angle it toward the sun to concentrate reflected sunlight at its focal point; compare air temperature at that point across differently-shaped bowls to see which reflects/heats best." },
  { n: 23, title: "Plant Obstacle Course", supplies: ["bean seeds", "planting container + soil", "shoebox", "dark cardboard", "tape, scissors, rubber band"], summary: "Sprout bean seeds, then transplant one into a shoebox rigged with internal cardboard shelves and a single hole, forcing the growing plant to find its way to light — demonstrates phototropism over 2-3 weeks. Extra sprouted beans are saved for Experiment #25." },
  { n: 24, title: "Needles and Broad Leaves", supplies: ["paper towels", "water", "waxed paper", "sunshine or a warm room"], summary: "Compare a flat wet paper towel (broad leaf), a rolled-up wet paper towel (conifer needle), and a rolled wet towel wrapped in waxed paper (waxy needle coating), checking every 30 minutes to see which retains water longest." },
  { n: 25, title: "Rainforest Soil", supplies: ["bucket", "watering can/hose", "water", "cheesecloth or sieve", "1-2 shovelfuls of soil", "2 same-size bean plants from Experiment #23"], summary: "Pour water repeatedly through soil held in cheesecloth over a bucket, showing how quickly rainforest rain leaches nutrients out (the runoff clouds, then clears). Transplant one saved bean plant into the leached soil and one into fresh soil, then compare growth over following weeks." },
  { n: 26, title: "Greenhouse Effect", supplies: ["2 small same-size bowls", "plastic wrap", "water", "direct sunlight"], summary: "Fill two bowls with water, cover only one with plastic wrap, and set both in direct sun for 30-60 minutes. The wrapped bowl (trapping heat like greenhouse gases trap infrared) reads warmer — measure and compare the temperatures." },
];

// A single week's text can reference more than one experiment (e.g. "Do
// Experiments #6 Shrinking Bottle & #7 Jumping Quarter"), so pull every
// "#N" that follows the word "Experiment(s)" rather than just the first.
export function findExperiments(weekText: string): ExperimentGuide[] {
  const nums = new Set<number>();
  const anchorRe = /Experiment[s]?\b/gi;
  let m: RegExpExecArray | null;
  while ((m = anchorRe.exec(weekText))) {
    // Grab every "#N" within a bounded window after each "Experiment(s)"
    // mention — handles "Experiments #6 Shrinking Bottle & #7 Jumping
    // Quarter" (the 2nd number isn't directly adjacent to the 1st) while
    // staying scoped enough not to pick up an unrelated "#" elsewhere in
    // the week's text (e.g. "in-class activities #1-4" has no nearby
    // "Experiment" anchor, so it's correctly never matched).
    const window = weekText.slice(m.index, m.index + 60);
    for (const numMatch of window.matchAll(/#(\d+)/g)) nums.add(Number(numMatch[1]));
  }
  return [...nums]
    .map((n) => science6Experiments.find((e) => e.n === n))
    .filter((e): e is ExperimentGuide => Boolean(e));
}

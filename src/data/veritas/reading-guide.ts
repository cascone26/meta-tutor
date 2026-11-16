export interface ReadingPathBook {
  title: string;
  author: string;
}

export interface ReadingPath {
  name: string;
  description: string;
  books: ReadingPathBook[];
}

export const READING_PATHS: ReadingPath[] = [
  {
    name: "Beginner Path",
    description: "Start here if you are new to Catholic theology and spirituality.",
    books: [
      { title: "The Practice of the Presence of God", author: "Brother Lawrence" },
      { title: "Mere Christianity", author: "C.S. Lewis" },
      { title: "The Screwtape Letters", author: "C.S. Lewis" },
      { title: "Story of a Soul", author: "St. Therese of Lisieux" },
      { title: "Introduction to the Devout Life", author: "St. Francis de Sales" },
      { title: "The Imitation of Christ", author: "Thomas a Kempis" },
      { title: "Rome Sweet Home", author: "Scott Hahn" },
      { title: "He Leadeth Me", author: "Fr. Walter Ciszek, S.J." },
      { title: "Orthodoxy", author: "G.K. Chesterton" },
      { title: "Theology and Sanity", author: "Frank Sheed" },
    ],
  },
  {
    name: "Intermediate Path",
    description: "For those who have read the beginner books and want to go deeper.",
    books: [
      { title: "Confessions", author: "St. Augustine" },
      { title: "True Devotion to Mary", author: "St. Louis de Montfort" },
      { title: "The Spiritual Exercises", author: "St. Ignatius of Loyola" },
      { title: "The Way of Perfection", author: "St. Teresa of Avila" },
      { title: "On the Incarnation", author: "St. Athanasius" },
      { title: "The Everlasting Man", author: "G.K. Chesterton" },
      { title: "Abandonment to Divine Providence", author: "Jean-Pierre de Caussade" },
      { title: "The Spirit of the Liturgy", author: "Romano Guardini" },
      { title: "Aquinas: A Beginner's Guide", author: "Edward Feser" },
      { title: "Jesus of Nazareth", author: "Pope Benedict XVI" },
    ],
  },
  {
    name: "Advanced Path",
    description: "For those ready to engage the masters directly.",
    books: [
      { title: "The Interior Castle", author: "St. Teresa of Avila" },
      { title: "Dark Night of the Soul", author: "St. John of the Cross" },
      { title: "The Divine Comedy", author: "Dante Alighieri" },
      { title: "The City of God", author: "St. Augustine" },
      { title: "Summa Theologica (selections)", author: "St. Thomas Aquinas" },
      { title: "Summa Contra Gentiles", author: "St. Thomas Aquinas" },
      { title: "The Philokalia", author: "Various Fathers" },
    ],
  },
];

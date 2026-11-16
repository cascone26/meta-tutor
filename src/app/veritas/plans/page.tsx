"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/veritas/PageHeader";

interface ReadingDay {
  day: number;
  title: string;
  reading: string;
}

interface ReadingPlan {
  id: string;
  title: string;
  duration: string;
  description: string;
  days: ReadingDay[];
}

const PLANS: ReadingPlan[] = [
  {
    id: "aquinas-90",
    title: "Aquinas in 90 Days",
    duration: "90 days",
    description: "A systematic journey through the Summa Theologica, covering the most essential questions from all four parts.",
    days: [
      { day: 1, title: "Sacred Doctrine", reading: "ST I, q.1 — The nature and extent of sacred doctrine" },
      { day: 2, title: "God's Existence", reading: "ST I, q.2 — The existence of God (The Five Ways)" },
      { day: 3, title: "Divine Simplicity", reading: "ST I, q.3 — The simplicity of God" },
      { day: 4, title: "Divine Perfection", reading: "ST I, qq.4-6 — Perfection and goodness of God" },
      { day: 5, title: "God's Infinity & Eternity", reading: "ST I, qq.7-10 — Infinity, existence in things, immutability, eternity" },
      { day: 6, title: "Knowing God", reading: "ST I, qq.12-13 — How God is known; the names of God" },
      { day: 7, title: "Divine Knowledge", reading: "ST I, qq.14-16 — God's knowledge, ideas, and truth" },
      { day: 8, title: "The Will of God", reading: "ST I, qq.19-20 — The will and love of God" },
      { day: 9, title: "Providence & Predestination", reading: "ST I, qq.22-23 — Providence and predestination" },
      { day: 10, title: "The Trinity: Processions", reading: "ST I, qq.27-28 — Procession and relations in God" },
      { day: 11, title: "The Divine Persons", reading: "ST I, qq.29-32 — Persons, relations, and knowledge of the Trinity" },
      { day: 12, title: "Father, Son, Spirit", reading: "ST I, qq.33-38 — The Person of the Father, Son, and Holy Spirit" },
      { day: 13, title: "Creation", reading: "ST I, qq.44-46 — The procession of creatures from God" },
      { day: 14, title: "Angels", reading: "ST I, qq.50-53 — The substance, knowledge, and will of angels" },
      { day: 15, title: "The Human Soul", reading: "ST I, qq.75-76 — The nature and union of the soul" },
      { day: 16, title: "Human Knowledge", reading: "ST I, qq.84-86 — How the soul knows corporeal things" },
      { day: 17, title: "The Will", reading: "ST I, qq.82-83 — The will and free choice" },
      { day: 18, title: "Divine Government", reading: "ST I, qq.103-105 — God's governance of creation" },
      { day: 19, title: "The Ultimate End", reading: "ST I-II, qq.1-3 — Man's last end; what is happiness" },
      { day: 20, title: "True Happiness", reading: "ST I-II, qq.4-5 — What happiness consists in; attainment of happiness" },
      { day: 21, title: "Voluntary Acts", reading: "ST I-II, qq.6-7 — The voluntary and involuntary; circumstances" },
      { day: 22, title: "The Will's Acts", reading: "ST I-II, qq.8-12 — Intention, choice, consent, and use" },
      { day: 23, title: "Good and Evil in Acts", reading: "ST I-II, qq.18-20 — The goodness and malice of human acts" },
      { day: 24, title: "The Passions", reading: "ST I-II, qq.22-25 — The passions in general; love" },
      { day: 25, title: "Fear, Anger, and Courage", reading: "ST I-II, qq.41-46 — Fear, daring, hope, despair, and anger" },
      { day: 26, title: "Habits", reading: "ST I-II, qq.49-51 — The nature of habits" },
      { day: 27, title: "Virtue in General", reading: "ST I-II, qq.55-58 — The nature of virtue; intellectual and moral virtues" },
      { day: 28, title: "Cardinal Virtues", reading: "ST I-II, qq.61-62 — The cardinal and theological virtues" },
      { day: 29, title: "Vice and Sin", reading: "ST I-II, qq.71-74 — The nature of sin; its subject" },
      { day: 30, title: "Original Sin", reading: "ST I-II, qq.81-83 — Original sin: its transmission and effects" },
      { day: 31, title: "Law in General", reading: "ST I-II, qq.90-92 — The essence of law" },
      { day: 32, title: "Eternal and Natural Law", reading: "ST I-II, qq.93-94 — The eternal law and the natural law" },
      { day: 33, title: "Human and Divine Law", reading: "ST I-II, qq.95-97 — Human law" },
      { day: 34, title: "The Old and New Law", reading: "ST I-II, qq.98-100, 106-108 — The old law and the new law" },
      { day: 35, title: "Grace: Necessity", reading: "ST I-II, qq.109-111 — The necessity and nature of grace" },
      { day: 36, title: "Grace: Division and Cause", reading: "ST I-II, qq.112-114 — The cause of grace; merit" },
      { day: 37, title: "Faith", reading: "ST II-II, qq.1-4 — The nature and object of faith" },
      { day: 38, title: "Faith: Effects and Gifts", reading: "ST II-II, qq.5-9 — Effects of faith; gifts of understanding and knowledge" },
      { day: 39, title: "Hope", reading: "ST II-II, qq.17-20 — The virtue of hope; despair and presumption" },
      { day: 40, title: "Charity", reading: "ST II-II, qq.23-26 — The nature of charity; what we love" },
      { day: 41, title: "Charity: Effects", reading: "ST II-II, qq.27-30 — Joy, peace, mercy, beneficence" },
      { day: 42, title: "Prudence", reading: "ST II-II, qq.47-49 — Prudence and its parts" },
      { day: 43, title: "Justice", reading: "ST II-II, qq.57-60 — Right, justice, and judgment" },
      { day: 44, title: "Justice: Specific", reading: "ST II-II, qq.61-63 — Restitution, respect of persons" },
      { day: 45, title: "Fortitude", reading: "ST II-II, qq.123-125 — Fortitude; martyrdom; fear" },
      { day: 46, title: "Temperance", reading: "ST II-II, qq.141-143 — Temperance and its parts" },
      { day: 47, title: "The Incarnation", reading: "ST III, qq.1-3 — The fitness and mode of the Incarnation" },
      { day: 48, title: "The Union of Natures", reading: "ST III, qq.4-6 — The assumed nature; the hypostatic union" },
      { day: 49, title: "Christ's Grace and Knowledge", reading: "ST III, qq.7-12 — Grace, knowledge, and power of Christ" },
      { day: 50, title: "Christ's Life", reading: "ST III, qq.27-34 — The conception and birth of Christ" },
      { day: 51, title: "The Passion", reading: "ST III, qq.46-49 — Christ's Passion: its cause and effects" },
      { day: 52, title: "Resurrection and Ascension", reading: "ST III, qq.53-57 — Resurrection, Ascension" },
      { day: 53, title: "The Sacraments in General", reading: "ST III, qq.60-63 — The nature of sacraments" },
      { day: 54, title: "Baptism", reading: "ST III, qq.66-69 — The sacrament of Baptism" },
      { day: 55, title: "Confirmation", reading: "ST III, qq.72 — The sacrament of Confirmation" },
      { day: 56, title: "The Eucharist: Substance", reading: "ST III, qq.73-75 — The Eucharist and transubstantiation" },
      { day: 57, title: "The Eucharist: Accidents", reading: "ST III, qq.76-78 — The accidents, form, and minister" },
      { day: 58, title: "The Eucharist: Use", reading: "ST III, qq.79-80 — Effects and use of the Eucharist" },
      { day: 59, title: "Penance", reading: "ST III, qq.84-86 — The sacrament of Penance" },
      { day: 60, title: "Rest and Review", reading: "Review your notes from days 1-59. Identify questions for deeper study." },
      { day: 61, title: "God as First Cause", reading: "SCG I, chs. 1-15 — The office of the wise man; God's existence" },
      { day: 62, title: "Divine Attributes", reading: "SCG I, chs. 16-40 — God's perfection, infinity, intelligence" },
      { day: 63, title: "God's Will and Providence", reading: "SCG I, chs. 72-86 — God's will, love, and providence" },
      { day: 64, title: "Creation from Nothing", reading: "SCG II, chs. 15-25 — Creation ex nihilo; the distinction of things" },
      { day: 65, title: "The Soul", reading: "SCG II, chs. 56-72 — The intellectual soul and its powers" },
      { day: 66, title: "Divine Providence", reading: "SCG III, chs. 1-25 — God as end of all things; divine providence" },
      { day: 67, title: "Human Happiness", reading: "SCG III, chs. 26-48 — Human felicity; the vision of God" },
      { day: 68, title: "Evil and Sin", reading: "SCG III, chs. 71-90 — Evil, sin, and divine permission" },
      { day: 69, title: "The Trinity Revealed", reading: "SCG IV, chs. 1-14 — The generation of the Son; the Holy Spirit" },
      { day: 70, title: "Incarnation and Redemption", reading: "SCG IV, chs. 27-55 — The mystery of the Incarnation" },
      { day: 71, title: "CCC: The Creed I", reading: "CCC 1-184 — I believe; God the Father" },
      { day: 72, title: "CCC: The Creed II", reading: "CCC 185-354 — Jesus Christ; the Holy Spirit; the Church" },
      { day: 73, title: "CCC: The Creed III", reading: "CCC 355-511 — Man; original sin" },
      { day: 74, title: "CCC: Christology", reading: "CCC 512-682 — The mysteries of Christ's life" },
      { day: 75, title: "CCC: The Church", reading: "CCC 683-870 — The Holy Spirit and the Church" },
      { day: 76, title: "CCC: Last Things", reading: "CCC 988-1065 — The resurrection, judgment, heaven, hell" },
      { day: 77, title: "CCC: Liturgy", reading: "CCC 1066-1209 — The sacramental economy" },
      { day: 78, title: "CCC: Baptism & Eucharist", reading: "CCC 1210-1419 — Sacraments of initiation" },
      { day: 79, title: "CCC: Healing & Service", reading: "CCC 1420-1666 — Sacraments of healing and service" },
      { day: 80, title: "CCC: Moral Life I", reading: "CCC 1691-1876 — The dignity of the human person" },
      { day: 81, title: "CCC: The Commandments I", reading: "CCC 2052-2195 — Commandments 1-3" },
      { day: 82, title: "CCC: The Commandments II", reading: "CCC 2196-2400 — Commandments 4-7" },
      { day: 83, title: "CCC: The Commandments III", reading: "CCC 2401-2557 — Commandments 8-10" },
      { day: 84, title: "CCC: Prayer", reading: "CCC 2558-2696 — The tradition of prayer" },
      { day: 85, title: "CCC: The Our Father", reading: "CCC 2759-2865 — The Lord's Prayer" },
      { day: 86, title: "De Veritate", reading: "Aquinas, De Veritate q.1 — On truth" },
      { day: 87, title: "De Ente et Essentia", reading: "Aquinas, On Being and Essence — The distinction of essence and existence" },
      { day: 88, title: "The Soul's Powers", reading: "Aquinas, De Anima — Commentary on Aristotle's On the Soul" },
      { day: 89, title: "The Virtues", reading: "Aquinas, De Virtutibus — On the virtues in general" },
      { day: 90, title: "Synthesis Day", reading: "Review all notes. Write a one-page summary of what Aquinas teaches about God, man, and salvation." },
    ],
  },
  {
    id: "apologetics-30",
    title: "Catholic Apologetics Foundations",
    duration: "30 days",
    description: "Build a solid foundation in Catholic apologetics, covering the core arguments for the faith.",
    days: [
      { day: 1, title: "Why Apologetics?", reading: "1 Peter 3:15; CCC 31-35 — Always be ready to give a reason for the hope within you" },
      { day: 2, title: "God's Existence: The Five Ways", reading: "ST I, q.2, a.3 — The five proofs for God's existence" },
      { day: 3, title: "The Kalam Argument", reading: "SCG I, ch.13; SCG II, ch.15 — Everything that begins to exist has a cause" },
      { day: 4, title: "The Moral Argument", reading: "ST I-II, q.91 — Natural law as participation in eternal law" },
      { day: 5, title: "The Problem of Evil", reading: "ST I, q.49; SCG III, chs.71-73 — Evil as privation of good" },
      { day: 6, title: "Faith and Reason", reading: "Fides et Ratio 1-35 — Faith and reason as complementary" },
      { day: 7, title: "Historical Reliability of the Gospels", reading: "CCC 126; Dei Verbum 18-19 — The Gospels as historical witness" },
      { day: 8, title: "The Resurrection", reading: "CCC 638-658; 1 Cor 15 — Evidence for the bodily resurrection" },
      { day: 9, title: "The Divinity of Christ", reading: "ST III, q.1-3; John 1:1-14 — Why Christ must be God" },
      { day: 10, title: "The Church Christ Founded", reading: "CCC 748-810; Matthew 16:18-19 — The Church built on Peter" },
      { day: 11, title: "Apostolic Succession", reading: "CCC 861-862; Acts 1:15-26 — The unbroken chain" },
      { day: 12, title: "Papal Authority", reading: "CCC 880-896; Matthew 16:18-19; John 21:15-17" },
      { day: 13, title: "Sola Scriptura Refuted", reading: "2 Thessalonians 2:15; 1 Timothy 3:15; CCC 80-83" },
      { day: 14, title: "Sacred Tradition", reading: "CCC 74-83; Dei Verbum 7-10 — Scripture and Tradition as one deposit" },
      { day: 15, title: "The Canon of Scripture", reading: "CCC 120-130 — How we got the Bible; the deuterocanonical books" },
      { day: 16, title: "Sola Fide Refuted", reading: "James 2:14-26; ST I-II, q.114 — Faith and works" },
      { day: 17, title: "The Real Presence", reading: "ST III, q.75; John 6:48-69; CCC 1373-1381" },
      { day: 18, title: "Transubstantiation", reading: "ST III, qq.75-77 — How substance changes while accidents remain" },
      { day: 19, title: "The Mass as Sacrifice", reading: "CCC 1362-1372; Hebrews 7-10 — The one sacrifice re-presented" },
      { day: 20, title: "Confession", reading: "CCC 1440-1460; John 20:22-23 — The sacrament of reconciliation" },
      { day: 21, title: "Baptismal Regeneration", reading: "CCC 1213-1274; John 3:5; Acts 2:38" },
      { day: 22, title: "Mary: Mother of God", reading: "CCC 495; Council of Ephesus; Luke 1:43 — Theotokos" },
      { day: 23, title: "Mary: Immaculate Conception", reading: "CCC 490-493; Genesis 3:15; Luke 1:28" },
      { day: 24, title: "Praying to Saints", reading: "CCC 956-958; Revelation 5:8; Hebrews 12:1" },
      { day: 25, title: "Purgatory", reading: "CCC 1030-1032; 1 Corinthians 3:13-15; 2 Maccabees 12:46" },
      { day: 26, title: "Natural Law and Morality", reading: "ST I-II, qq.90-94 — The foundation of moral reasoning" },
      { day: 27, title: "Science and the Church", reading: "CCC 283-289; Fides et Ratio 36-48 — No conflict between faith and science" },
      { day: 28, title: "The Crusades and the Inquisition", reading: "Historical context and common misconceptions" },
      { day: 29, title: "Engaging Other Worldviews", reading: "CCC 839-848; Nostra Aetate — Dialogue with charity and truth" },
      { day: 30, title: "Synthesis: Your Apologetics Toolkit", reading: "Review all 29 days. List your 10 strongest arguments." },
    ],
  },
  {
    id: "eucharist-14",
    title: "Deep Dive: The Eucharist",
    duration: "14 days",
    description: "An intensive study of the Catholic doctrine of the Eucharist — scriptural, philosophical, and historical.",
    days: [
      { day: 1, title: "Prefigured in the Old Testament", reading: "Genesis 14:18 (Melchizedek); Exodus 12 (Passover); Malachi 1:11" },
      { day: 2, title: "The Bread of Life Discourse", reading: "John 6:22-71 — 'Unless you eat the flesh of the Son of Man...'" },
      { day: 3, title: "The Last Supper", reading: "Matthew 26:26-29; Mark 14:22-25; Luke 22:14-20; 1 Corinthians 11:23-29" },
      { day: 4, title: "The Early Church Witness", reading: "Didache 14; Ignatius of Antioch, Letter to the Smyrnaeans 7; Justin Martyr, First Apology 66" },
      { day: 5, title: "Aquinas on Transubstantiation", reading: "ST III, q.75 — The change of bread and wine into Christ's Body and Blood" },
      { day: 6, title: "The Accidents Remain", reading: "ST III, q.77 — How the accidents of bread and wine subsist without a subject" },
      { day: 7, title: "Christ's Mode of Presence", reading: "ST III, q.76 — How Christ exists whole in each species and each part" },
      { day: 8, title: "The Eucharist as Sacrifice", reading: "ST III, q.83; Council of Trent Session 22; CCC 1362-1372" },
      { day: 9, title: "Effects of Holy Communion", reading: "ST III, q.79 — Union with Christ, forgiveness, preservation from sin" },
      { day: 10, title: "Worthy Reception", reading: "ST III, q.80; 1 Corinthians 11:27-29; CCC 1385-1390" },
      { day: 11, title: "The Protestant Reformers", reading: "Luther's consubstantiation; Zwingli's memorialism; Calvin's spiritual presence" },
      { day: 12, title: "Eucharistic Miracles", reading: "Lanciano (8th century); Buenos Aires (1996); Legnica (2013)" },
      { day: 13, title: "Eucharistic Devotion", reading: "Adoration, Benediction, Corpus Christi; Aquinas's hymns: Pange Lingua, Adoro Te Devote" },
      { day: 14, title: "Synthesis: The Source and Summit", reading: "CCC 1324 — 'The Eucharist is the source and summit of the Christian life.' Write a personal reflection." },
    ],
  },
  {
    id: "natural-theology-21",
    title: "Natural Theology Complete",
    duration: "21 days",
    description: "A thorough study of what reason alone can know about God, following Aquinas's natural theology.",
    days: [
      { day: 1, title: "Can We Know God Exists?", reading: "ST I, q.2, a.1-2 — Whether God's existence is self-evident; whether it can be demonstrated" },
      { day: 2, title: "The First Way: Motion", reading: "ST I, q.2, a.3 (First Way); Physics VIII; Metaphysics XII" },
      { day: 3, title: "The Second Way: Efficient Causality", reading: "ST I, q.2, a.3 (Second Way); SCG I, ch.13" },
      { day: 4, title: "The Third Way: Contingency", reading: "ST I, q.2, a.3 (Third Way); the necessity of a necessary being" },
      { day: 5, title: "The Fourth Way: Gradation", reading: "ST I, q.2, a.3 (Fourth Way); participation in being" },
      { day: 6, title: "The Fifth Way: Governance", reading: "ST I, q.2, a.3 (Fifth Way); natural teleology" },
      { day: 7, title: "Common Objections to the Five Ways", reading: "Modern criticisms: Hume, Kant, Russell. Thomistic responses." },
      { day: 8, title: "Divine Simplicity", reading: "ST I, q.3 — God has no parts, no composition of any kind" },
      { day: 9, title: "Divine Perfection and Goodness", reading: "ST I, qq.4-6 — God contains all perfections; God is goodness itself" },
      { day: 10, title: "Divine Infinity and Omnipresence", reading: "ST I, qq.7-8 — God is unlimited; God exists in all things" },
      { day: 11, title: "Immutability and Eternity", reading: "ST I, qq.9-10 — God does not change; God is outside time" },
      { day: 12, title: "The Unity of God", reading: "ST I, q.11 — There can be only one God" },
      { day: 13, title: "How We Know God", reading: "ST I, q.12 — The beatific vision; natural knowledge of God" },
      { day: 14, title: "The Names of God", reading: "ST I, q.13 — How we name God; analogy; the name 'I AM'" },
      { day: 15, title: "Divine Knowledge", reading: "ST I, q.14 — God knows all things, including future contingents" },
      { day: 16, title: "Divine Will", reading: "ST I, q.19 — God wills necessarily only His own goodness" },
      { day: 17, title: "Divine Providence", reading: "ST I, q.22 — God directs all things to their end" },
      { day: 18, title: "The Problem of Evil", reading: "ST I, q.49; SCG III, chs.71-73 — Evil as privation; why God permits evil" },
      { day: 19, title: "Creation", reading: "ST I, qq.44-46 — Creation from nothing; the beginning of the world" },
      { day: 20, title: "The Existence-Essence Distinction", reading: "De Ente et Essentia — Why God alone is subsistent being itself" },
      { day: 21, title: "Synthesis: The God of the Philosophers", reading: "How natural theology leads to the God of Abraham. Write a summary of what reason can and cannot prove." },
    ],
  },
  {
    id: "five-ways-7",
    title: "The Five Ways Mastery",
    duration: "7 days",
    description: "An intensive week-long study of Aquinas's Five Ways, one proof per day plus common objections.",
    days: [
      { day: 1, title: "Background: Motion and Act/Potency", reading: "Aristotle, Physics III.1; Aquinas on act and potency. Understand the metaphysical framework before diving in." },
      { day: 2, title: "The First Way: Argument from Motion", reading: "ST I, q.2, a.3 (First Way). Whatever is moved is moved by another. Trace the essentially ordered series to the unmoved mover." },
      { day: 3, title: "The Second Way: Argument from Efficient Causality", reading: "ST I, q.2, a.3 (Second Way). Nothing can be the efficient cause of itself. There must be a first cause." },
      { day: 4, title: "The Third Way: Argument from Contingency", reading: "ST I, q.2, a.3 (Third Way). If everything could not-be, then at some time there was nothing. But from nothing, nothing comes." },
      { day: 5, title: "The Fourth Way: Argument from Gradation", reading: "ST I, q.2, a.3 (Fourth Way). More and less presuppose a maximum. The maximum in any genus is the cause of all in that genus." },
      { day: 6, title: "The Fifth Way: Argument from Governance", reading: "ST I, q.2, a.3 (Fifth Way). Natural bodies act for an end. What lacks intelligence cannot act for an end unless directed by an intelligence." },
      { day: 7, title: "Common Objections and Synthesis", reading: "Hume's objection, the infinite regress objection, the 'Who made God?' objection, the quantum objection. Write your own defense of each Way." },
    ],
  },
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem("veritas-reading-plans");
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const toggleDay = (planId: string, day: number) => {
    const key = `${planId}-${day}`;
    const updated = { ...progress, [key]: !progress[key] };
    setProgress(updated);
    localStorage.setItem("veritas-reading-plans", JSON.stringify(updated));
  };

  const plan = PLANS.find((p) => p.id === selectedPlan);

  const getPlanProgress = (planId: string, totalDays: number) => {
    let completed = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (progress[`${planId}-${d}`]) completed++;
    }
    return completed;
  };

  return (
    <div className="flex h-app flex-col">
      <PageHeader
        title="Reading Plans"
        subtitle="Structured study plans for systematic learning"
        icon="📚"
      />
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {!selectedPlan ? (
          <div className="space-y-3">
            {PLANS.map((p) => {
              const completed = getPlanProgress(p.id, p.days.length);
              const pct = (completed / p.days.length) * 100;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className="w-full rounded-xl border border-stone-800 p-4 text-left transition-colors hover:border-stone-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-stone-200">
                      {p.title}
                    </h3>
                    <span className="text-xs text-amber-500">{p.duration}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{p.description}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-stone-600">
                        {completed}/{p.days.length} days
                      </span>
                      <span className="text-[10px] text-stone-600">
                        {Math.round(pct)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-700 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : plan ? (
          <div>
            <button
              onClick={() => setSelectedPlan(null)}
              className="mb-4 text-xs text-amber-600 hover:text-amber-500"
            >
              &larr; Back to Plans
            </button>
            <h2 className="text-lg font-semibold text-stone-200">{plan.title}</h2>
            <p className="mt-1 text-xs text-stone-500">{plan.description}</p>
            <div className="mt-4 space-y-1">
              {plan.days.map((day) => {
                const key = `${plan.id}-${day.day}`;
                const done = !!progress[key];
                return (
                  <label
                    key={day.day}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-stone-900/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleDay(plan.id, day.day)}
                      className="mt-0.5 h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-600 accent-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-stone-600 min-w-[2rem]">
                          D{day.day}
                        </span>
                        <span
                          className={`text-sm font-medium transition-colors ${
                            done ? "text-stone-600 line-through" : "text-stone-200"
                          }`}
                        >
                          {day.title}
                        </span>
                      </div>
                      <p className={`mt-0.5 text-xs ${done ? "text-stone-700" : "text-stone-500"}`}>
                        {day.reading}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

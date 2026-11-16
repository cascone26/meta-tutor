export interface DebateStrategy {
  id: string;
  title: string;
  content: string[];
}

export const DEBATE_PLAYBOOK: DebateStrategy[] = [
  {
    id: "socratic",
    title: "The Socratic Method in Practice",
    content: [
      "Never assert what you can lead someone to discover on their own. The Socratic method is not about trapping people — it is about guiding them toward truth through their own reasoning.",
      "Start with questions they will agree with. Build from common ground. If someone says 'morality is just opinion,' ask: 'Is it your opinion that torturing children for fun is wrong, or is it actually wrong?' They will almost always say it is actually wrong. Now you have objective morality on the table — from their own mouth.",
      "Ask 'what do you mean by that?' constantly. Most arguments dissolve when you force the other person to define their terms. 'Religion causes violence' — what do you mean by religion? What do you mean by causes? Are you counting state atheism?",
      "Let the contradictions emerge naturally. When someone says 'there is no truth,' ask 'is that true?' When someone says 'you cannot know anything about God,' ask 'how do you know that?' Do not point out the contradiction aggressively — just let it sit.",
      "Always be the one asking questions. Whoever is answering questions is on defense. Whoever is asking them is steering the conversation."
    ],
  },
  {
    id: "steelman",
    title: "How to Steelman Before Responding",
    content: [
      "Before you respond to any argument, restate it in the strongest possible form. Say: 'If I understand you correctly, your strongest point is...' This does three things: it earns respect, it proves you actually listened, and it makes your counter-argument much more powerful because you defeated the best version, not a caricature.",
      "If you cannot state your opponent's position in a way they would agree with, you do not understand it well enough to refute it. Ask more questions.",
      "Steelmanning is especially important in apologetics because most anti-Catholic arguments are straw men. When you steelman, you expose the gap between what they think the Church teaches and what the Church actually teaches.",
      "Example: Instead of responding to 'Catholics worship Mary,' say 'I think the strongest version of your concern is that Catholic devotion to Mary can appear indistinguishable from worship, and that the practical piety of many Catholics seems to elevate her beyond what Scripture warrants. Is that fair?' Now you are engaging the real concern, not the caricature."
    ],
  },
  {
    id: "concede",
    title: "When to Concede vs Hold Firm",
    content: [
      "Concede freely when the facts warrant it. The Crusades involved real atrocities. Some popes were morally horrific. The abuse crisis was a catastrophic failure of leadership. Conceding these things does not weaken your position — it strengthens your credibility.",
      "Distinguish between conceding facts and conceding conclusions. You can concede that the Inquisition killed people while firmly denying that this invalidates Catholic truth claims. Bad behavior by Catholics does not make Catholicism false any more than bad behavior by scientists makes science false.",
      "Hold firm on dogma. Never concede a defined doctrine to win social points. The Real Presence, the Immaculate Conception, papal infallibility — these are non-negotiable. You can explain them better, but you cannot water them down.",
      "The test: if conceding something would require you to say the Church was wrong on a matter of faith and morals, hold firm. If it is about historical facts, human failures, or disciplinary matters, concede freely.",
      "Conceding well is a power move. It signals confidence. A person who can say 'you are right about that, and here is what I think about the rest' is far more persuasive than someone who defends everything."
    ],
  },
  {
    id: "frame",
    title: "How to Control the Frame",
    content: [
      "Frame control is the single most important debate skill. Whoever sets the frame wins. If the frame is 'religion vs. science,' you lose. If the frame is 'what is the best explanation for why anything exists at all,' you win.",
      "Reframe constantly. 'Why do you believe in a sky daddy?' becomes 'What I actually believe is that there must be a necessary being that explains why contingent things exist. Let me walk you through why.' You have just moved from their mocking frame to a serious philosophical one.",
      "Never accept a frame that puts you on defense about the wrong thing. If someone says 'why does your Church hate gay people,' do not start explaining the Church's teaching on homosexuality. First reframe: 'The Church does not hate anyone. The question is whether sexual ethics can be grounded in human nature. Can we talk about that?'",
      "Use historical reframes. 'The Dark Ages' becomes 'the period when the Church preserved all of classical learning and invented the university system.' 'The Galileo affair' becomes 'the one time in 2,000 years the Church got a scientific question wrong, and even that is more complicated than people think.'",
      "The best frame for Catholic apologetics: 'What is the most reasonable explanation for reality as we actually experience it?' This frame puts everyone on equal footing and plays to Catholicism's strengths in philosophy and metaphysics."
    ],
  },
  {
    id: "stop",
    title: "When to Stop Arguing",
    content: [
      "Stop when the other person is getting angry. You are not going to convince someone who is emotionally flooded. Say: 'I think we have both made our points. I appreciate the conversation.' Leave the door open.",
      "Stop when you are going in circles. If you have made your point clearly twice and they keep repeating theirs, further repetition will not help. The seed has been planted.",
      "Stop when you notice you are arguing to win rather than to share truth. Check your motives constantly. If you are enjoying 'destroying' someone, you have already lost the real battle.",
      "Stop when the audience has heard enough. In public debates (online or in person), you are not really arguing for the other person — you are arguing for the people watching. Once the audience has seen you make your case clearly and charitably, stop. Extra rounds dilute your impact.",
      "Never stop because you do not have an answer. Instead say: 'That is a great question. I do not have a good answer right now, but I want to think about it and get back to you.' Intellectual honesty is more persuasive than a bad answer delivered with confidence."
    ],
  },
  {
    id: "levels",
    title: "The Three Levels Approach",
    content: [
      "Level 1 — Emotional: Before you can engage someone's mind, you have to engage their heart. If someone is angry at God because of suffering, a philosophical argument for why God allows evil will bounce off them. First, acknowledge the pain. 'That sounds incredibly difficult. I am sorry you went through that.' Only after emotional connection can you move to...",
      "Level 2 — Rational: This is where most apologetics happens. Logical arguments, historical evidence, philosophical reasoning. The Five Ways, the historical evidence for the Resurrection, the philosophical problems with materialism. This is essential but not sufficient, because...",
      "Level 3 — Authoritative: At some point, the question becomes 'who has the authority to interpret Scripture, define doctrine, and settle disputes?' This is where Catholic apologetics has its unique strength. Every Protestant denomination interprets Scripture differently. The Catholic Church claims — and can historically demonstrate — apostolic succession and doctrinal authority.",
      "Most apologetics failures happen because people start at the wrong level. They give philosophical arguments to someone who needs emotional healing, or they appeal to Church authority to someone who has not yet accepted that authority is even a valid category.",
      "Read the person. Are they hurting? Start at Level 1. Are they intellectually curious? Start at Level 2. Are they a thoughtful Protestant who already believes in Christ? Go straight to Level 3."
    ],
  },
  {
    id: "traps",
    title: "Common Debate Traps",
    content: [
      "The Gish Gallop: They throw 15 objections at you in 30 seconds. Do not try to answer all of them. Say: 'You have raised a lot of points. Let us take the strongest one and really dig into it. Which one do you think is most important?' This forces depth over breadth.",
      "The Moving Goalposts: You answer their objection, and they immediately shift to a new one without acknowledging your answer. Call it out gently: 'Before we move on, did my response to your first point make sense? I want to make sure we are actually engaging each other.'",
      "The Genetic Fallacy: 'You only believe because you were raised Catholic.' Respond: 'And you only disbelieve because of your particular life experiences. The origin of a belief says nothing about whether it is true. Let us talk about the evidence.'",
      "The Moral Gotcha: 'If God is good, why did He command X in the Old Testament?' Do not get drawn into defending every individual Old Testament passage. Reframe: 'The Catholic understanding of Scripture involves progressive revelation and the distinction between moral, ceremonial, and judicial law. Which specific passage concerns you most?'",
      "The Science Card: 'Science has disproven God.' This is never true because science studies the natural world and God is not a natural object. Respond: 'Science is a method for studying material reality. It cannot confirm or deny the existence of an immaterial being any more than a metal detector can find plastic. The question of God is a philosophical one.'"
    ],
  },
  {
    id: "mockery",
    title: "How to Respond to Mockery",
    content: [
      "Never match their tone. If someone mocks you, responding with anger or counter-mockery means you have already lost. Stay calm. Stay kind. The contrast between their mockery and your composure speaks louder than any argument.",
      "Use humor when appropriate. A light-hearted response to mockery disarms it. If someone says 'you believe in a magic sky wizard,' you can smile and say 'that is not quite how Thomas Aquinas would put it. Want to hear how he actually argued for God's existence?'",
      "Acknowledge the mockery without being wounded by it. 'I can see this seems ridiculous to you. I get it — I have had the same reaction to ideas that turned out to be true. Can I explain why I find it compelling?' This is disarming because it validates their reaction while redirecting to substance.",
      "Remember who you represent. When you are defending the faith, you are not defending yourself. Your ego is not at stake. Christ was mocked far worse. If you can stay charitable under fire, that itself is a witness.",
      "If the mockery is persistent and the person has no interest in honest dialogue, walk away. You are under no obligation to cast pearls before swine. Say: 'I do not think you are interested in a real conversation right now, but I am happy to talk whenever you are.' Then leave."
    ],
  },
  {
    id: "winning",
    title: "Winning the Person vs Winning the Argument",
    content: [
      "You can win every argument and lose every soul. The goal of apologetics is not to prove you are right — it is to remove obstacles so that grace can work. If someone walks away thinking 'that Catholic was right but what a jerk,' you have failed.",
      "Ask yourself after every conversation: did I make the Catholic faith more attractive or less attractive? Not 'did I win the point' but 'would this person be more open to Catholicism after talking to me?'",
      "The most effective apologetics is often not arguing at all. It is listening deeply, asking good questions, and being the kind of person that makes someone think 'whatever that person has, I want it.'",
      "Prioritize relationship over being right. If you are talking to a family member, friend, or coworker, the relationship is more important than any individual theological point. You will have many more conversations — do not burn the bridge to win one exchange.",
      "The best apologists in history — Chesterton, Lewis, Sheen, Kreeft — were all deeply charitable people who genuinely loved the people they disagreed with. Their arguments were effective because their character was compelling. Be that person.",
      "Final rule: pray before, during, and after every apologetics conversation. You are not the one who converts people — the Holy Spirit does. Your job is to be a clear window, not a brick wall."
    ],
  },
];

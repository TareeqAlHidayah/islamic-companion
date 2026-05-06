import { useState, useEffect, useRef } from "react";

// ── Palette & Fonts ──────────────────────────────────────────────────────────
// Deep emerald + warm gold on ivory parchment — refined Islamic manuscript feel
// Fonts: Cinzel Decorative (headings) + Lora (body) + Amiri (Arabic feel)

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
`;

// ── Static Data ──────────────────────────────────────────────────────────────

const GOOD_DEEDS = [
  { id: 1, deed: "Prayed Fajr on time", reward: "Angels witness your dawn prayer" },
  { id: 2, deed: "Prayed all 5 daily prayers", reward: "Pillar of your faith fulfilled" },
  { id: 3, deed: "Read Quran (even one verse)", reward: "Ten rewards per letter" },
  { id: 4, deed: "Said Bismillah before eating", reward: "Shaitan cannot share your meal" },
  { id: 5, deed: "Said Alhamdulillah", reward: "Fills the scales of good deeds" },
  { id: 6, deed: "Made dhikr (SubhanAllah 33x)", reward: "Tongue kept moist with Allah's remembrance" },
  { id: 7, deed: "Smiled at a fellow Muslim", reward: "A smile is sadaqah" },
  { id: 8, deed: "Gave charity (any amount)", reward: "Charity extinguishes sins like water puts out fire" },
  { id: 9, deed: "Fasted (or kept a sunnah fast)", reward: "Al-Rayyan gate awaits" },
  { id: 10, deed: "Helped someone in need", reward: "Allah helps those who help others" },
  { id: 11, deed: "Sought knowledge today", reward: "Path to Jannah is made easy" },
  { id: 12, deed: "Made dua for parents", reward: "Greatest act of filial piety" },
  { id: 13, deed: "Controlled anger", reward: "Strong is one who controls themselves" },
  { id: 14, deed: "Kept family ties", reward: "Mercy descends on those who maintain kinship" },
  { id: 15, deed: "Sent Salawat on the Prophet ﷺ", reward: "Allah sends 10 blessings upon you" },
];

const MINOR_SINS = [
  { id: 1, sin: "Wasting time idly", note: "Tawbah and fill moments with dhikr" },
  { id: 2, sin: "Overeating / food waste", note: "Eat less; be grateful for provision" },
  { id: 3, sin: "Unnecessary music or entertainment", note: "Replace with beneficial content" },
  { id: 4, sin: "Missing sunnah prayers", note: "Resume with intention to be consistent" },
  { id: 5, sin: "Sleeping through Fajr once", note: "Qada the prayer, strengthen your alarm routine" },
  { id: 6, sin: "Impatient words to others", note: "Seek their forgiveness, then Allah's" },
  { id: 7, sin: "Looking at something unlawful briefly", note: "Lower the gaze; seek refuge in Allah" },
];

const MAJOR_SINS = [
  { id: 1, sin: "Shirk — associating partners with Allah", note: "The gravest sin; sincere Tawbah required" },
  { id: 2, sin: "Abandoning prayer entirely", note: "Return immediately; the door of Tawbah is open" },
  { id: 3, sin: "Consuming riba (interest / usury)", note: "Seek halal alternatives urgently" },
  { id: 4, sin: "Consuming intoxicants", note: "Seek help; Allah loves those who repent" },
  { id: 5, sin: "Zina (adultery / fornication)", note: "Sincere Tawbah, avoid all pathways to it" },
  { id: 6, sin: "Disobeying parents harmfully", note: "Seek their forgiveness and Allah's" },
  { id: 7, sin: "Severing family ties deliberately", note: "Reach out; mercy descends on those who reconnect" },
  { id: 8, sin: "Eating wealth of orphans", note: "Return what was taken; make amends" },
  { id: 9, sin: "Accusing chaste women falsely", note: "Seek forgiveness of Allah and the person" },
  { id: 10, sin: "Fleeing from battle (abandoning duty)", note: "Recommit to your responsibilities" },
  { id: 11, sin: "Backbiting (ghibah)", note: "Major sin — repent and praise that person instead" },
  { id: 12, sin: "Lying deliberately", note: "Major sin — truthfulness leads to Paradise" },
  { id: 13, sin: "Watching improper videos/images", note: "Major sin — lower your gaze immediately" },
  { id: 14, sin: "Misbehaving with parents", note: "Major sin — apologize and serve them today" },
];

const KIND_WORDS = {
  happy: [
    "الحمد لله — All praise is for Allah! Your joy is a blessing from Him. Share it, for happiness shared is multiplied.",
    "This moment of happiness is a gift. Be grateful and let gratitude deepen it. 'If you are grateful, I will surely increase you.' (Quran 14:7)",
    "MashAllah, your heart is light today. Use this beautiful energy in the remembrance of Allah — dhikr in joy is precious.",
  ],
  sad: [
    "Indeed, with every hardship comes ease — twice. (Quran 94:5-6) This moment will pass, and what remains will be strength.",
    "Allah sees your tears. Every tear a believer sheds in sincerity, Allah does not let it go to waste. You are not alone.",
    "Your sadness is known to the Most Merciful. Whisper to Him now — He is closer than your jugular vein. (Quran 50:16)",
  ],
  anxious: [
    "Verily, in the remembrance of Allah do hearts find rest. (Quran 13:28) Breathe. Say: حسبي الله ونعم الوكيل — Allah is sufficient for me.",
    "Cast your worries upon the One who holds the heavens and earth. What burdens you is light to Him. Trust His plan.",
    "This anxiety is a test. Make wudu, pray two rak'ahs, and speak to Allah. He listens, always.",
  ],
  grateful: [
    "SubhanAllah — your gratitude itself is an act of worship! Allah loves the thankful heart. May He increase your blessings.",
    "Gratitude is the door to more. You have unlocked it today. Write down three blessings — small or large — and let them multiply.",
    "The Prophet ﷺ said: 'Whoever does not thank people has not thanked Allah.' Share your gratitude with those around you today.",
  ],
  guilty: [
    "Do not despair of Allah's mercy — indeed, He forgives all sins. (Quran 39:53) Your awareness of wrongdoing is itself a mercy.",
    "Say: أستغفر الله — I seek Allah's forgiveness. Say it now, from the heart. Then turn the page. Allah's mercy is vaster than your sin.",
    "The best of sinners are those who repent. (Hadith) You have already taken the first step by feeling remorse. Keep going.",
  ],
  peaceful: [
    "What a blessed state — the heart at peace. This is the reward of remembrance. Guard it with your salah and dhikr.",
    "السلام — Peace is one of Allah's names, and you are tasting it today. This is a sign of His closeness to you.",
    "A peaceful heart is a strong heart. Use this stillness to connect deeper — read a page of Quran, make a long sajdah.",
  ],
  empty: [
    "Even the Prophet ﷺ had moments of silence from revelation — and it was not abandonment. This emptiness is not a sign that Allah has left you. He is present, even in the quiet.",
    "When the heart feels hollow, it is often a thirst for Allah that nothing else can fill. Make wudu, sit in stillness, and simply say: يا الله — Ya Allah. Let that be enough for now.",
    "'He found you lost and guided you.' (Quran 93:7) This emptiness is not your final state. It is the valley before the mountain. Keep walking.",
  ],
  distressed: [
    "Allah said: 'Do not grieve — indeed Allah is with us.' (Quran 9:40) Your distress is seen, known, and held by the Most Merciful. You are not carrying this alone.",
    "The Prophet ﷺ was deeply distressed at times — he wept, he struggled, he sought Allah intensely. Your distress makes you human and your turning to Allah makes you a believer.",
    "Say this dua now: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ' — O Allah, I seek refuge in You from anxiety and grief. This dua was given precisely for moments like yours.",
  ],
  urge: [
    "Pause. Breathe. Say: أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ — I seek refuge in Allah from Shaitan. The Prophet ﷺ said this is the shield. Use it now, in this moment.",
    "This urge is the test. And you are reading this instead of giving in — that itself is a victory. Allah sees your struggle and loves you for it. Make wudu and change your environment right now.",
    "'Allah does not burden a soul beyond what it can bear.' (2:286) — He permitted this test because He knows you can pass it. Every moment you resist, you are earning what words cannot describe.",
  ],
};

// ── Surah index (all 114) ─────────────────────────────────────────────────────
const SURAHS = [
  {n:1,name:"Al-Fatiha",eng:"The Opening",ayahs:7},{n:2,name:"Al-Baqarah",eng:"The Cow",ayahs:286},
  {n:3,name:"Al-Imran",eng:"Family of Imran",ayahs:200},{n:4,name:"An-Nisa",eng:"The Women",ayahs:176},
  {n:5,name:"Al-Maidah",eng:"The Table Spread",ayahs:120},{n:6,name:"Al-Anam",eng:"The Cattle",ayahs:165},
  {n:7,name:"Al-Araf",eng:"The Heights",ayahs:206},{n:8,name:"Al-Anfal",eng:"The Spoils of War",ayahs:75},
  {n:9,name:"At-Tawbah",eng:"The Repentance",ayahs:129},{n:10,name:"Yunus",eng:"Jonah",ayahs:109},
  {n:11,name:"Hud",eng:"Hud",ayahs:123},{n:12,name:"Yusuf",eng:"Joseph",ayahs:111},
  {n:13,name:"Ar-Ra'd",eng:"The Thunder",ayahs:43},{n:14,name:"Ibrahim",eng:"Abraham",ayahs:52},
  {n:15,name:"Al-Hijr",eng:"The Rocky Tract",ayahs:99},{n:16,name:"An-Nahl",eng:"The Bee",ayahs:128},
  {n:17,name:"Al-Isra",eng:"The Night Journey",ayahs:111},{n:18,name:"Al-Kahf",eng:"The Cave",ayahs:110},
  {n:19,name:"Maryam",eng:"Mary",ayahs:98},{n:20,name:"Ta-Ha",eng:"Ta-Ha",ayahs:135},
  {n:21,name:"Al-Anbiya",eng:"The Prophets",ayahs:112},{n:22,name:"Al-Hajj",eng:"The Pilgrimage",ayahs:78},
  {n:23,name:"Al-Muminun",eng:"The Believers",ayahs:118},{n:24,name:"An-Nur",eng:"The Light",ayahs:64},
  {n:25,name:"Al-Furqan",eng:"The Criterion",ayahs:77},{n:26,name:"Ash-Shuara",eng:"The Poets",ayahs:227},
  {n:27,name:"An-Naml",eng:"The Ant",ayahs:93},{n:28,name:"Al-Qasas",eng:"The Stories",ayahs:88},
  {n:29,name:"Al-Ankabut",eng:"The Spider",ayahs:69},{n:30,name:"Ar-Rum",eng:"The Romans",ayahs:60},
  {n:31,name:"Luqman",eng:"Luqman",ayahs:34},{n:32,name:"As-Sajdah",eng:"The Prostration",ayahs:30},
  {n:33,name:"Al-Ahzab",eng:"The Confederates",ayahs:73},{n:34,name:"Saba",eng:"Sheba",ayahs:54},
  {n:35,name:"Fatir",eng:"Originator",ayahs:45},{n:36,name:"Ya-Sin",eng:"Ya-Sin",ayahs:83},
  {n:37,name:"As-Saffat",eng:"Those Ranged in Ranks",ayahs:182},{n:38,name:"Sad",eng:"Sad",ayahs:88},
  {n:39,name:"Az-Zumar",eng:"The Groups",ayahs:75},{n:40,name:"Ghafir",eng:"The Forgiver",ayahs:85},
  {n:41,name:"Fussilat",eng:"Explained in Detail",ayahs:54},{n:42,name:"Ash-Shura",eng:"The Consultation",ayahs:53},
  {n:43,name:"Az-Zukhruf",eng:"The Gold Adornments",ayahs:89},{n:44,name:"Ad-Dukhan",eng:"The Smoke",ayahs:59},
  {n:45,name:"Al-Jathiyah",eng:"The Crouching",ayahs:37},{n:46,name:"Al-Ahqaf",eng:"The Wind-Curved Sandhills",ayahs:35},
  {n:47,name:"Muhammad",eng:"Muhammad",ayahs:38},{n:48,name:"Al-Fath",eng:"The Victory",ayahs:29},
  {n:49,name:"Al-Hujurat",eng:"The Rooms",ayahs:18},{n:50,name:"Qaf",eng:"Qaf",ayahs:45},
  {n:51,name:"Adh-Dhariyat",eng:"The Winnowing Winds",ayahs:60},{n:52,name:"At-Tur",eng:"The Mount",ayahs:49},
  {n:53,name:"An-Najm",eng:"The Star",ayahs:62},{n:54,name:"Al-Qamar",eng:"The Moon",ayahs:55},
  {n:55,name:"Ar-Rahman",eng:"The Beneficent",ayahs:78},{n:56,name:"Al-Waqiah",eng:"The Inevitable",ayahs:96},
  {n:57,name:"Al-Hadid",eng:"The Iron",ayahs:29},{n:58,name:"Al-Mujadila",eng:"The Pleading Woman",ayahs:22},
  {n:59,name:"Al-Hashr",eng:"The Exile",ayahs:24},{n:60,name:"Al-Mumtahanah",eng:"She That is to be Examined",ayahs:13},
  {n:61,name:"As-Saf",eng:"The Ranks",ayahs:14},{n:62,name:"Al-Jumuah",eng:"Friday",ayahs:11},
  {n:63,name:"Al-Munafiqun",eng:"The Hypocrites",ayahs:11},{n:64,name:"At-Taghabun",eng:"Mutual Disillusion",ayahs:18},
  {n:65,name:"At-Talaq",eng:"Divorce",ayahs:12},{n:66,name:"At-Tahrim",eng:"The Prohibition",ayahs:12},
  {n:67,name:"Al-Mulk",eng:"The Sovereignty",ayahs:30},{n:68,name:"Al-Qalam",eng:"The Pen",ayahs:52},
  {n:69,name:"Al-Haqqah",eng:"The Reality",ayahs:52},{n:70,name:"Al-Maarij",eng:"The Ascending Stairways",ayahs:44},
  {n:71,name:"Nuh",eng:"Noah",ayahs:28},{n:72,name:"Al-Jinn",eng:"The Jinn",ayahs:28},
  {n:73,name:"Al-Muzzammil",eng:"The Enshrouded One",ayahs:20},{n:74,name:"Al-Muddaththir",eng:"The Cloaked One",ayahs:56},
  {n:75,name:"Al-Qiyamah",eng:"The Resurrection",ayahs:40},{n:76,name:"Al-Insan",eng:"The Human",ayahs:31},
  {n:77,name:"Al-Mursalat",eng:"The Emissaries",ayahs:50},{n:78,name:"An-Naba",eng:"The Tidings",ayahs:40},
  {n:79,name:"An-Naziat",eng:"Those Who Drag Forth",ayahs:46},{n:80,name:"Abasa",eng:"He Frowned",ayahs:42},
  {n:81,name:"At-Takwir",eng:"The Overthrowing",ayahs:29},{n:82,name:"Al-Infitar",eng:"The Cleaving",ayahs:19},
  {n:83,name:"Al-Mutaffifin",eng:"The Defrauding",ayahs:36},{n:84,name:"Al-Inshiqaq",eng:"The Splitting Open",ayahs:25},
  {n:85,name:"Al-Buruj",eng:"The Mansions of the Stars",ayahs:22},{n:86,name:"At-Tariq",eng:"The Morning Star",ayahs:17},
  {n:87,name:"Al-Ala",eng:"The Most High",ayahs:19},{n:88,name:"Al-Ghashiyah",eng:"The Overwhelming",ayahs:26},
  {n:89,name:"Al-Fajr",eng:"The Dawn",ayahs:30},{n:90,name:"Al-Balad",eng:"The City",ayahs:20},
  {n:91,name:"Ash-Shams",eng:"The Sun",ayahs:15},{n:92,name:"Al-Layl",eng:"The Night",ayahs:21},
  {n:93,name:"Ad-Duha",eng:"The Morning Hours",ayahs:11},{n:94,name:"Ash-Sharh",eng:"The Relief",ayahs:8},
  {n:95,name:"At-Tin",eng:"The Fig",ayahs:8},{n:96,name:"Al-Alaq",eng:"The Clot",ayahs:19},
  {n:97,name:"Al-Qadr",eng:"The Power",ayahs:5},{n:98,name:"Al-Bayyinah",eng:"The Clear Proof",ayahs:8},
  {n:99,name:"Az-Zalzalah",eng:"The Earthquake",ayahs:8},{n:100,name:"Al-Adiyat",eng:"The Courser",ayahs:11},
  {n:101,name:"Al-Qariah",eng:"The Calamity",ayahs:11},{n:102,name:"At-Takathur",eng:"The Rivalry in World Increase",ayahs:8},
  {n:103,name:"Al-Asr",eng:"The Declining Day",ayahs:3},{n:104,name:"Al-Humazah",eng:"The Traducer",ayahs:9},
  {n:105,name:"Al-Fil",eng:"The Elephant",ayahs:5},{n:106,name:"Quraysh",eng:"Quraysh",ayahs:4},
  {n:107,name:"Al-Maun",eng:"The Small Kindnesses",ayahs:7},{n:108,name:"Al-Kawthar",eng:"The Abundance",ayahs:3},
  {n:109,name:"Al-Kafirun",eng:"The Disbelievers",ayahs:6},{n:110,name:"An-Nasr",eng:"The Divine Support",ayahs:3},
  {n:111,name:"Al-Masad",eng:"The Palm Fiber",ayahs:5},{n:112,name:"Al-Ikhlas",eng:"The Sincerity",ayahs:4},
  {n:113,name:"Al-Falaq",eng:"The Daybreak",ayahs:5},{n:114,name:"An-Nas",eng:"Mankind",ayahs:6},
];

// ── Curated "Ayah of the Day" pool (50 powerful ayahs across the Quran) ──────
const DAILY_AYAH_POOL = [
  {s:1,a:1},{s:2,a:255},{s:2,a:286},{s:2,a:152},{s:2,a:153},{s:2,a:177},
  {s:3,a:139},{s:3,a:185},{s:3,a:200},{s:4,a:36},{s:5,a:8},{s:6,a:162},
  {s:7,a:23},{s:8,a:2},{s:9,a:40},{s:9,a:128},{s:10,a:62},{s:11,a:88},
  {s:12,a:87},{s:13,a:28},{s:14,a:7},{s:15,a:9},{s:16,a:97},{s:17,a:23},
  {s:18,a:10},{s:20,a:14},{s:22,a:77},{s:23,a:1},{s:24,a:35},{s:25,a:63},
  {s:29,a:69},{s:31,a:17},{s:33,a:41},{s:35,a:28},{s:36,a:83},{s:39,a:53},
  {s:40,a:60},{s:41,a:30},{s:42,a:25},{s:49,a:13},{s:51,a:56},{s:55,a:13},
  {s:57,a:4},{s:65,a:3},{s:67,a:2},{s:76,a:8},{s:93,a:5},{s:94,a:5},
  {s:103,a:1},{s:112,a:1},
];

// ── Large Hadith collection (40 hadiths across major books) ──────────────────
const HADITHS = [
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Revelation",text:"The Prophet ﷺ said: 'Actions are judged by intentions, and every person will have what they intended.'"},
  {narrator:"Ibn Umar (RA)",source:"Sahih Bukhari",book:"Book of Faith",text:"The Prophet ﷺ said: 'Islam is built on five pillars: testifying there is no god but Allah and Muhammad is His messenger, establishing prayer, paying Zakat, fasting Ramadan, and performing Hajj.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Virtue",text:"The Prophet ﷺ said: 'Whoever removes a worldly hardship from a believer, Allah will remove from him one of the hardships of the Day of Resurrection.'"},
  {narrator:"Anas ibn Malik (RA)",source:"Sahih Bukhari",book:"Book of Faith",text:"The Prophet ﷺ said: 'None of you truly believes until he loves for his brother what he loves for himself.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Good Manners",text:"The Prophet ﷺ said: 'The strong man is not the one who can overpower others. The strong man is the one who controls himself when he is angry.'"},
  {narrator:"Jabir (RA)",source:"Sahih Muslim",book:"Book of Zakat",text:"The Prophet ﷺ said: 'Every act of kindness is sadaqah (charity).'"},
  {narrator:"Abu Dharr (RA)",source:"Sahih Muslim",book:"Book of Zakat",text:"The Prophet ﷺ said: 'Your smiling in the face of your brother is an act of charity.'"},
  {narrator:"Aisha (RA)",source:"Sunan Abu Dawud",book:"Book of Prayer",text:"The Prophet ﷺ said: 'The best of deeds is that which is done regularly, even if it is small.'"},
  {narrator:"Abdullah ibn Masud (RA)",source:"Sahih Bukhari",book:"Book of Invocations",text:"The Prophet ﷺ said: 'Whoever reads a letter of the Book of Allah will have a reward, and that reward will be multiplied by ten.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Remembrance",text:"The Prophet ﷺ said: 'Allah the Exalted says: I am as My servant thinks of Me, and I am with him when he remembers Me.'"},
  {narrator:"Nu'man ibn Bashir (RA)",source:"Sahih Bukhari",book:"Book of Faith",text:"The Prophet ﷺ said: 'The lawful is clear and the unlawful is clear, and between them are doubtful matters. Whoever leaves what is doubtful will be safe regarding what is clearly forbidden.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Purification",text:"The Prophet ﷺ said: 'Cleanliness is half of faith. Alhamdulillah fills the scales. SubhanAllah and Alhamdulillah fill what is between the heavens and earth.'"},
  {narrator:"Ibn Abbas (RA)",source:"Sahih Bukhari",book:"Book of Supplications",text:"The Prophet ﷺ said: 'Guard Allah's rights and He will guard you. Guard Allah's rights and you will find Him in front of you. Know Allah in ease and He will know you in hardship.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Virtue",text:"The Prophet ﷺ said: 'Allah does not look at your forms and wealth, but He looks at your hearts and deeds.'"},
  {narrator:"Anas (RA)",source:"Sahih Bukhari",book:"Book of Good Manners",text:"The Prophet ﷺ said: 'Make things easy and do not make them difficult. Give glad tidings and do not cause people to flee.'"},
  {narrator:"Muadh ibn Jabal (RA)",source:"Sunan At-Tirmidhi",book:"Book of Virtue",text:"The Prophet ﷺ said: 'The head of the matter is Islam, its pillar is the prayer, and its peak is jihad (striving in the way of Allah).'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Remembrance",text:"The Prophet ﷺ said: 'Two words are light on the tongue, heavy in the scales, and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil Azim.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Good Manners",text:"The Prophet ﷺ said: 'He who believes in Allah and the Last Day should say good things or remain silent. He who believes in Allah and the Last Day should be generous to his neighbor.'"},
  {narrator:"Aisha (RA)",source:"Sahih Bukhari",book:"Book of Prayer",text:"The Prophet ﷺ said: 'If one of you falls asleep while praying, let him go and sleep, for he does not know whether he is asking for forgiveness or speaking ill of himself.'"},
  {narrator:"Umar ibn al-Khattab (RA)",source:"Sahih Bukhari",book:"Book of Faith",text:"The Prophet ﷺ said: 'Ihsan (excellence) is to worship Allah as though you see Him, and even though you do not see Him, He sees you.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Patients",text:"The Prophet ﷺ said: 'No fatigue, disease, sorrow, sadness, hurt, or distress befalls a Muslim — even if it were the prick of a thorn — except that Allah expiates some of his sins.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Virtue",text:"The Prophet ﷺ said: 'A Muslim is the brother of another Muslim. He does not oppress him, abandon him, or belittle him. Taqwa (piety) is right here — and he pointed to his chest three times.'"},
  {narrator:"Anas (RA)",source:"Sunan At-Tirmidhi",book:"Book of Supplication",text:"The Prophet ﷺ said: 'Supplication is the essence of worship.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Patients",text:"The Prophet ﷺ said: 'The example of a believer is like a fresh green plant — the wind bends it sometimes, but it returns upright. And the disbeliever is like a rigid pine tree — it stands firm until it is uprooted all at once.'"},
  {narrator:"Abu Musa al-Ashari (RA)",source:"Sahih Bukhari",book:"Book of Good Manners",text:"The Prophet ﷺ said: 'The example of a good companion and a bad companion is that of a musk seller and a blacksmith's bellows. With the musk seller you either buy musk or enjoy its fragrance, while the blacksmith's bellows either burn you or fill you with an unpleasant smell.'"},
  {narrator:"Ibn Umar (RA)",source:"Sahih Bukhari",book:"Book of Softening the Heart",text:"The Prophet ﷺ said: 'Be in this world as if you were a stranger or a traveler along a path.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Remembrance",text:"The Prophet ﷺ said: 'Whoever says SubhanAllahi wa bihamdihi one hundred times, his sins will be forgiven even if they are as much as the foam of the sea.'"},
  {narrator:"Abdullah ibn Amr (RA)",source:"Sahih Bukhari",book:"Book of Faith",text:"The Prophet ﷺ said: 'The Muslim is the one from whose tongue and hand the Muslims are safe, and the muhajir (emigrant) is the one who abandons what Allah has forbidden.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Merits",text:"The Prophet ﷺ said: 'Whoever sends one blessing upon me, Allah will send ten blessings upon him.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Virtue",text:"The Prophet ﷺ said: 'The most beloved of deeds to Allah are those done most consistently, even if they are few.'"},
  {narrator:"Abu Said al-Khudri (RA)",source:"Sahih Bukhari",book:"Book of Friday",text:"The Prophet ﷺ said: 'Whoever recites Surah Al-Kahf on Friday, it will illuminate him with light between the two Fridays.'"},
  {narrator:"Aisha (RA)",source:"Sahih Muslim",book:"Book of Prayer",text:"The Prophet ﷺ said: 'The two rakats of Fajr are better than this world and everything in it.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Purification",text:"The Prophet ﷺ said: 'Shall I not tell you of something by which Allah wipes away sins and raises ranks? Performing wudu properly when it is difficult, walking to the mosque, and waiting for prayer after prayer — that is ribat, that is ribat.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Patients",text:"The Prophet ﷺ said: 'The greatest reward comes from the greatest trial. When Allah loves a servant He tests him. Whoever accepts that wins His pleasure, but whoever is discontent with that earns His wrath.'"},
  {narrator:"Abdullah ibn Abbas (RA)",source:"Sunan At-Tirmidhi",book:"Book of Virtue",text:"The Prophet ﷺ said: 'Take advantage of five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your work, and your life before your death.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Good Manners",text:"The Prophet ﷺ said: 'Whoever believes in Allah and the Last Day should honor his guest. Whoever believes in Allah and the Last Day should maintain family ties.'"},
  {narrator:"Aisha (RA)",source:"Sahih Bukhari",book:"Book of Good Manners",text:"The Prophet ﷺ said: 'The most beloved of people to Allah is the one who brings most benefit to people.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Muslim",book:"Book of Remembrance",text:"The Prophet ﷺ said: 'Allah has ninety-nine names — whoever memorizes them will enter Paradise.'"},
  {narrator:"Uqba ibn Amir (RA)",source:"Sahih Muslim",book:"Book of Prayer",text:"The Prophet ﷺ said: 'Your Lord marvels at a shepherd on a mountain peak who gives the call to prayer and prays. Allah says: Look at My servant — he calls the adhan and prays, in awe of Me. I have forgiven My servant and admitted him to Paradise.'"},
  {narrator:"Abu Hurairah (RA)",source:"Sahih Bukhari",book:"Book of Fasting",text:"The Prophet ﷺ said: 'Fasting is a shield. When one of you is fasting, he should not behave immorally or foolishly. If someone fights him or insults him, let him say: I am fasting, I am fasting.'"},
];

// ── Rich Tafsir collection ────────────────────────────────────────────────────
const TAFSIR_ENTRIES = [
  {surah:"Al-Fatiha (The Opening)",ayah:"1:1-7",arabic:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",scholar:"Ibn Kathir",tafsir:"Ibn Kathir explains Al-Fatiha is called 'Umm Al-Quran' — the mother of the Quran, because it contains the essence of the entire revelation. The name 'Ar-Rahman' (Most Gracious) refers to the vastness of Allah's mercy in this world extended to all of creation. 'Ar-Rahim' (Most Merciful) refers to His special mercy for the believers in the Hereafter. 'Iyyaka na'budu wa iyyaka nasta'in' — this is the covenant renewed 17 times daily in prayer: You alone we worship, You alone we ask for help. This moves from praise of Allah to direct address, showing that worship draws the servant into the presence of the Divine."},
  {surah:"Ayat Al-Kursi",ayah:"2:255",arabic:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",scholar:"Ibn Kathir",tafsir:"The Prophet ﷺ said this is the greatest verse in the Quran. 'Al-Hayy' (the Ever-Living) means Allah's life is perfect and eternal — never preceded by non-existence and never ending. 'Al-Qayyum' means He is the Self-Sustaining who sustains all of creation. 'La ta'khudhuhu sinatun wa la nawm' — neither drowsiness nor sleep overtakes Him, which is perfection beyond anything in creation. Whoever recites it after every obligatory prayer, nothing prevents them from entering Paradise except death."},
  {surah:"Al-Baqarah",ayah:"2:286",arabic:"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ",scholar:"Al-Tabari",tafsir:"Al-Tabari says this verse was a great mercy and relief to the companions. When earlier verses about the accountability of thoughts were revealed, they were deeply worried. This verse came as reassurance: Allah does not burden any soul beyond what it can bear. The scholars note that 'wus'aha' means capacity — your capacity as Allah has designed you, not your imagined limit. This verse ends with the most comprehensive dua in the Quran, asking for forgiveness, mercy, and victory."},
  {surah:"Al-Inshirah (The Relief)",ayah:"94:1-8",arabic:"أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ",scholar:"Ibn Kathir",tafsir:"Ibn Kathir notes the surah opens with a rhetorical question — 'Have We not expanded your chest?' — confirming Allah already did this for the Prophet ﷺ. The phrase 'fa inna ma'al usri yusra' (with hardship is ease) is repeated twice with 'inna' (indeed) for emphasis. The scholars note that in Arabic grammar, the word 'al-usr' (hardship, with the definite article 'al') is the same both times — meaning one hardship. But 'yusr' (ease, indefinite) appears twice — meaning two different eases. Therefore one hardship cannot overcome two eases."},
  {surah:"Al-Ikhlas (Sincerity)",ayah:"112:1-4",arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",scholar:"Ibn Kathir & Al-Qurtubi",tafsir:"Al-Qurtubi explains 'As-Samad' is the most comprehensive of Allah's names — it means He is the one to whom all creation turns in need, while He needs nothing and no one. The surah was revealed in response to those who asked about Allah's lineage. 'Lam yalid wa lam yulad' — He did not give birth and was not born — negates any anthropomorphic concept of God. The Prophet ﷺ said reciting this surah is equivalent to reciting one-third of the Quran, because the Quran covers three broad topics — rulings, stories, and descriptions of Allah — and this surah covers the third perfectly."},
  {surah:"Al-Asr (Time)",ayah:"103:1-3",arabic:"وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",scholar:"Imam Ash-Shafi'i",tafsir:"Imam Ash-Shafi'i said: 'If Allah had revealed only Surah Al-Asr, it would be sufficient as guidance for humanity.' The oath by time shows that time itself testifies to the human condition. 'Al-Insan la-fi khusr' — all of humanity is in a state of loss, without exception. The only escape is four qualities together: faith (iman), righteous deeds (amal salih), mutual exhortation to truth (tawasi bil-haqq), and mutual exhortation to patience (tawasi bis-sabr). The companions would not part from one another without reciting this surah."},
  {surah:"Al-Kahf (The Cave)",ayah:"18:10",arabic:"إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",scholar:"Ibn Kathir",tafsir:"Ibn Kathir explains the People of the Cave were young men — 'fityah' — who had faith in Allah while their society rejected it. They retreated to the cave not out of cowardice but out of commitment: to protect their faith from corruption. Their dua — 'Our Lord, grant us mercy from Yourself and prepare for us from our affair right guidance' — combined reliance on Allah (seeking mercy) with personal agency (seeking guidance in their affairs). The Prophet ﷺ recommended reciting Surah Al-Kahf on Fridays for protection from the Dajjal."},
  {surah:"Ya-Sin",ayah:"36:83",arabic:"فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",scholar:"Al-Razi",tafsir:"Imam Al-Razi explains that 'malakut' refers to the absolute, complete dominion of Allah — not just outward kingship but the inner reality of ownership of all things. This final verse of Ya-Sin brings together tasbih (glorification), divine sovereignty, and return to Allah. The surah is called 'the heart of the Quran' and the Prophet ﷺ said: 'Everything has a heart, and the heart of the Quran is Ya-Sin.' Reciting it for a dying person or for those who have passed is a recommended practice in Islamic tradition."},
  {surah:"Ar-Rahman (The Beneficent)",ayah:"55:13",arabic:"فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",scholar:"Ibn Kathir",tafsir:"'Fabi-ayyi ala'i rabbikuma tukadhdhibaan' — So which of the favors of your Lord would you deny? This rhetorical question is repeated 31 times in Surah Ar-Rahman, directed at both humans and jinn (as indicated by the dual form). Ibn Kathir explains that the repetition serves multiple purposes: to emphasize the countless nature of Allah's blessings, to invite reflection, and to shame those who deny. The companions, when this verse was recited to them, would respond: 'La bi-shay'in min ni'amika rabbana nukadhdhib' — We deny none of Your blessings, our Lord, to You belongs all praise."},
  {surah:"Al-Mulk (The Sovereignty)",ayah:"67:1-2",arabic:"تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ",scholar:"Ibn Kathir",tafsir:"'Tabarak' — Blessed is He — indicates blessing that is vast, continuous, and overflowing from the Divine. Importantly, Allah says He created death BEFORE life — 'alladhi khalaqa al-mawta wal-hayata' — because death gives life its meaning and urgency. 'Liyabluwakum ayyukum ahsanu amala' — to test which of you is best in deed — not most in deed, but BEST. Al-Fudayl ibn Iyad said 'best in deed' means most sincere and most correct (following the Sunnah). The Prophet ﷺ called this surah 'Al-Waqiyah' — the Protector — and said it intercedes for its regular reciter."},
  {surah:"Ad-Duha (The Morning Hours)",ayah:"93:1-11",arabic:"وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",scholar:"Ibn Kathir",tafsir:"This surah was revealed after a period of silence in revelation, during which the Prophet ﷺ was deeply distressed, fearing Allah had abandoned him. 'Ma wadda'aka rabbuka wa ma qala' — Your Lord has not abandoned you, nor has He become displeased. Ibn Kathir notes this is one of the most emotionally powerful openings in the Quran — direct, personal, and reassuring. The surah then reminds the Prophet of three personal blessings: he was orphaned and Allah sheltered him, he was lost and Allah guided him, he was poor and Allah enriched him. This pattern — acknowledging past mercy to build trust in present difficulty — is a Quranic template for comfort."},
  {surah:"Al-Hujurat (The Rooms)",ayah:"49:13",arabic:"يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",scholar:"Al-Tabari",tafsir:"Al-Tabari explains that this verse establishes the Islamic foundation of human equality and brotherhood. 'Inna akramakum indallahi atqakum' — the most honored of you in the sight of Allah is the most righteous. Lineage, nationality, race, and wealth have no weight in the Divine scale — only taqwa. The surah as a whole establishes the ethics of Muslim community: verifying news, not mocking others, avoiding suspicion, not spying, not backbiting. This single verse dismantled 1400 years of tribal pride in Arabia and established the first universal declaration of human dignity."},
];

// ── Day-seeded random ─────────────────────────────────────────────────────────
function dayRandom(max, offset = 0) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + offset;
  return ((seed * 1103515245 + 12345) & 0x7fffffff) % max;
}

// ── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f8f4ec;
    --parchment: #fdf8f0;
    --emerald: #1a5c3a;
    --emerald-light: #2a7a50;
    --emerald-muted: #e8f2ec;
    --gold: #c9982a;
    --gold-light: #e8c16a;
    --gold-pale: #fdf5e0;
    --ink: #1c1a14;
    --ink-muted: #4a4535;
    --ink-light: #8a7d60;
    --red-sin: #8b2a2a;
    --red-pale: #fdf0f0;
    --border: #d4c9a8;
    --shadow: rgba(28,26,20,0.12);
    --radius: 14px;
  }

  body {
    font-family: 'Lora', Georgia, serif;
    background: var(--bg);
    color: var(--ink);
    min-height: 100vh;
  }

  /* geometric background pattern */
  .app-shell {
    min-height: 100vh;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(201,152,42,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(26,92,58,0.06) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9982a' fill-opacity='0.04'%3E%3Cpolygon points='30 0 60 30 30 60 0 30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .header {
    background: linear-gradient(135deg, var(--emerald) 0%, #0f3d27 100%);
    padding: 20px 24px 16px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .header::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z' stroke='%23c9982a' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3Ccircle cx='40' cy='40' r='20' stroke='%23c9982a' stroke-width='0.5' fill='none' opacity='0.2'/%3E%3C/g%3E%3C/svg%3E") repeat;
    opacity: 0.4;
  }
  .header-bismillah {
    font-family: 'Amiri', serif;
    font-size: 22px;
    color: var(--gold-light);
    letter-spacing: 2px;
    margin-bottom: 6px;
    position: relative;
  }
  .header-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 20px;
    font-weight: 700;
    color: white;
    position: relative;
    letter-spacing: 1px;
  }
  .header-subtitle {
    font-family: 'Lora', serif;
    font-size: 12px;
    color: rgba(255,255,255,0.65);
    margin-top: 4px;
    font-style: italic;
    position: relative;
  }

  /* ── Nav ── */
  .nav {
    background: var(--parchment);
    border-bottom: 2px solid var(--border);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 8px 6px;
    gap: 6px;
  }
  .nav::-webkit-scrollbar { display: none; }
  .nav-btn {
    flex-shrink: 0;
    padding: 8px 14px;
    border: none;
    background: transparent;
    font-family: 'Lora', serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    border-radius: 8px;
  }
  .nav-btn:hover {
    background: var(--emerald-muted);
    color: var(--emerald);
  }
  .nav-btn.active {
    background: transparent;
    color: var(--emerald);
    border-bottom: 3px solid var(--emerald);
  }
  .nav-btn:hover { color: var(--emerald); }

  }

  /* ── Main Content ── */
  .main { flex: 1; padding: 20px 16px 40px; max-width: 700px; margin: 0 auto; width: 100%; }

  /* ── Page Header ── */
  .page-header {
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .page-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 18px;
    color: var(--emerald);
    font-weight: 700;
  }
  .page-desc {
    font-size: 13px;
    color: var(--ink-muted);
    margin-top: 4px;
    font-style: italic;
  }

  /* ── Cards ── */
  .card {
    background: var(--parchment);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px var(--shadow);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px var(--shadow); }

  /* ── Deed Item ── */
  .deed-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    background: var(--parchment);
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .deed-item:hover { border-color: var(--gold); background: var(--gold-pale); }
  .deed-item.checked {
    background: var(--emerald-muted);
    border-color: var(--emerald-light);
  }
  .deed-check {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-radius: 50%;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    transition: all 0.2s;
    margin-top: 1px;
  }
  .deed-item.checked .deed-check {
    background: var(--emerald);
    border-color: var(--emerald);
    color: white;
  }
  .deed-text { font-size: 14px; font-weight: 600; color: var(--ink); line-height: 1.4; }
  .deed-reward { font-size: 12px; color: var(--emerald-light); font-style: italic; margin-top: 2px; }

  /* ── Sin Items ── */
  .sin-item {
    padding: 12px 14px;
    background: var(--parchment);
    border: 1px solid var(--border);
    border-left: 4px solid var(--border);
    border-radius: 10px;
    margin-bottom: 8px;
    transition: all 0.2s;
  }
  .sin-item.major { border-left-color: var(--red-sin); background: var(--red-pale); }
  .sin-item.minor { border-left-color: var(--gold); background: var(--gold-pale); }
  .sin-label {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .sin-item.major .sin-label { color: var(--red-sin); }
  .sin-item.minor .sin-label { color: #7a6020; }
  .sin-text { font-size: 14px; font-weight: 600; color: var(--ink); }
  .sin-note { font-size: 12px; color: var(--ink-muted); font-style: italic; margin-top: 4px; }

  /* ── Section Titles ── */
  .section-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--emerald);
    letter-spacing: 1px;
    margin: 20px 0 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--gold), transparent);
  }

  /* ── Quran Card ── */
  .quran-card {
    background: var(--parchment);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 14px;
    box-shadow: 0 2px 8px var(--shadow);
  }
  .quran-ref {
    font-size: 11px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .arabic-text {
    font-family: 'Amiri', serif;
    font-size: 20px;
    color: var(--emerald);
    line-height: 1.8;
    text-align: right;
    direction: rtl;
    margin-bottom: 12px;
    padding: 12px;
    background: rgba(26,92,58,0.04);
    border-radius: 8px;
    border: 1px solid rgba(26,92,58,0.1);
  }
  .translation-text {
    font-size: 14px;
    color: var(--ink);
    line-height: 1.7;
    font-style: italic;
  }
  .hadith-narrator {
    font-size: 11px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .hadith-source {
    font-size: 11px;
    color: var(--ink-light);
    margin-bottom: 10px;
  }
  .hadith-text { font-size: 14px; line-height: 1.7; color: var(--ink); }
  .tafsir-surah {
    font-family: 'Cinzel Decorative', serif;
    font-size: 14px;
    color: var(--emerald);
    font-weight: 700;
    margin-bottom: 4px;
  }
  .tafsir-text {
    font-size: 13px;
    line-height: 1.8;
    color: var(--ink-muted);
    margin-top: 10px;
  }

  /* ── Kind Words / Feelings ── */
  .feeling-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }
  .feeling-btn {
    padding: 10px 6px;
    border: 2px solid var(--border);
    border-radius: 10px;
    background: var(--parchment);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-family: 'Lora', serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-muted);
  }
  .feeling-btn:hover { border-color: var(--gold); color: var(--emerald); }
  .feeling-btn.active { border-color: var(--gold); background: var(--gold-pale); color: var(--emerald); }
  .feeling-emoji { font-size: 22px; display: block; margin-bottom: 4px; }
  .kind-words-box {
    background: linear-gradient(135deg, var(--emerald-muted), var(--gold-pale));
    border: 1px solid var(--gold-light);
    border-radius: var(--radius);
    padding: 20px;
    margin-top: 4px;
    animation: fadeIn 0.4s ease;
  }
  .kind-words-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .kind-words-text {
    font-size: 15px;
    line-height: 1.8;
    color: var(--emerald);
    font-style: italic;
  }
  .kind-words-nav {
    display: flex; gap: 8px; margin-top: 14px; justify-content: flex-end;
  }
  .kind-words-nav-btn {
    width: 28px; height: 28px;
    border: 1px solid var(--gold);
    background: transparent;
    border-radius: 50%;
    cursor: pointer;
    font-size: 13px;
    color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .kind-words-nav-btn:hover { background: var(--gold); color: white; }

  /* ── Journal ── */
  .journal-entry {
    background: var(--parchment);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 10px;
    box-shadow: 0 2px 6px var(--shadow);
    animation: fadeIn 0.3s ease;
  }
  .journal-date { font-size: 11px; color: var(--gold); font-weight: 700; letter-spacing: 1px; margin-bottom: 6px; }
  .journal-mood { font-size: 11px; color: var(--ink-light); font-style: italic; margin-bottom: 8px; }
  .journal-content { font-size: 14px; line-height: 1.7; color: var(--ink); }
  .journal-textarea {
    width: 100%;
    min-height: 140px;
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--parchment);
    font-family: 'Lora', serif;
    font-size: 14px;
    color: var(--ink);
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    line-height: 1.7;
  }
  .journal-textarea:focus { border-color: var(--gold); }
  .journal-textarea::placeholder { color: var(--ink-light); font-style: italic; }

  /* ── Progress Bar ── */
  .progress-bar-wrap {
    background: var(--border);
    border-radius: 99px;
    height: 8px;
    margin: 10px 0 4px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(to right, var(--emerald), var(--gold));
    border-radius: 99px;
    transition: width 0.4s ease;
  }
  .progress-label {
    font-size: 11px;
    color: var(--ink-muted);
    text-align: right;
  }

  /* ── Buttons ── */
  .btn-primary {
    padding: 12px 24px;
    background: linear-gradient(135deg, var(--emerald), var(--emerald-light));
    color: white;
    border: none;
    border-radius: 99px;
    font-family: 'Lora', serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(26,92,58,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,92,58,0.4); }
  .btn-gold {
    padding: 10px 20px;
    background: linear-gradient(135deg, var(--gold), #b8851e);
    color: white;
    border: none;
    border-radius: 99px;
    font-family: 'Lora', serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(201,152,42,0.3);
  }
  .btn-gold:hover { transform: translateY(-1px); }
  .btn-sm {
    padding: 6px 14px;
    font-size: 12px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: transparent;
    cursor: pointer;
    font-family: 'Lora', serif;
    color: var(--ink-muted);
    transition: all 0.2s;
  }
  .btn-sm:hover { border-color: var(--red-sin); color: var(--red-sin); }
  .btn-sm.del { border-color: rgba(139,42,42,0.3); }
  .btn-sm.del:hover { background: var(--red-pale); }

  /* ── Select & Input ── */
  .select-input {
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--parchment);
    font-family: 'Lora', serif;
    font-size: 13px;
    color: var(--ink);
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .select-input:focus { border-color: var(--gold); }

  /* ── Tab pills ── */
  .tab-pills { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .tab-pill {
    padding: 7px 16px;
    border: 1px solid var(--border);
    border-radius: 99px;
    background: transparent;
    font-family: 'Lora', serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-pill:hover { border-color: var(--gold); color: var(--emerald); }
  .tab-pill.active { background: var(--emerald); border-color: var(--emerald); color: white; }

  /* ── Deeds summary banner ── */
  .deeds-banner {
    background: linear-gradient(135deg, var(--emerald) 0%, #0f3d27 100%);
    border-radius: var(--radius);
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
  }
  .deeds-banner-count { font-family: 'Cinzel Decorative', serif; font-size: 28px; font-weight: 700; }
  .deeds-banner-label { font-size: 11px; opacity: 0.75; margin-top: 2px; }
  .deeds-banner-verse { font-size: 12px; opacity: 0.85; font-style: italic; max-width: 200px; text-align: right; line-height: 1.5; }

  /* ── AI Loading ── */
  .ai-loading {
    display: flex; align-items: center; gap: 8px;
    color: var(--emerald); font-size: 13px; font-style: italic;
  }
  .dots span {
    display: inline-block; width: 6px; height: 6px;
    background: var(--gold); border-radius: 50%;
    animation: bounce 1.2s infinite;
  }
  .dots span:nth-child(2) { animation-delay: 0.2s; }
  .dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Ornament ── */
  .ornament { text-align: center; color: var(--gold); font-size: 18px; margin: 10px 0 6px; letter-spacing: 4px; }
  .empty-state { text-align: center; color: var(--ink-light); font-style: italic; font-size: 14px; padding: 30px 0; }
`;

// ── Helper ───────────────────────────────────────────────────────────────────

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

// ── AI Hook ──────────────────────────────────────────────────────────────────

async function callClaude(prompt) {
  // AI features are disabled - returns friendly message
  console.log("AI feature called (disabled):", prompt);
  return "✨ AI features are currently disabled. All core features (Deeds, Sins, Tracker, Quran, Hadith, Journal) work perfectly! May Allah bless your journey. ✨";
}
// ── Pages ────────────────────────────────────────────────────────────────────

function DeedsPage() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const count = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((count / GOOD_DEEDS.length) * 100);

  // Save function
  const saveToTracker = () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = JSON.parse(localStorage.getItem("islamic-daily-tracker") || "{}");
    
    // Get existing sins data for today (preserve sins if already saved)
    const existingToday = existing[today] || {};
    
    const updated = {
      ...existing,
      [today]: {
        ...existingToday,
        deeds: checked,
        savedAt: new Date().toISOString()
      }
    };
    
    localStorage.setItem("islamic-daily-tracker", JSON.stringify(updated));
    alert(`✓ Saved today's good deeds to tracker! (${count} deeds recorded)`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">✦ Good Deeds Tracker</div>
        <div className="page-desc">Check off your deeds today — every small act weighs heavily on the scales.</div>
      </div>
      
      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="btn-gold" onClick={saveToTracker} style={{ fontSize: 12, padding: "8px 16px" }}>
          💾 Save Today's Record
        </button>
      </div>
      
      <div className="deeds-banner">
        <div>
          <div className="deeds-banner-count">{count}<span style={{fontSize:16,fontFamily:'Lora,serif',fontWeight:400}}>/{GOOD_DEEDS.length}</span></div>
          <div className="deeds-banner-label">Good deeds today</div>
        </div>
        <div className="deeds-banner-verse">"And whoever does an atom's weight of good will see it." (99:7)</div>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{width: pct + "%"}} />
      </div>
      <div className="progress-label" style={{marginBottom:16}}>{pct}% of today's checklist</div>

      {GOOD_DEEDS.map(d => (
        <div key={d.id} className={`deed-item ${checked[d.id] ? "checked" : ""}`} onClick={() => toggle(d.id)}>
          <div className="deed-check">{checked[d.id] ? "✓" : ""}</div>
          <div>
            <div className="deed-text">{d.deed}</div>
            <div className="deed-reward">✦ {d.reward}</div>
          </div>
        </div>
      ))}
      <div className="ornament">❧ ✦ ❧</div>
      <div style={{textAlign:"center",fontSize:13,color:"var(--ink-light)",fontStyle:"italic"}}>
        Reset at midnight — every day is a new beginning.
      </div>
    </div>
  );
}


function SinsPage() {
  const [tab, setTab] = useState("major");
  const [majorChecked, setMajorChecked] = useState({});
  const [minorChecked, setMinorChecked] = useState({});
  const [showTawbah, setShowTawbah] = useState(false);
  const [aiTawbah, setAiTawbah] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const toggleMajor = (id) => setMajorChecked(p => ({ ...p, [id]: !p[id] }));
  const toggleMinor = (id) => setMinorChecked(p => ({ ...p, [id]: !p[id] }));

  const majorCount = Object.values(majorChecked).filter(Boolean).length;
  const minorCount = Object.values(minorChecked).filter(Boolean).length;
  const totalChecked = majorCount + minorCount;

  const checkedMajorList = MAJOR_SINS.filter(s => majorChecked[s.id]).map(s => s.sin);
  const checkedMinorList = MINOR_SINS.filter(s => minorChecked[s.id]).map(s => s.sin);

  // Save function
  const saveToTracker = () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = JSON.parse(localStorage.getItem("islamic-daily-tracker") || "{}");
    
    // Get existing deeds data for today (preserve deeds if already saved)
    const existingToday = existing[today] || {};
    
    const updated = {
      ...existing,
      [today]: {
        ...existingToday,
        majorSins: majorChecked,
        minorSins: minorChecked,
        savedAt: new Date().toISOString()
      }
    };
    
    localStorage.setItem("islamic-daily-tracker", JSON.stringify(updated));
    alert(`✓ Saved today's sins to tracker! (${totalChecked} sins acknowledged)`);
  };

  const getTawbah = async () => {
    setAiLoading(true); setAiTawbah(""); setShowTawbah(true);
    const all = [...checkedMajorList, ...checkedMinorList];
    const prompt = all.length > 0
      ? `You are a compassionate Islamic scholar. A Muslim has acknowledged the following sins today: ${all.join("; ")}.
         Write a warm, non-judgmental tawbah (repentance) guidance of 4-5 sentences.
         Remind them of Allah's infinite mercy, give a specific dua for tawbah in Arabic with translation,
         and suggest one practical step for each category. End with hope and encouragement.
         No bullet points. Speak like a merciful elder.`
      : `You are a compassionate Islamic scholar. A Muslim is reflecting on their sins and seeking guidance on tawbah.
         Write a warm general guide to repentance — how to make tawbah, key duas, and why Allah loves those who repent.
         4-5 sentences. End with encouragement. No bullet points.`;
    const result = await callClaude(prompt);
    setAiTawbah(result);
    setAiLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">⚠ Sins & Tawbah</div>
        <div className="page-desc">Check what you've struggled with today — then seek Allah's forgiveness with guidance.</div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="btn-gold" onClick={saveToTracker} style={{ fontSize: 12, padding: "8px 16px" }}>
          💾 Save Today's Record
        </button>
      </div>

      {totalChecked > 0 && (
        <div style={{background:"linear-gradient(135deg,#5c1a1a,#8b2a2a)",borderRadius:"var(--radius)",padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",color:"white"}}>
          <div>
            <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:22,fontWeight:700}}>{totalChecked}</div>
            <div style={{fontSize:11,opacity:.75}}>sin{totalChecked>1?"s":""} acknowledged today</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:12,opacity:.85,fontStyle:"italic",maxWidth:180,lineHeight:1.5,marginBottom:8}}>"Indeed Allah loves those who repent." (2:222)</div>
            <button className="btn-gold" onClick={getTawbah} style={{fontSize:11,padding:"7px 14px"}}>✦ Seek Tawbah</button>
          </div>
        </div>
      )}

      {showTawbah && (
        <div className="kind-words-box" style={{marginBottom:16,background:"linear-gradient(135deg,#fff5f5,var(--gold-pale))"}}>
          <div className="kind-words-label" style={{color:"var(--red-sin)"}}>✦ Tawbah Guidance</div>
          {aiLoading
            ? <div className="ai-loading"><div className="dots"><span/><span/><span/></div>Preparing your path of repentance...</div>
            : <div className="kind-words-text" style={{color:"var(--ink)",fontSize:14,whiteSpace:"pre-wrap"}}>{aiTawbah}</div>
          }
        </div>
      )}

      <div className="tab-pills">
        <button className={`tab-pill ${tab === "major" ? "active" : ""}`} onClick={() => setTab("major")}>
          Major Sins {majorCount > 0 && <span style={{background:"var(--red-sin)",color:"white",borderRadius:99,padding:"1px 6px",fontSize:10,marginLeft:4}}>{majorCount}</span>}
        </button>
        <button className={`tab-pill ${tab === "minor" ? "active" : ""}`} onClick={() => setTab("minor")}>
          Minor Sins {minorCount > 0 && <span style={{background:"#b8851e",color:"white",borderRadius:99,padding:"1px 6px",fontSize:10,marginLeft:4}}>{minorCount}</span>}
        </button>
      </div>

      {/* Rest of the sins content remains the same */}
      {tab === "major" && (
        <div>
          <div className="card" style={{background:"#fff8f8",border:"1px solid rgba(139,42,42,0.2)",marginBottom:12}}>
            <div style={{fontSize:12,color:"var(--red-sin)",fontWeight:600,marginBottom:3}}>⚠ Tick what you've fallen into today — awareness is the first step to tawbah</div>
            <div style={{fontSize:11,color:"var(--ink-muted)",lineHeight:1.6}}>"Do not despair of the mercy of Allah. Indeed, Allah forgives all sins." (39:53)</div>
          </div>
          {MAJOR_SINS.map(s => (
            <div
              key={s.id}
              className={`deed-item ${majorChecked[s.id] ? "checked" : ""}`}
              style={{borderLeft: majorChecked[s.id] ? "4px solid var(--red-sin)" : "4px solid transparent", background: majorChecked[s.id] ? "#fff0f0" : "var(--parchment)", borderRadius:10}}
              onClick={() => toggleMajor(s.id)}
            >
              <div className="deed-check" style={majorChecked[s.id] ? {background:"var(--red-sin)",borderColor:"var(--red-sin)",color:"white"} : {borderColor:"#d4a0a0"}}>
                {majorChecked[s.id] ? "✓" : ""}
              </div>
              <div>
                <div className="deed-text">{s.sin}</div>
                <div className="deed-reward" style={{color:"var(--red-sin)"}}>📖 {s.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "minor" && (
        <div>
          <div className="card" style={{background:"var(--gold-pale)",border:"1px solid rgba(201,152,42,0.3)",marginBottom:12}}>
            <div style={{fontSize:12,color:"#7a6020",fontWeight:600,marginBottom:3}}>Minor sins accumulate — acknowledging them is the start of purification</div>
            <div style={{fontSize:11,color:"var(--ink-muted)",lineHeight:1.6}}>"The five prayers are expiation for what comes between them as long as major sins are avoided." (Sahih Muslim)</div>
          </div>
          {MINOR_SINS.map(s => (
            <div
              key={s.id}
              className={`deed-item ${minorChecked[s.id] ? "checked" : ""}`}
              style={{borderLeft: minorChecked[s.id] ? "4px solid var(--gold)" : "4px solid transparent", background: minorChecked[s.id] ? "#fffbec" : "var(--parchment)", borderRadius:10}}
              onClick={() => toggleMinor(s.id)}
            >
              <div className="deed-check" style={minorChecked[s.id] ? {background:"var(--gold)",borderColor:"var(--gold)",color:"white"} : {borderColor:"#c9b070"}}>
                {minorChecked[s.id] ? "✓" : ""}
              </div>
              <div>
                <div className="deed-text">{s.sin}</div>
                <div className="deed-reward" style={{color:"#8a6a10"}}>📖 {s.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalChecked === 0 && (
        <div style={{textAlign:"center",marginTop:16}}>
          <button className="btn-gold" onClick={getTawbah}>✦ General Tawbah Guidance</button>
        </div>
      )}

      <div className="ornament" style={{marginTop:20}}>❧ ✦ ❧</div>
      <div style={{textAlign:"center",fontSize:12,color:"var(--ink-light)",fontStyle:"italic",lineHeight:1.7}}>
        Acknowledging is not condemning yourself —<br/>it is opening the door of mercy.
      </div>
    </div>
  );
}
// ── Hadith books data (expanded) ─────────────────────────────────────────────
const HADITH_BOOKS = {
  bukhari: {
    name: "Sahih Al-Bukhari", short: "Bukhari",
    hadiths: [
      { id:1, narrator:"Umar ibn al-Khattab (RA)", text:"The Prophet ﷺ said: 'Actions are judged by intentions, and every person will have what they intended. So whoever emigrates for the sake of Allah and His Messenger, his emigration is for Allah and His Messenger. And whoever emigrates to gain some worldly benefit or to marry a woman, his emigration is for the purpose for which he emigrated.'" },
      { id:2, narrator:"Aisha (RA)", text:"The Prophet ﷺ said: 'The most beloved deeds to Allah are those done regularly, even if they are few.'" },
      { id:3, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Faith has over seventy branches — or over sixty branches — the uppermost of which is the declaration 'None has the right to be worshipped but Allah,' and the least of which is the removal of harmful things from the road; and modesty is a branch of faith.'" },
      { id:4, narrator:"Abdullah ibn Amr (RA)", text:"A man asked the Prophet ﷺ: 'Which Islam is the best?' He replied: 'Feeding the hungry and greeting both those you know and those you do not know.'" },
      { id:5, narrator:"Anas ibn Malik (RA)", text:"The Prophet ﷺ said: 'None of you truly believes until he loves for his brother what he loves for himself.'" },
      { id:6, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'The strong man is not the one who wrestles others to the ground. The strong man is the one who controls himself when he is angry.'" },
      { id:7, narrator:"Ibn Abbas (RA)", text:"The Prophet ﷺ said: 'Take advantage of five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.'" },
      { id:8, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Whoever believes in Allah and the Last Day should speak good or keep silent; and whoever believes in Allah and the Last Day should be generous to his neighbor; and whoever believes in Allah and the Last Day should be generous to his guest.'" },
    ]
  },
  muslim: {
    name: "Sahih Muslim", short: "Muslim",
    hadiths: [
      { id:1, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Whoever removes a worldly hardship from a believer, Allah will remove from him one of the hardships of the Day of Resurrection. Whoever makes things easy for a person in difficulty, Allah will make things easy for him in this world and the next. Whoever conceals a Muslim's faults, Allah will conceal his faults in this world and the next.'" },
      { id:2, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Do you know who is bankrupt?' They said: 'The bankrupt is the one with no money and no property.' He said: 'The truly bankrupt one of my ummah is the one who comes on the Day of Resurrection with prayer, fasting, and zakat, but who has insulted this person, accused that person, eaten the wealth of another, shed the blood of another, and struck another — so his good deeds will be shared out among them.'" },
      { id:3, narrator:"Jabir (RA)", text:"The Prophet ﷺ said: 'Every act of kindness is sadaqah (charity).'" },
      { id:4, narrator:"Abu Dharr (RA)", text:"The Prophet ﷺ said: 'Your smiling in the face of your brother is an act of charity. Enjoining good and forbidding evil is charity. Helping a man with his beast, lifting his load or helping him load it, is charity. Removing stones, thorns and bones from the road is charity. Emptying your bucket into your brother's is charity.'" },
      { id:5, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Allah Almighty said: I am as My servant thinks of Me, and I am with him when he remembers Me. If he remembers Me in himself, I remember him in Myself. If he mentions Me in an assembly, I mention him in a better assembly.'" },
      { id:6, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Part of the perfection of a person's Islam is his leaving what does not concern him.'" },
      { id:7, narrator:"An-Nawwas ibn Sam'an (RA)", text:"The Prophet ﷺ said: 'Righteousness is good character, and sin is that which wavers in your soul and which you dislike people finding out about.'" },
      { id:8, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Allah has ninety-nine names — one hundred minus one — and whoever memorises them will enter Paradise.'" },
    ]
  },
  tirmidhi: {
    name: "Jami At-Tirmidhi", short: "Tirmidhi",
    hadiths: [
      { id:1, narrator:"Muadh ibn Jabal (RA)", text:"The Prophet ﷺ said: 'Shall I not tell you of the head of the matter, its pillar and its peak?' I said: 'Yes, O Messenger of Allah.' He said: 'The head of the matter is Islam, its pillar is prayer, and its peak is jihad (striving in the way of Allah).'" },
      { id:2, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'The most complete of the believers in faith are those with the best character, and the best of you are the best of you to your wives.'" },
      { id:3, narrator:"Ibn Masud (RA)", text:"The Prophet ﷺ said: 'Truthfulness leads to righteousness and righteousness leads to Paradise. A man keeps speaking the truth until he is recorded with Allah as a truthful person. Falsehood leads to wickedness and wickedness leads to the Fire. A man keeps telling lies until he is recorded with Allah as a liar.'" },
      { id:4, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Whoever goes on a path seeking knowledge, Allah will make easy for him a path to Paradise.'" },
      { id:5, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'The most burdensome prayers for the hypocrites are the Isha prayer and the Fajr prayer. If they only knew what was in them, they would come to them even if they had to crawl.'" },
      { id:6, narrator:"Anas ibn Malik (RA)", text:"The Prophet ﷺ said: 'Make things easy and do not make them difficult. Give good news and do not drive people away.'" },
      { id:7, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Whoever has been given gentleness has been given the good of this world and the next; and whoever is deprived of gentleness has been deprived of the good of this world and the next.'" },
      { id:8, narrator:"Ibn Abbas (RA)", text:"The Prophet ﷺ said: 'There are two blessings which many people waste: health and free time.'" },
    ]
  },
  abudawud: {
    name: "Sunan Abu Dawud", short: "Abu Dawud",
    hadiths: [
      { id:1, narrator:"Aisha (RA)", text:"The Prophet ﷺ said: 'The best of deeds is that which is done consistently, even if it is small.'" },
      { id:2, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Whoever does not show mercy will not be shown mercy.'" },
      { id:3, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'Allah is gentle and loves gentleness in all matters.'" },
      { id:4, narrator:"Iyas ibn Abdullah (RA)", text:"The Prophet ﷺ said: 'Do not beat the female servants of Allah.' Then Umar came and said: 'O Messenger of Allah, the women have become bold toward their husbands!' So he gave permission to beat them. Then many women surrounded the family of Muhammad ﷺ complaining about their husbands. So the Messenger of Allah ﷺ said: 'Many women have gone around Muhammad's family complaining about their husbands. Those men are not the best among you.'" },
      { id:5, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'The one who is most deserving of a good opinion is the one who has shown it most.' He also said: 'Think the best of your brother until you find evidence of the opposite.'" },
      { id:6, narrator:"Abu Musa Al-Ash'ari (RA)", text:"The Prophet ﷺ said: 'Free the prisoner, feed the hungry, and visit the sick.'" },
      { id:7, narrator:"Anas ibn Malik (RA)", text:"The Prophet ﷺ said: 'Seek the night of Qadr in the last ten odd nights of Ramadan.'" },
      { id:8, narrator:"Abu Hurairah (RA)", text:"The Prophet ﷺ said: 'The rights of a Muslim upon another Muslim are six.' It was asked: 'What are they, O Messenger of Allah?' He said: 'When you meet him, give him the greeting of peace; when he invites you, accept his invitation; when he asks for your advice, give him sincere advice; when he sneezes and praises Allah, respond appropriately; when he falls ill, visit him; and when he dies, follow his funeral.'" },
    ]
  },
  nawawi: {
    name: "40 Hadith — An-Nawawi", short: "Nawawi",
    hadiths: [
      { id:1, narrator:"Hadith 1", text:"On the authority of Umar: 'Actions are judged by intentions, and every person will have what they intended. Whoever emigrates to Allah and His Messenger, his emigration is for Allah and His Messenger. Whoever emigrates for worldly gain or to marry a woman, his emigration is for the purpose for which he emigrated.'" },
      { id:2, narrator:"Hadith 2", text:"On the authority of Aisha: 'He ﷺ said: Whoever introduces into this affair of ours something that does not belong to it, it is to be rejected.'" },
      { id:3, narrator:"Hadith 5", text:"On the authority of Aisha: 'The Messenger of Allah ﷺ said: Whoever introduces into this affair of ours something that does not belong to it, it is to be rejected.'" },
      { id:4, narrator:"Hadith 6", text:"On the authority of an-Nu'man ibn Bashir: 'The lawful is clear and the forbidden is clear, and between them are ambiguous matters which many people do not recognise. Whoever guards against the doubtful things keeps his religion and his honour blameless, and whoever indulges in them is like a shepherd who grazes his animals around a sanctuary.'" },
      { id:5, narrator:"Hadith 13", text:"On the authority of Abu Hamzah Anas ibn Malik: 'None of you truly believes until he loves for his brother — or he said, for his neighbour — what he loves for himself.'" },
      { id:6, narrator:"Hadith 17", text:"On the authority of Wabisah ibn Mabad: 'I came to the Messenger of Allah ﷺ and he said: You have come to ask about righteousness and sin. I said: Yes. He said: Consult your heart. Righteousness is that in which the soul feels tranquility and the heart feels tranquility. And sin is that which wavers in the soul and moves to and fro in the breast, even though people give you their legal opinion in its favour, again and again.'" },
      { id:7, narrator:"Hadith 29", text:"On the authority of Muadh ibn Jabal: 'I asked: O Messenger of Allah, tell me of a deed that will take me into Paradise and keep me away from the Fire. He said: You have asked about a great matter, yet it is easy for the one for whom Allah makes it easy. Worship Allah, associate nothing with Him, establish prayer, pay zakah, fast Ramadan, and make the pilgrimage to the House.'" },
      { id:8, narrator:"Hadith 35", text:"On the authority of Abu Hurairah: 'The Prophet ﷺ said: Do not envy one another. Do not artificially inflate prices against one another. Do not hate one another. Do not shun one another. Do not undercut one another in commercial transactions. And be servants of Allah and brothers. A Muslim is the brother of a Muslim; he does not wrong him, nor does he let him down, nor does he lie to him, nor does he hold him in contempt.'" },
    ]
  },
};

// ── Tafsir entries (greatly expanded) ────────────────────────────────────────
const TAFSIR_COLLECTION = [
  { surah:"Al-Fatiha (The Opening)", ayah:"1:1-7", arabic:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", scholar:"Ibn Kathir", tafsir:"Al-Fatiha is the greatest surah — the 'mother of the Quran.' Ibn Kathir explains that Allah begins with His name to teach us to begin all affairs with Bismillah. 'Al-Hamd' (praise) is more complete than mere thanks — it covers both the qualities of the One being praised and the gifts He bestows. Allah praises Himself first so that we learn how to praise Him. The repetition of 'Ar-Rahman Ar-Rahim' reinforces that His mercy is not a single act but a constant attribute." },
  { surah:"Al-Baqarah — Ayat Al-Kursi", ayah:"2:255", arabic:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", scholar:"Ibn Kathir", tafsir:"The Prophet ﷺ declared this the greatest verse in the Quran. 'Al-Hayy' (the Ever-Living) and 'Al-Qayyum' (the Sustainer of all) are the two supreme names of Allah. That neither slumber nor sleep overtakes Him demolishes any idea of Allah as limited or needful of rest. Ibn Kathir notes that every name mentioned — Al-Ali (the Most High), Al-Azim (the Most Great) — opens a door of understanding about divine sovereignty. Recite it after every prayer and nothing will prevent your entry to Paradise but death." },
  { surah:"Al-Baqarah — The Verse of Debt", ayah:"2:282", arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ", scholar:"Al-Qurtubi", tafsir:"The longest single verse in the Quran demonstrates that Islam regulates commerce and social affairs with as much care as acts of worship. Al-Qurtubi notes that the command to record debts is a mercy — it prevents disputes, protects rights, and maintains trust between people. The repeated emphasis on 'do not cause harm' shows that economic transactions are an arena of worship when conducted with honesty and fairness." },
  { surah:"Al-Imran — Steadfastness", ayah:"3:200", arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ", scholar:"Ibn Kathir", tafsir:"This closing verse of Al-Imran contains four commands that climb in intensity: Isbiru (be patient yourself), Sabiru (outdo your enemy in patience), Rabitu (stand firm at your post), and Attaqu Allah (have taqwa). Ibn Kathir explains that 'Muraba'ta' originally meant stationing yourself at the frontier of Islam; the scholars extended it to mean constant vigilance in worship and guarding the self against sin." },
  { surah:"An-Nisa — Justice", ayah:"4:135", arabic:"يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ", scholar:"As-Sa'di", tafsir:"As-Sa'di explains that 'Qawwamin bil-qist' means to be constant, upright enforcers of justice — not merely fair when it's convenient, but constitutionally committed to it even if the testimony is against yourself, your parents, or your closest kin. This verse redefined justice in the ancient world: no tribe, no lineage, no wealth grants immunity from accountability before Allah." },
  { surah:"Al-An'am — The Straight Path", ayah:"6:153", arabic:"وَأَنَّ هَٰذَا صِرَاطِي مُسْتَقِيمًا فَاتَّبِعُوهُ ۖ وَلَا تَتَّبِعُوا السُّبُلَ", scholar:"Ibn Kathir", tafsir:"The Prophet ﷺ drew a straight line and said 'this is the path of Allah,' then drew lines branching off to the sides and said 'these are the other paths, and on each one is a devil calling to it.' Ibn Kathir explains the singular form 'Siraat' (one path) vs plural 'Subul' (many paths) is deliberate — the truth is one, but the ways to go astray are countless." },
  { surah:"Al-Kahf — The Cave", ayah:"18:1-5", arabic:"الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا", scholar:"Ibn Kathir", tafsir:"Surah Al-Kahf is the Friday surah — its recitation brings light from one Friday to the next. The scholars identify four stories: the youth of the Cave (fitnah of religion), Dhul-Qarnayn (fitnah of power), Musa and Khidr (fitnah of knowledge), and the owner of two gardens (fitnah of wealth). Together they cover every major trial a believer faces, and Surah Al-Kahf is the antidote to each." },
  { surah:"Maryam — The Story of Maryam", ayah:"19:16-21", arabic:"وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ إِذِ انتَبَذَتْ مِنْ أَهْلِهَا مَكَانًا شَرْقِيًّا", scholar:"Ibn Kathir", tafsir:"Maryam (AS) withdrew to a place to the east — scholars say it was the prayer chamber — to devote herself to worship. The Quran emphasises she was a 'siddiqah' (one of the truthful). When the angel came to her and she sought refuge in Allah, the Quran records her exact words — teaching believers that in moments of fear, the first refuge is Allah's name. Her story is the only surah in the Quran named after a woman." },
  { surah:"Ya-Sin — The Heart of the Quran", ayah:"36:1-12", arabic:"يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ", scholar:"Al-Qurtubi", tafsir:"The Prophet ﷺ said: 'Everything has a heart, and the heart of the Quran is Ya-Sin.' Al-Qurtubi explains that it is called the heart because it contains the essential doctrines of Islam — tawhid, prophethood, and resurrection — with an intensity that parallels the heart's role in the body. Reciting it for the dying eases the passage of the soul, and reciting it with sincerity for a need, Allah fulfils that need." },
  { surah:"Ar-Rahman — The Beneficent", ayah:"55:1-13", arabic:"الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ", scholar:"Ibn Kathir", tafsir:"Surah Ar-Rahman opens with Allah's name — not a command, not an address, just the name Ar-Rahman — teaching that His mercy is the starting point of all creation. The refrain 'Fa-bi-ayyi ala'i Rabbikuma tukadhdhibaan' (Which of the favours of your Lord will you deny?) appears 31 times, each time after a different blessing is enumerated. Ibn Kathir notes the jinn who heard this recitation from the Prophet ﷺ responded better than many humans: 'None of Your favours do we deny, O Lord!'" },
  { surah:"Al-Waqi'ah — The Inevitable Event", ayah:"56:1-10", arabic:"إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ", scholar:"As-Sa'di", tafsir:"The Prophet ﷺ said: 'Whoever recites Surah Al-Waqi'ah every night will never be afflicted with poverty.' As-Sa'di explains this surah divides all humanity on the Day of Judgment into three groups — the forerunners (As-Sabiqun), the People of the Right, and the People of the Left — with such precise descriptions of Paradise and Hell that it shakes the heart awake. The surah is a clarion call to compete in righteousness." },
  { surah:"Al-Mulk — The Sovereignty", ayah:"67:1-2", arabic:"تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", scholar:"Ibn Kathir", tafsir:"The Prophet ﷺ said Surah Al-Mulk 'intercedes for its companion until he is forgiven' and called it 'Al-Mani'ah' (the Protector). Ibn Kathir notes the opening word 'Tabaraka' — blessed, exalted, and continuously increasing in greatness — sets the tone: this is a surah about the absolute, unshared sovereignty of Allah. The question 'Do you feel secure from Him who is above the heavens?' is not a threat but an invitation to surrender and find true safety." },
  { surah:"Al-Ikhlas — Sincerity of Faith", ayah:"112:1-4", arabic:"قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", scholar:"Al-Qurtubi", tafsir:"Imam Ash-Shafi'i said: 'If Allah had revealed only this surah, it would be sufficient guidance.' Al-Qurtubi explains 'Ahad' (One, Unique) differs from 'Wahid' (one in number) — Ahad means absolutely singular with no parallel or comparison possible. 'As-Samad' — the Self-Sufficient upon whom all depend — is Allah's most comprehensive name after Allah itself. This surah equals one-third of the Quran because the Quran contains tawhid, commands, and stories — and this surah is pure tawhid." },
  { surah:"Al-Falaq & An-Nas — The Refuge Surahs", ayah:"113-114", arabic:"قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ", scholar:"Ibn Kathir", tafsir:"The Prophet ﷺ said: 'No one seeks refuge with anything like the Mu'awwidhatain (the two refuge surahs).' Ibn Kathir explains that Al-Falaq seeks refuge from external evils (creation, darkness, magic, envy), while An-Nas seeks refuge from the internal enemy — the whisperer who retreats when Allah is remembered and advances when He is forgotten. Together they protect the believer from all harm, seen and unseen. Recite them three times morning and evening." },
];

// ── Daily seed helpers ────────────────────────────────────────────────────────
function getDayNumber() {
  const start = new Date("2024-01-01");
  const now = new Date();
  return Math.floor((now - start) / 86400000);
}
function seededRandom(seed) {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ── QuranPage (enriched) ──────────────────────────────────────────────────────
function QuranPage() {
  const [tab, setTab] = useState("daily");

  // ── Daily Ayah via API ──
  const [dailyAyah, setDailyAyah] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState("");

  // ── Quran Browser ──
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahData, setSurahData] = useState(null);
  const [surahLoading, setSurahLoading] = useState(false);
  const [surahSearch, setSurahSearch] = useState("");

  // ── Hadith ──
  const [hadithBook, setHadithBook] = useState("bukhari");
  const [dailyHadith, setDailyHadith] = useState(null);

  // ── Tafsir ──
  const [tafsirIdx, setTafsirIdx] = useState(0);
  const [aiTafsir, setAiTafsir] = useState("");
  const [aiTafsirLoading, setAiTafsirLoading] = useState(false);

  // ── AI Search ──
  const [searchQuery, setSearchQuery] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const dayNum = getDayNumber();

  // Load daily ayah on mount
  useEffect(() => {
    if (tab === "daily") loadDailyAyah();
  }, [tab]);

  // Pick daily hadith based on date seed
  useEffect(() => {
    const book = HADITH_BOOKS[hadithBook];
    const idx = dayNum % book.hadiths.length;
    setDailyHadith(book.hadiths[idx]);
  }, [hadithBook, dayNum]);

  const loadDailyAyah = async () => {
    setDailyLoading(true); setDailyError("");
    try {
      // Pick a surah + ayah seeded by day
      const surahNum = Math.floor(seededRandom(dayNum) * 114) + 1;
      const surah = SURAHS.find(s => s.n === surahNum);
      const ayahNum = Math.floor(seededRandom(dayNum + 1000) * surah.ayahs) + 1;
      const ref = `${surahNum}:${ayahNum}`;

      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${ref}/ar.alafasy`),
        fetch(`https://api.alquran.cloud/v1/ayah/${ref}/en.sahih`),
      ]);
      const arData = await arRes.json();
      const enData = await enRes.json();

      if (arData.code === 200 && enData.code === 200) {
        setDailyAyah({
          arabic: arData.data.text,
          translation: enData.data.text,
          surah: arData.data.surah.englishName,
          surahAr: arData.data.surah.name,
          ayah: `${surahNum}:${ayahNum}`,
          numberInSurah: ayahNum,
        });
      } else {
        setDailyError("Could not load today's ayah. Please check your connection.");
      }
    } catch {
      setDailyError("Network error loading ayah. Please try again.");
    }
    setDailyLoading(false);
  };

  const loadSurah = async (surah) => {
    setSelectedSurah(surah);
    setSurahData(null); setSurahLoading(true);
    try {
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.n}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/en.sahih`),
      ]);
      const arData = await arRes.json();
      const enData = await enRes.json();
      if (arData.code === 200 && enData.code === 200) {
        const ayahs = arData.data.ayahs.map((a, i) => ({
          number: a.numberInSurah,
          arabic: a.text,
          translation: enData.data.ayahs[i]?.text || "",
        }));
        setSurahData({ ...surah, ayahs });
      }
    } catch {}
    setSurahLoading(false);
  };

  const getAiTafsir = async (entry) => {
    setAiTafsirLoading(true); setAiTafsir("");
    const result = await callClaude(
      `You are an Islamic scholar providing extended tafsir (Quranic commentary).
      Surah: ${entry.surah}, Ayah: ${entry.ayah}
      Arabic: ${entry.arabic}
      Existing tafsir by ${entry.scholar}: ${entry.tafsir}
      
      Expand upon this tafsir with 4-5 additional sentences covering:
      1. Historical context (asbab al-nuzul) if known
      2. Linguistic beauty of the Arabic words
      3. Practical lessons for a Muslim today
      4. Connection to another ayah or hadith
      Be scholarly yet accessible. No bullet points.`
    );
    setAiTafsir(result);
    setAiTafsirLoading(false);
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setAiLoading(true); setAiResult("");
    const result = await callClaude(
      `You are a knowledgeable Islamic scholar. The user asks: "${searchQuery}"
      Provide a warm, scholarly answer drawing from Quran, Hadith, or Tafsir.
      Under 280 words. Include relevant Arabic phrases with translations.
      Use clear paragraph breaks. No markdown headers or bullet points.`
    );
    setAiResult(result);
    setAiLoading(false);
  };

  const filteredSurahs = SURAHS.filter(s =>
    s.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
    s.en.toLowerCase().includes(surahSearch.toLowerCase()) ||
    String(s.n).includes(surahSearch)
  );

  const todayStr = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"2-digit", month:"long" });

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📖 Islamic Library</div>
        <div className="page-desc">Full Quran • Hadith Books • Tafsir • AI Scholar Search</div>
      </div>

      <div style={{display:"flex",overflowX:"auto",gap:6,marginBottom:16,paddingBottom:4,scrollbarWidth:"none"}}>
        {[
          {id:"daily",label:"🌟 Daily Ayah"},
          {id:"quran",label:"📖 Full Quran"},
          {id:"hadith",label:"📜 Hadith Books"},
          {id:"tafsir",label:"🔍 Tafsir"},
          {id:"search",label:"✦ AI Scholar"},
        ].map(t => (
          <button key={t.id} className={`tab-pill ${tab===t.id?"active":""}`}
            style={{whiteSpace:"nowrap",flexShrink:0}} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── DAILY AYAH ── */}
      {tab === "daily" && (
        <div>
          <div className="card" style={{background:"linear-gradient(135deg,var(--emerald),#0f3d27)",marginBottom:16}}>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Ayah of the Day</div>
            <div style={{color:"var(--gold-light)",fontSize:13,fontStyle:"italic"}}>{todayStr}</div>
          </div>

          {dailyLoading && (
            <div className="kind-words-box">
              <div className="ai-loading"><div className="dots"><span/><span/><span/></div>Loading today's ayah from the Quran...</div>
            </div>
          )}
          {dailyError && (
            <div className="card" style={{borderColor:"var(--red-sin)",background:"var(--red-pale)"}}>
              <div style={{color:"var(--red-sin)",fontSize:13}}>{dailyError}</div>
              <button className="btn-primary" style={{marginTop:10}} onClick={loadDailyAyah}>Retry</button>
            </div>
          )}
          {dailyAyah && !dailyLoading && (
            <div className="quran-card" style={{background:"linear-gradient(160deg,var(--parchment),var(--gold-pale))"}}>
              <div className="quran-ref" style={{fontSize:13}}>Surah {dailyAyah.surah} • {dailyAyah.ayah}</div>
              <div style={{fontFamily:"'Amiri',serif",fontSize:12,color:"var(--gold)",marginBottom:10,textAlign:"right",direction:"rtl"}}>{dailyAyah.surahAr}</div>
              <div className="arabic-text" style={{fontSize:22,lineHeight:2}}>{dailyAyah.arabic}</div>
              <div className="translation-text" style={{fontSize:15,marginTop:10}}>"{dailyAyah.translation}"</div>
              <button className="btn-gold" style={{marginTop:14,fontSize:12}} onClick={loadDailyAyah}>🔄 New Random Ayah</button>
            </div>
          )}

          {/* Daily Hadith of day */}
          <div className="section-title" style={{marginTop:24}}>Hadith of the Day</div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {Object.keys(HADITH_BOOKS).map(k => (
              <button key={k} className={`tab-pill ${hadithBook===k?"active":""}`}
                style={{fontSize:11,padding:"5px 12px"}} onClick={() => setHadithBook(k)}>
                {HADITH_BOOKS[k].short}
              </button>
            ))}
          </div>
          {dailyHadith && (
            <div className="quran-card">
              <div className="hadith-narrator">{dailyHadith.narrator}</div>
              <div className="hadith-source" style={{marginBottom:10}}>{HADITH_BOOKS[hadithBook].name}</div>
              <div className="hadith-text">"{dailyHadith.text}"</div>
            </div>
          )}
        </div>
      )}

      {/* ── FULL QURAN BROWSER ── */}
      {tab === "quran" && (
        <div>
          {!selectedSurah ? (
            <div>
              <input
                className="journal-textarea"
                style={{minHeight:"auto",padding:"10px 14px",marginBottom:14,fontSize:13}}
                placeholder="Search surah by name or number..."
                value={surahSearch}
                onChange={e => setSurahSearch(e.target.value)}
              />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {filteredSurahs.map(s => (
                  <div key={s.n} className="card" style={{cursor:"pointer",padding:"12px 14px",marginBottom:0}}
                    onClick={() => loadSurah(s)}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"var(--emerald)",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{s.n}</div>
                      <div style={{fontFamily:"'Amiri',serif",fontSize:14,color:"var(--gold)",textAlign:"right"}}>{s.name}</div>
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--ink)",marginTop:6}}>{s.en}</div>
                    <div style={{fontSize:10,color:"var(--ink-light)"}}>{s.ayahs} ayahs</div>
                  </div>
                ))}
              </div>
            </div>
          ) : surahLoading ? (
            <div className="kind-words-box">
              <div className="ai-loading"><div className="dots"><span/><span/><span/></div>Loading Surah {selectedSurah.name}...</div>
            </div>
          ) : surahData ? (
            <div>
              <button className="btn-sm" onClick={() => { setSelectedSurah(null); setSurahData(null); }} style={{marginBottom:14}}>← All Surahs</button>
              <div className="quran-card" style={{background:"linear-gradient(135deg,var(--emerald),#0f3d27)",marginBottom:16}}>
                <div style={{color:"rgba(255,255,255,.7)",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Surah {selectedSurah.n}</div>
                <div style={{color:"white",fontFamily:"'Cinzel Decorative',serif",fontSize:18,margin:"6px 0"}}>{selectedSurah.name}</div>
                <div style={{color:"var(--gold-light)",fontSize:13,fontStyle:"italic"}}>{selectedSurah.en} • {selectedSurah.ayahs} Ayahs</div>
              </div>
              {surahData.ayahs.map(a => (
                <div key={a.number} className="quran-card" style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:"var(--gold-pale)",border:"1px solid var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--gold)"}}>{a.number}</div>
                    <div style={{fontFamily:"'Amiri',serif",fontSize:10,color:"var(--ink-light)"}}>آية {a.number}</div>
                  </div>
                  <div className="arabic-text" style={{fontSize:19,lineHeight:2}}>{a.arabic}</div>
                  <div className="translation-text" style={{marginTop:8,fontSize:13}}>{a.translation}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* ── HADITH BOOKS ── */}
      {tab === "hadith" && (
        <div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {Object.keys(HADITH_BOOKS).map(k => (
              <button key={k} className={`tab-pill ${hadithBook===k?"active":""}`}
                style={{fontSize:11}} onClick={() => setHadithBook(k)}>
                {HADITH_BOOKS[k].short}
              </button>
            ))}
          </div>
          <div className="card" style={{background:"var(--emerald-muted)",border:"1px solid rgba(26,92,58,.2)",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--emerald)"}}>{HADITH_BOOKS[hadithBook].name}</div>
            <div style={{fontSize:11,color:"var(--ink-muted)",marginTop:4,fontStyle:"italic"}}>
              ★ Today's highlighted hadith: #{(dayNum % HADITH_BOOKS[hadithBook].hadiths.length) + 1}
            </div>
          </div>
          {HADITH_BOOKS[hadithBook].hadiths.map((h, i) => (
            <div key={h.id} className="quran-card" style={{marginBottom:10,borderLeft: i === dayNum % HADITH_BOOKS[hadithBook].hadiths.length ? "4px solid var(--gold)" : "none"}}>
              {i === dayNum % HADITH_BOOKS[hadithBook].hadiths.length && (
                <div style={{fontSize:10,color:"var(--gold)",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>★ Today's Hadith</div>
              )}
              <div className="hadith-narrator">{h.narrator}</div>
              <div className="hadith-source" style={{marginBottom:10}}>{HADITH_BOOKS[hadithBook].name}</div>
              <div className="hadith-text">"{h.text}"</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAFSIR ── */}
      {tab === "tafsir" && (
        <div>
          <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}}>
            {TAFSIR_COLLECTION.map((t, i) => (
              <button key={i} onClick={() => { setTafsirIdx(i); setAiTafsir(""); }}
                className={`tab-pill ${tafsirIdx===i?"active":""}`}
                style={{whiteSpace:"nowrap",flexShrink:0,fontSize:11}}>
                {t.ayah}
              </button>
            ))}
          </div>

          {(() => {
            const t = TAFSIR_COLLECTION[tafsirIdx];
            return (
              <div>
                <div className="quran-card" style={{marginBottom:12}}>
                  <div className="tafsir-surah">{t.surah}</div>
                  <div style={{fontSize:11,color:"var(--gold)",marginBottom:10}}>Ayah {t.ayah} • Scholar: {t.scholar}</div>
                  <div className="arabic-text" style={{fontSize:18,lineHeight:2}}>{t.arabic}</div>
                  <div className="tafsir-text">{t.tafsir}</div>
                </div>

                <button className="btn-gold" onClick={() => getAiTafsir(t)} disabled={aiTafsirLoading} style={{width:"100%",marginBottom:12}}>
                  {aiTafsirLoading ? "Expanding commentary..." : "✦ Expand with AI Tafsir"}
                </button>

                {aiTafsirLoading && (
                  <div className="kind-words-box">
                    <div className="ai-loading"><div className="dots"><span/><span/><span/></div>Consulting deeper scholarship...</div>
                  </div>
                )}
                {aiTafsir && (
                  <div className="kind-words-box">
                    <div className="kind-words-label">✦ Extended Tafsir</div>
                    <div style={{fontSize:14,lineHeight:1.9,color:"var(--ink)",whiteSpace:"pre-wrap"}}>{aiTafsir}</div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── AI SEARCH ── */}
      {tab === "search" && (
        <div>
          <div className="card">
            <div style={{fontSize:13,color:"var(--emerald)",fontWeight:700,marginBottom:6}}>✦ Ask the Scholar</div>
            <div style={{fontSize:12,color:"var(--ink-muted)",marginBottom:12,fontStyle:"italic"}}>Ask any question — prayer, fasting, dua, rulings, relationships, or the meaning of a verse.</div>
            <textarea
              className="journal-textarea"
              style={{minHeight:90,marginBottom:10}}
              placeholder="e.g. What is the meaning of Surah Ad-Duha? What does Islam say about grief? What is the ruling on..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAISearch(); }}}
            />
            <button className="btn-primary" onClick={handleAISearch} disabled={aiLoading || !searchQuery.trim()}>
              {aiLoading ? "Consulting knowledge..." : "Ask Question"}
            </button>
          </div>
          {aiLoading && (
            <div className="kind-words-box" style={{marginTop:12}}>
              <div className="ai-loading"><div className="dots"><span/><span/><span/></div>Searching Islamic knowledge...</div>
            </div>
          )}
          {aiResult && (
            <div className="kind-words-box" style={{marginTop:12}}>
              <div className="kind-words-label">✦ Scholar's Response</div>
              <div style={{fontSize:14,lineHeight:1.9,color:"var(--ink)",whiteSpace:"pre-wrap"}}>{aiResult}</div>
            </div>
          )}

          <div className="section-title" style={{marginTop:20}}>Suggested Questions</div>
          {[
            "What is the meaning of Surah Ad-Duha?",
            "What does Islam say about anxiety and depression?",
            "How do I make a proper tawbah?",
            "What are the virtues of the last 10 nights of Ramadan?",
            "What is the significance of Surah Al-Kahf on Friday?",
            "What dua should I say when I feel overwhelmed?",
          ].map(q => (
            <div key={q} className="card" style={{cursor:"pointer",padding:"10px 14px",marginBottom:8}}
              onClick={() => { setSearchQuery(q); }}>
              <div style={{fontSize:13,color:"var(--emerald)"}}>→ {q}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeelingPage() {
  const [feeling, setFeeling] = useState(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const feelings = [
    { key: "happy", label: "Happy", emoji: "🌟" },
    { key: "sad", label: "Sad", emoji: "🌧" },
    { key: "anxious", label: "Anxious", emoji: "🌊" },
    { key: "grateful", label: "Grateful", emoji: "🤲" },
    { key: "guilty", label: "Guilty", emoji: "💭" },
    { key: "peaceful", label: "Peaceful", emoji: "🕊" },
    { key: "empty", label: "Empty", emoji: "🌫" },
    { key: "distressed", label: "Distressed", emoji: "🌪" },
    { key: "urge", label: "Urge to Sin", emoji: "⚡" },
  ];

  const selectFeeling = async (f) => {
    setFeeling(f);
    setWordIdx(0);
    setAiMsg(""); setAiLoading(true);
    const urgentNote = f.key === "urge"
      ? "This is an URGENT spiritual crisis moment. Be immediate, practical, and powerful. Give them specific actions to take RIGHT NOW (make wudu, change location, say this dua). Be a compassionate but urgent spiritual first responder."
      : "Write a deeply personal, comforting message from an Islamic perspective. Include a relevant Quranic reference or Hadith naturally woven into your message. Be warm, not preachy. About 3-4 sentences.";
    const result = await callClaude(
      `You are a gentle, warm Islamic spiritual companion. The user is feeling "${f.label}".
      ${urgentNote}
      In English only. No bullet points.`
    );
    setAiMsg(result);
    setAiLoading(false);
  };

  const words = feeling ? KIND_WORDS[feeling.key] || [] : [];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🌸 Kind Words</div>
        <div className="page-desc">How are you feeling today? Let Islam speak to your heart.</div>
      </div>

      <div className="feeling-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {feelings.map(f => (
          <button
            key={f.key}
            className={`feeling-btn ${feeling?.key === f.key ? "active" : ""}`}
            style={f.key === "urge" ? {borderColor: feeling?.key === "urge" ? "var(--red-sin)" : "rgba(139,42,42,0.3)", background: feeling?.key === "urge" ? "#fff0f0" : "var(--parchment)", color: "var(--red-sin)"} : {}}
            onClick={() => selectFeeling(f)}
          >
            <span className="feeling-emoji">{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {feeling && feeling.key === "urge" && (
        <div style={{background:"linear-gradient(135deg,#5c1a1a,#8b2a2a)",borderRadius:"var(--radius)",padding:"16px 18px",marginBottom:14,color:"white",animation:"fadeIn 0.3s ease"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>⚡ Stop. Do these NOW:</div>
          <div style={{fontSize:13,lineHeight:1.8,opacity:.92}}>
            1. Say: <span style={{fontFamily:"'Amiri',serif",fontSize:16}}>أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</span><br/>
            2. Make wudu immediately<br/>
            3. Change where you are — physically move<br/>
            4. Call or text a trusted person<br/>
            5. Pray two rak'ahs of nafl
          </div>
        </div>
      )}

      {feeling && (
        <>
          <div className="kind-words-box">
            <div className="kind-words-label">✦ For when you feel {feeling.label}</div>
            <div className="kind-words-text">{words[wordIdx]}</div>
            <div className="kind-words-nav">
              <button className="kind-words-nav-btn" onClick={() => setWordIdx(i => (i - 1 + words.length) % words.length)}>‹</button>
              <button className="kind-words-nav-btn" onClick={() => setWordIdx(i => (i + 1) % words.length)}>›</button>
            </div>
          </div>

          <div style={{marginTop:14}}>
            {aiLoading && (
              <div className="card">
                <div className="ai-loading">
                  <div className="dots"><span/><span/><span/></div>
                  Writing a personal message for you...
                </div>
              </div>
            )}
            {aiMsg && (
              <div className="kind-words-box">
                <div className="kind-words-label">✦ A Personal Word from Your Companion</div>
                <div className="kind-words-text">{aiMsg}</div>
              </div>
            )}
          </div>
        </>
      )}

      {!feeling && (
        <div className="empty-state">
          Select how you feel above to receive<br/>words of comfort and guidance.
        </div>
      )}

      <div className="ornament" style={{marginTop:24}}>❧ ✦ ❧</div>
      <div className="card" style={{background:"var(--emerald-muted)",border:"1px solid rgba(26,92,58,0.2)"}}>
        <div className="arabic-text" style={{fontSize:16}}>"وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ"</div>
        <div style={{fontSize:13,color:"var(--emerald)",fontStyle:"italic",textAlign:"center"}}>
          "And He is with you wherever you are." (57:4)
        </div>
      </div>
    </div>
  );
}

function JournalPage() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("islamic-journal") || "[]"); } catch { return []; }
  });
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const moods = ["😊 Grateful", "😔 Sad", "😰 Anxious", "😌 Peaceful", "😤 Frustrated", "🤲 Hopeful"];

  const save = () => {
    if (!text.trim()) return;
    const entry = { id: Date.now(), text, mood, ts: Date.now() };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("islamic-journal", JSON.stringify(updated));
    setText(""); setMood(""); setAiReflection("");
  };

  const del = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("islamic-journal", JSON.stringify(updated));
  };

  const getReflection = async () => {
    if (!text.trim()) return;
    setAiLoading(true); setAiReflection("");
    const result = await callClaude(
      `You are a gentle Islamic spiritual counselor reading someone's personal journal entry.
      Journal entry: "${text}"
      Current mood: "${mood || "unspecified"}"
      
      Write a warm, short spiritual reflection (3-4 sentences) that:
      - Acknowledges their feelings with empathy
      - Offers a gentle Islamic perspective or reminder
      - Suggests one small actionable Islamic practice (like a dua, dhikr, or reflection)
      Be like a kind older Muslim mentor speaking warmly. No bullet points.`
    );
    setAiReflection(result);
    setAiLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📝 Personal Journal</div>
        <div className="page-desc">Your private space to reflect, feel, and grow in your faith.</div>
      </div>

      <div className="card">
        <div style={{fontSize:13,fontWeight:600,color:"var(--emerald)",marginBottom:10}}>New Entry</div>
        <div style={{marginBottom:10,display:"flex",flexWrap:"wrap",gap:6}}>
          {moods.map(m => (
            <button
              key={m}
              className={`tab-pill ${mood === m ? "active" : ""}`}
              style={{fontSize:11,padding:"5px 12px"}}
              onClick={() => setMood(m)}
            >{m}</button>
          ))}
        </div>
        <textarea
          className="journal-textarea"
          placeholder="بِسْمِ اللَّهِ — Begin in the name of Allah…&#10;&#10;Write freely. This is your space. What's on your heart today?"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
          <button className="btn-primary" onClick={save}>Save Entry</button>
          <button className="btn-gold" onClick={getReflection} disabled={aiLoading || !text.trim()}>
            {aiLoading ? "Reflecting..." : "✦ Get Reflection"}
          </button>
        </div>
      </div>

      {aiLoading && (
        <div className="kind-words-box">
          <div className="ai-loading">
            <div className="dots"><span/><span/><span/></div>
            Reading your heart...
          </div>
        </div>
      )}
      {aiReflection && (
        <div className="kind-words-box">
          <div className="kind-words-label">✦ Spiritual Reflection</div>
          <div className="kind-words-text">{aiReflection}</div>
        </div>
      )}

      {entries.length > 0 && (
        <>
          <div className="section-title">Previous Entries</div>
          {entries.map(e => (
            <div key={e.id} className="journal-entry">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div className="journal-date">{formatDate(e.ts)}</div>
                  {e.mood && <div className="journal-mood">{e.mood}</div>}
                </div>
                <button className="btn-sm del" onClick={() => del(e.id)}>✕</button>
              </div>
              <div className="journal-content">{e.text}</div>
            </div>
          ))}
        </>
      )}

      {entries.length === 0 && (
        <div className="empty-state">
          Your journal is empty.<br/>Begin your first reflection above.
        </div>
      )}
    </div>
  );
}

function DailyReviewPage() {
  const [answers, setAnswers] = useState({});
  const [aiReview, setAiReview] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const questions = [
    { id: "prayers", label: "How many of the 5 daily prayers did you complete?", type: "select", options: ["All 5 ✓", "4", "3", "2", "1", "None"] },
    { id: "quran", label: "Did you read or listen to Quran today?", type: "select", options: ["Yes — multiple pages", "Yes — a few verses", "No, but I made dhikr", "No"] },
    { id: "dhikr", label: "Did you make dhikr today?", type: "select", options: ["Yes — consistently", "Yes — a little", "Barely", "No"] },
    { id: "charity", label: "Did you do any act of charity or kindness?", type: "select", options: ["Yes — financial sadaqah", "Yes — a kind act", "Yes — both", "No"] },
    { id: "sin_avoided", label: "Did you successfully avoid a sin you normally struggle with?", type: "select", options: ["Yes, alhamdulillah", "Somewhat", "I struggled but repented", "No"] },
    { id: "highlight", label: "What was the best moment of your day spiritually?", type: "text", placeholder: "e.g. A moment of calm in salah, helping someone..." },
    { id: "regret", label: "Is there anything you regret from today?", type: "text", placeholder: "e.g. I lost my temper, I missed Fajr..." },
    { id: "tomorrow", label: "One thing you will do better tomorrow?", type: "text", placeholder: "e.g. Pray Fajr on time, lower my gaze..." },
  ];

  const set = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  const getAIReview = async () => {
    setAiLoading(true); setAiReview("");
    const summary = questions.map(q => `${q.label}: ${answers[q.id] || "not answered"}`).join("\n");
    const result = await callClaude(
      `You are a warm Islamic spiritual mentor doing a gentle end-of-day review with a Muslim.
      Here is their daily review:
      ${summary}
      
      Write a personal, encouraging end-of-day reflection (5-6 sentences) that:
      - Acknowledges their efforts with genuine warmth
      - Highlights what they did well spiritually
      - Gently addresses any regrets with hope and tawbah
      - Gives them one specific piece of guidance for tomorrow
      - Ends with a short dua or Quranic reminder
      Be like a wise, loving elder. No bullet points. No harsh judgment.`
    );
    setAiReview(result);
    setAiLoading(false);
    setSaved(true);
  };

  const todayStr = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🌙 Daily Review</div>
        <div className="page-desc">End your day with reflection — the believer accounts for themselves before they are held to account.</div>
      </div>

      <div className="card" style={{background:"linear-gradient(135deg,var(--emerald),#0f3d27)",marginBottom:20}}>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Today</div>
        <div style={{color:"white",fontSize:16,fontFamily:"'Cinzel Decorative',serif",marginTop:4}}>{todayStr}</div>
        <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontStyle:"italic",marginTop:6}}>
          "The Prophet ﷺ would review his day and increase in istighfar at night." — a practice of the righteous.
        </div>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} className="card" style={{marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:600,color:"var(--emerald)",marginBottom:10,lineHeight:1.5}}>
            <span style={{color:"var(--gold)",marginRight:6}}>{i+1}.</span>{q.label}
          </div>
          {q.type === "select" ? (
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {q.options.map(opt => (
                <button
                  key={opt}
                  className={`tab-pill ${answers[q.id] === opt ? "active" : ""}`}
                  style={{fontSize:11,padding:"6px 12px"}}
                  onClick={() => set(q.id, opt)}
                >{opt}</button>
              ))}
            </div>
          ) : (
            <textarea
              className="journal-textarea"
              style={{minHeight:70,fontSize:13}}
              placeholder={q.placeholder}
              value={answers[q.id] || ""}
              onChange={e => set(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <div style={{textAlign:"center",marginTop:6,marginBottom:20}}>
        <button className="btn-primary" onClick={getAIReview} disabled={aiLoading} style={{padding:"13px 32px",fontSize:14}}>
          {aiLoading ? "Reflecting on your day..." : "✦ Get My Daily Reflection"}
        </button>
      </div>

      {aiLoading && (
        <div className="kind-words-box">
          <div className="ai-loading"><div className="dots"><span/><span/><span/></div>Reviewing your day with care...</div>
        </div>
      )}

      {aiReview && (
        <div className="kind-words-box" style={{marginBottom:20}}>
          <div className="kind-words-label">✦ Your Personal Reflection</div>
          <div className="kind-words-text" style={{color:"var(--ink)",fontSize:14,whiteSpace:"pre-wrap"}}>{aiReview}</div>
        </div>
      )}

      {saved && (
        <div style={{textAlign:"center",fontSize:12,color:"var(--emerald)",fontStyle:"italic",marginBottom:20}}>
          ✓ May Allah accept your reflection and forgive your shortcomings.
        </div>
      )}

      <div className="card" style={{background:"var(--emerald-muted)",border:"1px solid rgba(26,92,58,0.2)"}}>
        <div className="arabic-text" style={{fontSize:16}}>"حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا"</div>
        <div style={{fontSize:13,color:"var(--emerald)",fontStyle:"italic",textAlign:"center",marginTop:4}}>
          "Hold yourselves accountable before you are held accountable." — Umar ibn al-Khattab (RA)
        </div>
      </div>

      <div className="ornament" style={{marginTop:16}}>❧ ✦ ❧</div>
    </div>
  );
}

// ── App Shell ────────────────────────────────────────────────────────────────

const PAGES = [
  { id: "deeds", label: "✦ Deeds", component: DeedsPage },
  { id: "sins", label: "⚠ Sins", component: SinsPage },
  { id: "tawbah", label: "🕋 Tawbah", component: TawbahPage },
  { id: "tracker", label: "📅 Tracker", component: DailyTrackerPage },
  { id: "overview", label: "📊 Overview", component: OverviewPage },
  { id: "library", label: "📖 Library", component: QuranPage },
  { id: "feelings", label: "🌸 Feelings", component: FeelingPage },
  { id: "review", label: "🌙 Review", component: DailyReviewPage },
  { id: "journal", label: "📝 Journal", component: JournalPage },
  { id: "backup", label: "💾 Backup", component: BackupPage },
  { id: "disclaimer", label: "📜 Disclaimer", component: DisclaimerPage },
];

// ── Daily Tracker Page ─────────────────────────────────────────────────────────

function DailyTrackerPage() {
  const [trackerData, setTrackerData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("islamic-daily-tracker") || "{}");
    } catch {
      return {};
    }
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  // Save current day's deeds and sins
  const [deedsChecked, setDeedsChecked] = useState({});
  const [majorChecked, setMajorChecked] = useState({});
  const [minorChecked, setMinorChecked] = useState({});

  // Load today's data when date changes
  useEffect(() => {
    const dayData = trackerData[selectedDate] || {};
    setDeedsChecked(dayData.deeds || {});
    setMajorChecked(dayData.majorSins || {});
    setMinorChecked(dayData.minorSins || {});
  }, [selectedDate, trackerData]);

  const toggleDeed = (id) => {
    setDeedsChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMajorSin = (id) => {
    setMajorChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMinorSin = (id) => {
    setMinorChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveToday = () => {
    const updated = {
      ...trackerData,
      [selectedDate]: {
        deeds: deedsChecked,
        majorSins: majorChecked,
        minorSins: minorChecked,
        savedAt: new Date().toISOString()
      }
    };
    setTrackerData(updated);
    localStorage.setItem("islamic-daily-tracker", JSON.stringify(updated));
    alert(`✓ Saved records for ${selectedDate}`);
  };

  const getStats = () => {
    const deedsCount = Object.values(deedsChecked).filter(Boolean).length;
    const majorCount = Object.values(majorChecked).filter(Boolean).length;
    const minorCount = Object.values(minorChecked).filter(Boolean).length;
    return { deedsCount, majorCount, minorCount, total: deedsCount + majorCount + minorCount };
  };

  const stats = getStats();

  // Get last 7 days for quick navigation
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  };

  const dateOptions = getLast7Days();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📅 Daily Tracker</div>
        <div className="page-desc">Track your good deeds and sins day by day — see your spiritual journey over time.</div>
      </div>

      {/* Date selector */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--emerald), #0f3d27)", marginBottom: 16 }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Select Date</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select 
            className="select-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ background: "white", padding: "8px 12px", flex: 1 }}
          >
            {dateOptions.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
            <option value={selectedDate} disabled>──────────</option>
            <option value={new Date().toISOString().split('T')[0]}>Today</option>
          </select>
          <input 
            type="date" 
            className="select-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ background: "white", padding: "8px 12px" }}
          />
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-gold" onClick={saveToday} style={{ fontSize: 12, padding: "8px 16px" }}>
            💾 Save This Day
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="deeds-banner" style={{ marginBottom: 16, background: "linear-gradient(135deg, var(--emerald), #2a7a50)" }}>
        <div>
          <div className="deeds-banner-count">{stats.total}<span style={{ fontSize: 14, fontWeight: 400 }}>/{GOOD_DEEDS.length + MAJOR_SINS.length + MINOR_SINS.length}</span></div>
          <div className="deeds-banner-label">Total tracked items</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>✨ {stats.deedsCount} deeds</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>⚠ {stats.majorCount + stats.minorCount} sins</div>
        </div>
      </div>

      {/* Good Deeds Section */}
      <div className="section-title">✦ Good Deeds {stats.deedsCount > 0 && <span style={{ fontSize: 11, background: "var(--emerald)", color: "white", padding: "2px 8px", borderRadius: 20 }}>{stats.deedsCount}/{GOOD_DEEDS.length}</span>}</div>
      {GOOD_DEEDS.slice(0, 8).map(d => (
        <div key={d.id} className={`deed-item ${deedsChecked[d.id] ? "checked" : ""}`} onClick={() => toggleDeed(d.id)}>
          <div className="deed-check">{deedsChecked[d.id] ? "✓" : ""}</div>
          <div>
            <div className="deed-text">{d.deed}</div>
            <div className="deed-reward">✦ {d.reward}</div>
          </div>
        </div>
      ))}
      {GOOD_DEEDS.length > 8 && (
        <details className="card" style={{ cursor: "pointer" }}>
          <summary style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, padding: "8px 0" }}>Show remaining {GOOD_DEEDS.length - 8} deeds ↓</summary>
          {GOOD_DEEDS.slice(8).map(d => (
            <div key={d.id} className={`deed-item ${deedsChecked[d.id] ? "checked" : ""}`} onClick={() => toggleDeed(d.id)} style={{ marginBottom: 6 }}>
              <div className="deed-check">{deedsChecked[d.id] ? "✓" : ""}</div>
              <div>
                <div className="deed-text">{d.deed}</div>
                <div className="deed-reward">✦ {d.reward}</div>
              </div>
            </div>
          ))}
        </details>
      )}

      {/* Major Sins Section */}
      <div className="section-title">⚠ Major Sins {Object.values(majorChecked).filter(Boolean).length > 0 && <span style={{ fontSize: 11, background: "var(--red-sin)", color: "white", padding: "2px 8px", borderRadius: 20 }}>{Object.values(majorChecked).filter(Boolean).length}/{MAJOR_SINS.length}</span>}</div>
      {MAJOR_SINS.slice(0, 6).map(s => (
        <div
          key={s.id}
          className={`deed-item ${majorChecked[s.id] ? "checked" : ""}`}
          style={{ borderLeft: majorChecked[s.id] ? "4px solid var(--red-sin)" : "4px solid transparent", background: majorChecked[s.id] ? "#fff0f0" : "var(--parchment)", borderRadius: 10 }}
          onClick={() => toggleMajorSin(s.id)}
        >
          <div className="deed-check" style={majorChecked[s.id] ? { background: "var(--red-sin)", borderColor: "var(--red-sin)", color: "white" } : { borderColor: "#d4a0a0" }}>
            {majorChecked[s.id] ? "✓" : ""}
          </div>
          <div>
            <div className="deed-text">{s.sin}</div>
            <div className="deed-reward" style={{ color: "var(--red-sin)" }}>📖 {s.note}</div>
          </div>
        </div>
      ))}
      {MAJOR_SINS.length > 6 && (
        <details className="card" style={{ cursor: "pointer" }}>
          <summary style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, padding: "8px 0" }}>Show remaining {MAJOR_SINS.length - 6} major sins ↓</summary>
          {MAJOR_SINS.slice(6).map(s => (
            <div key={s.id} className={`deed-item ${majorChecked[s.id] ? "checked" : ""}`} style={{ borderLeft: majorChecked[s.id] ? "4px solid var(--red-sin)" : "4px solid transparent", background: majorChecked[s.id] ? "#fff0f0" : "var(--parchment)", borderRadius: 10, marginBottom: 6 }} onClick={() => toggleMajorSin(s.id)}>
              <div className="deed-check" style={majorChecked[s.id] ? { background: "var(--red-sin)", borderColor: "var(--red-sin)", color: "white" } : { borderColor: "#d4a0a0" }}>
                {majorChecked[s.id] ? "✓" : ""}
              </div>
              <div>
                <div className="deed-text">{s.sin}</div>
                <div className="deed-reward" style={{ color: "var(--red-sin)" }}>📖 {s.note}</div>
              </div>
            </div>
          ))}
        </details>
      )}

      {/* Minor Sins Section */}
      <div className="section-title">📖 Minor Sins {Object.values(minorChecked).filter(Boolean).length > 0 && <span style={{ fontSize: 11, background: "#b8851e", color: "white", padding: "2px 8px", borderRadius: 20 }}>{Object.values(minorChecked).filter(Boolean).length}/{MINOR_SINS.length}</span>}</div>
      {MINOR_SINS.slice(0, 6).map(s => (
        <div
          key={s.id}
          className={`deed-item ${minorChecked[s.id] ? "checked" : ""}`}
          style={{ borderLeft: minorChecked[s.id] ? "4px solid var(--gold)" : "4px solid transparent", background: minorChecked[s.id] ? "#fffbec" : "var(--parchment)", borderRadius: 10 }}
          onClick={() => toggleMinorSin(s.id)}
        >
          <div className="deed-check" style={minorChecked[s.id] ? { background: "var(--gold)", borderColor: "var(--gold)", color: "white" } : { borderColor: "#c9b070" }}>
            {minorChecked[s.id] ? "✓" : ""}
          </div>
          <div>
            <div className="deed-text">{s.sin}</div>
            <div className="deed-reward" style={{ color: "#8a6a10" }}>📖 {s.note}</div>
          </div>
        </div>
      ))}
      {MINOR_SINS.length > 6 && (
        <details className="card" style={{ cursor: "pointer" }}>
          <summary style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, padding: "8px 0" }}>Show remaining {MINOR_SINS.length - 6} minor sins ↓</summary>
          {MINOR_SINS.slice(6).map(s => (
            <div key={s.id} className={`deed-item ${minorChecked[s.id] ? "checked" : ""}`} style={{ borderLeft: minorChecked[s.id] ? "4px solid var(--gold)" : "4px solid transparent", background: minorChecked[s.id] ? "#fffbec" : "var(--parchment)", borderRadius: 10, marginBottom: 6 }} onClick={() => toggleMinorSin(s.id)}>
              <div className="deed-check" style={minorChecked[s.id] ? { background: "var(--gold)", borderColor: "var(--gold)", color: "white" } : { borderColor: "#c9b070" }}>
                {minorChecked[s.id] ? "✓" : ""}
              </div>
              <div>
                <div className="deed-text">{s.sin}</div>
                <div className="deed-reward" style={{ color: "#8a6a10" }}>📖 {s.note}</div>
              </div>
            </div>
          ))}
        </details>
      )}

      {/* Past Records Summary */}
      <div className="section-title" style={{ marginTop: 24 }}>📊 Past Records</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {dateOptions.slice().reverse().map(date => {
          const data = trackerData[date];
          const deedsCount = data ? Object.values(data.deeds || {}).filter(Boolean).length : 0;
          const sinsCount = data ? (Object.values(data.majorSins || {}).filter(Boolean).length + Object.values(data.minorSins || {}).filter(Boolean).length) : 0;
          const isToday = date === new Date().toISOString().split('T')[0];
          
          return (
            <div 
              key={date} 
              className="card" 
              style={{ 
                cursor: "pointer",
                borderLeft: selectedDate === date ? "4px solid var(--gold)" : "1px solid var(--border)",
                background: selectedDate === date ? "var(--gold-pale)" : "var(--parchment)"
              }}
              onClick={() => setSelectedDate(date)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--emerald)" }}>{formatDate(date)}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-light)" }}>{date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {data ? (
                    <>
                      <div style={{ color: "var(--emerald)", fontSize: 13, fontWeight: 600 }}>✨ {deedsCount} deeds</div>
                      <div style={{ color: "var(--red-sin)", fontSize: 11 }}>⚠ {sinsCount} sins</div>
                    </>
                  ) : (
                    <div style={{ color: "var(--ink-light)", fontSize: 11, fontStyle: "italic" }}>No record saved</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ornament" style={{ marginTop: 20 }}>❧ ✦ ❧</div>
      <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink-light)", fontStyle: "italic" }}>
        Save your daily progress to track your spiritual journey over time.
      </div>
    </div>
  );
}

// ── Overview Page (Past Records) ─────────────────────────────────────────────

function OverviewPage() {
  const [trackerData, setTrackerData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("islamic-daily-tracker") || "{}");
    } catch {
      return {};
    }
  });

  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  };

  const getSortedDates = () => {
    return Object.keys(trackerData).sort().reverse();
  };

  const calculateStats = (data) => {
    if (!data) return { deedsCount: 0, majorSinsCount: 0, minorSinsCount: 0, totalDeeds: GOOD_DEEDS.length, totalSins: MAJOR_SINS.length + MINOR_SINS.length };
    
    const deedsCount = Object.values(data.deeds || {}).filter(Boolean).length;
    const majorSinsCount = Object.values(data.majorSins || {}).filter(Boolean).length;
    const minorSinsCount = Object.values(data.minorSins || {}).filter(Boolean).length;
    
    return { deedsCount, majorSinsCount, minorSinsCount, totalDeeds: GOOD_DEEDS.length, totalSins: MAJOR_SINS.length + MINOR_SINS.length };
  };

  const getDeedNames = (data) => {
    if (!data || !data.deeds) return [];
    return GOOD_DEEDS.filter(d => data.deeds[d.id]).map(d => d.deed);
  };

  const getSinNames = (data) => {
    if (!data) return [];
    const major = MAJOR_SINS.filter(s => data.majorSins?.[s.id]).map(s => ({ name: s.sin, type: "Major" }));
    const minor = MINOR_SINS.filter(s => data.minorSins?.[s.id]).map(s => ({ name: s.sin, type: "Minor" }));
    return [...major, ...minor];
  };

  const sortedDates = getSortedDates();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📊 Overview & Past Records</div>
        <div className="page-desc">View your spiritual journey over time — all saved records of good deeds and sins.</div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="empty-state">
          No records saved yet.<br/>
          Go to the Deeds or Sins page and click "Save Today's Record" to start tracking.
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div className="card" style={{ background: "linear-gradient(135deg, var(--emerald), #0f3d27)", color: "white", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{sortedDates.length}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Days Tracked</div>
            </div>
            <div className="card" style={{ background: "linear-gradient(135deg, var(--gold), #b8851e)", color: "white", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                {Object.values(trackerData).reduce((sum, day) => sum + Object.values(day.deeds || {}).filter(Boolean).length, 0)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Total Good Deeds</div>
            </div>
          </div>

          {/* Records by Date */}
          {sortedDates.map(date => {
            const data = trackerData[date];
            const stats = calculateStats(data);
            const deeds = getDeedNames(data);
            const sins = getSinNames(data);
            const savedDate = new Date(data?.savedAt);
            
            return (
              <div key={date} className="card" style={{ marginBottom: 16, overflow: "hidden" }}>
                <div style={{ 
                  background: "linear-gradient(135deg, var(--emerald), var(--emerald-light))", 
                  margin: -16, 
 marginBottom: 12, 
                  padding: "12px 16px",
                  color: "white"
                }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{formatDisplayDate(date)}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                    Saved: {savedDate.toLocaleTimeString()}
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "var(--emerald)" }}>{stats.deedsCount}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Good Deeds</div>
                    <div className="progress-bar-wrap" style={{ marginTop: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${(stats.deedsCount / stats.totalDeeds) * 100}%`, background: "var(--emerald)" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "var(--red-sin)" }}>{stats.majorSinsCount + stats.minorSinsCount}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Sins</div>
                    <div className="progress-bar-wrap" style={{ marginTop: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${((stats.majorSinsCount + stats.minorSinsCount) / stats.totalSins) * 100}%`, background: "var(--red-sin)" }} />
                    </div>
                  </div>
                </div>

                {deeds.length > 0 && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ fontSize: 12, fontWeight: 600, color: "var(--emerald)", cursor: "pointer", padding: "6px 0" }}>
                      ✨ Good Deeds ({deeds.length})
                    </summary>
                    <div style={{ marginTop: 8, paddingLeft: 12 }}>
                      {deeds.map((deed, i) => (
                        <div key={i} style={{ fontSize: 12, padding: "4px 0", borderBottom: "1px solid var(--border)", color: "var(--ink)" }}>✓ {deed}</div>
                      ))}
                    </div>
                  </details>
                )}

                {sins.length > 0 && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ fontSize: 12, fontWeight: 600, color: "var(--red-sin)", cursor: "pointer", padding: "6px 0" }}>
                      ⚠ Sins ({sins.length})
                    </summary>
                    <div style={{ marginTop: 8, paddingLeft: 12 }}>
                      {sins.map((sin, i) => (
                        <div key={i} style={{ fontSize: 12, padding: "4px 0", borderBottom: "1px solid var(--border)", color: "var(--ink)" }}>
                          {sin.type === "Major" ? "🔴" : "🟡"} {sin.name}
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {deeds.length === 0 && sins.length === 0 && (
                  <div style={{ fontSize: 12, color: "var(--ink-light)", fontStyle: "italic", textAlign: "center", padding: "12px 0" }}>
                    No deeds or sins recorded for this day.
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <div className="ornament" style={{ marginTop: 16 }}>❧ ✦ ❧</div>
      <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink-light)", fontStyle: "italic" }}>
        Records are saved when you click "Save Today's Record" on the Deeds or Sins page.
      </div>
    </div>
  );
}

// ── Tawbah Page (Comprehensive Repentance Guide) ─────────────────────────────

// ── Tawbah Page (Enhanced with Qur'an & Hadith) ──────────────────────────────
function TawbahPage() {
  const [selectedSin, setSelectedSin] = useState("");
  const [tawbahGuide, setTawbahGuide] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [dailyTawbah, setDailyTawbah] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const saved = JSON.parse(localStorage.getItem("tawbah-tracker") || "{}");
      return saved[today] || { count: 0, timestamp: null };
    } catch {
      return { count: 0, timestamp: null };
    }
  });

  const commonSins = [
    { name: "Missing prayers", severity: "Major", category: "Prayer" },
    { name: "Backbiting", severity: "Minor", category: "Tongue" },
    { name: "Lying", severity: "Minor", category: "Tongue" },
    { name: "Wasting time", severity: "Minor", category: "Habits" },
    { name: "Music & entertainment", severity: "Minor", category: "Habits" },
    { name: "Looking at haram", severity: "Minor", category: "Eyes" },
    { name: "Disobeying parents", severity: "Major", category: "Family" },
    { name: "Wasting food/water", severity: "Minor", category: "Habits" },
    { name: "Being ungrateful", severity: "Minor", category: "Heart" },
    { name: "Arrogance / Pride", severity: "Major", category: "Heart" },
    { name: "Envy / Jealousy", severity: "Minor", category: "Heart" },
    { name: "Not lowering gaze", severity: "Minor", category: "Eyes" },
    { name: "Breaking family ties", severity: "Major", category: "Family" },
    { name: "Consuming haram income", severity: "Major", category: "Wealth" },
    { name: "Missing Jumu'ah", severity: "Major", category: "Prayer" },
    { name: "Not giving Zakat", severity: "Major", category: "Wealth" },
    { name: "Breaking promises", severity: "Minor", category: "Tongue" },
    { name: "Cheating in exams/business", severity: "Minor", category: "Wealth" },
    { name: "Falsely accusing someone", severity: "Major", category: "Tongue" },
    { name: "Spying on Muslims", severity: "Minor", category: "Eyes" },
  ];

  const majorSinsCount = commonSins.filter(s => s.severity === "Major").length;
  const minorSinsCount = commonSins.filter(s => s.severity === "Minor").length;

  const getTawbahGuide = (sin) => {
    const guides = {
      "Missing prayers": "📿 **Immediate Actions:**\n• Make up the missed prayer (Qada) as soon as you remember\n• Set multiple alarms for each prayer time\n• Find a prayer buddy to check on each other\n\n**Hadith:** The Prophet ﷺ said: 'The covenant between us and them is prayer; whoever abandons it has committed disbelief.' (Tirmidhi)\n\n**Quran:** 'Then there succeeded them a generation who neglected prayer and followed their desires, so they will meet destruction — except those who repent, believe, and do righteousness.' (Maryam 19:59-60)\n\n**Action Plan:** Start with just one prayer (Maghrib/Isha) and gradually add more. Allah loves consistent deeds, even if small.\n\n**Hope:** The Prophet ﷺ said: 'The first thing the servant will be held accountable for on the Day of Judgment is the prayer. If it is sound, the rest of his deeds will be sound.'",
      
      "Backbiting": "🗣️ **Immediate Actions:**\n• Seek forgiveness from the person you spoke about\n• Speak well of them in gatherings where you backbit\n• Make dua for their well-being\n\n**Quran:** 'O you who believe, avoid much suspicion. Indeed, some suspicion is sin. And do not spy on one another or backbite one another. Would one of you like to eat the flesh of his dead brother? You would detest it.' (Al-Hujurat 49:12)\n\n**Hadith:** The Prophet ﷺ said: 'Do you know what backbiting is?' They said: 'Allah and His Messenger know best.' He said: 'Mentioning your brother with something he dislikes.' (Muslim)\n\n**Action Plan:** Before speaking about someone, ask: 'Would I say this if they were standing right here?'",
      
      "Lying": "🤥 **Immediate Actions:**\n• Correct the lie immediately if possible\n• Commit to truthfulness even when difficult\n• Apologize to anyone affected\n\n**Quran:** 'O you who believe, fear Allah and be with the truthful.' (At-Tawbah 9:119)\n\n**Hadith:** The Prophet ﷺ said: 'Truthfulness leads to righteousness, and righteousness leads to Paradise. A man continues to tell the truth until he is recorded with Allah as a truthful person. Falsehood leads to wickedness, and wickedness leads to the Fire.' (Bukhari & Muslim)\n\n**Action Plan:** Start with one day without any lies — even 'white lies'. Keep a truthfulness journal.",
      
      "Wasting time": "⏰ **Immediate Actions:**\n• Make a schedule for your day\n• Set 10-minute daily Quran goal\n• Remove time-wasting apps\n\n**Quran:** 'By time, indeed mankind is in loss, except those who believe and do righteous deeds, and enjoin one another to truth, and enjoin one another to patience.' (Al-Asr 103:1-3)\n\n**Hadith:** The Prophet ﷺ said: 'Take advantage of five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your work, and your life before your death.' (Hakim)\n\n**Action Plan:** Use the '5 minutes rule' — just 5 minutes of productivity often turns into more.",
      
      "Music & entertainment": "🎵 **Immediate Actions:**\n• Replace with Quran recitation or nasheeds\n• Unfollow music accounts on social media\n• Make dhikr 'SubhanAllah, Alhamdulillah, Allahu Akbar' when urge strikes\n\n**Quran:** 'And of the people is he who buys the amusement of speech to mislead others from the way of Allah without knowledge, and takes it in ridicule. Those will have a humiliating punishment.' (Luqman 31:6)\n\n**Action Plan:** Gradual replacement — reduce by 10 minutes daily, replace with beneficial Islamic content.",
      
      "Looking at haram": "👁️ **Immediate Actions:**\n• Lower your gaze immediately and say 'A'udhu billah'\n• Unfollow/block accounts that trigger this\n• Fill your feed with Islamic content\n\n**Quran:** 'Tell the believing men to lower their gaze and guard their private parts. That is purer for them. Indeed, Allah is Acquainted with what they do.' (An-Nur 24:30)\n\n**Hadith:** The Prophet ﷺ said: 'The eyes commit zina and their zina is looking.' (Bukhari)\n\n**Action Plan:** Practice 'second glance rule' — never look twice. The first may be accidental, the second is intentional.",
      
      "Disobeying parents": "👪 **Immediate Actions:**\n• Apologize to them today — right now\n• Serve them — make tea, help with chores, sit with them\n• Make abundant dua for their health and happiness\n\n**Quran:** 'And your Lord has decreed that you worship none but Him, and be dutiful to parents. Whether one or both of them attain old age in your life, say not to them a word of disrespect, nor shout at them, but address them in terms of honor.' (Al-Isra 17:23)\n\n**Hadith:** 'The pleasure of Allah is in the pleasure of parents, and the displeasure of Allah is in the displeasure of parents.' (Tirmidhi)\n\n**Action Plan:** Call or visit them daily, even just to say 'I love you'. Serve them with your own hands.",
      
      "Wasting food/water": "💧 **Immediate Actions:**\n• Take only what you will eat\n• Share leftovers with others\n• Say 'Bismillah' before eating and 'Alhamdulillah' after\n\n**Quran:** 'O children of Adam, take your adornment at every masjid, and eat and drink, but be not excessive. Indeed, He likes not those who commit excess.' (Al-A'raf 7:31)\n\n**Hadith:** The Prophet ﷺ passed by Sa'd while he was performing wudu and said: 'What is this wastage?' Sa'd replied: 'Is there wastage even in wudu?' The Prophet ﷺ said: 'Yes, even if you are at a flowing river.' (Ibn Majah)\n\n**Action Plan:** Finish everything on your plate. Compost food scraps instead of trashing them.",
      
      "Being ungrateful": "🙏 **Immediate Actions:**\n• Start a daily gratitude journal (write 3 blessings each night)\n• Say 'Alhamdulillah' at least 100 times daily\n• Thank people genuinely — the Prophet ﷺ said: 'Whoever does not thank people has not thanked Allah.'\n\n**Quran:** 'And remember when your Lord proclaimed: If you are grateful, I will surely increase you. But if you deny, indeed My punishment is severe.' (Ibrahim 14:7)\n\n**Action Plan:** Before sleeping, reflect on 3 things you're grateful for.",
      
      "Arrogance / Pride": "🦚 **Immediate Actions:**\n• Remind yourself that you came from dust and will return to dust\n• Perform acts of service humbly\n• Seek forgiveness from anyone you looked down upon\n\n**Quran:** 'And do not walk upon the earth exultantly. Indeed, you will never tear the earth apart, and you will never reach the mountains in height.' (Al-Isra 17:37)\n\n**Hadith:** The Prophet ﷺ said: 'No one who has an atom's weight of arrogance in his heart will enter Paradise.' A man asked: 'What if a man likes his clothes and shoes to look good?' The Prophet ﷺ said: 'Allah is beautiful and loves beauty. Arrogance is rejecting the truth and looking down on people.' (Muslim)\n\n**Action Plan:** Sit with people less fortunate and serve them — this humbles the heart.",
      
      "Envy / Jealousy": "💚 **Immediate Actions:**\n• Say 'MashaAllah, la quwwata illa billah'\n• Make dua for the person you envy — pray for their increase\n• Count your own blessings\n\n**Quran:** 'Or do they envy people for what Allah has given them of His bounty?' (An-Nisa 4:54)\n\n**Hadith:** The Prophet ﷺ said: 'Beware of envy, for envy consumes good deeds as fire consumes wood.' (Abu Dawud)\n\n**Action Plan:** When you feel envy, immediately make dua: 'Allahumma barik lahu' (O Allah, bless him).",
      
      "Not lowering gaze": "👀 **Immediate Actions:**\n• Look away immediately\n• Remember Allah is watching\n• Practice mindfulness in public spaces\n\n**Quran:** 'Tell the believing men to lower their gaze and guard their chastity. That is purer for them. Indeed, Allah is Acquainted with what they do.' (An-Nur 24:30)\n\n**Hadith:** The Prophet ﷺ said to Ali (RA): 'O Ali, do not follow a glance with another glance, for the first is for you (accidental) but the second is against you.' (Tirmidhi)\n\n**Action Plan:** Keep your eyes focused on the ground when walking in crowded areas.",
      
      "Breaking family ties": "💔 **Immediate Actions:**\n• Reach out today — call, text, or visit\n• Be the first to initiate reconciliation\n• Make dua for family unity\n\n**Quran:** 'So would you perhaps, if you turned away, cause corruption on earth and sever your family ties? Those whom Allah has cursed, so He made them deaf and blinded their vision.' (Muhammad 47:22-23)\n\n**Hadith:** The Prophet ﷺ said: 'The one who severs family ties will not enter Paradise.' (Bukhari & Muslim)\n\n**Action Plan:** Start with one relative you haven't contacted in a while. Send a simple greeting of salam.",
      
      "Consuming haram income": "💰 **Immediate Actions:**\n• Stop the haram source immediately\n• Seek halal alternatives\n• Give charity from haram money (to purify yourself, not for reward)\n\n**Quran:** 'O you who believe, eat from the good things which We have provided for you and be grateful to Allah if it is Him you worship.' (Al-Baqarah 2:172)\n\n**Hadith:** The Prophet ﷺ said: 'A body nourished with haram will not enter Paradise.' (Ahmad)\n\n**Action Plan:** Research halal income options. Even less money from halal sources brings barakah.",
      
      "Missing Jumu'ah": "🕌 **Immediate Actions:**\n• Set reminder for Friday before noon\n• Prepare for Jumu'ah the night before\n• Ask your employer for prayer accommodation\n\n**Quran:** 'O you who believe, when the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade.' (Al-Jumu'ah 62:9)\n\n**Hadith:** The Prophet ﷺ said: 'Whoever misses three Jumu'ahs out of negligence, Allah seals his heart.' (Abu Dawud)\n\n**Action Plan:** Make Jumu'ah your weekly appointment with Allah — nothing is more important.",
      
      "Not giving Zakat": "💸 **Immediate Actions:**\n• Calculate what you owe\n• Pay immediately to verified charities\n• Make intention to never delay again\n\n**Quran:** 'And establish prayer and give Zakat, and bow with those who bow.' (Al-Baqarah 2:43)\n\n**Quran:** 'And those who hoard gold and silver and spend it not in the way of Allah — give them tidings of a painful punishment.' (At-Tawbah 9:34)\n\n**Action Plan:** Calculate Zakat yearly in Ramadan. Set a reminder on your phone.",
      
      "Breaking promises": "📜 **Immediate Actions:**\n• Fulfill the promise if still possible\n• Sincerely apologize if you cannot\n• Avoid making promises you may not keep — say 'InshaAllah'\n\n**Quran:** 'And fulfill every promise. Indeed, the promise will be asked about.' (Al-Isra 17:34)\n\n**Quran:** 'O you who believe, fulfill your contracts.' (Al-Ma'idah 5:1)\n\n**Action Plan:** Say 'InshaAllah' when making future promises. Keep a small promises journal."
    };
    
    if (guides[sin]) return guides[sin];
    
    return `🌙 **General Tawbah Guide for "${sin}":**\n\n1. **Stop the sin immediately** — Right now, in this moment, cease the action.\n2. **Feel sincere regret** — Let your heart feel sorrow for disobeying Allah.\n3. **Resolve never to return** — Make a firm commitment in your heart.\n4. **Make wudu and pray 2 rak'ahs** — The 'Prayer of Repentance' (Salat al-Tawbah).\n5. **Cry to Allah** — Pour your heart out in dua. He loves when His servant calls upon Him.\n\n**Quran:** 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'' (Az-Zumar 39:53)\n\n**Hadith:** The Prophet ﷺ said: 'Allah extends His Hand at night to accept the repentance of the one who sinned during the day, and He extends His Hand during the day to accept the repentance of the one who sinned at night — until the sun rises from the west.' (Muslim)`;
  };

  const handleSinSelect = (sin) => {
    setSelectedSin(sin);
    const guide = getTawbahGuide(sin);
    setTawbahGuide(guide);
    setShowGuide(true);
  };

  const trackTawbah = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = dailyTawbah.count + 1;
    const newTracker = { count: newCount, timestamp: new Date().toISOString() };
    setDailyTawbah(newTracker);
    const saved = JSON.parse(localStorage.getItem("tawbah-tracker") || "{}");
    saved[today] = newTracker;
    localStorage.setItem("tawbah-tracker", JSON.stringify(saved));
  };

  const resetGuide = () => {
    setSelectedSin("");
    setTawbahGuide("");
    setShowGuide(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🤲 Tawbah — Return to Your Lord</div>
        <div className="page-desc">"Indeed, Allah loves those who constantly repent and those who purify themselves." (Al-Baqarah 2:222)</div>
      </div>

      {/* Daily Tawbah Tracker */}
      <div className="deeds-banner" style={{ marginBottom: 16, background: "linear-gradient(135deg, var(--gold), #b8851e)" }}>
        <div>
          <div className="deeds-banner-count">{dailyTawbah.count}</div>
          <div className="deeds-banner-label">Times sought forgiveness today</div>
        </div>
        <button className="btn-primary" onClick={trackTawbah} style={{ background: "white", color: "var(--gold)", fontSize: 12, padding: "8px 16px" }}>
          🤲 Say Astaghfirullah
        </button>
      </div>

      {/* Main Message Card */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--emerald), #0f3d27)", color: "white", textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🕋</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>The Door of Repentance is Always Open</div>
        <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.8, marginBottom: 12 }}>
          No matter how many times you fall, no matter how far you've strayed,<br/>
          Allah's mercy is greater than all your sins combined.
        </div>
        <div style={{ fontSize: 13, fontStyle: "italic", opacity: 0.85, lineHeight: 1.7 }}>
          The Prophet ﷺ said:<br/>
          <strong>"The one who repents from sin is like the one who never sinned."</strong><br/>
          (Ibn Majah)
        </div>
      </div>

      {/* Allah's Call to Sinners */}
      <div className="card" style={{ marginBottom: 16, background: "var(--gold-pale)", border: "2px solid var(--gold)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--emerald)", marginBottom: 12, textAlign: "center" }}>
          📖 Allah's Direct Call to Every Sinner
        </div>
        <div className="arabic-text" style={{ fontSize: 18, textAlign: "center", background: "transparent", border: "none" }}>
          ۞ قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ ۞
        </div>
        <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--ink)", textAlign: "center", marginBottom: 16, lineHeight: 1.7 }}>
          "Say: O My servants who have transgressed against themselves,<br/>
          <strong>do not despair of the mercy of Allah.</strong><br/>
          Indeed, Allah forgives all sins. Indeed, He is the Forgiving, the Merciful."<br/>
          <span style={{ fontSize: 12 }}>(Surah Az-Zumar 39:53)</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)", textAlign: "center", lineHeight: 1.7 }}>
          This verse was revealed about people who committed murder, adultery, and all kinds of major sins.<br/>
          If Allah's mercy encompassed them, <strong>it certainly encompasses you.</strong>
        </div>
      </div>

      {/* Why Tawbah Brings Joy to Allah */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--emerald)", marginBottom: 12, textAlign: "center" }}>
          🌅 Your Repentance Brings Joy to Allah
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 12 }}>
          The Prophet ﷺ told a story that shows <strong>how much Allah loves when you turn back to Him:</strong>
        </div>
        <div style={{ background: "var(--emerald-muted)", padding: 16, borderRadius: 10, fontSize: 14, lineHeight: 1.9, fontStyle: "italic", color: "var(--emerald)" }}>
          "Allah is more pleased with the repentance of His servant than a person who loses his camel in a barren desert, and then finds it unexpectedly. He had given up all hope, lay down in the shade waiting for death — and suddenly, his camel appears before him with all his food and water! He seizes its reins and cries out in overwhelming joy: <strong>'O Allah! You are my servant and I am Your Lord!'</strong> — he makes a mistake out of sheer joy."
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-light)", textAlign: "center", marginTop: 8 }}>
          (Sahih Muslim — Hadith of the man who lost his camel)
        </div>
        <div style={{ fontSize: 13, color: "var(--ink)", textAlign: "center", marginTop: 10, fontWeight: 600 }}>
          Imagine — your single sincere "Astaghfirullah" brings that kind of joy to your Creator.
        </div>
      </div>

      {/* Hadiths on Tawbah */}
      <div className="section-title">💎 Pearls from the Prophet ﷺ on Repentance</div>
      <div className="card" style={{ marginBottom: 16 }}>
        {[
          {
            hadith: "By Him in Whose Hand is my soul, if you did not sin, Allah would replace you with people who would sin, and they would seek forgiveness from Allah, and He would forgive them.",
            source: "Sahih Muslim"
          },
          {
            hadith: "Allah extends His Hand at night to accept the repentance of the one who sinned during the day, and He extends His Hand during the day to accept the repentance of the one who sinned at night — until the sun rises from the west.",
            source: "Sahih Muslim"
          },
          {
            hadith: "When a servant acknowledges his sin and repents, Allah forgives him.",
            source: "Sahih Bukhari"
          },
          {
            hadith: "Every son of Adam sins, and the best of those who sin are those who constantly repent.",
            source: "Sunan At-Tirmidhi"
          },
          {
            hadith: "Whoever says 'Astaghfirullah al-adheem, alladhi la ilaha illa huwa, al-hayyul qayyum, wa atubu ilayh' — his sins will be forgiven, even if he fled from the battlefield.",
            source: "Sunan Abu Dawud"
          },
        ].map((h, i) => (
          <div key={i} style={{ marginBottom: i < 4 ? 14 : 0, paddingBottom: i < 4 ? 14 : 0, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--ink)", marginBottom: 6, fontStyle: "italic" }}>
              "{h.hadith}"
            </div>
            <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700 }}>— {h.source}</div>
          </div>
        ))}
      </div>

      {/* Qur'anic Verses */}
      <div className="section-title">📖 Qur'anic Verses on Allah's Mercy</div>
      <div className="card" style={{ marginBottom: 16 }}>
        {[
          {
            arabic: "وَإِنِّي لَغَفَّارٌ لِمَنْ تَابَ وَآمَنَ وَعَمِلَ صَالِحًا ثُمَّ اهْتَدَىٰ",
            translation: "\"And indeed, I am the Perpetual Forgiver of whoever repents, believes, does righteousness, and then continues on guidance.\"",
            ref: "Surah Ta-Ha 20:82"
          },
          {
            arabic: "وَمَنْ تَابَ وَعَمِلَ صَالِحًا فَإِنَّهُ يَتُوبُ إِلَى اللَّهِ مَتَابًا",
            translation: "\"And whoever repents and does righteousness, then indeed he turns to Allah with true repentance.\"",
            ref: "Surah Al-Furqan 25:71"
          },
          {
            arabic: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ ۚ ذَٰلِكَ ذِكْرَىٰ لِلذَّاكِرِينَ",
            translation: "\"Indeed, good deeds remove bad deeds. That is a reminder for those who remember.\"",
            ref: "Surah Hud 11:114"
          },
          {
            arabic: "وَمَنْ يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَحِيمًا",
            translation: "\"And whoever does evil or wrongs himself, then seeks forgiveness from Allah, will find Allah Forgiving and Merciful.\"",
            ref: "Surah An-Nisa 4:110"
          },
          {
            arabic: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنْفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ",
            translation: "\"And those who, when they commit an immorality or wrong themselves, remember Allah and seek forgiveness for their sins.\"",
            ref: "Surah Al-Imran 3:135"
          },
        ].map((v, i) => (
          <div key={i} style={{ marginBottom: i < 4 ? 16 : 0, paddingBottom: i < 4 ? 16 : 0, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily: "'Amiri', serif", fontSize: 18, direction: "rtl", textAlign: "center", marginBottom: 8, lineHeight: 2 }}>{v.arabic}</div>
            <div style={{ fontSize: 13, fontStyle: "italic", textAlign: "center", color: "var(--ink)", marginBottom: 4 }}>{v.translation}</div>
            <div style={{ fontSize: 11, color: "var(--gold)", textAlign: "center", fontWeight: 700 }}>{v.ref}</div>
          </div>
        ))}
      </div>

      {/* 4 Conditions of Tawbah */}
      <div className="section-title">📖 The 4 Conditions of Sincere Tawbah</div>
      <div className="card" style={{ marginBottom: 16 }}>
        {[
          { num: "1", title: "Stop the Sin Immediately", desc: "Cease the sinful action right now, in this moment. Do not delay." },
          { num: "2", title: "Feel Genuine Regret", desc: "Let your heart feel true sorrow and remorse for disobeying Allah." },
          { num: "3", title: "Resolve Never to Return", desc: "Make a firm, sincere commitment in your heart to abandon the sin permanently." },
          { num: "4", title: "Restore Rights (If Applicable)", desc: "If the sin involved another person's rights, seek their forgiveness and make amends." },
        ].map((step, i) => (
          <div key={i} style={{ marginBottom: i < 3 ? 16 : 0, display: "flex", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--emerald)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{step.num}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--emerald)", marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Salat al-Tawbah */}
      <div className="section-title">🕌 Salat al-Tawbah — The Prayer of Repentance</div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
          A beautiful sunnah whenever you fall into sin:
        </div>
        <ul style={{ marginLeft: 20, fontSize: 13, lineHeight: 2, color: "var(--ink-muted)", marginBottom: 14 }}>
          <li>Make wudu (ablution) with care and presence of heart</li>
          <li>Pray 2 rak'ahs (units) of nafl prayer with full concentration</li>
          <li>Do not pray during the prohibited times (after Fajr until sunrise, and after Asr until Maghrib)</li>
          <li>After salam, raise your hands and make sincere dua, cry to Allah</li>
          <li>Admit your sin, ask for forgiveness, and resolve not to return</li>
        </ul>
        <div style={{ background: "var(--emerald-muted)", padding: 14, borderRadius: 10, fontSize: 13, fontStyle: "italic", lineHeight: 1.7, color: "var(--emerald)" }}>
          The Prophet ﷺ said: "There is no servant who commits a sin, then purifies himself (makes wudu), then prays two rak'ahs, then seeks forgiveness from Allah — except that Allah forgives him." (Abu Dawud)
        </div>
      </div>

      {/* Master Du'a for Forgiveness */}
      <div className="section-title">🤲 Sayyidul Istighfar — The Master of Forgiveness</div>
      <div className="card" style={{ background: "var(--emerald-muted)", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Amiri', serif", fontSize: 17, marginBottom: 14, direction: "rtl", lineHeight: 2.2 }}>
          اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلَّا أَنْتَ<br/>
          خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ<br/>
          أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ<br/>
          أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي<br/>
          فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ
        </div>
        <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--ink-muted)", marginBottom: 12, lineHeight: 1.7 }}>
          "O Allah, You are my Lord. There is no god but You. You created me and I am Your servant.<br/>
          I am upon Your covenant and Your promise as much as I am able.<br/>
          I seek refuge in You from the evil I have done.<br/>
          I acknowledge Your blessings upon me and I acknowledge my sin.<br/>
          So forgive me, for none forgives sins except You."
        </div>
        <div style={{ fontSize: 12, color: "var(--emerald)", fontWeight: 600, lineHeight: 1.7 }}>
          The Prophet ﷺ said: "Whoever says this with complete certainty in the morning and dies that day,<br/>
          will enter Paradise. And whoever says it in the evening and dies that night, will enter Paradise."<br/>
          <span style={{ fontSize: 11 }}>(Sahih Bukhari)</span>
        </div>
      </div>

      {/* Quick Daily Duas */}
      <div className="section-title">📿 Quick Duas for Daily Forgiveness</div>
      <div className="card" style={{ marginBottom: 16 }}>
        {[
          { arabic: "رَبِّ اغْفِرْ لِي", trans: "Rabbighfir li — \"My Lord, forgive me\"", note: "The Prophet ﷺ said this 100 times daily" },
          { arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", trans: "Astaghfirullah wa atubu ilayh — \"I seek forgiveness from Allah and repent to Him\"", note: "The Prophet ﷺ said this 70-100 times daily" },
          { arabic: "سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي", trans: "Subhanakallahumma rabbana wa bihamdika, allahummaghfirli — \"Glory be to You, O Allah our Lord, and praise; O Allah forgive me\"", note: "Recommended after ruku in prayer" },
          { arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", trans: "Astaghfirullah al-adheem alladhi la ilaha illa huwa al-hayyul qayyum wa atubu ilayh — \"I seek forgiveness from Allah the Almighty, besides Whom there is no god, the Ever-Living, the Sustainer, and I repent to Him\"", note: "Forgives sins even if one fled from battle (Abu Dawud)" },
        ].map((d, i) => (
          <div key={i} style={{ marginBottom: i < 3 ? 16 : 0, paddingBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily: "'Amiri', serif", fontSize: 18, direction: "rtl", textAlign: "center", marginBottom: 6 }}>{d.arabic}</div>
            <div style={{ fontSize: 13, textAlign: "center", color: "var(--ink)", fontWeight: 600 }}>{d.trans}</div>
            <div style={{ fontSize: 11, textAlign: "center", color: "var(--ink-light)", marginTop: 4, fontStyle: "italic" }}>{d.note}</div>
          </div>
        ))}
      </div>

      {/* Select a Sin Section */}
      <div className="section-title">⚠ Need Specific Guidance? Select a Sin Below</div>
      
      <details className="card" style={{ marginBottom: 12 }}>
        <summary style={{ fontSize: 14, fontWeight: 700, color: "var(--red-sin)", cursor: "pointer", padding: "8px 0" }}>
          🔴 Major Sins ({majorSinsCount})
        </summary>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 12 }}>
          {commonSins.filter(s => s.severity === "Major").map((sin, idx) => (
            <button
              key={idx}
              onClick={() => handleSinSelect(sin.name)}
              style={{ background: selectedSin === sin.name ? "var(--red-sin)" : "var(--red-pale)", color: selectedSin === sin.name ? "white" : "var(--red-sin)", fontSize: 12, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", fontFamily: "'Lora', serif" }}
            >
              {sin.name}
            </button>
          ))}
        </div>
      </details>

      <details className="card" style={{ marginBottom: 16 }}>
        <summary style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", cursor: "pointer", padding: "8px 0" }}>
          🟡 Minor Sins ({minorSinsCount})
        </summary>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 12 }}>
          {commonSins.filter(s => s.severity === "Minor").map((sin, idx) => (
            <button
              key={idx}
              onClick={() => handleSinSelect(sin.name)}
              style={{ background: selectedSin === sin.name ? "var(--gold)" : "var(--gold-pale)", color: selectedSin === sin.name ? "white" : "var(--gold)", fontSize: 12, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", fontFamily: "'Lora', serif" }}
            >
              {sin.name}
            </button>
          ))}
        </div>
      </details>

      {/* Custom Sin Input */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--emerald)", marginBottom: 8 }}>📝 Or write your own sin:</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input 
            type="text"
            id="customSin"
            placeholder="e.g., I was harsh with my child, I missed Fajr..."
            style={{ flex: 1, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "'Lora', serif", background: "var(--parchment)" }}
          />
          <button className="btn-primary" onClick={() => { const v = document.getElementById("customSin").value; if (v.trim()) handleSinSelect(v); }} style={{ padding: "12px 20px" }}>Get Guide</button>
        </div>
      </div>

      {/* Tawbah Guide Result */}
      {showGuide && (
        <div className="kind-words-box" style={{ background: "linear-gradient(135deg, var(--gold-pale), var(--emerald-muted))", marginBottom: 16 }}>
          <div className="kind-words-label" style={{ color: "var(--emerald)" }}>🌟 Tawbah Guide for: {selectedSin}</div>
          <div className="kind-words-text" style={{ color: "var(--ink)", fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{tawbahGuide}</div>
          <button className="btn-sm" onClick={resetGuide} style={{ marginTop: 12 }}>✕ Clear</button>
        </div>
      )}

      {/* Final Encouragement */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--emerald), #0f3d27)", color: "white", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>🌅 A Final Word of Hope</div>
        <div style={{ fontSize: 14, lineHeight: 1.9, opacity: 0.95 }}>
          If your sins were to reach the clouds of the sky,<br/>
          and then you were to seek forgiveness from Allah,<br/>
          <strong>He would forgive you.</strong>
        </div>
        <div style={{ fontSize: 12, marginTop: 10, opacity: 0.8 }}>— Hadith Qudsi (Tirmidhi)</div>
      </div>

      <div className="ornament" style={{ marginTop: 16 }}>❧ ✦ ❧</div>
      <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-light)", fontStyle: "italic", lineHeight: 1.8 }}>
        "And whoever does evil or wrongs himself but then seeks forgiveness from Allah<br/>
        will find Allah Forgiving and Merciful." (Surah An-Nisa 4:110)
      </div>
    </div>
  );
}

// ── Backup Page ──────────────────────────────────────────────────────────────
function BackupPage() {
  const [status, setStatus] = useState("");

  const createBackup = () => {
    try {
      const data = {
        journal: JSON.parse(localStorage.getItem("islamic-journal") || "[]"),
        tracker: JSON.parse(localStorage.getItem("islamic-daily-tracker") || "{}"),
        tawbah: JSON.parse(localStorage.getItem("tawbah-tracker") || "{}"),
        version: 1,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `islamic-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("✅ Backup downloaded successfully!");
    } catch (err) {
      setStatus("❌ Failed: " + err.message);
    }
  };

  const restoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.confirm("⚠️ This will overwrite ALL your current data! Continue?")) {
      e.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.journal) localStorage.setItem("islamic-journal", JSON.stringify(data.journal));
        if (data.tracker) localStorage.setItem("islamic-daily-tracker", JSON.stringify(data.tracker));
        if (data.tawbah) localStorage.setItem("tawbah-tracker", JSON.stringify(data.tawbah));
        setStatus("✅ Data restored! Refreshing...");
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        setStatus("❌ Invalid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">💾 Backup & Restore</div>
        <div className="page-desc">Protect your spiritual journey — download backups regularly!</div>
      </div>
      <div className="card" style={{ background: "linear-gradient(135deg, #5c1a1a, #8b2a2a)", color: "white", marginBottom: 20 }}>
        <div style={{ fontSize: 20, marginBottom: 10 }}>⚠️ IMPORTANT</div>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>
          Your data is stored <strong>only on this device</strong>. Clearing browser history will <strong>permanently delete</strong> all your records.
          <br/><br/>✅ <strong>Download a backup weekly!</strong>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 10 }}>📤 Download Backup</div>
        <p style={{ fontSize: 14, marginBottom: 12 }}>Saves: Journal entries • Daily tracker • Tawbah counter</p>
        <button className="btn-primary" onClick={createBackup} style={{ width: "100%" }}>📥 Download Backup File</button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 10 }}>📥 Restore from Backup</div>
        <p style={{ fontSize: 14, marginBottom: 12 }}>Select a backup file to restore all your data.</p>
        <input type="file" accept=".json" onChange={restoreBackup} style={{ width: "100%", padding: "12px", border: "2px dashed var(--gold)", borderRadius: 10, fontFamily: "Lora, serif", cursor: "pointer", marginBottom: 10 }} />
        <div style={{ fontSize: 12, color: "var(--red-sin)", fontWeight: 600 }}>⚠️ This will replace all current data.</div>
      </div>
      {status && (
        <div className="card" style={{ marginTop: 16, background: status.startsWith("✅") ? "var(--emerald-muted)" : "var(--red-pale)" }}>{status}</div>
      )}
    </div>
  );
}

// ── Disclaimer Page (Enhanced) ───────────────────────────────────────────────
function DisclaimerPage() {
  const [copied, setCopied] = useState(false);
  const copyEmail = () => { navigator.clipboard.writeText("faith.ink.nur@gmail.com"); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📜 Disclaimer & Reflection</div>
        <div className="page-desc">Important information about this spiritual companion</div>
      </div>

      {/* Bismillah Card */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--emerald), #0f3d27)", color: "white", textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🕋</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Bismillahir Rahmanir Rahim</div>
        <div style={{ fontSize: 14, opacity: 0.9, fontStyle: "italic", lineHeight: 1.8 }}>
          "And whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it."<br/>
          (Surah Az-Zalzalah 99:7-8)
        </div>
      </div>

      {/* Message from the Creator */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 12 }}>
          🌟 A Message from a Lost Wanderer
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 14 }}>
          Alhamdulillah, Astaghfirullah. All praise belongs to Allah, the Creator of all, and to Him we shall return.
          I am but a lost wanderer on this path of life, no different from you — a servant seeking His mercy, a soul yearning for His forgiveness.
          This app was born from my own struggle to keep account of my deeds before the ultimate accounting.
          I am not a scholar, nor a saint. Just a fellow traveler who stumbled trying to find the straight path.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", fontStyle: "italic" }}>
          "Our Lord, we have believed, so forgive us and have mercy upon us, and You are the best of the merciful." (23:109)
        </p>
      </div>

      {/* Words of Hope & Encouragement */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--gold-pale), var(--emerald-muted))", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 12 }}>
          🌈 Never Lose Hope in Allah
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 12 }}>
          If you have lost your data, missed your prayers, or are passing through the hardest time of your life — know this:
        </p>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--emerald)", textAlign: "center", marginBottom: 14, fontStyle: "italic" }}>
          "Say: O My servants who have transgressed against themselves,<br/>do not despair of the mercy of Allah.<br/>Indeed, Allah forgives all sins."<br/>
          <span style={{ fontSize: 13 }}>(Surah Az-Zumar 39:53)</span>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 10 }}>
          📿 <strong>If you forgot to pray</strong> — make wudu now and pray. The door is always open. Allah does not turn away a servant who returns to Him.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 10 }}>
          🤲 <strong>If you feel lost or broken</strong> — cry to Allah. He is Al-Sami (The All-Hearing), Al-Qarib (The Near One). Not a single tear falls without His knowledge.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 10 }}>
          🕋 <strong>If you have sinned again and again</strong> — make sincere Tawbah right now. Allah loves those who repent. The Prophet ﷺ said: "The one who repents from sin is like the one who never sinned."
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 10 }}>
          🌸 <strong>Spread kindness for the sake of Allah</strong> — a smile, a kind word, helping someone in need. Every small act of goodness plants a seed in your scales.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 10 }}>
          📖 <strong>Hold onto your prayers</strong> — even if everything else falls apart, your salah is your lifeline. The Prophet ﷺ said: "The comfort of my eyes is in prayer."
        </p>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, fontStyle: "italic", color: "var(--emerald)" }}>
          "And whoever fears Allah — He will make for him a way out, and will provide for him from where he does not expect." (65:2-3)
        </div>
      </div>

      {/* Data Warning */}
      <div className="card" style={{ background: "linear-gradient(135deg, #5c1a1a, #8b2a2a)", color: "white", marginBottom: 16 }}>
        <div style={{ fontSize: 20, marginBottom: 12 }}>⚠️ IMPORTANT — About Your Data</div>
        <div style={{ fontSize: 14, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 10 }}>
            Your data is stored <strong>locally on your device only</strong> — not on any external server.
            Even this lost wanderer cannot see your records. Your privacy is sacred.
          </p>
          <p style={{ marginBottom: 10 }}>
            <strong>⚠️ Your data WILL BE PERMANENTLY LOST if you:</strong>
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 14, lineHeight: 2 }}>
            <li>Clear your browser history or cache</li>
            <li>Uninstall or reset your browser</li>
            <li>Switch to a new device or phone</li>
            <li>Use incognito/private mode (data is not saved)</li>
            <li>Delete browsing data from your browser settings</li>
          </ul>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "14px 16px", borderRadius: 10, textAlign: "center", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
            💾 Go to the <strong>Backup</strong> tab and download a backup right now!<br/>
            <span style={{ fontSize: 12, fontWeight: 400 }}>Save it to Google Drive, email it to yourself, or keep it in a safe folder.</span>
          </div>
          <p style={{ fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
            Make it a habit — download a backup every Friday after Jumu'ah.
          </p>
        </div>
      </div>

      {/* Contact & Bug Reports */}
      <div className="card" style={{ background: "var(--gold-pale)", border: "1px solid var(--gold)", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 12 }}>
          📧 Suggestions, Bug Reports & Contact
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--ink)", marginBottom: 12 }}>
          If you find a bug, have a suggestion for improvement, want to report an issue, or simply want to share a prayer for this lost wanderer — your words reach my heart. I built this alone, and your feedback helps make it better for everyone.
        </p>
        <ul style={{ marginLeft: 20, fontSize: 13, lineHeight: 1.9, color: "var(--ink)", marginBottom: 14 }}>
          <li>🐛 Found a bug? Let me know what happened</li>
          <li>💡 Have an idea for a new feature?</li>
          <li>📖 Found incorrect Islamic content? Please report it</li>
          <li>🤲 Just want to share a dua or kind words</li>
        </ul>
        <div style={{ background: "white", padding: "14px 16px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: "var(--ink)", wordBreak: "break-all" }}>
            📧 faith.ink.nur@gmail.com
          </div>
          <button onClick={copyEmail} className="btn-primary" style={{ padding: "10px 18px", fontSize: 13, background: "var(--gold)", color: "white", border: "none", borderRadius: 99, cursor: "pointer", fontWeight: 600 }}>
            {copied ? "✓ Copied!" : "📋 Copy Email"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-muted)", fontStyle: "italic", textAlign: "center" }}>
          "And say, 'My Lord, increase me in knowledge.'" (20:114)
        </p>
      </div>

      {/* Terms of Use */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 12 }}>
          📜 Terms of Use
        </div>
        <ul style={{ marginLeft: 20, fontSize: 13, lineHeight: 2, color: "var(--ink-muted)" }}>
          <li>This app is for personal spiritual development only</li>
          <li>Not a substitute for professional religious advice from qualified scholars</li>
          <li>Always consult local imams or scholars for religious rulings (fiqh)</li>
          <li>This lost wanderer is not responsible for any misuse of the app</li>
          <li>All data remains on your device — no cloud storage or tracking</li>
          <li>AI features (if enabled) provide general guidance, not authoritative fatwas</li>
        </ul>
      </div>

      {/* Prayer for the Creator */}
      <div className="card" style={{ background: "var(--emerald-muted)", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald)", marginBottom: 14 }}>
          🤲 A Prayer for This Lost Wanderer
        </div>
        <div style={{ fontFamily: "'Amiri', serif", fontSize: 20, marginBottom: 14, direction: "rtl", lineHeight: 2 }}>
          اللهم اغفر له وارحمه واهدِه إلى صراطك المستقيم
        </div>
        <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--ink-muted)", marginBottom: 12 }}>
          "O Allah, forgive him, have mercy on him, and guide him to Your straight path."
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-light)", lineHeight: 1.8 }}>
          And for you, dear reader — may Allah grant you steadfastness in faith, accept every tear of repentance, 
          fill your heart with His light, and gather us all among His beloved servants on the Day when neither wealth 
          nor children will benefit — only a sound heart coming to Allah.
        </p>
      </div>

      {/* Final Reminder */}
      <div className="card" style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--emerald)", marginBottom: 8 }}>
          💡 Final Reminder
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.8 }}>
          Go to the <strong>💾 Backup</strong> tab to download your data now.<br/>
          Go to the <strong>🕋 Tawbah</strong> tab whenever you need to return to Allah.<br/>
          Your spiritual journey matters — protect it.
        </div>
      </div>

      <div className="ornament" style={{ marginTop: 16 }}>❧ ✦ ❧</div>
      <div style={{ textAlign: "center", fontSize: 13, color: "var(--ink-light)", fontStyle: "italic", lineHeight: 1.8, marginBottom: 20 }}>
        JazakAllah Khair for walking this path with me.<br/>
        May Allah accept every step, every tear, and every effort from all of us.
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("deeds");
  const Page = PAGES.find(p => p.id === page)?.component || DeedsPage;

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app-shell">
        <header className="header">
          <div className="header-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="header-title">My Islamic Companion</div>
          <div className="header-subtitle">Nurturing faith, one day at a time</div>
        </header>

        <nav className="nav">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`nav-btn ${page === p.id ? "active" : ""}`}
              onClick={() => setPage(p.id)}
            >{p.label}</button>
          ))}
        </nav>

        <main className="main">
          <Page />
        </main>
      </div>
    </>
  );
}
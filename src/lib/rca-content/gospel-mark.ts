// Gospel of Mark (Douay-Rheims Version, public domain)
// Organized by chapter and verse for quick reference

export type GospelVerse = { verse: number; text: string };
export type GospelChapter = { chapter: number; verses: GospelVerse[] };

export const gospelMark: GospelChapter[] = [
  {
    chapter: 1,
    verses: [
      { verse: 1, text: "The beginning of the gospel of Jesus Christ, the Son of God." },
      { verse: 2, text: "As it is written in Isaias the prophet: Behold I send my angel before thy face, who shall prepare thy way before thee." },
      { verse: 3, text: "A voice of one crying in the desert: Prepare ye the way of the Lord, make straight his paths." },
      { verse: 4, text: "John was in the desert, baptizing and preaching the baptism of penance for the remission of sins." },
      { verse: 5, text: "And all the country of Judea went out to him: and all Jerusalem: and they were baptized by him in the river Jordan, confessing their sins." },
      { verse: 6, text: "And John was clothed with camel's hair, and a leather girdle about his loins; and he ate locusts and wild honey." },
      { verse: 7, text: "And he preached, saying: There cometh after me one mightier than I, the latchet of whose shoes I am not worthy to stoop down and loose." },
      { verse: 8, text: "I have baptized you with water; but he shall baptize you with the Holy Ghost." },
      { verse: 9, text: "And it came to pass in those days, that Jesus came from Nazareth of Galilee, and was baptized by John in the Jordan." },
      { verse: 10, text: "And forthwith coming up out of the water, he saw the heavens open, and the Spirit as a dove descending, and remaining on him." },
      { verse: 11, text: "And a voice came from heaven: Thou art my beloved Son; in thee I am well pleased." },
      { verse: 12, text: "And immediately the Spirit drove him out into the desert." },
      { verse: 13, text: "And he was in the desert forty days and forty nights, and was tempted by Satan; and he was with beasts, and the angels ministered to him." },
      { verse: 14, text: "And after John was delivered up, Jesus came into Galilee, preaching the gospel of the kingdom of God," },
      { verse: 15, text: "And saying: The time is accomplished, and the kingdom of God is at hand: repent, and believe the gospel." },
    ],
  },
];

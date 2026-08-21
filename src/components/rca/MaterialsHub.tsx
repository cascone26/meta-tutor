"use client";

type Material = {
  title: string;
  description: string;
  links: { label: string; url: string; type: "official" | "archive" | "library" }[];
};

const RELIGION_6_MATERIALS: Material[] = [
  {
    title: "Baltimore Catechism No. 2",
    description: "321 questions and answers on Catholic faith. Complete reference built into the app.",
    links: [{ label: "View in app", url: "/rca/religion-6/catechism", type: "official" }],
  },
  {
    title: "Gospel of Mark (Douay-Rheims)",
    description: "Complete Gospel text, all 16 chapters. Complete reference built into the app.",
    links: [{ label: "View in app", url: "/rca/religion-6/gospel-mark", type: "official" }],
  },
  {
    title: "Gospel of Luke (Douay-Rheims)",
    description: "Complete Gospel text, all 24 chapters. Complete reference built into the app.",
    links: [{ label: "View in app", url: "/rca/religion-6/gospel-luke", type: "official" }],
  },
  {
    title: "Behold and See 6 (Science)",
    description: "Catholic hands-on science textbook + workbook, published by Catholic Heritage Curricula.",
    links: [
      {
        label: "Official (chcweb.com)",
        url: "https://chcweb.com/product/behold-and-see-6/",
        type: "official",
      },
    ],
  },
  {
    title: "Book of the Ancient World (History)",
    description: "Dorothy Mills, 1923 — original edition is public domain, full text free to read.",
    links: [
      {
        label: "Read free (Archive.org)",
        url: "https://archive.org/details/ancientworld",
        type: "library",
      },
      {
        label: "Memoria Press eBook (current edition)",
        url: "https://www.memoriapress.com/curriculum/ebooks/book-of-the-ancient-world-ebook/",
        type: "official",
      },
    ],
  },
  {
    title: "Logic of English: Essentials C",
    description: "Scope & Sequence guide and planning resources. Free downloads from publisher.",
    links: [
      {
        label: "Official Downloads (logicofenglish.com)",
        url: "https://www.logicofenglish.com/pages/downloads",
        type: "official",
      },
    ],
  },
  {
    title: "Saxon Math 7/6",
    description: "Complete textbook available through Internet Archive's Open Library.",
    links: [
      {
        label: "Borrow via Open Library",
        url: "https://openlibrary.org/search?q=Saxon+Math+7%2F6&mode=everything",
        type: "library",
      },
    ],
  },
  {
    title: "First Form Latin: Teacher Manual",
    description: "Teacher's guide available through Internet Archive for reference.",
    links: [
      {
        label: "Search Archive.org",
        url: "https://archive.org/search.php?query=First+Form+Latin",
        type: "library",
      },
    ],
  },
];

export default function MaterialsHub() {
  return (
    <div className="w-full space-y-4">
      {RELIGION_6_MATERIALS.map((material, idx) => (
        <div
          key={idx}
          className="border border-[#d9e4d3] rounded-lg bg-[#fbf8f0] p-4 hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-1">{material.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{material.description}</p>
          <div className="flex flex-wrap gap-2">
            {material.links.map((link, linkIdx) => (
              <a
                key={linkIdx}
                href={link.url}
                target={link.type === "official" ? "_self" : "_blank"}
                rel={link.type === "official" ? "" : "noopener noreferrer"}
                className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                style={
                  link.type === "official"
                    ? {
                        borderColor: "#3f7ea6",
                        color: "#3f7ea6",
                      }
                    : link.type === "library"
                      ? {
                          borderColor: "#6b8e5a",
                          color: "#6b8e5a",
                        }
                      : {
                          borderColor: "#999",
                          color: "#666",
                        }
                }
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

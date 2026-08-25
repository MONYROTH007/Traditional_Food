export type Ingredient = {
  group: string;
  items: string[];
};

export type Recipe = {
  slug: string;
  name: string;
  khmer: string;
  pronunciation: string;
  tagline: string;
  image: string;
  category: string;
  servedAs: string;
  story: string[];
  ingredients: Ingredient[];
  toServe: string[];
};

export const recipes: Recipe[] = [
  {
    slug: "mee-kola",
    name: "Mee Kola",
    khmer: "មីកូឡា/មីកាឡា",
    pronunciation: "mee koh-LAH",
    tagline: "Dry rice noodles, tossed bright, eaten at room temperature",
    image: "/images/mee-kola.jpg",
    category: "Noodles",
    servedAs: "Breakfast, light lunch, or a hot-season plate",
    story: [
      "Mee Kola belongs to the Kola — sometimes written Kula — people, traders of Shan and Burmese descent who settled around Battambang and neighbouring Pailin generations ago, drawn first by the gem mines and later by the rice land. They brought with them a taste for dried shrimp and roasted peanuts, and married it to Khmer pickles and fish sauce. What came out of that kitchen is a dry noodle salad rather than a soup, built to be eaten at room temperature in a province where the afternoons run hot.",
      "Older residents of Battambang still call it a dish for gathering — a plate mixed at the table, not the stove, so that everyone can pull it apart with their own hands and season it to their own taste. Away from home, Cambodians abroad have taken to calling it their \"summer noodles,\" the dish they cook on the hottest days because it asks for no fire once the noodles are boiled.",
      "It stayed a regional specialty for a long time, known mostly to people from Battambang and Pailin, before it started travelling with them to Phnom Penh and further afield — carrying a little of the Kola community's story on every plate."
    ],
    ingredients: [
      {
        group: "Noodles & toppings",
        items: [
          "Thin rice vermicelli, boiled and cooled",
          "Bean sprouts, blanched",
          "1 hard-boiled egg per serving, quartered",
          "Dried shrimp, pounded fine",
          "Roasted peanuts, crushed",
          "Fried garlic"
        ]
      },
      {
        group: "Pickled vegetables",
        items: [
          "Carrot, shredded",
          "Daikon radish or green papaya, shredded",
          "Cucumber, sliced thin",
          "Garlic, chopped",
          "Rice vinegar, sugar, and salt for the pickle"
        ]
      },
      {
        group: "Dressing",
        items: [
          "Fish sauce",
          "Palm sugar",
          "Fresh lime juice",
          "Garlic and fresh chili, pounded",
          "A splash of the pickle brine"
        ]
      }
    ],
    toServe: [
      "Toss the noodles with the dressing just before serving, not before.",
      "Pile the pickled vegetables and herbs on top rather than mixing them in — let each person fold their own plate together.",
      "Finish with the dried shrimp, peanuts, and fried garlic last, so they stay crisp."
    ]
  },
  {
    slug: "num-banh-chok",
    name: "Num Banh Chok",
    khmer: "នំបញ្ចុក",
    pronunciation: "num bahn-CHOK",
    tagline: "Cambodia's own rice noodles, in a green fish gravy",
    image: "/images/num-banh-chok.jpg",
    category: "Noodles",
    servedAs: "Breakfast, sold fresh each morning",
    story: [
      "Num banh chok is old enough that Khmer food historians trace it back to the Angkorian era, and the noodles themselves — fermented rice, pressed by hand through a stone or wooden mill — are considered by many Cambodians to be the true ancestor of noodle cooking in the region. Battambang, sitting in the country's rice basket, has long been one of the places where that rice-milling tradition runs deepest.",
      "The dish still moves the way it always has: women carry baskets of noodles and gravy on poles balanced across their shoulders, walking the early morning markets and calling out to households before the day's heat sets in. It is also offered to monks at the pagoda, which says something about how central this bowl is to ordinary Khmer life — equal parts breakfast, errand, and small ceremony.",
      "There's a well-loved folk tale about a clever man named Thun Chey who is said to have out-argued the Chinese emperor and, in doing so, planted the idea of noodle-making in China. Most Cambodians will tell you this story with a smile, only half-serious — but it's their way of saying that num banh chok, and the rice-noodle tradition it comes from, belongs to them first."
    ],
    ingredients: [
      {
        group: "Noodles",
        items: [
          "Fresh fermented rice noodles (num banh chok), or dried rice vermicelli as a substitute"
        ]
      },
      {
        group: "Fish gravy (kroeung base)",
        items: [
          "Freshwater fish, such as snakehead, poached and flaked",
          "Lemongrass",
          "Turmeric, fresh or ground",
          "Galangal",
          "Garlic and shallot",
          "Kaffir lime leaf",
          "Fish sauce",
          "Coconut milk (Battambang and Siem Reap style)"
        ]
      },
      {
        group: "Fresh vegetables and herbs",
        items: [
          "Cucumber, sliced",
          "Banana blossom, shredded",
          "Water lily stems",
          "Bean sprouts",
          "Mint and Khmer basil"
        ]
      }
    ],
    toServe: [
      "Serve the noodles at room temperature, ladling the warm gravy over just before eating.",
      "Pile the raw vegetables and herbs high — they are not a garnish here, but half the dish.",
      "Let each person finish their own bowl with lime, chili, or extra fish sauce at the table."
    ]
  },
  {
    slug: "larp-khmer",
    name: "Larp Khmer",
    khmer: "ឡាបខ្មែរ",
    pronunciation: "lahp khmai",
    tagline: "Lime-cured beef salad, sharp with herbs and chili",
    image: "/images/larb-khmer.jpg",
    category: "Salad",
    servedAs: "A festive dish, shared family-style",
    story: [
      "Larp Khmer — also called phlea sach ko, literally \"beef salad\" — is Cambodia's answer to the larb found across Laos and northern Thailand, but it takes its own path. Where other versions lean on cooked, minced meat, the Khmer table often prefers the beef thinly sliced and cured raw in lime juice, the acid turning the meat pale and tender the way heat would, in a method closer to ceviche than to stir-frying.",
      "Beef has traditionally been the more expensive, more special-occasion meat in Cambodian households, so larp khmer tends to show up at gatherings and family celebrations rather than as an everyday plate. It's built to be shared from a single platter at the center of the table, with everyone helping themselves — a dish that assumes company.",
      "The name \"larp\" itself is thought to come from a regional word meaning \"to chop finely,\" a nod to the technique at its heart, even in the Khmer version where the beef is sliced rather than minced. Whichever way it's cut, the dressing of lime, fish sauce, garlic, and chili stays the constant thread tying it to its neighbors across the Mekong."
    ],
    ingredients: [
      {
        group: "Beef & cure",
        items: [
          "Beef sirloin or tenderloin, sliced very thin",
          "Fresh lime juice, enough to coat and cure the meat",
          "Fish sauce",
          "Garlic, minced",
          "Fresh chili, chopped"
        ]
      },
      {
        group: "Aromatics",
        items: [
          "Lemongrass, thinly sliced",
          "Galangal or ginger, grated",
          "Kaffir lime leaves, very finely sliced",
          "Shallot, sliced thin"
        ]
      },
      {
        group: "Herbs & to finish",
        items: [
          "Mint leaves",
          "Cilantro",
          "Green onion",
          "Toasted rice powder",
          "Palm sugar, to balance"
        ]
      },
      {
        group: "To serve alongside",
        items: [
          "Lettuce leaves for wrapping",
          "Sliced cucumber",
          "Extra lime wedges"
        ]
      }
    ],
    toServe: [
      "Let the beef sit in the lime juice for ten to fifteen minutes only — enough to cure it, not enough to toughen it.",
      "Fold in the herbs and toasted rice powder last, right before the platter goes to the table.",
      "Eat it wrapped in lettuce with cucumber, the way it's shared at a Khmer family gathering."
    ]
  },
  {
    slug: "song-vak",
    name: "Song Vak",
    khmer: "សង្វាក់",
    pronunciation: "song-VAK",
    tagline: "Battambang's own fish cake, wrapped in banana leaf",
    image: "/images/song-vak.jpg",
    category: "Street food",
    servedAs: "A beer snack, or wrapped and eaten by hand at a street stall",
    story: [
      "Ask anyone in Battambang City to name the dish their town is known for on the street, and song vak usually comes up first. It's a sour, well-seasoned fish cake, packed and either steamed or grilled tightly inside a banana leaf, sold in small bundles along the Sangker riverside stalls and night markets that give Battambang its street food reputation.",
      "The way it's eaten is as much a part of the dish as the fish cake itself: you unwrap the banana leaf, tear off a piece, wrap it in lettuce with cucumber, herbs, and a tangle of rice noodles, and eat it all together as one bite — or simply pick at it plain as a snack alongside a cold beer with friends, which is exactly how it's most often enjoyed along the riverside in the evening.",
      "Song vak has since travelled well beyond its home province and can now be found in markets from Siem Reap to Phnom Penh, each city putting its own small spin on it. But in Battambang, where it started, people will still tell you theirs is the original, and that it's worth the trip to the riverside stalls to taste it made the way it always has been."
    ],
    ingredients: [
      {
        group: "Fish cake",
        items: [
          "Freshwater fish paste, well seasoned and slightly sour",
          "Garlic and shallot, pounded",
          "Salt and a touch of sugar to balance",
          "Banana leaf, for wrapping and steaming"
        ]
      },
      {
        group: "To eat alongside",
        items: [
          "Rice vermicelli noodles",
          "Lettuce leaves, for wrapping",
          "Cucumber, sliced",
          "Shredded cabbage",
          "Fresh herbs — Khmer basil and mint",
          "Carrot, sliced or shredded"
        ]
      },
      {
        group: "Dipping sauce",
        items: [
          "Roasted peanuts, crushed",
          "Fresh red chili",
          "Fish sauce, lime, and a little sugar"
        ]
      }
    ],
    toServe: [
      "Steam the wrapped banana-leaf parcels until firm, then let them cool slightly before unwrapping.",
      "Tear the fish cake into pieces rather than slicing it — it wraps more easily in lettuce that way.",
      "Build each bite yourself: lettuce, a little fish cake, noodles, herbs, and a dip in the peanut-chili sauce."
    ]
  },
  {
    slug: "prahok-ktis",
    name: "Prahok Ktis",
    khmer: "ប្រហុកខ្ទិះ",
    pronunciation: "prah-HOK kh-TIS",
    tagline: "Fermented fish and coconut, eaten with a plate of raw vegetables",
    image: "/images/prahok-ktis.jpg",
    category: "Dip",
    servedAs: "A shared dip, with rice and raw vegetables on the side",
    story: [
      "You cannot talk about Khmer cooking for long without arriving at prahok — the fermented fish paste that Cambodians have made and relied on for centuries, salted and left to cure for months until it turns pungent, protein-rich, and unmistakably itself. People often call it Cambodia's answer to blue cheese: intimidating to the uninitiated, and deeply loved at home.",
      "Prahok ktis is where that fermented fish paste is given its gentlest introduction. Minced pork and a yellow kroeung of lemongrass, turmeric, garlic, and galangal are simmered down with coconut cream and a little tamarind and palm sugar, softening prahok's sharp edge into something rounder and more approachable, studded with small pea eggplants and kaffir lime leaf.",
      "In Cambodian homes it has long been treated as an everyday, unglamorous comfort — an affordable dip that stretches a simple lunch of rice and whatever vegetables are in the garden into a full meal. It's still eaten that way today, with a shared bowl set in the middle of the table and a pile of fresh vegetables passed around for dipping."
    ],
    ingredients: [
      {
        group: "Base",
        items: [
          "Prahok sach (fermented fish paste), rinsed",
          "Minced pork",
          "Coconut cream",
          "Tamarind juice",
          "Palm sugar"
        ]
      },
      {
        group: "Yellow kroeung",
        items: [
          "Lemongrass",
          "Garlic",
          "Shallot",
          "Turmeric",
          "Galangal",
          "Fresh red chili"
        ]
      },
      {
        group: "To finish",
        items: [
          "Pea eggplants",
          "Kaffir lime leaves, sliced fine"
        ]
      },
      {
        group: "To serve alongside",
        items: [
          "Cucumber, sliced",
          "Eggplant, sliced",
          "Cabbage or lettuce leaves",
          "Long beans",
          "Steamed jasmine rice"
        ]
      }
    ],
    toServe: [
      "Simmer the paste slowly, letting the coconut cream soften the prahok rather than mask it.",
      "Add the pea eggplants near the end so they keep a little bite.",
      "Serve warm, with a generous plate of raw, crunchy vegetables for scooping and dipping."
    ]
  }
];

export function getRecipeBySlug(slug: string) {
  return recipes.find((r) => r.slug === slug);
}

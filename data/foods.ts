export type Food = {
  id: string;
  name: string;
  khmerName: string;
  pronunciation: string;
  mealTime: "Breakfast" | "Lunch & Dinner" | "Anytime";
  region: string;
  color: string; // tailwind class for placeholder art
  accent: string;
  summary: string;
  description: string;
  ingredients: string[];
  originNote: string;
  source: { label: string; url: string };
};

export const foods: Food[] = [
  {
    id: "amok-trey",
    name: "Fish Amok",
    khmerName: "អាម៉ុកត្រី",
    pronunciation: "ah-MOK tray",
    mealTime: "Lunch & Dinner",
    region: "Nationwide — closely tied to the Tonlé Sap region",
    color: "from-gold-dim to-brick",
    accent: "gold",
    summary:
      "Widely regarded as Cambodia's national dish: a delicate, custard-like fish curry steamed inside a banana leaf cup.",
    description:
      "Freshwater fish is folded into a paste of lemongrass, galangal, turmeric, and kaffir lime, then loosened with coconut milk and egg until it sets into a soft, mousse-like curd when steamed. The dish is traditionally cooked and served in a bowl folded from banana leaf, and finished with a spoon of thick coconut cream and shredded kaffir lime leaf. Its richness comes directly from the Tonlé Sap Lake, Southeast Asia's largest freshwater fishery, which has supplied Cambodian kitchens with fish for generations.",
    ingredients: [
      "Freshwater fish (snakehead or catfish)",
      "Kroeung (lemongrass-galangal paste)",
      "Coconut milk & coconut cream",
      "Egg",
      "Kaffir lime leaf",
      "Banana leaf, for steaming",
    ],
    originNote:
      "Considered Cambodia's signature dish; steaming fish in banana leaf is a technique that predates modern cookware.",
    source: {
      label: "Wikipedia — Amok (dish)",
      url: "https://en.wikipedia.org/wiki/Amok_(dish)",
    },
  },
  {
    id: "nom-banh-chok",
    name: "Khmer Noodles",
    khmerName: "នំបញ្ចុក",
    pronunciation: "num bahn-CHOK",
    mealTime: "Breakfast",
    region: "Nationwide, rooted in rural Khmer villages",
    color: "from-sage to-paddy-light",
    accent: "sage",
    summary:
      "Often called Cambodia's oldest dish: fresh rice noodles under a green fish-and-herb gravy, piled with garden vegetables.",
    description:
      "Rice is soaked, ground, and pressed into soft noodles, then topped with a fragrant green gravy called samlar built from fish, lemongrass, turmeric root, and kaffir lime. A tangle of fresh vegetables — banana blossom, cucumber, mint, bean sprouts, and water lily stems — is heaped on top so every bowl becomes part noodle dish, part salad. It's traditionally a breakfast food, historically sold each morning by vendors who carried baskets of noodles on a shoulder pole through the village.",
    ingredients: [
      "Fresh rice noodles",
      "Freshwater fish",
      "Turmeric root",
      "Lemongrass & kaffir lime",
      "Banana blossom",
      "Fresh herbs & bean sprouts",
    ],
    originNote:
      "Rural in origin and still sold by roadside and market vendors each morning across the countryside.",
    source: {
      label: "Wikipedia — Num banh chok",
      url: "https://en.wikipedia.org/wiki/Num_banh_chok",
    },
  },
  {
    id: "bai-sach-chrouk",
    name: "Pork & Rice",
    khmerName: "បាយសាច់ជ្រូក",
    pronunciation: "bai sach CHROUK",
    mealTime: "Breakfast",
    region: "Phnom Penh street carts",
    color: "from-brick to-gold-dim",
    accent: "brick",
    summary:
      "Phnom Penh's classic street breakfast: thin-sliced grilled pork fanned over broken rice with pickles and clear broth.",
    description:
      "Pork shoulder is marinated in coconut milk, garlic, and a touch of sugar before being grilled slowly over charcoal until the edges char. It's sliced thin and laid over broken rice — rice grains fractured during milling, which cook up softer and were once the cheaper cut sold to the working class. A small bowl of clear pork broth and a tangle of pickled cucumber and daikon round out the plate. Charcoal smoke from pork carts is one of the defining smells of early morning Phnom Penh.",
    ingredients: [
      "Pork shoulder, thin-sliced",
      "Coconut milk marinade",
      "Broken rice",
      "Pickled cucumber & daikon",
      "Clear pork broth",
      "Scallion oil",
    ],
    originNote:
      "A working-class breakfast built around broken rice, now eaten across every income level in the capital.",
    source: {
      label: "Wikipedia — Bai sach chrouk",
      url: "https://en.wikipedia.org/wiki/Bai_sach_chrouk",
    },
  },
  {
    id: "kuy-teav",
    name: "Noodle Soup",
    khmerName: "គុយទាវ",
    pronunciation: "kooy-TEAV",
    mealTime: "Breakfast",
    region: "Nationwide, especially Phnom Penh & Kampot",
    color: "from-paddy-light to-sage",
    accent: "sage",
    summary:
      "A clear pork or beef bone broth over rice noodles, built up at the table with garlic oil, herbs, and chili.",
    description:
      "Bones are simmered for hours into a light, clean broth, then ladled over thin rice noodles with slices of pork, beef balls, or offal depending on the stall. The soup itself arrives simply dressed, and diners finish it themselves at the table with fried garlic, scallions, bean sprouts, lime, and chili to taste. The dish traces back to Teochew Chinese immigrant communities who settled in Cambodia and adapted their noodle soups to local broths and produce, making it one of the clearest examples of Khmer-Chinese food history.",
    ingredients: [
      "Rice noodles",
      "Pork or beef bone broth",
      "Pork slices or beef balls",
      "Fried garlic",
      "Bean sprouts & scallion",
      "Lime & chili",
    ],
    originNote:
      "Brought by Teochew Chinese immigrants and localized into one of the most common breakfasts in the country.",
    source: {
      label: "Wikipedia — Kuy teav",
      url: "https://en.wikipedia.org/wiki/Kuy_teav",
    },
  },
  {
    id: "lok-lak",
    name: "Beef Lok Lak",
    khmerName: "ឡុកឡាក់",
    pronunciation: "lohk LAHK",
    mealTime: "Lunch & Dinner",
    region: "Nationwide — sauce tradition tied to Kampot",
    color: "from-brick-light to-paddy",
    accent: "brick",
    summary:
      "Wok-seared cubes of marinated beef over crisp lettuce and tomato, dipped in a sharp lime-and-pepper sauce.",
    description:
      "Cubed beef is marinated briefly in soy, oyster sauce, and garlic, then seared hot and fast so the outside caramelizes while the center stays tender. It's plated over a bed of lettuce, tomato, and sliced onion, often with a fried egg on top, and served with a dipping sauce of lime juice, crushed black pepper, and salt. That pepper is typically Kampot pepper, grown in the red soil around Kampot province and considered among the most prized peppercorns in the world, giving the sauce its distinctive sharp heat.",
    ingredients: [
      "Beef, cubed",
      "Garlic & oyster sauce marinade",
      "Lettuce, tomato, red onion",
      "Kampot black pepper",
      "Lime juice",
      "Fried egg (optional)",
    ],
    originNote:
      "A French-colonial-era steakhouse dish adapted into a Khmer everyday favorite, built around Kampot pepper.",
    source: {
      label: "Wikipedia — Lok lak",
      url: "https://en.wikipedia.org/wiki/Lok_lak",
    },
  },
];

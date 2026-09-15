import larbKhmer from "@/assets/larb-khmer.jpg";
import meeKola from "@/assets/mee-kola.jpg";
import numBanhChok from "@/assets/num-banh-chok.jpg";
import prahokKtis from "@/assets/prahok-ktis.jpg";
import songVak from "@/assets/song-vak.jpg";
import amokTrey from "@/assets/amok-trey.jpg";
import kralan from "@/assets/kralan.jpg";
import teukKreung from "@/assets/teuk-kreung.jpg";
import lortJrouk from "@/assets/lort-jrouk.jpg";

export type RecipeCategory =
  "Soups & Stews" | "Main Dishes" | "Noodles & Rice" | "Snacks & Desserts";

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  "Soups & Stews",
  "Main Dishes",
  "Noodles & Rice",
  "Snacks & Desserts",
];

export type Recipe = {
  id: string;
  name: string;
  khmer: string;
  category: RecipeCategory;
  place: string;
  time: string;
  servings?: string;
  note: string;
  image: string;
  ingredients: string[];
  instructions: string[];
};

export const recipes: Recipe[] = [
  {
    id: "larb-khmer",
    name: "Larb Khmer",
    khmer: "ឡាបខ្មែរ",
    category: "Main Dishes",
    place: "Family tables across Battambang town",
    time: "30 min",
    servings: "4 servings",
    note: "Minced beef or pork tossed with toasted rice powder, fresh herbs, lime and a little prahok — eaten warm with cabbage leaves.",
    image: larbKhmer.src,
    ingredients: [
      "400g lean beef or pork, finely minced",
      "2 tbsp toasted rice powder (phlea/larb rice)",
      "1 tbsp prahok, finely chopped & dissolved in 2 tbsp warm water",
      "3 tbsp fresh lime juice",
      "2 tbsp fish sauce",
      "3 fresh bird's eye chilies, thinly sliced",
      "4 shallots, thinly sliced",
      "1 cup fresh herbs (sawtooth coriander, mint, Thai basil)",
      "Crisp raw cabbage leaves & green long beans for serving",
    ],
    instructions: [
      "Heat a skillet over medium heat and stir-fry the minced meat with dissolved prahok until fully cooked through.",
      "Transfer cooked meat to a mixing bowl and allow to cool slightly for 2 minutes.",
      "Add lime juice, fish sauce, bird's eye chilies, and sliced shallots; mix thoroughly to infuse flavor.",
      "Fold in toasted rice powder and torn fresh herbs right before serving.",
      "Serve immediately alongside crisp cabbage leaves and green long beans for wrapping.",
    ],
  },
  {
    id: "mee-kola",
    name: "Mee Kola",
    khmer: "មីកូឡា/មីកាឡា",
    category: "Noodles & Rice",
    place: "Psar Boeung Chhouk noodle stalls",
    time: "40 min",
    servings: "2–3 servings",
    note: "Battambang's own egg noodles dressed with a sweet-sour pork sauce, peanuts, herbs and a squeeze of lime.",
    image: meeKola.src,
    ingredients: [
      "300g fresh egg noodles, boiled & tossed in a drop of sesame oil",
      "200g pork shoulder, finely minced",
      "2 tbsp roasted peanuts, coarsely crushed",
      "2 hard-boiled eggs, halved",
      "1 cup fresh bean sprouts and julienned cucumber",
      "2 tbsp sweet tamarind sauce",
      "1 tbsp soy sauce & 1 tsp palm sugar",
      "Fresh coriander & lime wedges for serving",
    ],
    instructions: [
      "In a small wok, simmer minced pork with soy sauce, palm sugar, and tamarind until glossy and savory-sweet.",
      "Divide cooked egg noodles evenly into warm serving bowls.",
      "Spoon the hot pork tamarind sauce generously over the noodles.",
      "Top with crushed roasted peanuts, hard-boiled egg halves, fresh bean sprouts, and cucumber julienne.",
      "Garnish with coriander and serve hot with fresh lime wedges on the side.",
    ],
  },
  {
    id: "teuk-kreung",
    name: "Teuk Kreung",
    khmer: "ទឹកគ្រឿង",
    category: "Soups & Stews",
    place: "Ek Phnom village homes",
    time: "1 hr",
    servings: "4 servings",
    note: "A sour lemongrass soup with beef and tamarind, seasoned with prahok and finished with a handful of bitter herbs.",
    image: teukKreung.src,
    ingredients: [
      "300g freshwater catfish or snakehead fish fillets",
      "3 tbsp yellow kroeung (lemongrass, turmeric, galangal, garlic, kaffir lime leaf)",
      "1 tbsp prahok, steamed and mashed",
      "2 tbsp roasted peanuts, pounded",
      "1 tbsp tamarind paste dissolved in water",
      "3 cups fish broth or filtered water",
      "1 tbsp fish sauce & 1 tsp palm sugar",
      "Fresh platter of raw & blanched seasonal vegetables (eggplant, winged beans, long beans)",
    ],
    instructions: [
      "Poach fish fillets in water until tender; flake fish meat and gently pound with kroeung and prahok in a mortar.",
      "In a soup pot, simmer fish broth, the pounded fish-kroeung mixture, and tamarind juice over medium heat for 15 minutes.",
      "Stir in crushed roasted peanuts, fish sauce, and palm sugar; adjust seasoning to balance sour, savory, and prahok richness.",
      "Ladle soup into bowls and serve alongside an abundant platter of fresh raw and steamed vegetables.",
    ],
  },
  {
    id: "num-banh-chok",
    name: "Num Banh Chok",
    khmer: "នំបញ្ចុក",
    category: "Noodles & Rice",
    place: "Psar Nath morning market",
    time: "2 hr",
    servings: "4–6 servings",
    note: "Fermented rice noodles under a green fish gravy of lemongrass and turmeric, eaten at dawn with banana blossom and cucumber.",
    image: numBanhChok.src,
    ingredients: [
      "500g fresh fermented rice noodles (Num Banh Chok)",
      "400g mudfish or tilapia fillets",
      "4 tbsp yellow kroeung paste",
      "2 tbsp prahok, strained with warm water",
      "4 cups thick coconut milk & 2 cups thin coconut milk",
      "2 tbsp fish sauce & 1 tbsp palm sugar",
      "Garnishes: shredded banana blossom, cucumber, mint leaves, water spinach stems",
    ],
    instructions: [
      "Boil fish fillets with salt; debone and pound fish meat together with kroeung in a wooden mortar until smooth.",
      "In a clay pot, simmer thin coconut milk with strained prahok and pounded fish-kroeung paste for 20 minutes.",
      "Add thick coconut milk, fish sauce, and palm sugar. Simmer gently on low heat without boiling over.",
      "Portion fresh rice noodles into deep bowls and pour hot golden green fish gravy over the top.",
      "Serve with shredded banana blossom, cucumber julienne, and fresh wild mint.",
    ],
  },
  {
    id: "prahok-ktis",
    name: "Prahok Ktis",
    khmer: "ប្រហុកខ្ទិះ",
    category: "Main Dishes",
    place: "Battambang town family tables",
    time: "35 min",
    servings: "4 servings",
    note: "Minced pork simmered with prahok, coconut cream and kroeung into a thick dip for raw eggplant, cabbage and long beans.",
    image: prahokKtis.src,
    ingredients: [
      "250g pork belly or minced pork with fat",
      "2 tbsp prahok, finely chopped",
      "3 tbsp yellow kroeung paste",
      "1.5 cups thick coconut cream",
      "1 tbsp pea eggplants (mak keuk)",
      "1 tbsp palm sugar & 1 tbsp fish sauce",
      "Sliced fresh bird's eye chilies",
      "Crisp raw vegetables (cabbage, cucumber, raw eggplant, long beans)",
    ],
    instructions: [
      "In a saucepan, render minced pork belly over medium heat until fat releases.",
      "Add yellow kroeung paste and chopped prahok, frying until fragrant and golden.",
      "Pour in coconut cream and pea eggplants; simmer over low heat until oil separates and dip thickens.",
      "Season with palm sugar and sliced chilies to balance savory prahok and creamy coconut milk.",
      "Transfer to a dipping bowl and serve warm with a platter of crisp seasonal raw vegetables.",
    ],
  },
  {
    id: "samlor-korko",
    name: "Samlor Korko",
    khmer: "ឡតជ្រក់ល្ហុង",
    category: "Soups & Stews",
    place: "Rice fields of Bavel district",
    time: "1 hr 15 min",
    servings: "4–6 servings",
    note: "The old harvest soup: whatever the garden gives, thickened with toasted ground rice and a spoon of prahok.",
    image: lortJrouk.src,
    ingredients: [
      "300g catfish fillets or pork ribs, cut into pieces",
      "3 tbsp yellow kroeung paste",
      "1 tbsp prahok, strained",
      "3 tbsp toasted ground rice powder (thkno)",
      "3 cups mixed garden vegetables (green papaya, pumpkin, eggplant, long beans, ivy gourd leaves)",
      "4 cups light broth or water",
      "2 tbsp fish sauce & 1 tsp palm sugar",
    ],
    instructions: [
      "Sauté kroeung paste and prahok in a pot with a splash of oil until fragrant.",
      "Add fish or pork pieces and toss to coat in paste for 3 minutes.",
      "Pour in water/stock and bring to a simmer. Add green papaya and pumpkin; cook for 10 minutes.",
      "Stir in toasted ground rice powder to thicken the soup, then add eggplant and leafy greens.",
      "Simmer until vegetables are tender. Serve steaming hot in family-sized soup bowls.",
    ],
  },
  {
    id: "kralan",
    name: "Kralan",
    khmer: "ក្រឡាន",
    category: "Snacks & Desserts",
    place: "Roadside stalls on National Road 5",
    time: "1 hr 30 min",
    servings: "4 bamboo tubes",
    note: "Sticky rice, black beans and coconut milk packed into a bamboo tube and roasted slowly over charcoal until the bamboo blackens.",
    image: kralan.src,
    ingredients: [
      "500g glutinous sticky rice, soaked overnight",
      "150g black beans, pre-cooked until tender",
      "1 cup fresh thick coconut milk",
      "2 tbsp palm sugar & 1 tsp salt",
      "Fresh hollow bamboo stalks, cut into 30cm sections",
      "Banana leaf or coconut husk plugs",
    ],
    instructions: [
      "Mix soaked glutinous rice with cooked black beans, thick coconut milk, palm sugar, and salt.",
      "Pack the sticky rice mixture tightly into clean bamboo tubes, leaving 5cm space at the top.",
      "Seal open ends securely with folded banana leaf and coconut husk.",
      "Roast bamboo stalks slowly over charcoal embers, rotating regularly for 1 to 1.5 hours until outer bamboo charrs.",
      "Peel back outer charred bamboo skin to reveal sweet, coconut-scented roast sticky rice.",
    ],
  },
  {
    id: "song-vak",
    name: "Song Vak",
    khmer: "សង្វាក់",
    category: "Snacks & Desserts",
    place: "Sangkae riverside kitchens",
    time: "50 min",
    servings: "3–4 servings",
    note: "Freshwater fish simmered in a clear lemongrass broth with fingerroot and young papaya — a quiet Battambang river dish.",
    image: songVak.src,
    ingredients: [
      "400g small freshwater fish, cleaned",
      "2 tbsp yellow kroeung paste with extra fingerroot (ksay)",
      "1 cup young green papaya, julienned",
      "4 cups clear fish stock",
      "1 tbsp fish sauce & 1 tbsp lime juice",
      "Fresh holy basil leaves & bird's eye chilies",
    ],
    instructions: [
      "Bring clear fish stock to a simmer with kroeung and sliced fingerroot.",
      "Slide in freshwater fish and simmer on medium heat for 8 minutes without stirring.",
      "Add julienned young papaya and cook until tender-crisp.",
      "Season with fish sauce and lime juice; remove from heat.",
      "Garnish with holy basil and fresh chilies before serving.",
    ],
  },
  {
    id: "amok-trey",
    name: "Amok Trey",
    khmer: "អាម៉ុកត្រី",
    category: "Main Dishes",
    place: "Sangkae riverside kitchens",
    time: "45 min",
    servings: "4 banana leaf cups",
    note: "Freshwater fish folded into coconut cream and yellow kroeung, then steamed in a banana leaf cup until it sets like a custard.",
    image: amokTrey.src,
    ingredients: [
      "400g freshwater fish fillets, cubed",
      "4 tbsp yellow kroeung paste",
      "1.5 cups coconut cream",
      "1 egg, beaten",
      "1 tbsp prahok, strained",
      "1 tbsp fish sauce & 1 tsp palm sugar",
      "1 cup sliced noni leaves (slok kror gney) or Swiss chard",
      "Banana leaf square cups (Kanthong) for steaming",
    ],
    instructions: [
      "Whisk yellow kroeung, coconut cream, beaten egg, prahok, fish sauce, and palm sugar into a smooth custard mixture.",
      "Fold fish cubes gently into the coconut kroeung mixture.",
      "Line the bottom of folded banana leaf cups with sliced noni leaves.",
      "Spoon fish custard into each cup and steam over boiling water for 25 minutes until set.",
      "Top with a drizzle of coconut cream and slivered kaffir lime leaf before serving.",
    ],
  },
];

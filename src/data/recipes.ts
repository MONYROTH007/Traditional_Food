import kralan from "@/assets/kralan.jpg";
import amok from "@/assets/amok.jpg";
import machuKroeung from "@/assets/machu-kroeung.jpg";
import numBanhChok from "@/assets/num-banh-chok.jpg";
import prahokKtis from "@/assets/prahok-ktis.jpg";
import samlorKorko from "@/assets/samlor-korko.jpg";
import numKrok from "@/assets/num-krok.jpg";
import chaKroeung from "@/assets/cha-kroeung.jpg";
import baiSachChrouk from "@/assets/bai-sach-chrouk.jpg";

export type RecipeCategory =
  | "Soups & Stews"
  | "Main Dishes"
  | "Noodles & Rice"
  | "Snacks & Desserts";

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
  note: string;
  image: string;
};

export const recipes: Recipe[] = [
  {
    id: "kralan",
    name: "Kralan",
    khmer: "ក្រឡាន",
    category: "Snacks & Desserts",
    place: "Roadside stalls on National Road 5",
    time: "1 hr 30 min",
    note: "Sticky rice, black beans and coconut milk packed into a bamboo tube and roasted slowly over charcoal until the bamboo blackens.",
    image: kralan,
  },
  {
    id: "amok-trey",
    name: "Amok Trey",
    khmer: "អាម៉ុកត្រី",
    category: "Main Dishes",
    place: "Sangkae riverside kitchens",
    time: "45 min",
    note: "Freshwater fish folded into coconut cream and yellow kroeung, then steamed in a banana leaf cup until it sets like a custard.",
    image: amok,
  },
  {
    id: "samlor-machu-kroeung",
    name: "Samlor Machu Kroeung",
    khmer: "សម្លម្ជូរគ្រឿង",
    category: "Soups & Stews",
    place: "Ek Phnom village homes",
    time: "1 hr",
    note: "A sour lemongrass soup with beef and tamarind, seasoned with prahok and finished with a handful of bitter herbs.",
    image: machuKroeung,
  },
  {
    id: "num-banh-chok",
    name: "Num Banh Chok",
    khmer: "នំបញ្ចុក",
    category: "Noodles & Rice",
    place: "Psar Nath morning market",
    time: "2 hr",
    note: "Fermented rice noodles under a green fish gravy of lemongrass and turmeric, eaten at dawn with banana blossom and cucumber.",
    image: numBanhChok,
  },
  {
    id: "prahok-ktis",
    name: "Prahok Ktis",
    khmer: "ប្រហុកខ្ទិះ",
    category: "Main Dishes",
    place: "Battambang town family tables",
    time: "35 min",
    note: "Minced pork simmered with prahok, coconut cream and kroeung into a thick dip for raw eggplant, cabbage and long beans.",
    image: prahokKtis,
  },
  {
    id: "samlor-korko",
    name: "Samlor Korko",
    khmer: "សម្លករគោ",
    category: "Soups & Stews",
    place: "Rice fields of Bavel district",
    time: "1 hr 15 min",
    note: "The old harvest soup: whatever the garden gives, thickened with toasted ground rice and a spoon of prahok.",
    image: samlorKorko,
  },
  {
    id: "num-krok",
    name: "Num Krok",
    khmer: "នំគ្រក",
    category: "Snacks & Desserts",
    place: "Evening stalls near the Bamboo Train",
    time: "30 min",
    note: "Coconut rice batter poured into a dimpled iron pan over coals, crisp at the edge and soft as cream inside.",
    image: numKrok,
  },
  {
    id: "cha-kroeung-sach-ko",
    name: "Cha Kroeung Sach Ko",
    khmer: "ឆាគ្រឿងសាច់គោ",
    category: "Main Dishes",
    place: "Moung Ruessei roadside eateries",
    time: "25 min",
    note: "Beef stir fried hard and fast with hand pounded lemongrass paste, kaffir lime leaf and a little palm sugar.",
    image: chaKroeung,
  },
  {
    id: "bai-sach-chrouk",
    name: "Bai Sach Chrouk",
    khmer: "បាយសាច់ជ្រូក",
    category: "Noodles & Rice",
    place: "Street corners around Psar Boeung Chhouk",
    time: "40 min",
    note: "Coconut marinated pork grilled over charcoal, served on broken rice with pickles and a bowl of clear broth.",
    image: baiSachChrouk,
  },
];

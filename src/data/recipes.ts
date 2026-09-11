import larbKhmer from "@/assets/larb-khmer.jpg";
import meeKola from "@/assets/mee-kola.jpg";
import numBanhChok from "@/assets/num-banh-chok.jpg";
import placeholderDish from "@/assets/placeholder-dish.svg";
import prahokKtis from "@/assets/prahok-ktis.jpg";
import songVak from "@/assets/song-vak.jpg";
import amokTrey from "@/assets/amok-trey.jpg";
import kralan from "@/assets/kralan.jpg";
import teukKreung from "@/assets/teuk-kreung.jpg";
import lortJrouk from "@/assets/lort-jrouk.jpg";
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
    id: "larb-khmer",
    name: "Larb Khmer",
    khmer: "ឡាបខ្មែរ",
    category: "Main Dishes",
    place: "Family tables across Battambang town",
    time: "30 min",
    note: "Minced beef or pork tossed with toasted rice powder, fresh herbs, lime and a little prahok — eaten warm with cabbage leaves.",
    image: larbKhmer.src,
  },
  {
    id: "mee-kola",
    name: "Mee Kola",
    khmer: "មីកូឡា/មីកាឡា",
    category: "Noodles & Rice",
    place: "Psar Boeung Chhouk noodle stalls",
    time: "40 min",
    note: "Battambang's own egg noodles dressed with a sweet-sour pork sauce, peanuts, herbs and a squeeze of lime.",
    image: meeKola.src,
  },
  {
    id: "teuk-kreung",
    name: "teuk kreung",
    khmer: "ទឹកគ្រឿង",
    category: "Soups & Stews",
    place: "Ek Phnom village homes",
    time: "1 hr",
    note: "A sour lemongrass soup with beef and tamarind, seasoned with prahok and finished with a handful of bitter herbs.",
    image: teukKreung.src,
  },
  {
    id: "num-banh-chok",
    name: "Num Banh Chok",
    khmer: "នំបញ្ចុក",
    category: "Noodles & Rice",
    place: "Psar Nath morning market",
    time: "2 hr",
    note: "Fermented rice noodles under a green fish gravy of lemongrass and turmeric, eaten at dawn with banana blossom and cucumber.",
    image: numBanhChok.src,
  },
  {
    id: "prahok-ktis",
    name: "Prahok Ktis",
    khmer: "ប្រហុកខ្ទិះ",
    category: "Main Dishes",
    place: "Battambang town family tables",
    time: "35 min",
    note: "Minced pork simmered with prahok, coconut cream and kroeung into a thick dip for raw eggplant, cabbage and long beans.",
    image: prahokKtis.src,
  },
  {
    id: "samlor-korko",
    name: "Samlor Korko",
    khmer: "ឡតជ្រក់ល្ហុង",
    category: "Soups & Stews",
    place: "Rice fields of Bavel district",
    time: "1 hr 15 min",
    note: "The old harvest soup: whatever the garden gives, thickened with toasted ground rice and a spoon of prahok.",
    image: lortJrouk.src,
  },
  {
    id: "kralan",
    name: "Kralan",
    khmer: "ក្រឡាន",
    category: "Snacks & Desserts",
    place: "Roadside stalls on National Road 5",
    time: "1 hr 30 min",
    note: "Sticky rice, black beans and coconut milk packed into a bamboo tube and roasted slowly over charcoal until the bamboo blackens.",
    image: kralan.src,
  },
  {
    id: "song-vak",
    name: "Song Vak",
    khmer: "សង្វាក់",
    category: "Snacks & Desserts",
    place: "Sangkae riverside kitchens",
    time: "50 min",
    note: "Freshwater fish simmered in a clear lemongrass broth with fingerroot and young papaya — a quiet Battambang river dish.",
    image: songVak.src,
  },
  {
    id: "amok-trey",
    name: "Amok Trey",
    khmer: "អាម៉ុកត្រី",
    category: "Main Dishes",
    place: "Sangkae riverside kitchens",
    time: "45 min",
    note: "Freshwater fish folded into coconut cream and yellow kroeung, then steamed in a banana leaf cup until it sets like a custard.",
    image: amokTrey.src,
  },
];

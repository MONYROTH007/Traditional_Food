export interface ArchiveCollection {
  name: string;
  description: string;
  curator: string;
  source: string;
}

export interface ArchiveEntry {
  id: string;
  titleKhmer: string;
  titleEnglish: string;
  category: string;
  province: string;
  description: string;
  recordedDate: string;
  imageUrl?: string;
}

export type NavTab = "Home" | "Recipes" | "About" | "Contact";

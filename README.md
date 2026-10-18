# Traditional Khmer Recipes (Battambang Province)

A web archive dedicated to preserving and sharing traditional Cambodian dishes from Battambang province.

**Live Application:** https://traditional-khmer-food.lovable.app  

---

## Key Features

### 1. Public Browse & Search (Sprint 1)
- **Heritage Dishes:** 9 traditional recipes from Battambang province (*Larb Khmer, Mee Kola, Teuk Kreung, Num Banh Chok, Prahok Ktis, Lort Jrouk, Kralan, Song Vak, Amok Trey*).
- **Search & Filters:** Real-time search across dish titles (Khmer and English), ingredients, notes, and local origins, along with category filtering (*Soups & Stews, Main Dishes, Noodles & Rice, Snacks & Desserts*).
- **Pagination:** 6 recipes per page with pagination controls.
- **Traditional Cambodian Design:** Authentic color palette, subtle borders, and Khmer typography (`Moul` display headings, `Battambang` body font).

### 2. Contributor Accounts & Contributions (Sprint 2)
- **Authentication:** Strangers can register (`/signup`) and log in (`/login`) securely via Supabase Auth.
- **Recipe Contribution:** Authenticated members can submit new family or village recipes (`/contribute`), with required Khmer dish title, ingredient breakdown, and cooking steps.
- **Dish Photo Uploads:** Direct uploads to isolated Supabase Storage (`photos`), supporting JPG, PNG, and WebP images up to 5 MB.
- **Public Archive Synchronization:** Newly submitted recipes appear immediately in the public archive.

### 3. Row-Level Security & Access Control
- **Strict Data Isolation:** Contributor A cannot edit or delete Contributor B's recipes or photos through either the user interface or the Supabase REST API.
- **Postgres Row-Level Security (RLS):** Read access is open to all visitors (`public`), while `INSERT`, `UPDATE`, and `DELETE` operations strictly verify `auth.uid() = owner`.
- **Storage Policies:** File creation and deletion are restricted to each user's authenticated folder path.

### 4. First-Class Khmer Support
- Native typography using Google Fonts `Moul` and `Battambang`.
- Full Unicode support across database records, input validations (`\u1780-\u17FF`), search indexes, and automatic category inference.

### 5. Repository Integrity
- **Zero Secrets in Git:** All secrets remain strictly local (`.env*`); only public client identifiers are used in builds.

---

## Local Development

Prerequisites: Node.js (v18+) and npm.

```sh
# Clone repository
git clone <repository-url>
cd Traditional_Food

# Install dependencies
npm install

# Start local development server
npm run dev
```

Build for production:
```sh
npm run build
```

---

# Blockchain Evidence System - Web3 Dashboard

A professional, high-fidelity Web3 dashboard for managing blockchain-based forensic evidence.

## 🎨 Design System

### Colors
- **Background**: `#0B0F19` (Dark)
- **Primary (Blue)**: `#3B82F6` - Blockchain actions
- **Success (Green)**: `#22C55E` - Valid/Verified states
- **Error (Red)**: `#EF4444` - Tampered/Error states
- **Warning (Orange)**: `#F59E0B` - IPFS/Storage

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter
- **Code/Hashes**: Monospace

### Design Features
- Glassmorphism cards with backdrop blur
- Soft shadows and subtle gradients
- 8px grid spacing system
- Responsive layout (desktop-first)

## 📁 Project Structure

```
src/app/
├── App.tsx                    # Main application entry
├── routes.tsx                 # React Router configuration
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx    # Root layout with navbar + sidebar
│   │   ├── Navbar.tsx        # Top navigation with wallet
│   │   └── Sidebar.tsx       # Side navigation menu
│   │
│   ├── ui/
│   │   ├── Button.tsx        # Reusable button component
│   │   ├── Card.tsx          # Glassmorphism card component
│   │   ├── Badge.tsx         # Status badge component
│   │   ├── Input.tsx         # Form input component
│   │   ├── Textarea.tsx      # Form textarea component
│   │   ├── Select.tsx        # Dropdown select component
│   │   ├── Spinner.tsx       # Loading spinner
│   │   └── Toast.tsx         # Toast notification system
│   │
│   ├── StatCard.tsx          # Dashboard statistics card
│   └── CopyButton.tsx        # Copy-to-clipboard button
│
└── pages/
    ├── Dashboard.tsx         # Main dashboard with stats
    ├── Upload.tsx            # Evidence upload form
    ├── Verify.tsx            # Evidence verification
    ├── Search.tsx            # Search by ID or hash
    ├── EvidenceDetail.tsx    # Detailed evidence view
    ├── History.tsx           # Activity timeline
    └── NotFound.tsx          # 404 error page
```

## 🚀 Features

### Page 1: Dashboard
- 4 stat cards (Total Evidence, Verified, Tampered, Network)
- Evidence flow infographic (User → Backend → IPFS → Blockchain)
- Recent activity table with links to evidence details
- Real-time network status

### Page 2: Upload Evidence
- Complete form with all fields:
  - Case Name, Description, Type, Location, Date, Suspect
- Drag & drop file upload
- IPFS storage toggle
- Upload result card with:
  - Evidence ID, Hash, Transaction Hash
  - Block Number, File CID, Metadata CID
  - Clickable IPFS links
- "Fetch All" button for batch operations

### Page 3: Verify Evidence
- File upload for verification
- Evidence ID input
- Visual hash comparison:
  - Stored Hash (from blockchain)
  - Computed Hash (from uploaded file)
  - Match/Mismatch indicator with large icon
- Result display with owner and timestamp

### Page 4: Search
- Tab navigation (Search by ID / Search by Hash)
- Results display:
  - Case information card
  - File preview
  - Blockchain data sidebar
  - IPFS storage sidebar
  - Copy buttons for all hashes/CIDs

### Page 5: Evidence Detail
- Split into 3 sections:
  1. **Metadata Card**: All case information
  2. **Blockchain Card**: Hash, Owner, Block, Transaction
  3. **IPFS Card**: File CID, Metadata CID, Preview
- Action buttons:
  - Verify Again
  - Transfer Ownership
  - Download from IPFS
  - Export Metadata

### Page 6: History
- Timeline UI with visual indicators
- Action types: Uploaded, Verified, Transferred
- Color-coded icons
- Summary statistics (Total Uploads, Verifications, Transfers)

## 🎯 Key UI Elements

### Navbar
- Logo with shield icon
- "Connect Wallet" button
- Connected wallet address display
- Network status indicator

### Sidebar
- Navigation menu with active state highlighting
- Network status card (Chain, Block number, Connection)
- Storage status card (IPFS Node, Files count)

### Micro Features
- ✅ Copy buttons on all hashes, CIDs, and addresses
- ✅ Toast notifications (ready for implementation)
- ✅ Loading spinners
- ✅ File preview modals
- ✅ Status badges (Success/Error/Warning/Info)
- ✅ Responsive hover states
- ✅ Smooth transitions and animations

## 🔧 Technical Stack

- **React** with TypeScript
- **React Router** (v7) for navigation
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Custom design tokens** in theme.css

## 🎨 Component Library

### Buttons
- Variants: `primary`, `secondary`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`

### Cards
- Glassmorphism background
- Optional hover effect
- CardHeader and CardBody subcomponents

### Badges
- Variants: `success`, `error`, `warning`, `info`, `default`

### Form Components
- Input with label support
- Textarea with custom styling
- Select with dropdown options
- All with blue accent on focus

## 🌐 Mock Data

All pages use mock data for demonstration:
- Random hash generation
- Sample case names and descriptions
- Simulated blockchain data
- Mock IPFS CIDs

## 📱 Responsive Design

- Desktop-first approach
- Sidebar layout (fixed 256px width)
- Grid layouts for cards (1-4 columns)
- Responsive breakpoints for tablets and mobile

## 🎯 Production-Ready Features

- Professional color scheme
- Consistent spacing (8px grid)
- Accessible color contrast
- Loading states
- Error handling UI
- Empty states
- Hover feedback
- Focus management

---

Built with ❤️ for forensic blockchain applications

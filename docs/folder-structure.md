# Folder Structure

```text
.
├── .env.example
├── docs/
├── firestore/
├── scripts/
├── seeds/
└── src/
    ├── config/
    ├── constants/
    ├── frontend/
    │   ├── app/
    │   ├── components/
    │   ├── pages/
    │   └── styles/
    ├── screens/
    ├── services/
    ├── types/
    └── utils/
```

## Screen Registry Coverage
All required screens are defined in `src/screens/screenRegistry.ts` for router wiring and role guarding.

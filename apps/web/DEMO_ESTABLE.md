# DEMO ESTABLE — 25 Marzo 2026

## Como volver al demo si algo se rompe

### Opcion 1: Git (rollback codigo)
```bash
git checkout demo-estable-25mar
npm run build
npx vercel --prod --token=iQFvXm0UaNvtfVhDRZww6Zax
```

### Opcion 2: Vercel URL directo (deploy pinneado)
Este URL SIEMPRE funcionara, nunca se borra:
```
https://itseia-academy-online-9oghbpyja-hector-velascos-projects.vercel.app
```

### Opcion 3: Tag de git
```bash
git checkout demo-estable-25mar
```

## Que funciona en este demo
- Login: demo@itseia.ai / HV$itseia2026Demo!
- Carreras > Inteligencia Artificial > Fundamentos Programacion > Sesion 1
- 8 tabs: Video, Presentacion, Teoria, Quiz, Ejercicio, AI Lab, Recursos, Clase en Vivo
- Texto visible (CSS !important)
- Presentacion persiste entre tabs
- Quiz con parse STRING

## Commit
- Hash: 7fa5e4c
- Branch: demo-estable-25mar
- Tag: demo-estable-25mar

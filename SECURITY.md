# 🔒 SÉCURITÉ: Instructions importantes 

## ⚠️ AVANT COMMIT/PUSH GIT:

1. **Vérifier que les .env sont bien ignorés:**
   ```bash
   git status
   # Les fichiers .env ne doivent PAS apparaître
   ```

2. **Si .env apparait dans git status:**
   ```bash
   git rm --cached .env
   git rm --cached backend/.env
   git commit -m "Remove env files from tracking"
   ```

## 🛡️ Sécurité Production:

- ✅ Nouveau JWT_SECRET généré (64 bytes)
- ✅ .gitignore configuré (frontend + backend) 
- ✅ .env.example avec valeurs d'exemple
- ⚠️ CHANGEZ les mots de passe en production !

## 📝 Déploiement:

1. Copiez .env.example vers .env
2. Remplacez toutes les valeurs par celles de production
3. Générez un nouveau JWT_SECRET
4. Configurez vos vraies credentials SMTP
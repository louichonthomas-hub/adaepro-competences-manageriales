#!/bin/bash

echo "🔐 Push vers GitHub"
echo ""
echo "Pour pusher le code, vous avez besoin d'un Personal Access Token (PAT) GitHub."
echo ""
echo "Option 1 : Si vous avez déjà un token, entrez-le maintenant"
echo "Option 2 : Si vous n'avez pas de token, créez-en un sur : https://github.com/settings/tokens"
echo ""
echo "Permissions requises pour le token :"
echo "  - repo (full control)"
echo ""
read -sp "Entrez votre token GitHub : " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ Aucun token fourni."
    exit 1
fi

git remote set-url origin https://${TOKEN}@github.com/louichonthomas-hub/Comp-tences-Manager.git
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code pushé avec succès sur GitHub !"
    echo "🔗 Voir sur : https://github.com/louichonthomas-hub/Comp-tences-Manager"
else
    echo ""
    echo "❌ Échec du push. Vérifiez votre token."
fi

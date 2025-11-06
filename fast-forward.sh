
#!/bin/bash
cd /home/ubuntu/adaepro_competences_manageriales/app
if [ -z "$1" ]; then
  echo "❌ Veuillez fournir un ID de candidat"
  echo "Usage: ./fast-forward.sh <candidateId>"
  exit 1
fi
tsx --require dotenv/config scripts/fast-forward-test.ts "$1"

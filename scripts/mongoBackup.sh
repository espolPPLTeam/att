#! /bin/bash
DATE=`date +%y-%m-%d_%H_%M_%S`
echo "Haciendo el backup"
mkdir -p ./dbbackup
FOLDER="./dbbackup/${DATE}"
echo $FOLDER
mongodump --db att_production -o $FOLDER

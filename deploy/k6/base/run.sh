#!/bin/sh

TS=$(date -Iminutes)
k6 run scripts/${FLOW}.js -o csv=${FLOW}.csv
tail ${FLOW}.csv 
du ${FLOW}.csv 
/init-share/mc cp ${FLOW}.csv k6/argo/k6-datahub/${FLOW}/${TS}/data.csv
echo "done"
tail -f /dev/null
#!/bin/bash

# Convert each zipped NHGIS state shapefile in ../data into a TopoJSON file.
# Requires: unzip, and
#   npm install -g shapefile topojson-server
# (provides the shp2json and geo2topo commands)

cd "$(dirname "$0")"

for f in ../data/*.zip
do
  year=$(printf "%s" "$f" | sed "s/^.*_\(.*\)\.zip$/\1/")
  echo Parsing shapefile ${year}...
  tmp=$(mktemp -d)
  unzip -q -o "$f" -d "$tmp"
  shp=$(find "$tmp" -name '*.shp' | head -n 1)
  shp2json "$shp" > "$tmp/states.geojson"
  geo2topo stdin="$tmp/states.geojson" > ../data/$year.json
  rm -rf "$tmp"
done

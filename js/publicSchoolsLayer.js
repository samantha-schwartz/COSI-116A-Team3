
/* Public school point layer for a Greater Boston map.
 * Source: MassGIS Schools (PK–High School), ArcGIS FeatureServer.
 * Includes public school categories only (ELE, MID, SEC, OTH, VOC).
 * Usage: call addPublicSchoolsLayer(svg, projection) after your map is drawn,
 * where svg is the D3 selection of the map's SVG and projection is the same
 * geographic projection used to draw the map.
 */
function addPublicSchoolsLayer(svg, projection) {
  const schoolsQuery =
    "https://services1.arcgis.com/TXaY625xGc0yvAuQ/arcgis/rest/services/Schools/FeatureServer/0/query" +
    "?where=TYPE%20IN%20('ELE','MID','SEC','OTH','VOC')" +
    "&outFields=*&returnGeometry=true&outSR=4326&f=geojson";

  return d3.json(schoolsQuery).then(geojson => {
    // Greater Boston geographic extent (approximate bounding box).
    const greaterBoston = geojson.features.filter(f => {
      const coords = f.geometry && f.geometry.coordinates;
      if (!coords) return false;
      const [lon, lat] = coords;
      return lon >= -71.65 && lon <= -70.55 && lat >= 42.0 && lat <= 42.75;
    });

    const layer = svg.append("g")
      .attr("class", "public-schools-layer")
      .attr("aria-label", "Public school locations in Greater Boston");

    layer.selectAll("circle")
      .data(greaterBoston)
      .join("circle")
      .attr("class", "public-school-point")
      .attr("cx", d => projection(d.geometry.coordinates)[0])
      .attr("cy", d => projection(d.geometry.coordinates)[1])
      .attr("r", 3.2)
      .attr("fill", "#2b83ba")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.7)
      .append("title")
      .text(d => {
        const p = d.properties || {};
        return `${p.NAME || p.SCHOOL || p.SCH_NAME || "Public school"} — ${p.TYPE || p.TYPE_DESC || "Public"}`;
      });

    return { count: greaterBoston.length, group: layer, data: greaterBoston };
  }).catch(error => {
    console.error("Unable to load public school layer from MassGIS:", error);
    return { count: 0, group: null, data: [] };
  });
}

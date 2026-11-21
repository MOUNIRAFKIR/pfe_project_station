import json
import pandas as pd
import uuid

with open('database.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

parkings = []

for i, item in enumerate(data.get('features', [])):
    props = item.get('properties', {})
    geom = item.get('geometry', {})
    
    if not geom:
        continue
        
    g_type = geom.get('type')
    coords = geom.get('coordinates', [])
    lon, lat = None, None
    
    if g_type == 'Point' and len(coords) >= 2:
        lon, lat = coords[0], coords[1]
    elif g_type == 'Polygon' and len(coords) > 0:
        ring = coords[0]
        lons = [c[0] for c in ring if len(c) >= 2]
        lats = [c[1] for c in ring if len(c) >= 2]
        if lons and lats:
            lon, lat = sum(lons) / len(lons), sum(lats) / len(lats)
            
    if lon and lat:
        name = props.get('name')
        if not name or str(name).strip() == "" or str(name).lower() == "null":
            name = f"Parking Marrakech {i+1}"
        else:
            name = str(name).strip()
            
        address = props.get('addr:street', 'Marrakech')
        if not address or str(address).lower() == "null":
            address = "Marrakech"
            
        parkings.append({
            'id': str(uuid.uuid4())[:8],
            'name': name,
            'address': address,
            'totalSpots': 50,
            'pricePerHour': 5.0,
            'latitude': lat,
            'longitude': lon
        })

df = pd.DataFrame(parkings)

if not df.empty:
    df = df.drop_duplicates(subset=['latitude', 'longitude'])
    

    sql_lines = []
    for _, row in df.iterrows():
        name = str(row['name']).replace("'", "''")
        address = str(row['address']).replace("'", "''")
        sql = f'INSERT INTO public."Parking" (id, name, address, "totalSpots", "pricePerHour", latitude, longitude) VALUES (\'{row["id"]}\', \'{name}\', \'{address}\', {row["totalSpots"]}, {row["pricePerHour"]}, {row["latitude"]}, {row["longitude"]}) ON CONFLICT (id) DO NOTHING;'
        sql_lines.append(sql)
        
    with open('insert_parkings.sql', 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
        
    print(f"Done! {len(df)} parkings generated in 'insert_parkings.sql'.")
else:
    print("No data found.")
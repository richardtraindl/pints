# encoding: utf-8

##
##
#  use in root / app folder:
#    ruby script/geo.rb
#
#    will read in data/pubs.txt and data/pubs.geo.csv
#    will search open street map (OSM) nominatim
#     and write search results to data/o/pubs.geo.csv


require_relative 'lib/pubs'
require_relative 'lib/pubs_geo.rb'
require_relative 'lib/nominatim'




def search_pub( pub )

  address_lines  = pub.address.split( %r{\s*//\s*} )
  city   = address_lines[0].gsub( /[0-9]+/, '' ).strip    ## remove all numbers e.g. postal code
  street = address_lines[1].gsub( /[0-9]([0-9\/\-]+)?/, '' ).strip    ## incl. 1-3 or 95/2/1

  name   = pub.name

  ##  use city & street query params - why? why not?
  ## city: "#{pub.city}",
  ## street: "#{pub.street}"

  status, data = Nominatim.search( q: "#{name}, #{city}, #{street}" )


  geos = []

  if status == 200
    if data.size == 0   ## nothing found
     geos << PubGeo.new(
                status: status,
                n:      "0/0",
                name:   name,
                city:   city,
                street: street
              )
    else   ## loop over result records (might be more than one)
     data.each_with_index do |h,i|
       geos << PubGeo.new(
                status:  status,
                n:       "#{i+1}/#{data.size}",
                name:    name,
                city:    city,
                street:  street,
                lat:     h['lat'],
                lon:     h['lon'],
                type:    "#{h['class']}/#{h['type']}",    ## e.g. pub
                display: h['display_name'],
                )
      end  # each data
    end
  else
     geos << PubGeo.new(
                status: status,
                name:   name,
                city:   city,
                street: street
              )
  end

  ## throttle; do NOT overload nominatim service; be kind
  sleep( 0.5 )   # sleep 0.5 seconds (half a second)

  geos
end  # method search_pub



puts "reading pubs..."

pubs = Pub.load_file( "./data/pubs.txt" )

known_geos = PubGeo.load_file( "./data/pubs.geo.csv" )
Pub.update_geos( pubs, known_geos )


## search pubs (only) with missing lat/lon (geos)
geos = []
pubs.each do |pub|
  if pub.lat && pub.lon
    puts "  Skipping #{pub.name} (using cached lat/lon)..."
  else
    geos += search_pub( pub )
  end
end

pp geos

PubGeo.save_file( "./data/o/pubs.geo.csv", geos )

puts "bye"

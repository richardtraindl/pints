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
require_relative 'lib/nominatim'



class GeoLine
  def initialize( status:'?', n:'?', name:'?', city:'?', street:'?',  lat:'?', lon:'?', type:'?', display: '?')
    @status  = status
    @n       = n

    @name    = name
    @city    = city
    @street  = street

    @lat     = lat
    @lon     = lon
    @type    = type
    @display = display
  end


  def self.headers
    ['Status',
     'N',
     'Name',
     'City',
     'Street',
     'Lat',
     'Lon',
     'Type',
     'Display']
  end

  def data
    [@status,
     @n,
     @name,
     @city,
     @street,
     @lat,
     @lon,
     @type,
     @display
    ]
  end
end   ## class ResultLine



def search_pub( pub )

  address_lines  = pub.address.split( %r{\s*//\s*} )
  city   = address_lines[0].gsub( /[0-9]/, '' ).strip    ## remove all numbers e.g. postal code
  street = address_lines[1].gsub( /[0-9]/, '' ).strip

  name   = pub.name

  ##  use city & street query params - why? why not?
  ## city: "#{pub.city}",
  ## street: "#{pub.street}"

  status, data = Nominatim.search( q: "#{name}, #{city}, #{street}" )


  lines = []

  if status == 200
    if data.size == 0
      ## nothing found
     lines << GeoLine.new(
                status: status,
                n:      "0/0",
                name:   name,
                city:   city,
                street: street
              )
    else
     data.each_with_index do |h,i|
       lines << GeoLine.new(
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
     lines << GeoLine.new(
                status: status,
                name:   name,
                city:   city,
                street: street
              )
  end

  ## throttle; do NOT overload nominatim service; be kind
  sleep( 0.5 )   # sleep 0.5 seconds (half a second)

  lines
end


puts "reading pubs..."

pubs = Pub.load_file( "./data/pubs.txt" )

lines = []

lines += search_pub( pubs[0] )
lines += search_pub( pubs[1] )
lines += search_pub( pubs[2] )
lines += search_pub( pubs[3] )

pp lines


CSV.open( "./data/o/pubs.geo.csv", "w:utf-8") do |csv|
  csv << GeoLine.headers
  lines.each do |line|
    csv << line.data
  end
end

puts "bye"

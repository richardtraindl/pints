# encoding: utf-8

# encoding: utf-8


##
##
#  use in root / app folder:
#    ruby script/convert.rb
#
#    will read in data/pubs.txt and convert data/pubs2.json



require 'pp'
require 'cgi'
require 'net/http'
require 'uri'
require 'json'
require 'csv'


require_relative 'convert'




class ResultLine
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

  ## base_url = 'http://open.mapquestapi.com/nominatim/v1/search.php'
  base_url = 'http://nominatim.openstreetmap.org/search'

  ## ?q=135+pilkington+avenue,+birmingham
  ##     &format=xml
  ##     &polygon=1
  ##     &addressdetails=1

  address_lines  = pub.address.split( %r{\s*//\s*} )
  city   = address_lines[0].gsub( /[0-9]/, '' ).strip    ## remove all numbers e.g. postal code
  street = address_lines[0].gsub( /[0-9]/, '' ).strip

  name   = pub.name

  params = {
    format: 'json',
    q: "#{name}, #{city}, #{street}",
    ## city: "#{pub.city}",
    ## street: "#{pub.street}"
    countrycodes: "at"
  }

  query_params = []
  params.each do |k,v|
    query_params << "#{k}=#{CGI.escape(v)}"
  end

  search_url = "#{base_url}?#{query_params.join('&')}"

  pp search_url


  uri = URI.parse( search_url )

  http = Net::HTTP.new( uri.host, uri.port )

  response = http.request( Net::HTTP::Get.new(uri.request_uri) )

  pp response.code             # => '301'
  pp response.code.class   ## check is string or number?

  ## response.body             # => The body (HTML, XML, blob, whatever)

  puts "content-type: #{response['content-type']}"
  puts "content-length: #{response['content-length']}"

  json = response.body
  pp json[0..20]

  data = JSON.parse( json )
  puts "data.class.name: #{data.class.name}, data.size (before): #{data.size}"


  lines = []

  if response.code == '200'    ## note: code is a string (NOT a number)

    if data.size == 0
      ## nothing found
     lines << ResultLine.new(
                status: response.code,
                n:      "0/0",
                name:   name,
                city:   city,
                street: street
              )
    else
     data.each_with_index do |h,i|
       lines << ResultLine.new(
                status:  response.code,
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
     lines << ResultLine.new(
                status: response.code,
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


CSV.open( "./data/o/geo.csv", "w:utf-8") do |csv|
  csv << ResultLine.headers
  lines.each do |line|
    csv << line.data
  end
end

puts "bye"

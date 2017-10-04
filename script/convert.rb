# encoding: utf-8

##
##
#  use in root / app folder:
#    ruby script/convert.rb
#
#    will read in data/pubs.txt and convert data/o/pubs.json


require_relative 'lib/pubs'
require_relative 'lib/pubs_geo'



puts "reading pubs..."

pubs = Pub.load_file( "./data/pubs.txt" )
## pp pubs

geos = PubGeo.load_file( "./data/pubs.geo.csv" )
Pub.update_geos( pubs, geos )


Pub.save_file( "./data/o/pubs.json", pubs )     ##  convert/save to json
Pub.save_file( "./data/o/pubs.geojson", pubs)   ##  save to geojson too

puts "bye"

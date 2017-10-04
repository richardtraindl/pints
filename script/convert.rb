# encoding: utf-8

##
##
#  use in root / app folder:
#    ruby script/convert.rb
#
#    will read in data/pubs.txt and convert data/o/pubs.json


require_relative 'lib/pubs'



puts "reading pubs..."

pubs = Pub.load_file( "./data/pubs.txt" )
## pp pubs

##  convert/save to json
Pub.save_file( "./data/o/pubs.json", pubs )

puts "bye"

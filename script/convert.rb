# encoding: utf-8


##
##
#  use in root / app folder:
#    ruby script/convert.rb
#
#    will read in data/pubs.txt and convert data/pubs2.json


require 'pp'#
require 'json'


class Pub

  attr_accessor :name          ## e.g. Red Lion
  attr_accessor :address       ## e.g. 1030 Wien // Löwengasse 6
  attr_accessor :categories    ## e.g. Pub Brew-Pub
  attr_accessor :food          ## e.g. Snacks
  attr_accessor :features      ## e.g. Live Football, Ozapft is', 17.10.2017, Winterbierverkostung, genauer Termin für Dezember wird noch bekanntgegeben
  attr_accessor :open          ## e.g. Mo - Thu 18:00 – 01:00 | Friday 18:00 – 02:00 | Saturday 12:30 – 02:00 | Sunday 14:00 – 00:00
  attr_accessor :website       ## e.g. www.redlion-vienna.at
  attr_accessor :tel           ## e.g.+43 - (0)676 560 53 53

  def initialize
    @name       = ""
    @address    = ""
    @categories = []
    @food       = ""
    @features   = ""
    @open       = ""
    @website    = ""
    @tel        = []
  end

  def to_hash    ## used for json conversion
    {
      name:       name,
      address:    address,
      categories: categories,
      food:       food,
      features:   features,
      open:       open,
      website:    website,
      tel:        tel
    }
  end


  def self.load_file( path )  ## returns an array of pubs
    text   = File.open( path, 'r:bom|utf-8' ).read
    reader = PubReader.new( text )
    reader.parse
  end
end  # class Pub




def generate_json( pubs )
  ## convert to hash
  pubs = pubs.map { |pub| pub.to_hash }
  JSON.pretty_generate( pubs )
end



class PubReader

def initialize( text )
  @text = text
end

def parse

   pubs = []

   ## step 1: split into blocks
   blocks = @text.split( /^\s*[-]{1,}\s*$/ )
   ## note: remove first blocks  (is comments / prolog) -
   blocks.shift

   blocks.each_with_index do |block,i|

     lineno = 0
     pub    = Pub.new

     block.each_line do |line|

      # comments allow:
      # 1) #####  (shell/ruby style)
      # 2) --  comment here (haskel/?? style)
      # 3) % comment here (tex/latex style)

      if line =~ /^\s*#/
        # skip komments and do NOT copy to result (keep comments secret!)
        puts 'skipping comment line'
        next
      end

      if line =~ /^\s*$/
        # kommentar oder leerzeile überspringen
        next
      end

      ## if first line; assume required name/time
      if lineno == 0
         pub.name = line.strip
         puts "pub name: #{pub.name}"
      else

        ## if line includes // assume address
        if line =~ %r<//>
          pub.address = line.strip
          puts "pub address: #{pub.address}"
        else
          ## assume key value pairs
          if line =~ /^\s*([a-z]+)\s*[:](.*)$/
             key   = $1.to_s
             value = $2.to_s.dup.strip   # check if it can be nil? if yes use blank string e.g. ''
             ### todo:  strip quotes from value??? why? why not?

             if key =~ /food/
               pub.food = value
             elsif key =~ /features/
               pub.features = value
             elsif key =~ /open(ings)?/
               pub.open = value
             elsif key =~ /web(site)?/
               pub.website = value
             elsif key =~ /cat(egorie)?s/
               pub.categories = value.split( /[ |,]+/ )
             elsif key =~ /tel(s)?/
               pub.tel = value.split( /\s*[|,]+\s*/ )
             else
               puts "*** warn: skipping unknown key/value line >#{line}<"
             end
          else
            puts "*** warn: skipping unknown line type >#{line}<"
          end
        end
      end

      lineno +=1
    end # loop lines
    pubs << pub   ## add pub to pubs array
  end # loop blocks
  pubs ## return pubs
end # method parse

end  # class PubReader


puts "reading pubs..."

pubs = Pub.load_file( "./data/pubs.txt" )
## pp pubs

puts generate_json( pubs )

File.open( "./data/pubs2.json", "w:utf-8") do |f|
  f.write generate_json( pubs )
end

puts "hye"

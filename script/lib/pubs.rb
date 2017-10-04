# encoding: utf-8


require 'pp'
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

  attr_accessor :lat
  attr_accessor :lon

  def address_str
     if @address
       ## e.g. convert  1030 Wien // Löwengasse 6  to
       ##               1030 Wien, Löwengasse 6
       lines = @address.split( %r{\s*//\s*} )
       lines.join( ', ' )
     else
       nil
     end
  end


  def as_json    ## used for json conversion
    {
      name:       name         || "",
      address:    address_str  || "",     ## note: use pretty formatted version (_str)
      longitude:  lon          || "?",
      latitude:   lat          || "?",
      categories: categories   || [],
      food:       food         || "",
      features:   features     || "",
      open:       open         || "",
      website:    website      || "",
      tel:        tel          || []
    }
  end

  def as_geojson    ## used for geojson conversion
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat]
      },
      properties: {
        title: name,
        description: address,
        website: website,
        "marker-color": "#ffd700",
        "marker-size": "small"
      }
    }
  end



  def self.load_file( path )  ## returns an array of pubs
    text   = File.open( path, 'r:bom|utf-8' ).read
    reader = PubReader.new( text )
    reader.parse
  end

  def self.save_file( path, pubs )   ## todo/check: rename to export_file - why? why not?
     ## note: will save pubs as json (or geojson)!!!

     if path.include?( '.geojson' )
       pubs = pubs.map { |pub| pub.as_geojson }

       data = {
         type:     "FeatureCollection",
         features: pubs
       }
     else
       data = pubs.map { |pub| pub.as_json }
     end

     File.open( path, "w:utf-8") do |f|
        f.write JSON.pretty_generate( data )
     end
  end


  def self.update_geos( pubs, geos )
    pubs.each do |pub|
      geo = geos[ pub.name ]
      if geo
        pub.lat = geo['lat']
        pub.lon = geo['lon']
        puts "update #{pub.name} => #{geo.inspect} lat=#{pub.lat}, lon=#{pub.lon}"
      end
    end
  end # method update_geos

end  # class Pub




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

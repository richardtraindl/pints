# encoding: utf-8


require 'pp'
require 'csv'


class PubGeo
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


  def self.load_file( path )
    text = File.open( path, "r:utf-8").read
    table = CSV.parse( text, headers: true)

    ## pp table
    ## table.each do |row|
    ##   pp row
    ## end

    ## return hash for lookup by name
    h = {}
    table.each do |row|
      name = row['Name']
      h[name] = { 'lat' => row['Lat'], 'lon' => row['Lon'] }
    end
    h
  end  # method self.load_file



  def self.save_file( path, lines )
    CSV.open( path, "w:utf-8") do |csv|
       csv << self.headers
       lines.each do |line|
          csv << line.data
       end
    end
  end  # method self.save_file

end   ## class PubGeo



if __FILE__ == $0
  pp PubGeo.load_file( "./data/pubs.geo.csv" )
end

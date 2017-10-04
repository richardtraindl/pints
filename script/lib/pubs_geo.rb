# encoding: utf-8


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


  def self.save_file( path, lines )
    CSV.open( path, "w:utf-8") do |csv|
       csv << self.headers
       lines.each do |line|
          csv << line.data
       end
    end
  end  # method self.save_file

end   ## class PubGeo

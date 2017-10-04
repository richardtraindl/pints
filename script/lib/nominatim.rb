# encoding: utf-8

##
##
#  use in root / app folder for testing:
#    ruby script/lib/nominatim.rb



require 'pp'
require 'cgi'
require 'net/http'
require 'uri'
require 'json'
require 'csv'


class Nominatim

  ## BASE_URL = 'http://open.mapquestapi.com/nominatim/v1/search.php'
  BASE_URL = 'http://nominatim.openstreetmap.org/search'

  def self.search( params )

    default_params = {
      format: 'json',
      countrycodes: 'at'
    }

    new_params = default_params.merge( params )

    query_params = []
    new_params.each do |k,v|
      query_params << "#{k}=#{CGI.escape(v)}"
    end

    search_url = "#{BASE_URL}?#{query_params.join('&')}"

    pp search_url

    uri = URI.parse( search_url )

    http = Net::HTTP.new( uri.host, uri.port )

    response = http.request( Net::HTTP::Get.new(uri.request_uri) )

    pp response.code             # => '301'
    pp response.code.class   ## check is string or number?

    ## response.body             # => The body (HTML, XML, blob, whatever)

    puts "Content-type:   #{response['Content-type']}"
    puts "Content-length: #{response['Content-length']}"

    json = response.body
    pp json[0..60]

    data = JSON.parse( json )
    puts "data.class.name: #{data.class.name}, data.size: #{data.size}"

    [response.code.to_i,data]   ## return status_code (number), data (array)
  end
end # class Nominatim


if __FILE__ == $0
  pp Nominatim.search( q: "Red Lion, Wien, Löwengasse" )
end

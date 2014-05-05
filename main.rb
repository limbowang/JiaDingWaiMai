#!/usr/bin/env ruby

require 'slim'
require 'json'
require 'fileutils'
require 'thor'
require 'mini_magick'
require 'net/http'
require 'base64'
require 'openssl'
require 'rest_client'


module JiaDingWaiMai
  DATA_DIR = "./data"
  LAYOUTS_DIR = "./layouts"
  DESTINATION = "./_site"
  
  class Content
    attr_accessor :items, :sidebar,
      :contents_left, :contents_right
  end

  def init
    Dir.mkdir DESTINATION if not Dir.exist? DESTINATION

    FileUtils.rm_r Dir.glob("#{DESTINATION}/*")
  end

  def moveDir 
    needCP = ["./js", "./css", "./fonts", "./robots.txt"]
    FileUtils.cp_r needCP, DESTINATION 
  end

  def generateIndex
    data = Content.new

    items = File.read "#{DATA_DIR}/merged/mergedData.json"
    items = JSON.parse items
    data.items = items["items"]
    data.sidebar = Slim::Template
      .new("#{LAYOUTS_DIR}/sidebar-list.slim", :pretty=>true)
      .render(data)

    items = File.read "#{DATA_DIR}/merged/contents-left.json"
    items = JSON.parse items
    data.items = items["items"]
    data.contents_left = Slim::Template
      .new("#{LAYOUTS_DIR}/contents.slim", :pretty=>true)
      .render(data)

    items = File.read "#{DATA_DIR}/merged/contents-right.json"
    items = JSON.parse items
    data.items = items["items"]
    data.contents_right = Slim::Template
      .new("#{LAYOUTS_DIR}/contents.slim", :pretty=>true)
      .render(data)

    index = Slim::Template
      .new("#{LAYOUTS_DIR}/index.slim", :pretty=>true)
      .render(data)
    file = File.new "#{DESTINATION}/index.html", "w"
    file.print index 
    file.close
  end

  def mergeData
    items = Array.new
    Dir.foreach( "#{DATA_DIR}/json" ) do |filename|
      next if File.extname(filename).downcase != ".json"

      item = File.read "#{DATA_DIR}/json/#{filename}"
      item = JSON.parse item
      items.push item
    end
    
    results = JSON.pretty_generate({:items=>items})
    Dir.mkdir "#{DATA_DIR}/merged" if not Dir.exist? "#{DATA_DIR}/merged"
    file = File.new "#{DATA_DIR}/merged/mergedData.json", "w"
    file.print results
    file.close

    puts "Data merged into #{DATA_DIR}/merged/mergedData.json"
  end

  def compressImg(img_width_small=415, img_width_large=1024)
    num = 0
    Dir.foreach("#{DATA_DIR}/img/pending") do |filename|
      next if not File.extname(filename).downcase =~ /\.jpg|\.png/

      num += 1
      img = MiniMagick::Image.open("#{DATA_DIR}/img/pending/#{filename}")
      img.resize "#{img_width_large}"
      img.write "#{DATA_DIR}/img/done/#{filename}_#{img_width_large}"  
      puts "#{DATA_DIR}/img/done/#{filename}_#{img_width_large} compressed"

      img = MiniMagick::Image.open("#{DATA_DIR}/img/pending/#{filename}")
      img.resize "#{img_width_small}"
      img.write "#{DATA_DIR}/img/done/#{filename}_#{img_width_small}"  
      puts "#{DATA_DIR}/img/done/#{filename}_#{img_width_small} compressed"
    end 

    puts "#{num} images compressed."
  end

  def uploadImg bucket_name = "jiadingwaimai"
    accessKey = "ysm4KDdDLab4Q777LjVvxe_jhDfG7GDhorOSkcAP"
    secretKey = "jcUs2RW2pb3dDCRIBG92CFT_8kXVIyFe--s6B5sO"

    num = 0
    uri = "http://up.qiniu.com/"
    digest = OpenSSL::Digest.new('sha1')
    Dir.foreach("#{DATA_DIR}/img/done") do |filename|
      next if not File.extname(filename).downcase =~ /\.jpg|\.png/

      num +=1
      putPolicy = Hash.new
      putPolicy[:scope] = "#{bucket_name}:#{filename}"
      putPolicy[:deadline] = Time.now.to_i + 60 * 60

      putPolicyJSON = JSON.generate putPolicy
      encodedPutPolicy = Base64.strict_encode64 putPolicyJSON
      sign = OpenSSL::HMAC.digest(digest, secretKey, encodedPutPolicy)
      encodedSign = Base64.strict_encode64 sign
      encodedSign.gsub!(/\+/, "-")
      uploadToken = "#{accessKey}:#{encodedSign}:#{encodedPutPolicy}"
      RestClient.post(uri,
                      {:token => uploadToken,
                       :file => File.new("#{DATA_DIR}/img/done/#{filename}", "rb"),
                       :key => filename,
                       :multipart => true})
      puts "#{filename} uploaded."
    end

    puts "#{num} imgaes uploaded."
  end

  module_function :init, :moveDir, :generateIndex, :mergeData, :compressImg
end


class MyCommand < Thor
  include JiaDingWaiMai

  desc "build", "Build your site."
  def build
    init
    moveDir
    generateIndex
  end

  desc "merge", "Merge the data."
  def merge
    mergeData
  end

  desc "compress", "Compress pending images."
  def compress
    compressImg
  end

  desc "upload", "Upload compressed images."
  def upload
    uploadImg
  end
end


MyCommand.start if __FILE__ == $0

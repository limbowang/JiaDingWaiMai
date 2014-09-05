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
    attr_accessor :items, :sidebar, :contents 
  end

  def init
    Dir.mkdir DESTINATION if not Dir.exist? DESTINATION

    FileUtils.rm_r Dir.glob("#{DESTINATION}/*")
  end

  def moveDir 
    needCP = ["./js", "./css", "./fonts"]
    FileUtils.cp_r needCP, DESTINATION 
  end

  def generateIndex
    data = Content.new
    items = File.read "#{DATA_DIR}/merged/mergedData.json"
    items = JSON.parse items
    data.items = items["items"]

    data.sidebar = Slim::Template
      .new("#{LAYOUTS_DIR}/sidebar-list.slim", :pretty => true)
      .render(data)
    data.contents = Slim::Template
      .new("#{LAYOUTS_DIR}/contents.slim", :pretty => true)
      .render(data)
    index = Slim::Template
      .new("#{LAYOUTS_DIR}/index.slim", :pretty => true)
      .render(data)

    file = File.new "#{DESTINATION}/index.html", "w"
    file.print index 
    file.close

    puts "Generated the #{DESTINATION}/index.html"
  end

  def mergeData
    items = Array.new
    Dir.glob( "#{DATA_DIR}/json/*" ) do |filename|
      next if File.extname(filename).downcase != ".json"

      item = File.read filename
      item = JSON.parse item
      items.push item
    end
    
    items.sort!{|x, y| x["id"]<=>y["id"]}
    results = JSON.pretty_generate({:items=>items})
    Dir.mkdir "#{DATA_DIR}/merged" if not Dir.exist? "#{DATA_DIR}/merged"
    file = File.new "#{DATA_DIR}/merged/mergedData.json", "w"
    file.print results
    file.close

    puts "Data merged into #{DATA_DIR}/merged/mergedData.json"
  end

  def compressImg(img_width_small=415, img_width_large=1024)
    return puts "No pending image to compress." if not Dir.exist? "#{DATA_DIR}/img/pending" 

    num = 0
    Dir.foreach("#{DATA_DIR}/img/pending") do |filename|
      next if not File.extname(filename).downcase =~ /\.jpg|\.png/

      src_dir = "#{DATA_DIR}/img/pending/#{filename}"
      des_dir = "#{DATA_DIR}/img/done/#{filename}"

      img = MiniMagick::Image.open(src_dir)
      img.combine_options do |c|
        c.resize img_width_large
        c.quality "90%"
      end
      img.write "#{des_dir}_#{img_width_large}"  
      puts "#{des_dir}_#{img_width_large} compressed"

      img = MiniMagick::Image.open(src_dir)
      img.combine_options do |c|
        c.resize img_width_small
        c.quality "90%"
      end
      img.write "#{des_dir}_#{img_width_small}"  
      puts "#{des_dir}_#{img_width_small} compressed"

      num += 1
      FileUtils.rm src_dir
    end 

    puts "#{num} images compressed."
  end

  def uploadImg 
    bucket_name = "jiadingwaimai"
    accessKey = "ysm4KDdDLab4Q777LjVvxe_jhDfG7GDhorOSkcAP"
    secretKey = "jcUs2RW2pb3dDCRIBG92CFT_8kXVIyFe--s6B5sO"
    uri = "http://up.qiniu.com/"
    digest = OpenSSL::Digest.new('sha1')

    return puts "No image to upload." if not Dir.exist? "#{DATA_DIR}/img/done"
    num = 0 if not num
    Dir.foreach("#{DATA_DIR}/img/done") do |filename|
      next if not File.extname(filename).downcase =~ /\.jpg|\.png/

      src_dir = "#{DATA_DIR}/img/done/#{filename}"
      putPolicy = Hash.new
      putPolicy[:scope] = "#{bucket_name}:#{filename}"
      putPolicy[:deadline] = Time.now.to_i + 60 * 60 * 24

      putPolicyJSON = JSON.generate putPolicy
      encodedPutPolicy = Base64.strict_encode64 putPolicyJSON
      sign = OpenSSL::HMAC.digest(digest, secretKey, encodedPutPolicy)
      encodedSign = Base64.strict_encode64 sign
      encodedSign.gsub!(/\+/, "-")
      uploadToken = "#{accessKey}:#{encodedSign}:#{encodedPutPolicy}"
      RestClient.post(uri,
                      :token => uploadToken,
                      :file => File.new(src_dir, "rb"),
                      :key => filename,
                      :multipart => true,
                      :content_type => "image/jpeg")

      puts "#{filename} uploaded."
      num += 1
      FileUtils.rm src_dir
    end

    puts "#{num} imgaes uploaded."

  rescue => e
    puts e
    retry
  end

  def mergeData2
    items = Array.new
    height = Array.new
    Dir.foreach( "#{DATA_DIR}/json" ) do |filename|
      next if File.extname(filename).downcase != ".json"

      item = File.read "#{DATA_DIR}/json/#{filename}"
      item = JSON.parse item
      items.push item
    end

    left_h, right_h = 0
    left, right, results = Array.new
    items.foreach do |item|
      img = MiniMagick::Image.open("#{DATA_DIR}/img/done/#{item["img"]}_415")
      if right_h < left_h 
        right_h += img[:height]
        right.push item 
      else 
        left_h += img[:height]
        left.push item
      end 
    end
    
    i, j, k= 0
    while i<left.size && j<right.size do
      #if i==left.size
        #while(j<right.size) 
      #if k % 2 == 0 
    end

    results = JSON.pretty_generate({:items=>items})
    Dir.mkdir "#{DATA_DIR}/merged" if not Dir.exist? "#{DATA_DIR}/merged"
    file = File.new "#{DATA_DIR}/merged/mergedData.json", "w"
    file.print results
    file.close
  end

  module_function :init, :moveDir, :generateIndex, :mergeData, :compressImg, :mergeData2
end


class MyCommand < Thor
  include JiaDingWaiMai

  desc "build", "Build your site."
  def build
    init
    mergeData
    compressImg
    uploadImg
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

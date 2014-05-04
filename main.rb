#!/usr/bin/env ruby

require 'slim'
require 'json'
require 'fileutils'
require 'thor'
require 'mini_magick'


class MyCommand < Thor
  desc "build", "Build your site."
  def build
    JiaDingWaiMai.init
    JiaDingWaiMai.moveDir
    JiaDingWaiMai.generateIndex
  end

  desc "merge", "Merge the data."
  def merge
    JiaDingWaiMai.merge
  end

  desc "compress", "Compress pending images."
  def compress
    JiaDingWaiMai.compress
  end
end

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
    needCP = ["./js", "./css", "./img", "./fonts"]
    FileUtils.cp_r needCP, DESTINATION 
  end

  def generateIndex
    data = Content.new

    items = File.read "#{DATA_DIR}/merged/mergedData.json"
    items = JSON.parse items
    data.items = items["items"]
    data.sidebar = Slim::Template.new("#{LAYOUTS_DIR}/sidebar-list.slim")
      .render(data)

    items = File.read "#{DATA_DIR}/merged/contents-left.json"
    items = JSON.parse items
    data.items = items["items"]
    data.contents_left = Slim::Template.new("#{LAYOUTS_DIR}/contents.slim")
      .render(data)

    items = File.read "#{DATA_DIR}/merged/contents-right.json"
    items = JSON.parse items
    data.items = items["items"]
    data.contents_right = Slim::Template.new("#{LAYOUTS_DIR}/contents.slim")
      .render(data)

    index = Slim::Template.new("#{LAYOUTS_DIR}/index.slim").render(data)
    file = File.new "#{DESTINATION}/index.html", "w"
    file.print index 
    file.close
  end

  def merge
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

  def compress(img_width_small=415, img_width_large=1024)
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

  module_function :init, :moveDir, :generateIndex, :merge, :compress
end


MyCommand.start if __FILE__ == $0

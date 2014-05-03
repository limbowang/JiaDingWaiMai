require 'slim'
require 'json'
require 'fileutils'

$DATA_DIR = "./data/merged"
$LAYOUTS_DIR = "./layouts"
$DESTINATION = "./_site"

class Content
  attr_accessor :items, :sidebar,
    :contents_left, :contents_right
end

def init
  if not Dir.exist? $DESTINATION
    Dir.mkdir $DESTINATION
  end

  FileUtils.rm_r Dir.glob("#{$DESTINATION}/*")

  FileUtils.cp_r "./js", $DESTINATION   
  FileUtils.cp_r "./css", $DESTINATION   
  FileUtils.cp_r "./img", $DESTINATION   
  FileUtils.cp_r "./fonts", $DESTINATION   
end

def generateIndex
  data = Content.new

  items = File.read "#{$DATA_DIR}/mergedData.json"
  items = JSON.parse items
  data.items = items["items"]
  data.sidebar = Slim::Template.new("#{$LAYOUTS_DIR}/sidebar-list.slim")
    .render(data)

  items = File.read "#{$DATA_DIR}/contents-left.json"
  items = JSON.parse items
  data.items = items["items"]
  data.contents_left = Slim::Template.new("#{$LAYOUTS_DIR}/contents.slim")
    .render(data)

  items = File.read "#{$DATA_DIR}/contents-right.json"
  items = JSON.parse items
  data.items = items["items"]
  data.contents_right = Slim::Template.new("#{$LAYOUTS_DIR}/contents.slim")
    .render(data)

  index = Slim::Template.new("#{$LAYOUTS_DIR}/index.slim").render(data)
  file = File.new "#{$DESTINATION}/index.html", "w"
  file.print index 
  file.close
end

def main
  init
  generateIndex 
end

main


require 'slim'
require 'json'

DATA_DIR = "data/merged/"
TEMPLATES_DIR = "templates/"

class Content
  attr_accessor :items, :sidebar,
                :contents_left, :contents_right
end

data = Content.new

items = File.read(DATA_DIR + "mergedData.json")
items = JSON.parse(items)
data.items = items["items"]

data.sidebar = Slim::Template.new(TEMPLATES_DIR+"sidebar-list.slim")
                              .render(data)

items = File.read(DATA_DIR + "contents-left.json")
items = JSON.parse(items)
data.items = items["items"]

data.contents_left = Slim::Template.new(TEMPLATES_DIR+"contents.slim")
                                       .render(data)


items = File.read(DATA_DIR + "contents-right.json")
items = JSON.parse(items)
data.items = items["items"]

data.contents_right = Slim::Template.new(TEMPLATES_DIR+"contents.slim")
                                        .render(data)


output = Slim::Template.new("index.slim").render(data)

file = File.new("index.html", "w")
file.print output
file.close

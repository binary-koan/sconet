class FrontendController < ApplicationController
  def index
    path = Rails.env.production? ? "public/index.html" : "web/build/index.html"
    render html: File.read(Rails.root.join(path)).html_safe
  end
end

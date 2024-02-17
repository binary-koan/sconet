class FrontendController < ApplicationController
  def index
    render html: File.read(Rails.root.join("public/index.html")).html_safe
  end
end

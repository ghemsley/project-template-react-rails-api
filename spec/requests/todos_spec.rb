require 'rails_helper'

RSpec.describe "Todos", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/todos/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/todos/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/todos/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/todos/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /delete" do
    it "returns http success" do
      get "/todos/delete"
      expect(response).to have_http_status(:success)
    end
  end

end

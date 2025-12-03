require "rails_helper"

RSpec.describe "Api::V0::BadgeAchievementsController" do
  let!(:admin) { create(:user, :admin) }
  let!(:user) { create(:user) }
  let!(:badge) { create(:badge) }
  let!(:badge_achievement) { create(:badge_achievement, user: user, badge: badge) }

  describe "GET /api/badge_achievements" do
    context "when user is an admin with API key" do
      let!(:api_secret) { create(:api_secret, user: admin) }
      let(:headers) { { "api-key" => api_secret.secret } }

      it "returns a list of badge achievements" do
        get api_badge_achievements_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body).to be_an(Array)
      end

      it "returns badge achievements ordered by created_at desc" do
        older_achievement = create(:badge_achievement, created_at: 2.days.ago)

        get api_badge_achievements_path, headers: headers

        parsed = response.parsed_body
        expect(parsed.first["id"]).to eq(badge_achievement.id)
      end
    end

    context "when user is not an admin" do
      let!(:api_secret) { create(:api_secret, user: user) }
      let(:headers) { { "api-key" => api_secret.secret } }

      it "returns unauthorized" do
        get api_badge_achievements_path, headers: headers

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when no authentication provided" do
      it "returns unauthorized" do
        get api_badge_achievements_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/badge_achievements/:id" do
    context "when user is an admin with API key" do
      let!(:api_secret) { create(:api_secret, user: admin) }
      let(:headers) { { "api-key" => api_secret.secret } }

      it "returns the badge achievement" do
        get api_badge_achievement_path(badge_achievement.id), headers: headers

        expect(response).to have_http_status(:ok)
        expect(response.parsed_body["id"]).to eq(badge_achievement.id)
      end

      it "returns 404 for non-existent badge achievement" do
        get api_badge_achievement_path(99_999), headers: headers

        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /api/badge_achievements" do
    context "when user is an admin with API key" do
      let!(:api_secret) { create(:api_secret, user: admin) }
      let(:headers) { { "api-key" => api_secret.secret } }

      it "creates a new badge achievement" do
        new_user = create(:user)
        params = {
          badge_achievement: {
            user_id: new_user.id,
            badge_id: badge.id,
            rewarding_context_message_markdown: "Great contribution!"
          }
        }

        expect do
          post api_badge_achievements_path, params: params, headers: headers
        end.to change(BadgeAchievement, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "returns errors for invalid params" do
        params = {
          badge_achievement: {
            user_id: nil,
            badge_id: nil
          }
        }

        post api_badge_achievements_path, params: params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body).to have_key("errors")
      end
    end
  end

  describe "DELETE /api/badge_achievements/:id" do
    context "when user is an admin with API key" do
      let!(:api_secret) { create(:api_secret, user: admin) }
      let(:headers) { { "api-key" => api_secret.secret } }

      it "deletes the badge achievement" do
        expect do
          delete api_badge_achievement_path(badge_achievement.id), headers: headers
        end.to change(BadgeAchievement, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end
  end
end

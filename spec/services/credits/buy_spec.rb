require "rails_helper"

RSpec.describe Credits::Buy, type: :service do
  describe ".call" do
    let(:user) { create(:user) }
    let(:article) { create(:article, user: user) }

    before do
      # Add credits to the user
      Credit.add_to(user, 10)
    end

    context "when purchaser has enough credits" do
      it "returns true" do
        result = described_class.call(purchaser: user, purchase: article, cost: 5)

        expect(result).to be(true)
      end

      it "marks credits as spent" do
        described_class.call(purchaser: user, purchase: article, cost: 5)

        expect(user.credits.spent.count).to eq(5)
        expect(user.credits.unspent.count).to eq(5)
      end

      it "sets the spent_at timestamp" do
        described_class.call(purchaser: user, purchase: article, cost: 3)

        user.credits.spent.each do |credit|
          expect(credit.spent_at).not_to be_nil
        end
      end

      it "associates the purchase with the credits" do
        described_class.call(purchaser: user, purchase: article, cost: 4)

        user.credits.spent.each do |credit|
          expect(credit.purchase_type).to eq(article.class.name)
          expect(credit.purchase_id).to eq(article.id)
        end
      end

      it "spends exactly the cost amount of credits" do
        described_class.call(purchaser: user, purchase: article, cost: 7)

        expect(user.credits.spent.count).to eq(7)
        expect(user.credits.unspent.count).to eq(3)
      end
    end

    context "when purchaser does not have enough credits" do
      it "returns false" do
        result = described_class.call(purchaser: user, purchase: article, cost: 15)

        expect(result).to be(false)
      end

      it "does not mark any credits as spent" do
        described_class.call(purchaser: user, purchase: article, cost: 15)

        expect(user.credits.spent.count).to eq(0)
        expect(user.credits.unspent.count).to eq(10)
      end
    end

    context "when purchaser has no credits" do
      let(:user_without_credits) { create(:user) }

      it "returns false" do
        result = described_class.call(purchaser: user_without_credits, purchase: article, cost: 1)

        expect(result).to be(false)
      end
    end

    context "when cost is zero" do
      it "returns true and does not spend any credits" do
        result = described_class.call(purchaser: user, purchase: article, cost: 0)

        expect(result).to be(true)
        expect(user.credits.spent.count).to eq(0)
      end
    end

    context "when purchaser has exact amount of credits needed" do
      it "returns true and spends all credits" do
        result = described_class.call(purchaser: user, purchase: article, cost: 10)

        expect(result).to be(true)
        expect(user.credits.spent.count).to eq(10)
        expect(user.credits.unspent.count).to eq(0)
      end
    end

    context "with organization as purchaser" do
      let(:organization) { create(:organization) }

      before do
        Credit.add_to(organization, 10)
      end

      it "works with organization purchaser" do
        result = described_class.call(purchaser: organization, purchase: article, cost: 5)

        expect(result).to be(true)
        expect(organization.credits.spent.count).to eq(5)
      end
    end
  end
end

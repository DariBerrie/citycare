require 'rails_helper'

RSpec.describe Alert, type: :model do
  context 'validation tests' do
    let(:user) { User.create(first_name: "John", last_name: "Johnson", email: "appa@example.com",
                             address: "10 Rue Stephenson, Paris", password: "Password0!") }

    let(:valid_attributes) do
      {
        title: "Trash bags blocking bike lane",
        description: "There are trash bags blocking the bike lane.",
        category: "Pollution",
        address: "30 rue de Nice, 69008, Lyon, France",
        creator: user
      }
    end

    it 'ensures title presence' do
      alert = Alert.new(valid_attributes.except(:title)).save
      expect(alert).to eq(false)
    end

    it 'ensures description presence and character length' do
      alert = Alert.new(valid_attributes.except(:description)).save
      expect(alert).to eq(false)
    end

    it 'ensures category presence' do
      alert = Alert.new(valid_attributes.except(:category)).save
      expect(alert).to eq(false)
    end

    it 'ensures address presence' do
      alert = Alert.new(valid_attributes.except(:address)).save
      expect(alert).to eq(false)
    end

    it 'should save successfully' do
      alert = Alert.new(valid_attributes)
      expect(alert.save).to eq(true)
    end
  end
end

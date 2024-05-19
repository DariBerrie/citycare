require 'rails_helper'

RSpec.describe User, type: :model do
  context 'validation tests' do
    let(:valid_attributes) do
      {
        first_name: "Appalito",
        last_name: "Goldman",
        email: "appalito@example.com",
        address: "10 Rue Stephenson, Paris",
        password: "Password0!"
      }
    end

    it 'ensures first name presence' do
      user = User.new(valid_attributes.except(:first_name)).save
      expect(user).to eq(false)
    end

    it 'ensures last name presence' do
      user = User.new(valid_attributes.except(:last_name)).save
      expect(user).to eq(false)
    end

    it 'ensures email presence' do
      user = User.new(valid_attributes.except(:email)).save
      expect(user).to eq(false)
    end

    it 'should save successfully' do
      user = User.new(valid_attributes).save
      expect(user).to eq(true)
    end
  end

  context 'scope tests' do
    it 'should return users with resident role' do
      expect { User.create(first_name: "Appa", last_name: "Goldman", email: "appa_resident@example.com",
        address: "10 Rue Stephenson, Paris", password: "Password0!") }.to change { User.resident_users.count}.by(1)
    end

    it 'should return users with worker role' do
      expect { User.create(first_name: "Bappa", last_name: "Goldman", email: "bappa_worker@example.com",
        address: "10 Rue Stephenson, Paris", password: "Password0!", role: "worker") }. to change { User.worker_users.count}.by(1)
    end
  end
end

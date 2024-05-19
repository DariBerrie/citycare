require 'rails_helper'

RSpec.describe Assignment, type: :model do
  let(:user) { User.create(first_name: "John", last_name: "Johnson", email: "appa@example.com",
    address: "10 Rue Stephenson, Paris", password: "Password0!", role: "worker") }
  let(:alert) { Alert.create(
      title: "Graffiti on park entrance wall",
      description: "Woke up to new graffiti on the park wall. It's horribly ugly.",
      category: "Vandalism",
      address: '82 Bd de Clichy, Paris',
      upvotes: rand(1..10),
      status: 0,
      creator: user
    )
  }
  context 'validation tests' do
    it 'ensures alert and worker presence' do
      assignment = Assignment.new(alert: alert, worker: user)
      expect(assignment.save).to eq(true)
    end
  end
end

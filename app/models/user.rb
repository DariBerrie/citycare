class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  scope :resident_users, -> { where(role: 0) }
  scope :worker_users, -> {where(role: 1)}
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :alerts
  has_many :assignments
  has_many :messages
  has_many :chat_messages
  has_many :subscribers
  has_many :notifications, as: :recipient, dependent: :destroy
  validates :password, presence: true, length: { minimum: 8, maximum: 36 }, password: true
  validates :first_name, :last_name, presence: true

  acts_as_voter

  enum role: { resident: 0, worker: 1 }
end

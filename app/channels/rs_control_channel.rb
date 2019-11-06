class RsControlChannel < ApplicationCable::Channel

  def subscribed
    stream_from 'rs_control'
  end

  def unsubscribed
  end

  def broadcast_from_client(data)
    ActionCable.server.broadcast 'rs_control', data
  end
end
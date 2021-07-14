import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from channels.generic.websocket import AsyncWebsocketConsumer
from sellerApp import common

logger = common.getLogger()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("connect start")
        logger.info(self.scope['url_route'])
        self.room_name = self.scope['url_route']['kwargs']['seller_id']
        self.room_group_name = 'chat_%s' % self.room_name
        logger.info(self.room_group_name)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        logger.info("connect end")
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        writer = text_data_json['writer']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'writer': writer
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        logger.info("chat_message start")
        logger.info(event)
        message = event['message']
        writer = event['writer']
        logger.info("chat_message end")
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'writer': writer
        }))

def send_message(param):
    try:
        logger.info("send_message start")
        layer = get_channel_layer()
        data = dict({'type': 'chat_message'}, **param)
        logger.info(data)
        async_to_sync(layer.group_send)('chat_seller1', data)
        code = {'code':200}
    except Exception as e:
        logger.error(e)
        code = {'code':500}
    finally:
        logger.info("send_message end")
        return code
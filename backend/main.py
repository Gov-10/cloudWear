from agents.agent import agent
from fastapi import FastAPI
from pydantic import BaseModel
import aio_pika, json, uuid
import os, asyncio
from dotenv import load_dotenv
import logging
load_dotenv()
app = FastAPI()
class cityInput(BaseModel):
    city : str

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("cloudwear")
# @app.post("/suggest")
# async def suggest(payload: cityInput):
#     """
#     Publishes a message to RabbitMQ, waits for worker's reply, and returns AI result.
#     Includes timeout and graceful error handling.
#     """
#     RABBITMQ_URL = os.getenv("RABBITMQ_URL")
#     TIMEOUT = int(os.getenv("RESPONSE_TIMEOUT", 30))  # default 30s

#     city = payload.city.strip()
#     correlation_id = str(uuid.uuid4())

#     try:
#         # Connect to RabbitMQ
#         logger.info(f"Connecting to RabbitMQ...")
#         connection = await aio_pika.connect_robust(RABBITMQ_URL)
#         channel = await connection.channel()

#         # Declare queues
#         await channel.declare_queue("cloudwear_queue", durable=True)
#         callback_queue = await channel.declare_queue(exclusive=True)

#         # Prepare message
#         message = aio_pika.Message(
#             body=json.dumps({"city": city}).encode(),
#             correlation_id=correlation_id,
#             reply_to=callback_queue.name,
#             content_type="application/json",
#             delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
#         )

#         # Publish to main queue
#         await channel.default_exchange.publish(message, routing_key="cloudwear_queue")
#         logger.info(f"📨 Published task for {city} (corr_id={correlation_id})")

#         # Wait for worker’s response
#         future = asyncio.get_event_loop().create_future()

#         async def on_response(msg: aio_pika.IncomingMessage):
#             if msg.correlation_id == correlation_id:
#                 async with msg.process():
#                     result_data = json.loads(msg.body)
#                     future.set_result(result_data)

#         await callback_queue.consume(on_response, no_ack=False)

#         logger.info(f"⏳ Waiting up to {TIMEOUT}s for worker response...")
#         try:
#             result = await asyncio.wait_for(future, timeout=TIMEOUT)
#         except asyncio.TimeoutError:
#             logger.warning(f"⏰ Timeout after {TIMEOUT}s for city: {city}")
#             return {
#                 "city": city,
#                 "error": f"AI processing took too long (> {TIMEOUT}s). Please try again."
#             }

#         await connection.close()
#         logger.info(f"✅ Got response for {city}")

#         return {"city": city, "result": result["result"]}

#     except Exception as e:
#         logger.error(f"❌ Unexpected error in /suggest: {e}", exc_info=True)
#         return {"city": city, "error": "Internal server error. Please retry."}

#     finally:
#         # Ensure connection is closed
#         try:
#             if not connection.is_closed:
#                 await connection.close()
#                 await asyncio.sleep(0.1)
#         except Exception:
#             pass


@app.post("/suggest")
async def suggest(payload: cityInput):
    query = f"You're a witty travel assistant. Give me the current weather and a humorous clothing, travel tips and places to visit in {payload.city}."
    result = agent(query)
    print("Type of result:", type(result))
    print("Keys:", getattr(result, "__dict__", result if isinstance(result, dict) else None))
    return {"city": payload.city, "result": result.message["content"][0]["text"] }

#CORS Settings
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app= app

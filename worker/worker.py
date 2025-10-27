import os, json, asyncio, aio_pika, traceback, logging
from agents.agent import agent
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
# Thread executor for blocking Strands agent calls
executor = ThreadPoolExecutor(max_workers=3)

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger("cloudwear_worker")

app = FastAPI()
@app.get("/check")
async def check():
    return {"health": "Okay"}

async def process_city(city: str, timeout: int = 25):
    """
    Runs Strands agent in a thread to avoid blocking event loop,
    includes timeout and structured logging.
    """
    def blocking_call():
        query = (
            f"You're a witty travel assistant. "
            f"Give me the current weather, a humorous clothing tip, "
            f"travel advice, and places to visit in {city}."
        )
        return agent(query)

    loop = asyncio.get_event_loop()

    try:
        logger.info(f"🚀 Starting Strands call for {city} ...")
        result = await asyncio.wait_for(
            loop.run_in_executor(executor, blocking_call),
            timeout=timeout
        )
        logger.info(f"✅ Strands done for {city}")
        return result.message["content"][0]["text"]

    except asyncio.TimeoutError:
        logger.warning(f"⚠️ Strands timeout (> {timeout}s) for {city}")
        return f"AI took too long to respond for {city}. Try again later!"
    except Exception as e:
        logger.error(f"❌ Strands error for {city}: {e}", exc_info=True)
        return f"An error occurred while processing {city}: {str(e)}"


async def consume():
    """
    Continuously consumes messages from RabbitMQ queue and processes them.
    Automatically reconnects if connection drops.
    """
    RABBITMQ_URL = os.getenv("RABBITMQ_URL")

    while True:  # Auto-reconnect loop
        try:
            logger.info("🔗 Connecting to RabbitMQ...")
            connection = await aio_pika.connect_robust(RABBITMQ_URL)
            channel = await connection.channel()
            queue = await channel.declare_queue("cloudwear_queue", durable=True)
            logger.info("✅ Connected and listening to 'cloudwear_queue'")

            async with queue.iterator() as q:
                async for message in q:
                    async with message.process():
                        data = json.loads(message.body)
                        city = data.get("city")
                        correlation_id = message.correlation_id
                        reply_to = message.reply_to
                        logger.info(f"📬 Preparing to send reply (reply_to={reply_to}, corr_id={correlation_id})")
                        logger.info(f"🔄 Received task for {city} (corr_id={correlation_id})")

                        if not reply_to:
                            logger.warning(f"⚠️ No reply_to found for {city}, skipping...")
                            continue

                        try:
                            result_text = await process_city(city)
                            response = {"city": city, "result": result_text}

                            await channel.default_exchange.publish(
                                aio_pika.Message(
                                    body=json.dumps(response).encode(),
                                    correlation_id=correlation_id,
                                    content_type="application/json",
                                    delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                                ),
                                routing_key=reply_to,
                            )

                            logger.info(f"📤 Sent response for {city} ✅")

                        except Exception as e:
                            logger.error(f"❌ Error processing {city}: {e}", exc_info=True)

        except Exception as e:
            logger.error(f"💥 Worker crashed or disconnected: {e}", exc_info=True)
            logger.info("🔁 Reconnecting to RabbitMQ in 5 seconds...")
            await asyncio.sleep(5)


if __name__ == "__main__":
    logger.info("🚀 CloudWear Worker starting up...")
    asyncio.run(consume())

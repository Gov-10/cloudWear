import aio_pika, asyncio, os
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    url = os.getenv("RABBITMQ_URL")
    print(f"Connecting to: {url}")
    conn = await aio_pika.connect_robust(url)
    print("✅ Connection successful!")
    await conn.close()

asyncio.run(test_connection())

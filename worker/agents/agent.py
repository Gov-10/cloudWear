from strands import Agent, tool
from strands.models.gemini import GeminiModel
import requests
import os
from dotenv import load_dotenv
load_dotenv()
model = GeminiModel(
    client_args={
        "api_key": os.getenv("GEMINI_API_KEY")
    },
    model_id="gemini-2.5-flash",
    params={
        "temperature": 0.5,
        "max_output_tokens": 2048,
        "top_p": 0.9,
        "top_k": 40
    }
)

@tool
async def suggest_weather(city: str):
    """Fetch weather of the given city and provide a fun, friendly travel and clothing suggestion for a tourist visiting today
    """
    url = f"https://znlkfjg718.execute-api.us-east-1.amazonaws.com/prod/weather?city={city}"
    data = requests.get(url, timeout=10).json()
    temperature = data.get("temperature", "N/A")
    windspeed = data.get("windspeed", "N/A")
    city_name = data.get("name", city)
    return f"The current weather in {city_name} is {temperature} with winds of {windspeed}."

agent = Agent(model=model,tools=[suggest_weather])

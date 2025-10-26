from agents.agent import agent
from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
class cityInput(BaseModel):
    city : str

@app.post("/suggest")
async def suggest(payload: cityInput):
    query = f"You're a witty travel assistant. Give me the current weather and a humorous clothing & travel tip for {payload.city}."
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

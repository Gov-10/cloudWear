# cloudWear
## Description
CloudWear AI is a fun project made using AWS Strands agents, fastAPI, NextJS, AWS Lambda functions and Amazon API Gateway. This witty AI agent fetches real time weather and searches for tourist attractions based on the user's entered city. 

## Tech Stack
1. Frontend : NextJS
2. Backend : FastAPI
3. Deployments: GCP Cloud Run
4. AI Agent Layer: Strands framework
5. Weather, location fetching layer : OpenMeteo APIs exposed through AWS Lambda function and Amazon API Gateway

## Updates
1. Replacing AWS Lambda+ Amazon API Gateway combination with Cloudflare workers to reduce Latency (Underway)
2. Adding context-aware feature with the help of caching using Redis Cloud (planned)
3. Storing User queries and AI Agent responses for long term memory, in Amazon RDS (Underway)


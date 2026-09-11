
import os
import time

from dotenv import load_dotenv
from google import genai

from app.models.schemas import AIResponse, SourceCitation, KnowledgeCard
from app.services.chroma_db import collection, init_db


# ---------------------------------------------------------
# 1. Load environment variables
# ---------------------------------------------------------

load_dotenv()


# ---------------------------------------------------------
# 2. Configure Gemini
# ---------------------------------------------------------

api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None


# ---------------------------------------------------------
# 3. Initialize local knowledge database
# ---------------------------------------------------------

init_db()


# ---------------------------------------------------------
# 4. Gemini generation with retry handling
# ---------------------------------------------------------

def generate_gemini_response(prompt: str) -> tuple[str | None, str | None]:

    if not client:
        return None, "API_KEY_MISSING"

    # Maximum number of attempts
    max_attempts = 3

    # Wait times between attempts
    retry_delays = [2, 4]

    for attempt in range(max_attempts):

        try:

            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )

            # Gemini returned a response successfully
            if response and response.text:

                return response.text, None

            # Empty response
            return None, "EMPTY_RESPONSE"

        except Exception as e:

            error_message = str(e)

            # -------------------------------------------------
            # Temporary Gemini errors
            # -------------------------------------------------

            temporary_error = (
                "503" in error_message
                or "UNAVAILABLE" in error_message
                or "429" in error_message
                or "RESOURCE_EXHAUSTED" in error_message
                or "high demand" in error_message
            )

            if temporary_error and attempt < max_attempts - 1:

                time.sleep(retry_delays[attempt])

                continue

            # -------------------------------------------------
            # Permanent / final error
            # -------------------------------------------------

            return None, error_message

    return None, "UNKNOWN_GEMINI_ERROR"


# ---------------------------------------------------------
# 5. Main RAG function
# ---------------------------------------------------------

def get_rag_search_response(query: str, audience: str) -> AIResponse:

    # ---------------------------------------------------------
    # Retrieve relevant context from ChromaDB
    # ---------------------------------------------------------

    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    contexts = (
        results["documents"][0]
        if results.get("documents")
        else []
    )

    metadatas = (
        results["metadatas"][0]
        if results.get("metadatas")
        else []
    )

    # ---------------------------------------------------------
    # Build context for Gemini
    # ---------------------------------------------------------

    context_string = "\n\n".join(
        [
            f"Source {i + 1}:\n{doc}"
            for i, doc in enumerate(contexts)
        ]
    )

    # ---------------------------------------------------------
    # Generate AI answer
    # ---------------------------------------------------------

    generation_error = None

    if client and contexts:

        prompt = f"""
You are an AI Polar Knowledge Assistant for the Polaris platform.

Your job is to answer the user's query using ONLY the provided
verified context.

Adjust your language, complexity, and tone to suit the target
audience: "{audience}".

IMPORTANT RULES:

- Do not invent facts.
- Do not use information outside the provided context.
- If the context does not contain the exact answer, clearly say so.
- You may combine information from multiple provided sources.
- Keep the answer concise but informative.
- Use markdown when it improves readability.
- Prefer clear explanations over unnecessary technical jargon.
- Never create fake citations or sources.

VERIFIED CONTEXT:

{context_string}

USER QUERY:

{query}

TARGET AUDIENCE:

{audience}

Provide the final answer now.
"""

        summary, generation_error = generate_gemini_response(prompt)

    else:

        summary = None

        if not client:
            generation_error = "API_KEY_MISSING"

        elif not contexts:
            generation_error = "NO_CONTEXT"


    # ---------------------------------------------------------
    # 6. Fallback response
    # ---------------------------------------------------------

    if summary is None:

        if generation_error == "API_KEY_MISSING":

            summary = (
                "Gemini is not configured because "
                "GEMINI_API_KEY was not found in the backend .env file.\n\n"
                "The relevant information was successfully retrieved "
                "from the Polaris knowledge base:\n\n"
                f"{context_string}"
            )

        elif generation_error == "NO_CONTEXT":

            summary = (
                "I could not find relevant information for this query "
                "in the indexed Polaris knowledge base."
            )

        else:

            summary = (
                "The AI generation service is temporarily unavailable, "
                "but the relevant information was successfully retrieved "
                "from the Polaris knowledge base.\n\n"
                "### Retrieved Knowledge\n\n"
                f"{context_string}\n\n"
                "Please try the query again in a moment."
            )


    # ---------------------------------------------------------
    # 7. Construct provenance / source citations
    # ---------------------------------------------------------

    sources = []

    for meta in metadatas:

        sources.append(
            SourceCitation(
                id=meta.get("id", "UNKNOWN"),
                type=meta.get("type", "document"),
                title=meta.get("title", "Untitled Document"),
                url=meta.get("url", "#")
            )
        )


    # ---------------------------------------------------------
    # Mocking related knowledge based on the retrieved items for demonstration
    related_knowledge = [
        KnowledgeCard(
            id="DATA-8492", type="dataset", title="Southern Ocean Sea Ice Extent (2010-2023)", 
            metadata={"year": "2023", "region": "Southern Ocean", "url": "https://incois.gov.in/data/southern-ocean-sea-ice"}
        ),
        KnowledgeCard(
            id="MEDIA-VID-01", type="media", title="Ice Core Extraction Process", 
            metadata={"year": "2022", "url": "https://ncpor.res.in/media/vid-01"}
        )
    ]


    # ---------------------------------------------------------
    # 9. Determine retrieval confidence
    # ---------------------------------------------------------

    if len(contexts) >= 3:
        confidence = "High"

    elif len(contexts) >= 1:
        confidence = "Medium"

    else:
        confidence = "Low"


    # ---------------------------------------------------------
    # 10. Return structured API response
    # ---------------------------------------------------------

    return AIResponse(
        query=query,
        audience=audience,
        summary=summary,
        sources=sources,
        related_knowledge=related_knowledge,
        confidence=confidence
    )

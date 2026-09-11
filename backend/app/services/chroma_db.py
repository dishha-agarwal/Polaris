import chromadb
import json
import os


DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "chroma_db"
)

DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "data",
    "mock_data.json"
)


client = chromadb.PersistentClient(path=DB_PATH)

collection = client.get_or_create_collection(
    name="polar_knowledge"
)


def init_db():

    # If the collection is already populated, skip
    if collection.count() > 0:
        return

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:

        # Store important source information directly
        # inside ChromaDB metadata.
       metadata = {
    "id": item["id"],
    "type": item["type"],
    "title": item["title"],
    "url": item.get("url", ""),
    }

        # Add additional metadata fields
    for k, v in item.get("metadata", {}).items():
            metadata[k] = str(v)

    collection.add(
            documents=[item["content"]],
            metadatas=[metadata],
            ids=[item["id"]]
        )
"""
AI DATA ANALYZER - ANSWER GENERATOR TEST
"""

import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_engine.answer_generator import AnswerGenerator

def test_answer_generator():
    print("======================================================================")
    print("AI DATA ANALYZER - QWEN ANSWER GENERATOR TEST")
    print("======================================================================\n")

    question = "Which product generated the highest revenue?"
    
    print("USER QUESTION")
    print("-" * 70)
    print(f"\n{question}\n")

    context = {
      "question": question,
      "result": {
        "product": "Drone",
        "revenue": 2537181.0,
        "units_sold": 1286,
        "orders": 433
      },
      "available_context": {
        "date": True,
        "location": True,
        "channel": True,
        "customer": True,
        "branch": False,
        "category": False
      },
      "source": {
        "file": "sample_sales.csv",
        "rows_analyzed": 11000
      }
    }
    
    print("VERIFIED DATA")
    print("-" * 70)
    print(f"\nProduct: {context['result']['product']}")
    print(f"Revenue: {context['result']['revenue']:.2f}")
    print(f"Units Sold: {context['result']['units_sold']}")
    print(f"Orders: {context['result']['orders']}\n")

    generator = AnswerGenerator()
    
    answer = generator.generate(context)
    
    print("QWEN ANSWER")
    print("-" * 70)
    print(f"\n{answer}\n")
    
    generator.unload()

    print("======================================================================")
    print("TEST COMPLETED SUCCESSFULLY")
    print("======================================================================")

if __name__ == "__main__":
    test_answer_generator()

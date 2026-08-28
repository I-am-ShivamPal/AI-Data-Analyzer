import gc
import time
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig


MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"


def print_gpu_memory(label):
    if torch.cuda.is_available():
        allocated = torch.cuda.memory_allocated() / 1024**3
        reserved = torch.cuda.memory_reserved() / 1024**3

        print(f"\n[{label}]")
        print(f"GPU allocated: {allocated:.2f} GB")
        print(f"GPU reserved:  {reserved:.2f} GB")


print("=" * 60)
print("Qwen2.5-7B-Instruct GPU Test")
print("=" * 60)

print("\nCUDA available:", torch.cuda.is_available())

if not torch.cuda.is_available():
    raise RuntimeError("CUDA GPU is not available.")

print("GPU:", torch.cuda.get_device_name(0))
print_gpu_memory("Before model loading")


print("\nLoading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_ID
)


print("Loading model in 4-bit mode...")

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)


model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    quantization_config=quantization_config,
    device_map={"": 0},
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True,
)

print("\nModel loaded successfully!")

print_gpu_memory("After model loading")


messages = [
    {
        "role": "system",
        "content": (
            "You are the main reasoning engine of an AI Data Analyzer. "
            "Give clear, concise and useful answers."
        ),
    },
    {
        "role": "user",
        "content": (
            "A sales dataset has monthly revenue values: "
            "January 120000, February 150000, March 110000, "
            "April 180000. Give me two important insights."
        ),
    },
]


text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
)

inputs = tokenizer(
    text,
    return_tensors="pt"
).to(model.device)


print("\nGenerating response...")

start_time = time.time()

with torch.inference_mode():
    outputs = model.generate(
        **inputs,
        max_new_tokens=200,
        do_sample=False,
        temperature=None,
        top_p=None,
        pad_token_id=tokenizer.eos_token_id,
    )

elapsed = time.time() - start_time


generated_tokens = outputs[0][inputs.input_ids.shape[1]:]

response = tokenizer.decode(
    generated_tokens,
    skip_special_tokens=True
)


print("\n" + "=" * 60)
print("MODEL RESPONSE")
print("=" * 60)

print(response)

print("\n" + "=" * 60)
print(f"Generation time: {elapsed:.2f} seconds")
print("=" * 60)

print_gpu_memory("After generation")


del model
gc.collect()

if torch.cuda.is_available():
    torch.cuda.empty_cache()

print("\nTest completed successfully.")
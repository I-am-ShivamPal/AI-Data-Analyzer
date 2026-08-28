import os
import gc
import time
import psutil
import torch

from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
)

MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"

TEST_PROMPTS = [
    "Explain what data analysis means in two sentences.",
    "A company had sales of 100, 120, 90, 150 and 200. Give three useful insights.",
    "Explain the difference between mean, median and mode in simple words.",
    "You have a dataset with missing values. List five steps for analyzing it.",
    "Write a short summary of why DuckDB can be useful for analyzing large datasets.",
]


def memory_stats(label):
    process = psutil.Process(os.getpid())

    ram_gb = process.memory_info().rss / (1024 ** 3)

    print(f"\n--- {label} ---")
    print(f"Process RAM: {ram_gb:.2f} GB")

    if torch.cuda.is_available():
        allocated = torch.cuda.memory_allocated() / (1024 ** 3)
        reserved = torch.cuda.memory_reserved() / (1024 ** 3)

        print(f"GPU allocated: {allocated:.2f} GB")
        print(f"GPU reserved:  {reserved:.2f} GB")


print("=" * 70)
print("QWEN2.5-7B STABILITY AND PERFORMANCE TEST")
print("=" * 70)

if not torch.cuda.is_available():
    raise RuntimeError("CUDA GPU is not available.")

print("\nGPU:", torch.cuda.get_device_name(0))
memory_stats("Before model loading")


quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)


print("\nLoading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)


print("Loading Qwen2.5-7B in 4-bit mode...")

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    quantization_config=quantization_config,
    device_map={"": 0},
    dtype=torch.float16,
    low_cpu_mem_usage=True,
)

model.eval()

memory_stats("After model loading")


total_tokens = 0
total_time = 0


for index, prompt in enumerate(TEST_PROMPTS, start=1):

    print("\n" + "=" * 70)
    print(f"TEST {index}/{len(TEST_PROMPTS)}")
    print("=" * 70)

    print("Prompt:")
    print(prompt)

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful AI assistant for data analysis. "
                "Answer clearly and concisely."
            ),
        },
        {
            "role": "user",
            "content": prompt,
        },
    ]

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
    )

    inputs = tokenizer(
        text,
        return_tensors="pt",
    ).to("cuda")

    torch.cuda.synchronize()

    start_time = time.time()

    with torch.inference_mode():
        outputs = model.generate(
            **inputs,
            max_new_tokens=150,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )

    torch.cuda.synchronize()

    elapsed = time.time() - start_time

    generated_tokens = outputs[0][inputs.input_ids.shape[1]:]

    token_count = len(generated_tokens)

    total_tokens += token_count
    total_time += elapsed

    response = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True,
    )

    print("\nResponse:")
    print(response)

    print(f"\nGenerated tokens: {token_count}")
    print(f"Generation time: {elapsed:.2f} seconds")

    if elapsed > 0:
        print(f"Approx. speed: {token_count / elapsed:.2f} tokens/sec")

    memory_stats(f"After test {index}")

    del outputs
    del inputs
    gc.collect()
    torch.cuda.empty_cache()


print("\n" + "=" * 70)
print("FINAL PERFORMANCE SUMMARY")
print("=" * 70)

print(f"Total generated tokens: {total_tokens}")
print(f"Total generation time: {total_time:.2f} seconds")

if total_time > 0:
    print(f"Average speed: {total_tokens / total_time:.2f} tokens/sec")

memory_stats("Final memory state")

print("\nStability test completed successfully.")
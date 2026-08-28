import gc
import os
import time
import psutil
import torch

from transformers import (
    Qwen2_5_VLForConditionalGeneration,
    AutoProcessor,
    BitsAndBytesConfig,
)

from qwen_vl_utils import process_vision_info


MODEL_ID = "Qwen/Qwen2.5-VL-3B-Instruct"


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
print("QWEN2.5-VL-3B-INSTRUCT GPU TEST")
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


print("\nLoading processor...")

processor = AutoProcessor.from_pretrained(MODEL_ID)


print("Loading Qwen2.5-VL-3B in 4-bit mode...")


model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
    MODEL_ID,
    quantization_config=quantization_config,
    device_map={"": 0},
    dtype=torch.float16,
    low_cpu_mem_usage=True,
)

model.eval()

memory_stats("After model loading")


# --------------------------------------------------
# IMAGE TEST
# --------------------------------------------------

IMAGE_PATH = "image.jpg"


if not os.path.exists(IMAGE_PATH):
    raise FileNotFoundError(
        f"\nImage not found: {IMAGE_PATH}\n"
        "Put an image named image.jpg in the project root."
    )


print("\nUsing image:", IMAGE_PATH)


messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image",
                "image": IMAGE_PATH,
            },
            {
                "type": "text",
                "text": (
                    "Analyze this image carefully. "
                    "Describe what you see and identify any useful "
                    "data, patterns, charts, tables, or insights."
                ),
            },
        ],
    }
]


text = processor.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
)


image_inputs, video_inputs = process_vision_info(messages)


inputs = processor(
    text=[text],
    images=image_inputs,
    videos=video_inputs,
    padding=True,
    return_tensors="pt",
)


inputs = inputs.to("cuda")


torch.cuda.synchronize()

start_time = time.time()


print("\nGenerating vision response...")


with torch.inference_mode():

    generated_ids = model.generate(
        **inputs,
        max_new_tokens=300,
        do_sample=False,
    )


torch.cuda.synchronize()

elapsed = time.time() - start_time


generated_ids_trimmed = [
    output_ids[len(input_ids):]
    for input_ids, output_ids in zip(
        inputs.input_ids,
        generated_ids,
    )
]


response = processor.batch_decode(
    generated_ids_trimmed,
    skip_special_tokens=True,
    clean_up_tokenization_spaces=False,
)


print("\n" + "=" * 70)
print("VISION MODEL RESPONSE")
print("=" * 70)

print(response[0])


print("\n" + "=" * 70)
print(f"Generation time: {elapsed:.2f} seconds")
print("=" * 70)


memory_stats("After generation")


# Cleanup

del generated_ids
del inputs
gc.collect()
torch.cuda.empty_cache()


print("\nTest completed successfully.")
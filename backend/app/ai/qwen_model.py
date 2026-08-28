# app/ai/qwen_model.py

from __future__ import annotations

import gc
from typing import Optional

import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
)


class QwenModel:
    """
    Shared Qwen2.5-7B-Instruct model.

    The model is loaded ONCE and reused by:
      - QuestionParser
      - AnswerGenerator

    Designed for an RTX 4050 6GB VRAM using 4-bit quantization.
    """

    MODEL_NAME = "Qwen/Qwen2.5-7B-Instruct"

    def __init__(self):
        self.tokenizer = None
        self.model = None
        self._loaded = False

    # ---------------------------------------------------------
    # LOAD MODEL
    # ---------------------------------------------------------

    def load(self) -> None:

        if self._loaded:
            return

        if not torch.cuda.is_available():
            raise RuntimeError(
                "CUDA is not available. "
                "Qwen2.5-7B requires the configured NVIDIA GPU."
            )

        print(f"Loading {self.MODEL_NAME}...")

        print("GPU:", torch.cuda.get_device_name(0))

        self.tokenizer = AutoTokenizer.from_pretrained(
            self.MODEL_NAME
        )

        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )

        self.model = AutoModelForCausalLM.from_pretrained(
            self.MODEL_NAME,
            quantization_config=quantization_config,
            device_map={"": 0},
            dtype=torch.float16,
        )

        self.model.eval()

        self._loaded = True

        self._print_gpu_memory(
            "Qwen loaded"
        )

    # ---------------------------------------------------------
    # GENERATE
    # ---------------------------------------------------------

    def generate(
        self,
        prompt: str,
        max_new_tokens: int = 256,
        temperature: float = 0.1,
    ) -> str:

        self.load()

        messages = [
            {
                "role": "user",
                "content": prompt,
            }
        ]

        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
        )

        # Move input tensors to GPU.
        inputs = {
            key: value.to("cuda")
            for key, value in inputs.items()
        }

        input_length = inputs["input_ids"].shape[1]

        with torch.inference_mode():

            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=temperature > 0,
                temperature=temperature,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        generated_tokens = outputs[
            0,
            input_length:
        ]

        response = self.tokenizer.decode(
            generated_tokens,
            skip_special_tokens=True,
        ).strip()

        # Release temporary generation tensors.
        del inputs
        del outputs
        del generated_tokens

        gc.collect()

        # Don't call empty_cache aggressively after every generation.
        # PyTorch's caching allocator can reuse this memory efficiently.

        return response

    # ---------------------------------------------------------
    # MEMORY
    # ---------------------------------------------------------

    @staticmethod
    def _print_gpu_memory(label: str) -> None:

        if not torch.cuda.is_available():
            return

        allocated = (
            torch.cuda.memory_allocated(0)
            / 1024**3
        )

        reserved = (
            torch.cuda.memory_reserved(0)
            / 1024**3
        )

        print(
            f"[{label}] "
            f"GPU allocated: {allocated:.2f} GB | "
            f"reserved: {reserved:.2f} GB"
        )

    def gpu_memory(self) -> dict:

        if not torch.cuda.is_available():
            return {
                "allocated_gb": 0.0,
                "reserved_gb": 0.0,
            }

        return {
            "allocated_gb": round(
                torch.cuda.memory_allocated(0)
                / 1024**3,
                2,
            ),
            "reserved_gb": round(
                torch.cuda.memory_reserved(0)
                / 1024**3,
                2,
            ),
        }

    # ---------------------------------------------------------
    # UNLOAD
    # ---------------------------------------------------------

    def unload(self) -> None:

        if self.model is not None:
            del self.model

        if self.tokenizer is not None:
            del self.tokenizer

        self.model = None
        self.tokenizer = None
        self._loaded = False

        gc.collect()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.synchronize()

        print("Qwen model unloaded.")

    # ---------------------------------------------------------
    # CONTEXT MANAGER
    # ---------------------------------------------------------

    def __enter__(self):
        self.load()
        return self

    def __exit__(
        self,
        exc_type,
        exc_value,
        traceback,
    ):
        self.unload()

# ---------------------------------------------------------
# SHARED QWEN INSTANCE
# ---------------------------------------------------------

_shared_qwen: Optional[QwenModel] = None


def get_qwen_model() -> QwenModel:

    global _shared_qwen

    if _shared_qwen is None:
        _shared_qwen = QwenModel()

    _shared_qwen.load()

    return _shared_qwen


def unload_qwen_model() -> None:

    global _shared_qwen

    if _shared_qwen is not None:
        _shared_qwen.unload()
        _shared_qwen = None

import torch

from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
)


class QwenAnalysisEngine:
    """
    AI engine powered by Qwen2.5-7B-Instruct.

    The model receives a compact dataset context and a user question,
    then produces an analysis plan.
    """

    def __init__(
        self,
        model_name="Qwen/Qwen2.5-7B-Instruct"
    ):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None

    def load_model(self):
        """
        Load Qwen in 4-bit mode on the GPU.
        """

        print("Loading Qwen2.5-7B-Instruct...")

        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
        )

        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name
        )

        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            quantization_config=quantization_config,
            device_map={"": 0},
            dtype=torch.float16,
        )

        self.model.eval()

        print("Qwen loaded successfully.")

    def analyze(
        self,
        dataset_context: str,
        user_question: str,
        max_new_tokens=500,
    ) -> str:
        """
        Ask Qwen to understand the dataset and produce an analysis plan.
        """

        if self.model is None:
            raise RuntimeError(
                "Model is not loaded. Call load_model() first."
            )

        system_prompt = """
You are an expert data analyst.

You are helping analyze a dataset.

Your job is NOT to invent results.

You must carefully study the dataset metadata,
schema, statistics, data quality information,
and sample rows provided.

When the user asks a question:

1. Understand the question.
2. Identify the relevant columns.
3. Explain what calculations or analysis are required.
4. Create a clear step-by-step analysis plan.
5. Do not claim a final result unless that result
   is explicitly present in the provided context.
6. If actual dataset computation is required,
   clearly state what should be calculated.

Be precise and concise.
"""

        user_prompt = f"""
DATASET CONTEXT:

{dataset_context}

USER QUESTION:

{user_question}

Create an analysis plan for answering this question.
"""

        messages = [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ]

        prompt = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
        ).to("cuda")

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=False,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        generated_tokens = outputs[
            0,
            inputs.input_ids.shape[1]:
        ]

        response = self.tokenizer.decode(
            generated_tokens,
            skip_special_tokens=True,
        )

        return response.strip()

    def unload_model(self):
        """
        Free GPU memory.
        """

        if self.model is not None:

            del self.model
            self.model = None

        if torch.cuda.is_available():

            torch.cuda.empty_cache()

        print("Qwen model unloaded.")

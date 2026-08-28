from typing import Any, Dict

from app.data_engine.question_parser import QuestionParser
from app.data_engine.answer_generator import AnswerGenerator
from app.data_engine.result_context_builder import ResultContextBuilder
from app.data_engine.analysis_executor import AnalysisExecutor

class AnalysisPipeline:

    def __init__(
        self,
        question_parser: QuestionParser,
        analysis_executor: AnalysisExecutor,
        result_context_builder: ResultContextBuilder,
        answer_generator: AnswerGenerator,
    ):
        self.question_parser = question_parser
        self.analysis_executor = analysis_executor
        self.result_context_builder = result_context_builder
        self.answer_generator = answer_generator

    def run(self, question: str) -> Dict[str, Any]:

        if not question or not question.strip():
            raise ValueError("Question cannot be empty.")

        # --------------------------------------------------
        # STEP 1: Convert natural language → structured intent
        # --------------------------------------------------
        intent = self.question_parser.parse(question)

        # --------------------------------------------------
        # STEP 2: Execute deterministic data analysis
        # --------------------------------------------------
        verified_result = self.analysis_executor.execute(intent)

        # --------------------------------------------------
        # STEP 3: Build trusted context
        # --------------------------------------------------
        result_context = self.result_context_builder.build_context(
            question=question,
            result=verified_result,
            intent=intent,
        )

        # --------------------------------------------------
        # STEP 4: Generate final natural-language answer
        # --------------------------------------------------
        answer = self.answer_generator.generate(
            context=result_context,
        )

        # --------------------------------------------------
        # Return complete trace
        # --------------------------------------------------
        return {
            "answer": answer,
            "data": verified_result.get("result", []),
            "intent": intent,
            "context": result_context.get("result", {}).get("resolved_context", {})
        }

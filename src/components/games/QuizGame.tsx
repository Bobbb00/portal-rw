'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, ArrowLeft, Trophy, Target, Lightbulb } from 'lucide-react';
import { QuizQuestion } from '@/types';
import ProgressBar from '@/components/ui/ProgressBar';

interface QuizGameProps {
  questions: QuizQuestion[];
}

type GameState = 'intro' | 'playing' | 'answered' | 'result';

export default function QuizGame({ questions }: QuizGameProps) {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const currentQuestion = questions[currentIndex];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const getResultMessage = () => {
    if (percentage >= 80) return { emoji: '🌟', title: 'Sangat Mengenal Lingkungan!', message: 'Luar biasa! Anda sangat memahami lingkungan RW 05. Terus jaga dan lestarikan lingkungan kita!' };
    if (percentage >= 60) return { emoji: '👍', title: 'Cukup Mengenal Lingkungan', message: 'Bagus! Anda cukup memahami lingkungan sekitar. Terus tingkatkan pengetahuan Anda!' };
    if (percentage >= 40) return { emoji: '📚', title: 'Perlu Mempelajari Kembali', message: 'Masih perlu belajar lebih banyak tentang lingkungan RW 05. Coba jelajahi portal ini untuk menambah pengetahuan!' };
    return { emoji: '🌱', title: 'Mari Mengenal Lingkungan Lebih Jauh', message: 'Yuk, mulai kenali lingkungan RW 05 kita lebih baik! Kunjungi halaman-halaman informasi di portal ini.' };
  };

  const handleStart = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (answerIndex: number) => {
    if (gameState === 'answered') return;
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    setAnswers((prev) => [...prev, isCorrect]);
    setGameState('answered');
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setGameState('playing');
    } else {
      setGameState('result');
    }
  };

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Target className="w-10 h-10 text-primary-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Kuis Kenali Lingkungan</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Uji pengetahuan Anda tentang lingkungan RW 05! Jawab {questions.length} pertanyaan seputar kebersihan, keamanan, fasilitas, dan pelayanan warga.
        </p>

        <div className="bg-primary-50 rounded-xl p-5 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Petunjuk Permainan
          </h3>
          <ul className="space-y-2 text-sm text-primary-700">
            <li>• Terdapat {questions.length} pertanyaan pilihan ganda</li>
            <li>• Pilih satu jawaban yang paling tepat</li>
            <li>• Setiap jawaban akan langsung dinilai</li>
            <li>• Skor akhir akan ditampilkan setelah semua pertanyaan selesai</li>
          </ul>
        </div>

        <button onClick={handleStart} className="btn-primary text-lg px-8 py-3">
          Mulai Bermain
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Result Screen
  if (gameState === 'result') {
    const result = getResultMessage();
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="text-6xl mb-4">{result.emoji}</div>
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-12 h-12 text-primary-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{result.title}</h2>
        <p className="text-gray-500 mb-6">{result.message}</p>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 max-w-sm mx-auto">
          <div className="text-5xl font-bold text-primary-600 mb-1">{score}/{questions.length}</div>
          <p className="text-gray-500 text-sm">Jawaban Benar</p>
          <div className="mt-4 w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Skor: {percentage}%</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {answers.map((isCorrect, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={handleStart} className="btn-primary">
            <RotateCcw className="w-4 h-4" />
            Main Lagi
          </button>
          <Link href="/permainan" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Permainan
          </Link>
        </div>
      </div>
    );
  }

  // Playing / Answered Screen
  return (
    <div className="max-w-2xl mx-auto py-4">
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let optionClass = 'border-gray-200 hover:border-primary-300 hover:bg-primary-50';

            if (gameState === 'answered') {
              if (index === currentQuestion.correctAnswer) {
                optionClass = 'border-green-500 bg-green-50';
              } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                optionClass = 'border-red-500 bg-red-50';
              } else {
                optionClass = 'border-gray-100 opacity-60';
              }
            } else if (selectedAnswer === index) {
              optionClass = 'border-primary-500 bg-primary-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={gameState === 'answered'}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${optionClass} ${
                  gameState === 'answered' ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 ${
                  gameState === 'answered' && index === currentQuestion.correctAnswer
                    ? 'bg-green-500 text-white'
                    : gameState === 'answered' && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm sm:text-base text-gray-700 grow">{option}</span>
                {gameState === 'answered' && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                )}
                {gameState === 'answered' && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {gameState === 'answered' && (
          <div className={`mt-6 p-4 rounded-xl ${
            selectedAnswer === currentQuestion.correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              )}
              <div>
                <p className={`font-semibold mb-1 ${
                  selectedAnswer === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Jawaban Benar! 🎉' : 'Jawaban Salah 😕'}
                </p>
                <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {gameState === 'answered' && (
          <div className="mt-6 flex justify-end">
            <button onClick={handleNext} className="btn-primary">
              {currentIndex < questions.length - 1 ? 'Selanjutnya' : 'Lihat Hasil'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

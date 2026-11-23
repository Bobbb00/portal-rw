'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizData: Question[] = [
  {
    id: 1,
    question: "Kapan jadwal rutin pengangkutan sampah di RW 05?",
    options: ["Setiap hari", "Senin & Kamis", "Rabu & Sabtu", "Minggu saja"],
    correctAnswer: 1,
    explanation: "Sesuai jadwal kebersihan, sampah diangkut secara rutin pada hari Senin dan Kamis mulai pukul 07.00 WIB."
  },
  {
    id: 2,
    question: "Jika ada tamu yang menginap, kapan batas waktu maksimal untuk melapor ke RT?",
    options: ["1x24 jam", "2x24 jam", "3x24 jam", "Seminggu"],
    correctAnswer: 0,
    explanation: "Tamu yang bermalam/menginap wajib dilaporkan kepada pengurus RT setempat dalam waktu maksimal 1x24 jam."
  },
  {
    id: 3,
    question: "Pukul berapakah portal utama (Gerbang Depan) RW 05 ditutup pada malam hari?",
    options: ["21.00 WIB", "22.00 WIB", "23.00 WIB", "00.00 WIB"],
    correctAnswer: 2,
    explanation: "Portal utama ditutup pada pukul 23.00 WIB. Akses setelah jam tersebut harus melapor pada petugas jaga."
  },
  {
    id: 4,
    question: "Apa warna tempat sampah yang dikhususkan untuk sampah organik?",
    options: ["Kuning", "Hijau", "Merah", "Biru"],
    correctAnswer: 1,
    explanation: "Tempat sampah berwarna Hijau dikhususkan untuk sampah organik (sisa makanan, daun, dll)."
  },
  {
    id: 5,
    question: "Apa syarat utama untuk mengurus Surat Pengantar dari RW?",
    options: ["Membawa KK Asli", "Membawa Surat Pengantar dari RT", "Membayar iuran", "Membawa KTP asli"],
    correctAnswer: 1,
    explanation: "Syarat utama mendapatkan pelayanan di tingkat RW adalah harus membawa Surat Pengantar yang sudah ditandatangani oleh Ketua RT setempat."
  }
];

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <Link href="/permainan" className="inline-flex items-center gap-2 text-(--color-rw-muted) hover:text-(--color-rw-primary) transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Permainan
        </Link>
      </div>

      <div className="card-padded bg-white shadow-xl border-(--color-rw-border) relative overflow-hidden">
        {showScore ? (
          <div className="py-12 text-center animate-fade-in">
            <div className="w-24 h-24 bg-(--color-rw-primary-pale) rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-(--color-rw-accent)" />
            </div>
            <h2 className="text-3xl font-extrabold text-(--color-rw-text) mb-2" style={{ fontFamily: 'var(--font-display)' }}>Kuis Selesai!</h2>
            <p className="text-lg text-(--color-rw-muted) mb-8">
              Skor Anda: <span className="font-bold text-(--color-rw-primary)">{score}</span> dari {quizData.length}
            </p>

            <div className="p-6 bg-(--color-rw-bg-alt) rounded-2xl mb-8 max-w-md mx-auto">
              <h3 className="font-bold text-(--color-rw-text) mb-2">Penilaian:</h3>
              <p className="text-(--color-rw-muted) font-medium">
                {score === quizData.length ? 'Luar biasa! Anda adalah warga teladan yang sangat mengenal lingkungan RW 05.' : 
                 score >= 3 ? 'Bagus! Anda cukup mengenal aturan dan lingkungan RW 05.' : 
                 'Mari pelajari lebih lanjut informasi di portal ini untuk lebih mengenal lingkungan kita.'}
              </p>
            </div>

            <button
              onClick={resetQuiz}
              className="btn-primary"
            >
              <RefreshCw className="w-5 h-5" />
              Mainkan Ulang
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-8">
              <ProgressBar current={currentQuestion + 1} total={quizData.length} />
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-(--color-rw-text) leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {quizData[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {quizData[currentQuestion].options.map((option, index) => {
                let buttonStyle = "bg-(--color-rw-primary-pale) border-(--color-rw-primary-lighter) text-(--color-rw-primary) hover:border-(--color-rw-primary)";
                let Icon = null;
                
                if (isAnswered) {
                  if (index === quizData[currentQuestion].correctAnswer) {
                    buttonStyle = "bg-green-50 border-green-500 text-green-700 font-bold";
                    Icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                  } else if (index === selectedOption) {
                    buttonStyle = "bg-red-50 border-red-500 text-red-700 font-bold";
                    Icon = <XCircle className="w-5 h-5 text-red-600" />;
                  } else {
                    buttonStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(index)}
                    disabled={isAnswered}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${buttonStyle}`}
                  >
                    <span className="text-base sm:text-lg">{option}</span>
                    {Icon}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="animate-slide-up bg-(--color-rw-primary-pale) border border-(--color-rw-border) rounded-xl p-5 mb-8">
                <h4 className="font-bold text-(--color-rw-text) mb-1 flex items-center gap-2">
                  Jawaban: {quizData[currentQuestion].options[quizData[currentQuestion].correctAnswer]}
                </h4>
                <p className="text-(--color-rw-text) text-sm">
                  {quizData[currentQuestion].explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className={`btn-primary ${!isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {currentQuestion === quizData.length - 1 ? 'Selesai' : 'Pertanyaan Berikutnya'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

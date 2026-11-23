import { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QuizGame from '@/components/games/QuizGame';
import { quizQuestions } from '@/data/quiz';

export const metadata: Metadata = {
  title: 'Kuis Lingkungan',
  description: 'Kuis interaktif untuk menguji pengetahuan tentang lingkungan RW 05.',
};

export default function KuisLingkunganPage() {
  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <div className="container-custom">
        <Breadcrumb items={[
          { label: 'Permainan Edukatif', href: '/permainan' },
          { label: 'Kuis Lingkungan' }
        ]} />
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <QuizGame questions={quizQuestions} />
        </div>
      </div>
    </div>
  );
}

interface WaveDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
}

export default function WaveDivider({ color = 'var(--color-rw-bg)', flip = false, className = '' }: WaveDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-[40px] sm:h-[60px] lg:h-[80px]"
      >
        <path
          d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

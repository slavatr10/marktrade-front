import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from '@/assets/icons';
import { Title } from '@/components/typography';
import './introLayout.scss';

interface IntroLayoutProps {
  title?: string;
  backTo?: string;      // якщо задано — показуємо кнопку «назад»
  children: ReactNode;
  className?: string;
}

export default function IntroLayout({
                                      title = '',
                                      backTo,
                                      children,
                                      className,
                                    }: IntroLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className={`w-full min-h-screen ${className ?? ''}`}>
      <header className="intro-header">
        {backTo ? (
          <button
            type="button"
            className="intro-header__back"
            aria-label="Назад"
            onClick={() => navigate({ to: backTo })}
          >
            <ArrowLeft svgColor="#797979" width={14} height={14} />
          </button>
        ) : (
          <span className="intro-header__back--placeholder" />
        )}

        {title ? (
          <Title variant="h2" className="intro-header__title">
            {title}
          </Title>
        ) : (
          <h2 className="intro-header__title" />
        )}
      </header>

      <main className="intro-main">
        {children}
      </main>
    </div>
  );
}

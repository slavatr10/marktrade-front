import React, { useState } from 'react';

import LogoIcon from '@/assets/icons/Logo';
import HomeIcon from '@/assets/icons/Home';
import MetodichkaIcon from '@/assets/icons/Method';
import PlatformIcon from '@/assets/icons/Platform';
import SupportIcon from '@/assets/icons/Support';
import { Link } from '@tanstack/react-router';
import { BottomSheet } from '@/components';
import { useUser } from '@/hooks';
import { getBalance } from '@/api/user';
import classNames from 'classnames';
import { ROUTES } from '@/constants';
import supportImg from '@/assets/images/support.png';
import { Body } from '../typography';

/** =========================
 *  NavItem (універсальний)
 *  ========================= */
type BaseProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

type NavItemLinkProps = BaseProps & {
  to: string; // внутрішній або зовнішній URL
  onClick?: never;
};

type NavItemButtonProps = BaseProps & {
  onClick: (e?: React.MouseEvent) => void; // кастомна дія (наприклад openLink)
  to?: never;
};

export type NavItemProps = NavItemLinkProps | NavItemButtonProps;

const NavItem: React.FC<NavItemProps> = (props) => {
  const cls =
    props.className ??
    'flex h-[72px] w-[75px] flex-col items-center justify-center !text-[11px]';

  // Випадок кнопки (кастомний onClick)
  if ('onClick' in props) {
    const { label, children, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cls} text-[#B0B3B8]`}
        aria-label={label}
      >
        {children}
        <Body variant="xsRegular" className="mt-1 !text-[11px]">
          {label}
        </Body>
      </button>
    );
  }

  // Випадок лінка (to)
  const { label, children, to } = props;
  const isExternal = /^https?:\/\//i.test(to);

  if (isExternal) {
    // Зовнішній URL — рендеримо <a>
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} text-[#B0B3B8]`}
        aria-label={label}
      >
        {children}
        <Body variant="xsRegular" className="mt-1 !text-[11px]">
          {label}
        </Body>
      </a>
    );
  }

  // Внутрішній маршрут — TanStack Router <Link>
  return (
    <Link
      to={to}
      className={cls}
      activeProps={{ className: 'text-white' }}
      inactiveProps={{ className: 'text-[#B0B3B8]' }}
      aria-label={label}
    >
      {children}
      <Body variant="xsRegular" className="mt-1 !text-[11px]">
        {label}
      </Body>
    </Link>
  );
};

/** =========================
 *  Навігаційна кнопка
 *  ========================= */
interface NavButtonProps {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-[72px] w-[75px] flex-col items-center justify-center text-[#B0B3B8]"
  >
    {children}
    <Body variant="xsRegular" className="mt-1 !text-[11px]">
      {label}
    </Body>
  </button>
);

/** =========================
 *  Хелпер відкриття зовнішніх URL
 *  ========================= */
const openExternal = (url: string) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openLink(url); // відкриє системний браузер із WebApp
  } else {
    window.open(url, '_blank'); // звичайний браузер
  }
};

type CommunityMode = 'info' | 'join' | 'vipReady';

/** =========================
 *  Золота кнопка (градієнт як на скріні)
 *  ========================= */
const GoldButton: React.FC<{
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}> = ({ title, onClick, isLoading, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classNames(
        'w-full h-12 rounded-xl px-4 flex items-center justify-center',
        'font-medium shadow-[0_6px_18px_rgba(0,0,0,0.35)]',
        'border border-[#D4A041] transition-opacity',
        (disabled || isLoading) && 'opacity-70 cursor-not-allowed'
      )}
      // градієнт 0→27→46→63→84→100% з палітри зі скріну
      style={{
        backgroundImage:
          'linear-gradient(90deg,#8C421D 0%,#FBE67B 27%,#D4A041 46%,#FBE67B 63%,#F7D14E 84%,#D4A041 100%)',
      }}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="black"
              strokeOpacity="0.25"
              strokeWidth="3"
            />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="black" strokeWidth="3" />
          </svg>
          <span className="text-[#181717]">Перевіряю…</span>
        </span>
      ) : (
        <Body className="text-[#181717]">{title}</Body>
      )}
    </button>
  );
};

export const Footer: React.FC = () => {
  // Sheet для підтримки
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // ЄДИНИЙ sheet для комʼюніті з режимами
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [communityMode, setCommunityMode] = useState<CommunityMode>('info');
  const [vipHref, setVipHref] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { user } = useUser();

  const handleClickCommunity = () => {
    setCommunityMode(user?.deposit === true ? 'join' : 'info');
    setIsCommunityOpen(true);
  };

  const checkDeposit = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      // захист від порожнього traderId
      if (!user?.traderId) {
        setHasError(true);
        return;
      }

      const { balance } = await getBalance(String(user.traderId));

      // успіх → показати кнопку-посилання в ТОМУ Ж sheet (без openExternal)
      if (balance > 499 && user?.inviteUrlVip) {
        setVipHref(user.inviteUrlVip);
        setCommunityMode('vipReady');
      } else {
        setHasError(true);
      }
    } catch (error) {
      setHasError(true);
      console.error('Помилка при перевірці балансу:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const depositLink = (() => {
    const cid = localStorage.getItem('click_id') || '';
    return `https://u3.shortink.io/register?utm_campaign=802555&utm_source=affiliate&utm_medium=sr&a=jy9IGDHoNUussf&ac=bot-protrd&code=YRL936${
      cid ? `&click_id=${encodeURIComponent(cid)}` : ''
    }`;
  })();

  const handleDepositClick = () => {
    openExternal(depositLink);
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 h-[81px]  w-full">
        <div className="absolute bottom-[49px] left-1/2 -translate-x-1/2 z-10">
          <Link
            to={ROUTES.HOME}
            className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#005EFF]"
          >
            <HomeIcon />
          </Link>
        </div>

        <div className="relative flex h-full items-center justify-around text-white bg-white footer-dent-bar">
          <button
            onClick={handleClickCommunity}
            className="flex h-[72px] w-[75px] flex-col items-center justify-center text-[#B0B3B8]"
          >
            <LogoIcon />
            <Body variant="xsRegular" className="mt-1 !text-[11px]">
              Cообщество
            </Body>
          </button>

          <NavItem to="https://help.sprotrade.com/" label="Стратегии">
            <MetodichkaIcon />
          </NavItem>
          {/* <div className="absolute -top-8">
            <Link
              to={ROUTES.HOME}
              className="flex ml-[1px] h-[64px] w-[64px] items-center justify-center rounded-full bg-[#005EFF]"
            >
              <HomeIcon />
            </Link>
          </div> */}
          <div className="w-[60px]" />

          <NavItem onClick={handleDepositClick} label="Платформа">
            <PlatformIcon />
          </NavItem>

          <NavButton onClick={() => setIsSupportOpen(true)} label="Поддержка">
            <SupportIcon />
          </NavButton>
        </div>
      </footer>

      <BottomSheet
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        title="Поддержка"
        text1="Если у тебя остались вопросы или что-то непонятно - напиши мне"
        href="https://t.me/SashaPT_CEO"
        linkText="Написать"
        headerImg={supportImg}
      />

      <BottomSheet
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        title={
          communityMode === 'info'
            ? 'Доступ к Комьюнити'
            : communityMode === 'join'
            ? 'Присоединиться к комьюнити'
            : 'ProTrade Community Plus'
        }
        text1={
          communityMode === 'info'
            ? 'Чтобы получить доступ к комьюнити, необходимо сделать депозит.'
            : communityMode === 'join'
            ? ''
            : 'Поздравляем! У вас достаточно средств для доступа.'
        }
        text3={
          communityMode === 'join'
            ? 'У нас также есть ProTrade Community Plus — расширенный формат с дополнительными возможностями.\nЧтобы присоединиться, достаточно иметь на балансе от 500$. \nДоступ откроется после нажатия кнопки ниже.'
            : undefined
        }
        href={
          communityMode === 'info'
            ? depositLink
            : communityMode === 'vipReady'
            ? vipHref
            : communityMode === 'join'
            ? user?.inviteUrl ?? '#'
            : '#'
        }
        linkText={
          communityMode === 'info'
            ? 'Сделать депозит'
            : communityMode === 'vipReady'
            ? 'ProTrade Community +'
            : communityMode === 'join'
            ? 'ProTrade Community'
            : ''
        }
        linkElement={
          communityMode === 'join' ? (
            <GoldButton
              title={hasError ? 'Недостаточно средств' : 'ProTrade Community +'}
              onClick={checkDeposit}
              isLoading={isLoading}
              disabled={hasError}
            />
          ) : undefined
        }
        headerImg={supportImg}
      />
    </>
  );
};

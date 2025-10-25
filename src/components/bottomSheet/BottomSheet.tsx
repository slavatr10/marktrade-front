import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, LinkComponent } from '@/components';
import { CrossIcon } from '@/assets/icons';
import { Body, Title } from '../typography';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleImage?: ReactNode;
  text1?: string;
  text2?: string;
  text3?: string;
  linkText: string;
  href?: string;
  isTest?: boolean;
  onClick?: () => void;
  linkElement?: React.ReactNode;
  headerImg: string;
};

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  titleImage,
  text1,
  text2,
  text3,
  linkText,
  href = '#',
  isTest,
  linkElement,
  headerImg,
  onClick = () => {},
}: BottomSheetProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed bottom-6 left-4 right-4 z-50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <motion.img
                src={headerImg}
                alt="support"
                className="absolute -top-17 left-1/2 -translate-x-1/2 pointer-events-none w-[120px] h-[100px]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              />

              <div className="mt-24 mx-auto w-full rounded-3xl bg-modal shadow-lg text-[#181717]">
                <div className="px-4 pb-6 pt-8">
                  <div className="absolute right-4 top-4">
                    <button className="cursor-pointer" onClick={onClose}>
                      <CrossIcon />
                    </button>
                  </div>
                  <div className="flex items-center justify-center mb-5">
                    {titleImage && <div className="mr-3">{titleImage}</div>}
                    <Title className="text-center">{title}</Title>
                  </div>
                  <Body
                    variant="mdRegular"
                    className={`text-light ${text2 ? 'mb-3' : 'mb-12'}`}
                  >
                    {text1}
                  </Body>

                  {text2 && (
                    <Body variant="mdRegular" className="mb-12 text-light ">
                      {text2}
                    </Body>
                  )}

                  {isTest ? (
                    <Button
                      onClick={() => onClick()}
                      title={linkText}
                      isGreen
                      className="w-full"
                    />
                  ) : (
                    <LinkComponent to={href} variant="primary">
                      <Title variant="h6">{linkText}</Title>
                    </LinkComponent>
                  )}

                  {text3 && <p className="mb-5 mt-5">{text3}</p>}

                  {linkElement}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

'use client';

import { Button } from '@payloadcms/ui/elements';
import { useModal } from '@payloadcms/ui/elements/Modal';
import { DefaultSaveButton } from '@payloadcms/ui/elements/Save';

import styles from './Translator.module.scss';
import { TranslatorModal } from './TranslatorModal';

const modalSlug = 'translator-modal';

export const Translator = () => {
  const { isModalOpen, openModal } = useModal();

  return (
    <div className={styles.component}>
      {isModalOpen(modalSlug) && <TranslatorModal slug={modalSlug} />}
      <Button onClick={() => openModal(modalSlug)} size='small'>
        Translate content
      </Button>
      <DefaultSaveButton />
    </div>
  );
};

import type { FilmDraftResponse } from '@hobbies-collection/shared';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import styles from './styles.module.css';
import { useFormContext } from 'react-hook-form';
import { Trash2Icon, TrashIcon } from 'lucide-react';
import { getFilmDraftsQueryOptions } from '~/shared/helpers/query-options/films/get-film-drafts-query-options';
import { toaster } from '~/shared/utils/toaster';
import { api, queryKey } from '~/shared/services/api';
import { Panel } from '~/shared/components/ui/panel';
import { Button } from '~/shared/components/controls/button';
import { Modal } from '~/shared/components/modals/modal';
import { ConfirmModal } from '~/shared/components/modals/confirm-modal';

type Props = {
  selectedDraft: FilmDraftResponse | null;
  onSelectDraft: (draft: FilmDraftResponse | null) => void;
};

export const Drafts = ({ selectedDraft, onSelectDraft }: Props) => {
  const params = useParams({ from: '/console/films_/$id' });
  const { data } = useSuspenseQuery(getFilmDraftsQueryOptions(params.id));
  const [contentToView, setContentToView] = useState<FilmDraftResponse | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<FilmDraftResponse | null>(null);
  const [askDeleteAllDrafts, setAskDeleteAllDrafts] = useState<boolean | null>(null);
  const { reset } = useFormContext();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FilmDraftResponse) => {
      if (selectedDraft?.id === data.id) {
        toaster.error("Can't delete draft for the current session");
        return;
      }

      await api.films.deleteDraft({ params: { id: data.id } });
      setDraftToDelete(null);
    },
    meta: {
      invalidateQueries: {
        queryKey: queryKey('films.getFilmDrafts'),
      },
    },
  });

  const { mutate: deleteAllDrafts, isPending: isDraftsDeleting } = useMutation({
    mutationFn: async () => {
      await api.films.deleteAllFilmDrafts({ params: { filmId: params.id } });
    },
    meta: {
      invalidateQueries: {
        queryKey: queryKey('films.getFilmDrafts'),
      },
    },
  });

  if (!data.length) {
    return null;
  }

  const handleApply = (draft: FilmDraftResponse) => {
    reset(draft.content);
    onSelectDraft(draft);
  };

  return (
    <Panel>
      <div className={styles.header}>
        <div className={styles.title}>Drafts</div>
        <Button icon={<Trash2Icon />} variant="ghost" onClick={() => setAskDeleteAllDrafts(true)} />
      </div>
      <div className={styles.wrapper}>
        {data.map((draft) => (
          <div className={styles.row} key={draft.id}>
            <div>
              <div className={styles.row_title}>
                {draft.content.title?.length ? draft.content.title : 'No title'}
              </div>
              <div className={styles.row_date}>Last modified: {draft.updatedAt}</div>
            </div>
            <div className={styles.row_buttons}>
              <Button variant="light" size="small" onClick={() => setContentToView(draft)}>
                View
              </Button>
              <Button size="small" onClick={() => handleApply(draft)}>
                Apply
              </Button>
              <Button
                variant="ghost"
                icon={<TrashIcon />}
                onClick={() => setDraftToDelete(draft)}
              />
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={contentToView !== null} onClose={() => setContentToView(null)}>
        <Modal.Content>
          <div className={styles.content}>
            <div className={styles.modal_title}>Last modified: {contentToView?.updatedAt}</div>
            <pre>{JSON.stringify(contentToView?.content, null, 2)}</pre>
          </div>
          <Modal.CloseButton onClick={() => setContentToView(null)} />
        </Modal.Content>
      </Modal>
      <ConfirmModal
        data={draftToDelete}
        onClose={() => setDraftToDelete(null)}
        title="Confirm draft deletion"
        onConfirm={(data) => mutate(data)}
        isPending={isPending}
      />
      <ConfirmModal
        data={askDeleteAllDrafts}
        onClose={() => setAskDeleteAllDrafts(null)}
        title="Delete all drafts?"
        onConfirm={() => deleteAllDrafts()}
        isPending={isDraftsDeleting}
      />
    </Panel>
  );
};

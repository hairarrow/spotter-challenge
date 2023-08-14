import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

import type { Beat as IBeat } from "~/server/api/routers/act";
import { api } from "~/utils/api";
import { BeatComposer } from "./BeatComposer";
import { useClickAway } from "@uidotdev/usehooks";

interface Props {
  actId: number;
  beat: IBeat;
}

export const Beat: React.FC<Props> = ({ beat, actId }) => {
  const [showEdit, setShowEdit] = useState(false);
  const { mutate: deleteBeat } = api.beat.delete.useMutation();
  // const { mutate: updateBeat } = api.beat.update.useMutation();
  const ref = useClickAway<HTMLDivElement>(() => setShowEdit(false));
  const utils = api.useContext();

  function onDeleteBeat(id: number) {
    deleteBeat(
      { actId, id },
      {
        onSuccess: () => {
          utils.act.sheet.invalidate().catch(console.error);
        },
      }
    );
  }

  return (
    <motion.li
      key={beat.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="group relative flex snap-start gap-2 md:flex-col"
    >
      <AnimatePresence mode="wait">
        {showEdit ? (
          <motion.div
            ref={ref}
            key="composer"
            className="w-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
          >
            <BeatComposer
              isEditing
              actId={actId}
              beat={beat}
              onComplete={() => setShowEdit(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="beat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
            className="w-24 md:w-72"
          >
            <div className="h-16 w-24 rounded-lg bg-zinc-800 md:h-40 md:w-72">
              <div className="absolute right-0 top-0 flex gap-2">
                <button
                  className="opacity-80 transition-all hover:text-zinc-200 group-hover:opacity-100 md:p-2 md:opacity-30"
                  onClick={() => setShowEdit(true)}
                >
                  <PencilIcon className="hidden h-6 w-6 md:block" />
                  <span className="text-zinc-300 md:hidden">Edit</span>
                </button>
                <button
                  className="opacity-80 transition-all hover:text-zinc-200 group-hover:opacity-100 md:p-2 md:opacity-30"
                  onClick={() => onDeleteBeat(beat.id)}
                >
                  <TrashIcon className="hidden h-6 w-6 md:block" />
                  <span className="text-zinc-300 md:hidden">Delete</span>
                </button>
              </div>
            </div>
            <div className="truncate font-medium leading-loose text-zinc-500">
              {beat.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

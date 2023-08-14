import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useClickAway } from "@uidotdev/usehooks";
import { PencilSquareIcon, VideoCameraIcon } from "@heroicons/react/20/solid";

import type { Beat as IBeat } from "~/server/api/routers/act";
import { api } from "~/utils/api";
import { BeatComposer } from "./BeatComposer";

interface Props {
  actId: number;
  beat: IBeat;
}

export const Beat: React.FC<Props> = ({ beat, actId }) => {
  const [showEdit, setShowEdit] = useState(false);
  const { mutate: deleteBeat } = api.beat.delete.useMutation();
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
            className="w-full md:w-72"
          >
            <div className="group/block relative h-44 w-full rounded-lg bg-zinc-800 md:w-72">
              <div className="absolute left-0 top-0 flex gap-2 p-2">
                {Boolean(beat.time) ? (
                  <div className="rounded-lg bg-zinc-950 p-1 text-xs font-medium text-zinc-400">
                    {beat.time.split("-")[0]}
                    {" - "}
                    {beat.time.split("-")[1]}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {Boolean(beat.content) ? (
                <div className="absolute bottom-0 left-0 p-2">
                  {Boolean(beat.cameraAngle) ? (
                    <div className="relative line-clamp-1 inline-flex rounded-lg bg-zinc-900 px-2 py-1.5 text-xs font-medium text-zinc-400">
                      <VideoCameraIcon className="mr-2 inline-block h-4 w-4" />
                      <p className="line-clamp-1">{beat.cameraAngle}</p>
                    </div>
                  ) : (
                    <></>
                  )}
                  <p className="relative z-10 mt-1 line-clamp-2 bg-zinc-800 text-sm text-zinc-300 group-hover/block:line-clamp-none">
                    {beat.content}
                  </p>
                </div>
              ) : (
                <></>
              )}
              {Boolean(beat.notes) ? (
                <div className="absolute left-0 top-8 z-10 p-2">
                  <p className="line-clamp-1 rounded bg-zinc-700 p-0.5 px-1 text-xs text-zinc-300 hover:line-clamp-none">
                    <PencilSquareIcon className="-mt-1 mr-1 inline-block h-4 w-4" />
                    {beat.notes}
                  </p>
                </div>
              ) : (
                <></>
              )}
              <div className="absolute right-2 top-2 flex gap-2 text-zinc-400 md:right-0 md:top-0 md:gap-0">
                <button
                  className="opacity-80 transition-all hover:text-zinc-200 group-hover:opacity-100 md:p-1 md:opacity-30"
                  onClick={() => setShowEdit(true)}
                >
                  <PencilIcon className="h-6 w-6" />
                  <span className="hidden">Edit</span>
                </button>
                <button
                  className="opacity-80 transition-all hover:text-zinc-200 group-hover:opacity-100 md:p-1 md:opacity-30"
                  onClick={() => onDeleteBeat(beat.id)}
                >
                  <TrashIcon className="h-6 w-6" />
                  <span className="hidden">Delete</span>
                </button>
              </div>
            </div>
            <p className="mt-1 truncate font-medium leading-loose text-zinc-400">
              {beat.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

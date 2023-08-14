import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

import type { Props } from "~/components/Act/Act";
import { BeatComposer } from "~/components/BeatComposer";
import { Beat } from "~/components/Beat";

export const BeatList: React.FC<Props> = ({ act }) => {
  const [isAdding, setIsAdding] = useState(false);
  const ref = useClickAway<HTMLLIElement>(() => setIsAdding(false));

  return (
    <motion.ul
      layout
      className="no-scrollbar flex flex-col gap-4 overflow-x-scroll px-2 md:snap-x md:flex-row"
    >
      <AnimatePresence>
        {act.beats
          .sort((a, b) => a.id - b.id)
          .map((beat) => (
            <Beat key={beat.id} beat={beat} actId={act.id} />
          ))}
      </AnimatePresence>

      <motion.div layout>
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.li
              ref={ref}
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{
                duration: 0.1,
              }}
            >
              <BeatComposer
                actId={act.id}
                onComplete={() => setIsAdding(false)}
              />
            </motion.li>
          ) : (
            <motion.li
              layout
              key="add"
              role="button"
              className="flex h-24 min-w-fit cursor-pointer snap-start flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/0 text-zinc-500 transition-colors hover:bg-zinc-900/100 hover:text-zinc-100 md:h-44 md:w-72 md:px-8"
              onClick={() => setIsAdding(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: {
                  duration: 0.1,
                },
              }}
            >
              <PlusCircleIcon className="h-12 w-12" />
              <p className="font-semibold leading-loose">Add a Beat</p>
            </motion.li>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.ul>
  );
};

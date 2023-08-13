import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";

import type { Props } from "~/components/Act/Act";
import { BeatComposer } from "./BeatComposer";
import { api } from "~/utils/api";

export const BeatList: React.FC<Props> = ({ act }) => {
  const { mutate: deleteBeat } = api.beat.delete.useMutation();
  const { mutate: updateBeat } = api.beat.update.useMutation();
  const [isAdding, setIsAdding] = useState(false);
  const ref = useClickAway<HTMLUListElement>(() => setIsAdding(false));
  const utils = api.useContext();

  function onDeleteBeat(id: number) {
    deleteBeat(
      { actId: act.id, id },
      {
        onSuccess: () => {
          utils.act.sheet.invalidate().catch(console.error);
        },
      }
    );
  }

  return (
    <ul
      ref={ref}
      className="no-scrollbar flex snap-x flex-row gap-4 overflow-x-scroll px-2"
    >
      {act.beats.map((beat) => (
        <li key={beat.id} className="group relative snap-start">
          <div
            className="h-40 w-72 rounded-lg bg-zinc-800"
            onClick={() => {
              updateBeat(
                {
                  id: beat.id,
                  name: "foobar",
                },
                {
                  onSuccess: () => {
                    utils.act.sheet.invalidate().catch(console.error);
                  },
                }
              );
            }}
          >
            <button
              className="absolute right-0 top-0 p-2 opacity-30 transition-all hover:text-zinc-200 group-hover:opacity-100"
              onClick={() => onDeleteBeat(beat.id)}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="text-sm text-zinc-500">{beat.name}</div>
        </li>
      ))}

      {isAdding ? (
        <Transition
          as="li"
          className="flex min-h-[160px] min-w-[288px] cursor-pointer flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/100 text-zinc-100 transition-colors"
          show={isAdding}
          enter="transition-opacity transition-transform ease-out duration-100"
          enterFrom="opacity-0 translate-x-10"
          enterTo="opacity-100 translate-x-0"
          leave="transition-opacity transition-transform ease-in duration-75"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-10"
        >
          <BeatComposer actId={act.id} onComplete={() => setIsAdding(false)} />
        </Transition>
      ) : (
        <Transition
          as="li"
          role="button"
          className="flex min-h-[160px] min-w-[288px] cursor-pointer snap-start flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/0 text-zinc-500 transition-colors hover:bg-zinc-900/100 hover:text-zinc-100"
          onClick={() => setIsAdding(true)}
          show={!isAdding}
          enter="transition-opacity transition-transform ease-out duration-100"
          enterFrom="opacity-0 translate-x-10"
          enterTo="opacity-100 translate-x-0"
          leave="transition-opacity transition-transform ease-in duration-75"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-10"
        >
          <PlusCircleIcon className="h-12 w-12" />
          <p className="leading-loose">Create a Beat</p>
        </Transition>
      )}
    </ul>
  );
};

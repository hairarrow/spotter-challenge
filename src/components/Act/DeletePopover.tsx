import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";

import { api } from "~/utils/api";
import type { Props as ActProps } from "./Act";

export function DeletePopover({ act }: ActProps) {
  const { mutate: handleDeleteAct } = api.act.delete.useMutation();
  const utils = api.useContext();

  function onDeleteAct() {
    handleDeleteAct(act.id, {
      onSuccess: () => {
        utils.act.sheet
          .invalidate()
          .then(() => close())
          .catch(console.error);
      },
    });
  }

  return (
    <Popover className="relative top-1 z-10">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`${
              open ? "opacity-100" : "opacity-40"
            } h-6 transition-opacity group-hover/act:opacity-100`}
          >
            {open ? (
              <XMarkIcon className="h-6 w-6 text-zinc-500 transition-colors hover:text-zinc-200" />
            ) : (
              <TrashIcon className="h-6 w-6 text-zinc-500 transition-colors hover:text-zinc-200" />
            )}
          </Popover.Button>

          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute -top-4 left-0 z-10 mt-5 flex w-screen max-w-max">
              <div className="flex-auto overflow-hidden rounded-2xl bg-zinc-900  leading-6 shadow-2xl shadow-red-300/5 ring-1 ring-red-900/20">
                <div className="px-12 py-8 text-center text-zinc-100">
                  <p className="leading-8">
                    Are you sure you want to delete{" "}
                    <span className="font-bold">{act.name}</span>?
                  </p>
                  <p className="text-sm leading-8 opacity-70">
                    This will delete all beats in{" "}
                    <span className="font-bold">{act.name}</span>
                  </p>
                </div>
                <div className="flex justify-end gap-3 bg-red-900/10 px-4 py-3">
                  <button
                    className="rounded-md bg-zinc-100 px-4 py-1 font-semibold transition-colors hover:bg-zinc-100/80"
                    onClick={close}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-row items-center justify-center gap-2 rounded-md bg-red-800 py-1 pl-4 pr-5 font-semibold text-white transition-colors hover:bg-red-800/80"
                    onClick={onDeleteAct}
                  >
                    <TrashIcon className="relative -top-0.5 mr-1.5 inline-flex h-5 w-5 scale-90" />
                    <div className="inline-flex leading-6">Delete</div>
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

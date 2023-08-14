import { useState, useEffect } from "react";
import {
  VideoCameraIcon,
  PencilSquareIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "framer-motion";

import { api } from "~/utils/api";
import type { Beat } from "~/server/api/routers/act";

interface Props {
  actId: number;
  onComplete: () => void;
  isEditing?: true;
  beat: Beat;
}

interface OptionalProps {
  actId: number;
  onComplete: () => void;
  isEditing?: false;
  beat?: Beat;
}

export const BeatComposer: React.FC<Props | OptionalProps> = ({
  actId,
  onComplete,
  isEditing,
  beat,
}) => {
  const { mutate: handleCreateBeat, isLoading: isCreateLoading } =
    api.beat.create.useMutation();
  const { mutate: handleUpdateBeat, isLoading: isUpdateLoading } =
    api.beat.update.useMutation();
  const [showNotes, setShowNotes] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const utils = api.useContext();
  const isLoading = isCreateLoading || isUpdateLoading;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const content = formData.get("content") as string;
    const notes = formData.get("notes") as string;
    const cameraAngle = formData.get("cameraAngle") as string;
    const time = Boolean(formData.get("time"))
      ? (formData.get("time") as string)
      : null;
    const input = { name, content, notes, cameraAngle, time } as const;
    const onSuccess = () => {
      utils.act.sheet.invalidate().catch(console.error);
      onComplete();
    };

    if (isEditing) {
      handleUpdateBeat({ ...input, id: beat.id }, { onSuccess });
    } else {
      handleCreateBeat({ ...input, actId }, { onSuccess });
    }
  };

  useEffect(() => {
    if (isEditing) {
      setShowNotes(Boolean(beat.notes));
      setShowCamera(Boolean(beat.cameraAngle));
      setShowTime(Boolean(beat.time));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className={`flex min-w-[320px] flex-col items-stretch justify-stretch gap-1 rounded-lg bg-zinc-900/50 p-4 ${
        isLoading ? "animate-pulse" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <label htmlFor="name" className="hidden">
        Beat Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        minLength={1}
        maxLength={255}
        placeholder="Beat Name"
        className="border-dashed border-red-600 bg-transparent px-2 text-lg font-medium leading-relaxed text-zinc-50 invalid:border-b focus:outline-none"
        autoFocus
        defaultValue={beat?.name}
      />
      <label htmlFor="content" className="hidden">
        Content
      </label>
      <textarea
        id="content"
        name="content"
        defaultValue={beat?.content}
        rows={4}
        placeholder="Content"
        maxLength={255}
        className="bg-transparent px-2 font-medium leading-relaxed text-zinc-50 focus:outline-none md:text-sm"
      />
      {showNotes ? (
        <div className="flex">
          <label htmlFor="notes" className="">
            <PencilSquareIcon className="mr-2 inline-block h-4 w-4 text-zinc-500" />
            <span className="hidden">Notes</span>
          </label>
          <motion.textarea
            id="notes"
            name="notes"
            defaultValue={beat?.notes}
            maxLength={255}
            rows={3}
            placeholder="Notes"
            className="grow rounded-md bg-zinc-800 px-2 py-1 font-medium leading-relaxed text-zinc-50 focus:outline-none md:text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: isEditing ? 0 : 0.2,
              },
            }}
          />
        </div>
      ) : (
        <></>
      )}
      {showCamera ? (
        <div className="flex items-center">
          <label htmlFor="cameraAngle">
            <VideoCameraIcon className="mr-2 inline-block h-4 w-4 text-zinc-500" />
            <span className="hidden">Camera Angle</span>
          </label>
          <motion.input
            id="cameraAngle"
            name="cameraAngle"
            defaultValue={beat?.cameraAngle}
            maxLength={255}
            placeholder="Camera Angle"
            className="grow rounded-md bg-zinc-800 px-2 py-1 font-medium leading-relaxed text-zinc-50 focus:outline-none md:text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: isEditing ? 0 : 0.2,
              },
            }}
          />
        </div>
      ) : (
        <></>
      )}
      {showTime ? (
        <div className="flex">
          <label htmlFor="time">
            <ClockIcon className="mr-2 inline-block h-4 w-4 text-zinc-500" />
            <span className="hidden">Time</span>
          </label>
          <motion.input
            id="time"
            name="time"
            defaultValue={beat?.time}
            maxLength={"00:00:00-00:00:00".length}
            placeholder="Time (00:00-00:00)"
            className="rounded-md bg-zinc-800 px-2 py-1 font-medium leading-relaxed text-zinc-50 focus:outline-none md:text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: isEditing ? 0 : 0.2,
              },
            }}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="flex gap-2.5 border-y border-zinc-700 py-2 empty:border-t-0">
        <AnimatePresence>
          {!showNotes && (
            <motion.button
              type="button"
              key="note"
              layout
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-400 px-2 py-1 font-medium hover:bg-zinc-300"
              onClick={() => setShowNotes(true)}
              exit={{ opacity: 0 }}
            >
              <PencilSquareIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Add Note</span>
            </motion.button>
          )}
          {!showCamera && (
            <motion.button
              type="button"
              key="angle"
              layout
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-400 px-2 py-1 font-medium hover:bg-zinc-300"
              onClick={() => setShowCamera(true)}
              exit={{ opacity: 0 }}
            >
              <VideoCameraIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Angle</span>
            </motion.button>
          )}
          {!showTime && (
            <motion.button
              type="button"
              key="time"
              layout
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-400 px-2 py-1 font-medium hover:bg-zinc-300"
              onClick={() => setShowTime(true)}
              exit={{ opacity: 0 }}
            >
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Time</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <button
        type="submit"
        className="ml-auto mt-2 rounded-lg bg-zinc-50 px-4 py-1.5 font-medium disabled:opacity-50"
        disabled={isLoading}
      >
        {isEditing ? "Update" : "Create"} Beat
      </button>
    </form>
  );
};

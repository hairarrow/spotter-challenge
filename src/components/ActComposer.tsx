import { motion } from "framer-motion";
import { useRef } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

import { api } from "~/utils/api";

export const ActComposer: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: handleCreateAct, isLoading } = api.act.create.useMutation();
  const utils = api.useContext();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (!name) inputRef.current?.focus();

    if (name) {
      handleCreateAct(name, {
        onSuccess: () => {
          utils.act.sheet.invalidate().catch(console.error);
          if (inputRef.current?.value) inputRef.current.value = "";
        },
      });
    }
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className={`mt-12 flex ${isLoading ? "animate-pulse" : ""}`}
    >
      <div className="flex w-full items-center rounded-xl bg-zinc-800 px-3 py-4 md:mx-auto md:w-auto">
        <label htmlFor="actName">
          <PlusCircleIcon className="mr-2 inline-block h-6 w-6 text-zinc-50" />
          <span className="hidden">New Act Name</span>
        </label>
        <input
          ref={inputRef}
          id="actName"
          name="name"
          placeholder="New Act"
          className="grow bg-transparent text-lg font-medium text-zinc-50 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-100 px-4 py-1 text-sm font-medium"
        >
          Create Act
        </button>
      </div>
    </motion.form>
  );
};

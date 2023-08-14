import { motion } from "framer-motion";

import type { ActWithBeats } from "~/server/api/routers/act";
import { BeatList } from "~/components/BeatList";
import { DeletePopover } from "./DeletePopover";

export interface Props {
  act: ActWithBeats;
}

export const Act = ({ act }: Props) => (
  <motion.li
    layout
    className="group/act border-t border-dashed border-zinc-500"
  >
    <div className="flex items-center gap-4 px-2 pb-4">
      <div className="inline-block rounded-b-lg bg-zinc-200 px-3 py-2 text-sm font-bold">
        {act.name}
      </div>
      <DeletePopover act={act} />
    </div>

    <BeatList act={act} />
  </motion.li>
);

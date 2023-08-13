import type { ActWithBeats } from "~/server/api/routers/act";
import DeletePopover from "./DeletePopover";

export interface Props {
  act: ActWithBeats;
}

export default function Act({ act }: Props) {
  return (
    <li className="group/act border-t border-dashed border-zinc-500">
      <div className="flex items-center gap-4 px-2 pb-4">
        <div className="inline-block rounded-b-lg bg-zinc-200 px-3 py-2 text-sm font-bold">
          {act.name}
        </div>
        <DeletePopover act={act} />
      </div>

      <ul className="no-scrollbar flex snap-x flex-row gap-4 overflow-x-scroll px-2">
        {act.beats.map((beat) => (
          <li key={beat.id} className="snap-start">
            <div className="h-40 w-72 rounded-lg bg-zinc-800" />
            <div className="text-sm text-zinc-500">{beat.name}</div>
          </li>
        ))}
      </ul>
    </li>
  );
}

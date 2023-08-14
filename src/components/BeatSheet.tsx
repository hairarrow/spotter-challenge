import { BookOpenIcon } from "@heroicons/react/24/solid";

import { api } from "~/utils/api";
import { Act } from "~/components/Act";
import { ActComposer } from "~/components/ActComposer";

export function BeatSheet() {
  const { data } = api.act.sheet.useQuery();

  return (
    <div className="container mx-auto py-16">
      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-zinc-900 py-8 text-zinc-200 md:mx-auto md:max-w-xl md:py-16">
          <BookOpenIcon className="h-12 w-12" />
          <p className="text-lg font-medium md:text-xl">
            Create your first act!
          </p>
        </div>
      ) : (
        <ul className="flex flex-col justify-center gap-8 empty:hidden">
          {data?.map((act) => (
            <Act key={act.id} act={act} />
          ))}
        </ul>
      )}

      <ActComposer />
    </div>
  );
}

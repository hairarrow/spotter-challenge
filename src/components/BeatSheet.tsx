import { api } from "~/utils/api";
import { Act } from "~/components/Act";
import { ActComposer } from "~/components/ActComposer";

export default function BeatSheet() {
  const { data } = api.act.sheet.useQuery();

  return (
    <div className="container mx-auto py-16">
      <ul className="flex flex-col justify-center gap-8">
        {data?.map((act) => (
          <Act key={act.id} act={act} />
        ))}
      </ul>

      <ActComposer />
    </div>
  );
}

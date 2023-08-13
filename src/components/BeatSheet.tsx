import Act from "./Act/Act";
import { api } from "~/utils/api";

export default function BeatSheet() {
  const { data } = api.act.beatSheet.useQuery();
  const { mutate: handleCreateAct } = api.act.createAct.useMutation();
  const utils = api.useContext();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      handleCreateAct(name, {
        onSuccess: () => {
          utils.act.beatSheet.invalidate().catch(console.error);
        },
      });
    }
  };

  return (
    <div className="container mx-auto py-16">
      <ul className="flex flex-col justify-center gap-8">
        {data?.map((act) => (
          <Act key={act.id} act={act} />
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" />
        <button className="bg-white">Create Act</button>
      </form>
    </div>
  );
}

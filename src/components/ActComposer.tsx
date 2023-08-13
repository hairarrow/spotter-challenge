import { api } from "~/utils/api";

export const ActComposer: React.FC = () => {
  const { mutate: handleCreateAct } = api.act.create.useMutation();
  const utils = api.useContext();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if (name) {
      handleCreateAct(name, {
        onSuccess: () => {
          utils.act.sheet.invalidate().catch(console.error);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <button className="bg-white">Create Act</button>
    </form>
  );
};

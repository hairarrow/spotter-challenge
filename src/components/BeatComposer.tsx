import { api } from "~/utils/api";

interface Props {
  actId: number;
  onComplete: () => void;
}

export const BeatComposer: React.FC<Props> = ({ actId, onComplete }) => {
  const { mutate: handleCreateBeat } = api.beat.create.useMutation();
  const utils = api.useContext();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    handleCreateBeat(
      { actId, name },
      {
        onSuccess: () => {
          utils.act.sheet.invalidate().catch(console.error);
          onComplete();
        },
      }
    );
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label htmlFor="name">Beat Name</label>
      <input type="text" name="name" className="text-zinc-900" />
      <button type="submit">Create Beat</button>
    </form>
  );
};

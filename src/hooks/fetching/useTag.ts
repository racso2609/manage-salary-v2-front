import useTags from "./useTags";

export type useTag = {
  tagId: string;
};

const useTag = ({ tagId }: useTag) => {
  const { data, ...rest } = useTags();
  const tag = data?.find((tag) => tag._id === tagId);

  return { ...rest, data: tag };
};

export default useTag;

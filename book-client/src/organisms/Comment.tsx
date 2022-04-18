import { Box, Heading, Spinner } from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import { useCommentsStore } from "../stores/showingCommentsStore";
interface IProps {
  totalComments: number;
  bookId: number;
}
export const Comment = (props: IProps) => {
  const { totalComments, bookId } = props;
  const { setStore } = useCommentsStore();
  const [loading, setLoading] = createSignal(false);
  const handleShowComments = () => {
    setLoading(true);
    setTimeout(() => {
      setStore((prev) => ({
        ...prev,
        showingCommentsForBookIds: [...prev.showingCommentsForBookIds, bookId],
      }));
      setLoading(false);
    }, 500);
  };
  return (
    <Box flex={1}>
      <Show when={loading()}>
        <Spinner color="#FFF" />
      </Show>
      <Heading
        color="#cacaca"
        _hover={{ cursor: "pointer" }}
        onClick={() => handleShowComments()}
      >
        Mostrar todos os {totalComments} comentários...
      </Heading>
    </Box>
  );
};

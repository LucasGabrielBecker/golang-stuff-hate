import {
  Box,
  Center,
  CloseButton,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
} from "@hope-ui/solid";
import { format } from "date-fns";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { VoteButtons } from "../molecules/voteButtons";
import { useCommentsStore } from "../stores/showingCommentsStore";
import { capitalize } from "../utils/capitalize";
import { Comment } from "./Comment";

export interface IBook {
  ID: number;
  title: string;
  author: string;
  upVotes: number;
  downVotes: number;
  Comments: Comment[];
}

interface IProps {
  book: IBook;
  loading(): boolean;
  setLoading(newState: boolean): void;
  setBooks: any;
}

export const Book = ({ book, loading, setLoading, setBooks }: IProps) => {
  console.log({ book });
  const { store, setStore } = useCommentsStore();
  const upVote = async (bookId: number): Promise<void> => {
    if (loading()) return;
    setLoading(true);
    await fetch(`http://localhost:8080/books/upvote/${bookId}`, {
      method: "POST",
    });
    setBooks((prev: IBook[]) =>
      prev.map((book) =>
        book.ID === bookId ? { ...book, upVotes: book.upVotes + 1 } : book
      )
    );
    setLoading(false);
  };
  const downVote = async (bookId: number): Promise<void> => {
    if (loading()) return;
    setLoading(true);
    await fetch(`http://localhost:8080/books/downvote/${bookId}`, {
      method: "POST",
    });
    setBooks((prev: IBook[]) =>
      prev.map((book) =>
        book.ID === bookId ? { ...book, downVotes: book.downVotes + 1 } : book
      )
    );
    setLoading(false);
  };

  const handleHideComments = (bookId: number) => {
    setStore((prev) => ({
      ...prev,
      showingCommentsForBookIds: prev.showingCommentsForBookIds.filter(
        (id) => id !== bookId
      ),
    }));
  };

  const handleNewComment = async (e: any, bookId: number): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const comment = e.target.comment.value;
    await fetch(`http://localhost:8080/books/add-comment/${bookId}`, {
      method: "POST",
      body: JSON.stringify({
        content: comment,
      }),
    });
    setBooks((prev: IBook[]) => {
      return prev.map((book) => {
        if (book.ID === bookId) {
          return {
            ...book,
            Comments: [
              ...book.Comments,
              { content: comment, CreatedAt: new Date().toISOString() },
            ],
          };
        }
      });
    });
    // await getBooks();
    setLoading(false);
    e.target.reset();
  };
  return (
    <Box w="50%" mb={0} mt={20} ml="auto" mr="auto">
      <Flex
        h="120px"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderRadius={6}
      >
        <Heading color="#F10086">{book.title}</Heading>
        <VoteButtons {...{ upVote, downVote, loading, book }} />
      </Flex>
      <Show when={book.Comments.length > 0}>
        <Switch
          fallback={
            <Comment bookId={book.ID} totalComments={book.Comments.length} />
          }
        >
          <Match
            when={
              !!store.showingCommentsForBookIds.find((id) => id === book.ID)
            }
          >
            <IconButton
              color="#FFF"
              icon={() => (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width={1}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
              aria-label="icon"
              variant="ghost"
              style={{ float: "right" }}
              onClick={() => handleHideComments(book.ID)}
            />
            <Box w="80%" p={8} mb={12} borderRadius={4} ml="auto" mr="auto">
              <form onSubmit={(e) => handleNewComment(e, book.ID)}>
                <Input
                  type="text"
                  placeholder="Add new comment"
                  autocomplete="off"
                  name="comment"
                  color="#FFF"
                />
              </form>
            </Box>
            <For each={book.Comments}>
              {(comment: any) => (
                <Box
                  w="80%"
                  border="1px solid #5a5860"
                  p={8}
                  mb={12}
                  borderRadius={4}
                  ml="auto"
                  mr="auto"
                >
                  <Flex justifyContent="space-between" pt={4} pb={4}>
                    <Heading color="#dedede" _hover={{ color: "#fff" }}>
                      {capitalize(comment.content)}
                    </Heading>

                    <Text color="#909090" size="sm">
                      {format(new Date(comment.CreatedAt), "dd/MM HH:mm")}
                    </Text>
                  </Flex>
                  <Text textAlign="start" size="sm" color="#5a5860">
                    Anonymous
                  </Text>
                </Box>
              )}
            </For>
          </Match>
        </Switch>
      </Show>
    </Box>
  );
};

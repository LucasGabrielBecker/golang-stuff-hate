import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { Box, Button, globalCss, Spinner } from "@hope-ui/solid";
import { format } from "date-fns";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@hope-ui/solid";
import { VoteButtons } from "./molecules/voteButtons";
import { Book, IBook } from "./organisms/Book";

interface Comment {
  content: string;
  ID: number;
  CreatedAt: string;
  DeletedAt: string;
}
const globalStyles = globalCss({
  body: {
    backgroundColor: "#3A3845",
  },
});

const App: Component = () => {
  globalStyles();
  const [books, setBooks] = createSignal<IBook[]>([]);
  const [loading, setLoading] = createSignal<boolean>(false);

  const getBooks = async (): Promise<void> => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/books");
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };
  return (
    <Box flex={1} gap="$6" w="100vw" h="100vh" pt={6}>
      <Show when={!books().length}>
        <Button loading={loading()} onClick={getBooks}>
          Load books
        </Button>
      </Show>
      <For each={books()}>
        {(book) => <Book {...{ book, loading, setLoading, setBooks }} />}
      </For>
    </Box>
  );
};

export default App;

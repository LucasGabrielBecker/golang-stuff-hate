import { Box, Flex, Heading } from "@hope-ui/solid";
import { Show } from "solid-js";
import { VoteButton } from "../atoms/VoteButton";
import { IBook } from "../organisms/Book";
import { Comment } from "../organisms/Comment";

interface IProps {
  book: IBook;
  loading(): boolean;
  upVote(bookId: number): Promise<void>;
  downVote(bookId: number): Promise<void>;
}

export const VoteButtons = ({ book, loading, upVote, downVote }: IProps) => {
  return (
    <Flex alignItems="center">
      <Heading color="#087a0f">{book.upVotes}</Heading>
      <VoteButton
        loading={loading()}
        mr={8}
        ml={12}
        onClick={() => upVote(book.ID)}
        vote="UP"
      />
      <VoteButton
        loading={loading()}
        onClick={() => downVote(book.ID)}
        mr={12}
        vote="DOWN"
      />
      <Heading color="#8b391c">{book.downVotes}</Heading>
    </Flex>
  );
};

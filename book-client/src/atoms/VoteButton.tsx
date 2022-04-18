import { Button, ButtonProps } from "@hope-ui/solid";

interface IProps {
  vote: "UP" | "DOWN";
  loading?: boolean;
}
export const VoteButton = (props: ButtonProps & IProps) => {
  const votes = {
    UP: "👍🏻",
    DOWN: "👎🏻",
  };
  return (
    <Button colorScheme="neutral" {...props}>
      {votes[props.vote]}
    </Button>
  );
};

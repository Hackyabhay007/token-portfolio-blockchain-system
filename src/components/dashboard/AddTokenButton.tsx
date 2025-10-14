import { Button } from '../common/Button';

interface AddTokenButtonProps {
  onClick: () => void;
}

export const AddTokenButton = ({ onClick }: AddTokenButtonProps) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      icon={
        <img src="/assets/plus.svg" alt="Add" className="w-4 h-4" />
      }
    >
      Add Token
    </Button>
  );
};

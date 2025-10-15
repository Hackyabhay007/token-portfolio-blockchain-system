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
        <img src="/icons/plus.svg" alt="Add" style={{ width: '15px', height: '15px' }} />
      }
    >
      Add Token
    </Button>
  );
};

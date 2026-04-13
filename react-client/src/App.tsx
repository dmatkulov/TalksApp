import { Button } from '@heroui/button';
import { Alert } from '@heroui/react';

function App() {
  return (
    <div>
      <Button color="primary">Button</Button>
      <Alert color="danger" isClosable={true} title="test" />
      <Button color="primary">111</Button>
    </div>
  );
}

export default App;

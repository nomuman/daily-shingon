import { Text } from 'react-native';
import ErrorState from '../src/components/ErrorState';
import { renderWithProviders, unmountWithAct } from '../test-utils';

describe('ErrorState', () => {
  it('hides retry button when onRetry is missing', async () => {
    const tree = await renderWithProviders(<ErrorState message="error" />);
    const texts = tree.root
      .findAllByType(Text)
      .map((node) => node.props.children)
      .flat();
    expect(texts).not.toContain('再試行');
    await unmountWithAct(tree);
  });

  it('shows retry and secondary actions when provided', async () => {
    const tree = await renderWithProviders(
      <ErrorState
        message="error"
        onRetry={() => {}}
        secondaryLabel="別の操作"
        onSecondaryPress={() => {}}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((node) => node.props.children)
      .flat();
    expect(texts).toContain('再試行');
    expect(texts).toContain('別の操作');
    await unmountWithAct(tree);
  });
});

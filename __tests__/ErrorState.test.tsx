import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import ErrorState from '../src/components/ErrorState';

describe('ErrorState', () => {
  it('hides retry button when onRetry is missing', () => {
    let tree: renderer.ReactTestRenderer | undefined;
    renderer.act(() => {
      tree = renderer.create(<ErrorState message="error" />);
    });
    if (!tree) throw new Error('renderer not created');
    const texts = tree.root
      .findAllByType(Text)
      .map((node) => node.props.children)
      .flat();
    expect(texts).not.toContain('再試行');
    renderer.act(() => {
      tree?.unmount();
    });
  });

  it('shows retry and secondary actions when provided', () => {
    let tree: renderer.ReactTestRenderer | undefined;
    renderer.act(() => {
      tree = renderer.create(
        <ErrorState
          message="error"
          onRetry={() => {}}
          secondaryLabel="別の操作"
          onSecondaryPress={() => {}}
        />,
      );
    });
    if (!tree) throw new Error('renderer not created');
    const texts = tree.root
      .findAllByType(Text)
      .map((node) => node.props.children)
      .flat();
    expect(texts).toContain('再試行');
    expect(texts).toContain('別の操作');
    renderer.act(() => {
      tree?.unmount();
    });
  });
});

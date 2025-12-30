import renderer from 'react-test-renderer';
import { TextInput } from 'react-native';

import SearchInput from '../src/components/SearchInput';
import { withProviders } from '../test-utils';

describe('SearchInput', () => {
  it('uses default placeholder when not provided', () => {
    let tree: renderer.ReactTestRenderer | undefined;
    renderer.act(() => {
      tree = renderer.create(withProviders(<SearchInput value="" onChangeText={() => {}} />));
    });
    if (!tree) throw new Error('renderer not created');
    const input = tree.root.findByType(TextInput);
    expect(input.props.placeholder).toBe('検索');
    renderer.act(() => {
      tree?.unmount();
    });
  });

  it('uses custom placeholder when provided', () => {
    let tree: renderer.ReactTestRenderer | undefined;
    renderer.act(() => {
      tree = renderer.create(
        withProviders(<SearchInput value="" onChangeText={() => {}} placeholder="用語検索" />),
      );
    });
    if (!tree) throw new Error('renderer not created');
    const input = tree.root.findByType(TextInput);
    expect(input.props.placeholder).toBe('用語検索');
    renderer.act(() => {
      tree?.unmount();
    });
  });
});

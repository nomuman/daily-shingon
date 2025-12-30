import { TextInput } from 'react-native';

import SearchInput from '../src/components/SearchInput';
import { renderWithProviders, unmountWithAct } from '../test-utils';

describe('SearchInput', () => {
  it('uses default placeholder when not provided', async () => {
    const tree = await renderWithProviders(<SearchInput value="" onChangeText={() => {}} />);
    const input = tree.root.findByType(TextInput);
    expect(input.props.placeholder).toBe('検索');
    await unmountWithAct(tree);
  });

  it('uses custom placeholder when provided', async () => {
    const tree = await renderWithProviders(
      <SearchInput value="" onChangeText={() => {}} placeholder="用語検索" />,
    );
    const input = tree.root.findByType(TextInput);
    expect(input.props.placeholder).toBe('用語検索');
    await unmountWithAct(tree);
  });
});

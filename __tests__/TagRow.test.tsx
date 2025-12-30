import { Text } from 'react-native';
import TagRow from '../src/components/TagRow';
import { renderWithProviders, unmountWithAct } from '../test-utils';

describe('TagRow', () => {
  it('renders null when tags are empty', async () => {
    const tree = await renderWithProviders(
      <TagRow tags={[]} activeTag={null} onSelect={() => {}} />,
    );
    expect(tree.toJSON()).toBeNull();
    await unmountWithAct(tree);
  });

  it('renders unique tags and the all label', async () => {
    const tree = await renderWithProviders(
      <TagRow tags={['b', 'a', 'b']} activeTag={null} onSelect={() => {}} />,
    );
    const texts = tree.root.findAllByType(Text).map((node) => node.props.children);
    const flat = texts.flat().filter(Boolean);
    expect(flat).toContain('全部');
    expect(flat).toContain('a');
    expect(flat).toContain('b');
    expect(flat.filter((t) => t === 'b')).toHaveLength(1);
    await unmountWithAct(tree);
  });
});

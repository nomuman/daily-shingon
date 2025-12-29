import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import TagRow from '../src/components/TagRow';

describe('TagRow', () => {
  it('renders null when tags are empty', () => {
    let tree: renderer.ReactTestRenderer | undefined;
    renderer.act(() => {
      tree = renderer.create(<TagRow tags={[]} activeTag={null} onSelect={() => {}} />);
    });
    if (!tree) throw new Error('renderer not created');
    expect(tree.toJSON()).toBeNull();
    renderer.act(() => {
      tree?.unmount();
    });
  });

  it('renders unique tags and the all label', () => {
    let tree: renderer.ReactTestRenderer | undefined;
    renderer.act(() => {
      tree = renderer.create(
        <TagRow tags={['b', 'a', 'b']} activeTag={null} onSelect={() => {}} />,
      );
    });
    if (!tree) throw new Error('renderer not created');
    const texts = tree.root.findAllByType(Text).map((node) => node.props.children);
    const flat = texts.flat().filter(Boolean);
    expect(flat).toContain('全部');
    expect(flat).toContain('a');
    expect(flat).toContain('b');
    expect(flat.filter((t) => t === 'b')).toHaveLength(1);
    renderer.act(() => {
      tree?.unmount();
    });
  });
});

import renderer from 'react-test-renderer';

import LearnCard from '../src/components/LearnCard';
import { getDayCard } from '../src/content/curriculum30.ja';

type JsonNode =
  | string
  | number
  | boolean
  | null
  | { children?: JsonNode[] }
  | JsonNode[];

function collectText(node: JsonNode): string[] {
  if (node == null) return [];
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return [String(node)];
  }
  if (Array.isArray(node)) {
    return node.flatMap(collectText);
  }
  if (node.children) {
    return node.children.flatMap(collectText);
  }
  return [];
}

describe('LearnCard', () => {
  it('renders key content for the day card', async () => {
    const card = getDayCard(1);
    let tree: renderer.ReactTestRenderer | undefined;

    await renderer.act(async () => {
      tree = renderer.create(
        <LearnCard
          dayNumber={1}
          card={card}
          isComplete={false}
          sourceLinks={[{ id: 'SRC_TEST' }]}
        />,
      );
    });

    if (!tree) {
      throw new Error('LearnCard renderer was not created');
    }

    const mounted = tree;
    const text = collectText(mounted.toJSON() as JsonNode);
    const joined = text.join(' ').replace(/\s+/g, ' ').trim();

    expect(joined).toContain('Day 1 / 30');
    expect(joined).toContain(card.title);
    expect(joined).toContain(card.nightQuestion);
    expect(joined).toContain('SRC_TEST');

    await renderer.act(async () => {
      mounted.unmount();
    });
  });
});

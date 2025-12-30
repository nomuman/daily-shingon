import LearnCard from '../src/components/LearnCard';
import { getDayCard } from '../src/content/curriculum30.ja';
import { renderWithProviders, unmountWithAct } from '../test-utils';

type JsonNode = string | number | boolean | null | { children?: JsonNode[] } | JsonNode[];

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
    const tree = await renderWithProviders(
      <LearnCard
        dayNumber={1}
        card={card}
        isComplete={false}
        sourceLinks={[{ id: 'SRC_TEST' }]}
      />,
    );

    const text = collectText(tree.toJSON() as JsonNode);
    const joined = text.join(' ').replace(/\s+/g, ' ').trim();

    expect(joined).toContain('Day 1 / 30');
    expect(joined).toContain(card.title);
    expect(joined).toContain(card.nightQuestion);
    expect(joined).toContain('SRC_TEST');

    await unmountWithAct(tree);
  });
});

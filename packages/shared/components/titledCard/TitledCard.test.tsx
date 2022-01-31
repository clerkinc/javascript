import * as React from 'react';
import { renderJSON } from '@clerk/shared/testUtils';
import { TitledCard } from './TitledCard';

describe('<TitledCard/>', () => {
  it('renders the card and its childred', () => {
    const tree = renderJSON(
      <TitledCard title="Foo">
        <div>Foo content</div>
      </TitledCard>
    );
    expect(tree).toMatchSnapshot();
  });
});

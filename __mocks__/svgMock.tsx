import type { ComponentProps } from 'react';
import { View } from 'react-native';

const SvgMock = (props: ComponentProps<typeof View>) => <View {...props} />;

export default SvgMock;

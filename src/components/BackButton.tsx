/**
 * Purpose: Consistent top-left back button for non-home screens. / 目的: ホーム以外の左上戻るボタンを統一。
 * Responsibilities: render a themed back button and navigate back by default. / 役割: テーマ付き戻るボタン表示と既定の戻る遷移。
 * Inputs: optional label and press handler. / 入力: 任意ラベルと押下ハンドラ。
 * Outputs: back button UI. / 出力: 戻るボタンUI。
 * Dependencies: Expo Router, i18n, theme tokens. / 依存: Expo Router、i18n、テーマトークン。
 * Side effects: navigation when pressed. / 副作用: 押下時の遷移。
 * Edge cases: no navigation stack (falls back to router.back()). / 例外: スタックなし（router.backに委譲）。
 */
import { useRouter } from 'expo-router';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTranslation } from 'react-i18next';
import AppButton from './AppButton';
import { useThemedStyles } from '../ui/theme';

type BackButtonProps = {
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function BackButton({ label, onPress, style }: BackButtonProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: {
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.sm,
      },
    }),
  );

  return (
    <View style={[styles.container, style]}>
      <AppButton
        label={label ?? t('common.back')}
        onPress={onPress ?? (() => router.back())}
        accessibilityLabel={label ?? t('common.back')}
        variant="ghost"
        size="sm"
      />
    </View>
  );
}

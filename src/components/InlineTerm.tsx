/**
 * Purpose: Inline glossary term with expandable short explanation. / 目的: タップで短い解説が展開されるインライン用語コンポーネント。
 * Responsibilities: fetch glossary entry by termId and toggle explanation visibility. / 役割: termIdで用語を引き、解説の表示/非表示を切り替える。
 * Inputs: termId, display text (children string), optional textStyle. / 入力: termId、表示テキスト、任意のテキストスタイル。
 * Outputs: tappable label + expandable definition bubble. / 出力: タップ可能なラベル＋展開可能な定義バブル。
 */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { getGlossaryEntry } from '../content/glossary';
import { useContentLang } from '../content/useContentLang';
import { useTheme, useThemedStyles } from '../ui/theme';
import type { Theme } from '../ui/theme';

type Props = {
  termId: string;
  children: string;
  textStyle?: TextStyle | TextStyle[];
};

export default function InlineTerm({ termId, children, textStyle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const contentLang = useContentLang();
  const entry = getGlossaryEntry(contentLang, termId);
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!entry) {
    return <Text style={textStyle}>{children}</Text>;
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.row}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Text style={textStyle}>{children}</Text>
        <Text style={[styles.icon, { color: theme.colors.inkMuted }]}>
          {expanded ? ' ▾' : ' ▸'}
        </Text>
      </Pressable>
      {expanded && (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{entry.short}</Text>
          {!!entry.reading && (
            <Text style={styles.reading}>
              {contentLang === 'ja' ? `読み：${entry.reading}` : `Reading: ${entry.reading}`}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      marginVertical: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      fontSize: 11,
      marginLeft: 2,
    },
    bubble: {
      marginTop: 6,
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    bubbleText: {
      color: theme.colors.ink,
      fontFamily: theme.font.body,
      lineHeight: 20,
    },
    reading: {
      color: theme.colors.inkMuted,
      fontFamily: theme.font.body,
      fontSize: 12,
      marginTop: 4,
    },
  });
